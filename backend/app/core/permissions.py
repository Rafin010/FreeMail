"""Dependencies and middleware for permissions and authorization."""

import uuid
from typing import Annotated

from fastapi import Depends, Header, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.core.exceptions import ForbiddenException, UnauthorizedException
from app.database import get_db
from app.models.user import User
from app.models.workspace import WorkspaceMember

security = HTTPBearer()

async def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(security)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> User:
    """Extract user from JWT and fetch from database."""
    try:
        payload = jwt.decode(credentials.credentials, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        user_id_str = payload.get("sub")
        if user_id_str is None:
            raise UnauthorizedException("Invalid authentication credentials")
        user_id = uuid.UUID(user_id_str)
    except (JWTError, ValueError):
        raise UnauthorizedException("Invalid authentication credentials")

    result = await db.execute(select(User).where(User.id == user_id, User.is_active == True))
    user = result.scalars().first()
    if not user:
        raise UnauthorizedException("User not found or inactive")
        
    return user


async def get_current_workspace_member(
    user: Annotated[User, Depends(get_current_user)],
    x_workspace_id: Annotated[str | None, Header(description="Current workspace ID")] = None,
    db: AsyncSession = Depends(get_db),
) -> WorkspaceMember:
    """Ensure user is a member of the requested workspace."""
    if not x_workspace_id:
        raise ForbiddenException("Workspace ID header (X-Workspace-Id) is required")
        
    try:
        ws_id = uuid.UUID(x_workspace_id)
    except ValueError:
        raise ForbiddenException("Invalid workspace ID format")

    result = await db.execute(
        select(WorkspaceMember).where(
            WorkspaceMember.user_id == user.id,
            WorkspaceMember.workspace_id == ws_id
        )
    )
    member = result.scalars().first()
    
    if not member:
        raise ForbiddenException("You do not have access to this workspace")
        
    return member


def require_role(min_role: str):
    """Dependency factory for checking minimum role."""
    # Roles in order of power
    roles = {"viewer": 0, "analyst": 1, "manager": 2, "admin": 3, "owner": 4}
    
    async def role_checker(member: Annotated[WorkspaceMember, Depends(get_current_workspace_member)]):
        if roles.get(member.role, 0) < roles.get(min_role, 0):
            raise ForbiddenException(f"This action requires at least {min_role} access")
        return member
        
    return role_checker
