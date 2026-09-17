"""Segment model for dynamic audiences."""

from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import String, ForeignKey, Integer, Boolean, DateTime, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base
from app.models.base import TimestampMixin, generate_uuid


class Segment(TimestampMixin, Base):
    __tablename__ = "segments"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=generate_uuid)
    workspace_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    
    conditions: Mapped[dict] = mapped_column(JSONB, nullable=False, default=dict, server_default='{}')
    is_dynamic: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    
    estimated_count: Mapped[int] = mapped_column(Integer, default=0)
    last_evaluated_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
