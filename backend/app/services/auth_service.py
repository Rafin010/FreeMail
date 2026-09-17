"""Business logic for authentication."""

import uuid
from datetime import datetime, timedelta, timezone

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.config import settings
from app.core.exceptions import ConflictException, UnauthorizedException
from app.core.security import create_access_token, create_refresh_token, hash_password, verify_password
from app.models.user import RefreshToken, User
from app.models.workspace import Workspace, WorkspaceMember
from app.schemas.auth import RegisterRequest, TokenResponse, UserResponse


async def register_user(db: AsyncSession, data: RegisterRequest) -> tuple[TokenResponse, UserResponse]:
    """Register a new user and create their default workspace."""
    # Check if email exists
    result = await db.execute(select(User).where(User.email == data.email))
    if result.scalars().first():
        raise ConflictException("Email already registered")
        
    # Create user
    user = User(
        email=data.email,
        password_hash=hash_password(data.password),
        first_name=data.first_name,
        last_name=data.last_name,
    )
    db.add(user)
    await db.flush()
    
    # Create default workspace
    workspace = Workspace(
        name=f"{data.first_name}'s Workspace",
        slug=f"{data.first_name.lower()}-workspace-{user.id.hex[:6]}",
    )
    db.add(workspace)
    await db.flush()
    
    # Add user as owner
    member = WorkspaceMember(
        workspace_id=workspace.id,
        user_id=user.id,
        role="owner",
    )
    db.add(member)
    
    # Create tokens
    access_token = create_access_token(user.id, workspace.id)
    refresh_token_str = create_refresh_token()
    
    expires_at = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    db_refresh_token = RefreshToken(
        user_id=user.id,
        token=refresh_token_str,
        expires_at=expires_at,
    )
    db.add(db_refresh_token)
    
    await db.commit()
    await db.refresh(user)
    
    token_response = TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token_str,
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )
    
    return token_response, UserResponse.model_validate(user)


async def authenticate_user(db: AsyncSession, email: str, password: str) -> tuple[TokenResponse, UserResponse]:
    """Verify credentials and issue tokens."""
    result = await db.execute(select(User).options(selectinload(User.workspace_memberships)).where(User.email == email))
    user = result.scalars().first()
    
    if not user or not user.is_active or not verify_password(password, user.password_hash):
        raise UnauthorizedException("Incorrect email or password")
        
    # Pick the first workspace to include in token (if they have one)
    ws_id = user.workspace_memberships[0].workspace_id if user.workspace_memberships else None
    
    # Create tokens
    access_token = create_access_token(user.id, ws_id)
    refresh_token_str = create_refresh_token()
    
    expires_at = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    db_refresh_token = RefreshToken(
        user_id=user.id,
        token=refresh_token_str,
        expires_at=expires_at,
    )
    db.add(db_refresh_token)
    await db.commit()
    
    token_response = TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token_str,
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )
    
    return token_response, UserResponse.model_validate(user)


async def refresh_access_token(db: AsyncSession, token: str) -> TokenResponse:
    """Issue new access token from a valid refresh token."""
    result = await db.execute(
        select(RefreshToken).options(selectinload(RefreshToken.user).selectinload(User.workspace_memberships)).where(RefreshToken.token == token)
    )
    db_token = result.scalars().first()
    
    if not db_token:
        raise UnauthorizedException("Invalid refresh token")
        
    if db_token.revoked:
        raise UnauthorizedException("Refresh token has been revoked")
        
    if db_token.expires_at < datetime.now(timezone.utc):
        raise UnauthorizedException("Refresh token has expired")
        
    user = db_token.user
    if not user.is_active:
        raise UnauthorizedException("User is inactive")
        
    ws_id = user.workspace_memberships[0].workspace_id if user.workspace_memberships else None
    access_token = create_access_token(user.id, ws_id)
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=token,
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )


async def revoke_refresh_token(db: AsyncSession, token: str) -> None:
    """Revoke a refresh token on logout."""
    result = await db.execute(select(RefreshToken).where(RefreshToken.token == token))
    db_token = result.scalars().first()
    
    if db_token:
        db_token.revoked = True
        await db.commit()
