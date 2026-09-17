"""Automation models for workflow builder."""

from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import String, ForeignKey, Integer, Float, DateTime, BigInteger
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.base import TimestampMixin, generate_uuid


class Automation(TimestampMixin, Base):
    __tablename__ = "automations"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=generate_uuid)
    workspace_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str | None] = mapped_column(String(500))
    status: Mapped[str] = mapped_column(String(20), default="draft", nullable=False) # draft, active, paused, completed, failed
    
    trigger_type: Mapped[str | None] = mapped_column(String(50))
    trigger_config: Mapped[dict | None] = mapped_column(JSONB)
    
    total_entered: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    total_completed: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    total_failed: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    
    created_by: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"))

    nodes = relationship("AutomationNode", back_populates="automation", cascade="all, delete-orphan")
    edges = relationship("AutomationEdge", back_populates="automation", cascade="all, delete-orphan")
    runs = relationship("AutomationRun", back_populates="automation", cascade="all, delete-orphan")


class AutomationNode(TimestampMixin, Base):
    __tablename__ = "automation_nodes"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=generate_uuid)
    automation_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("automations.id", ondelete="CASCADE"), nullable=False, index=True)
    type: Mapped[str] = mapped_column(String(50), nullable=False) # trigger, send_email, wait, condition, add_tag, etc.
    config: Mapped[dict | None] = mapped_column(JSONB)
    position_x: Mapped[float] = mapped_column(Float, default=0.0)
    position_y: Mapped[float] = mapped_column(Float, default=0.0)

    automation = relationship("Automation", back_populates="nodes")


class AutomationEdge(TimestampMixin, Base):
    __tablename__ = "automation_edges"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=generate_uuid)
    automation_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("automations.id", ondelete="CASCADE"), nullable=False, index=True)
    source_node_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("automation_nodes.id", ondelete="CASCADE"), nullable=False)
    target_node_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("automation_nodes.id", ondelete="CASCADE"), nullable=False)
    source_handle: Mapped[str | None] = mapped_column(String(50))
    target_handle: Mapped[str | None] = mapped_column(String(50))
    label: Mapped[str | None] = mapped_column(String(100))

    automation = relationship("Automation", back_populates="edges")


class AutomationRun(Base):
    __tablename__ = "automation_runs"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=generate_uuid)
    automation_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("automations.id", ondelete="CASCADE"), nullable=False, index=True)
    contact_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("contacts.id", ondelete="CASCADE"), nullable=False, index=True)
    status: Mapped[str] = mapped_column(String(20), default="running", nullable=False) # running, completed, failed, cancelled
    
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    current_node_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("automation_nodes.id", ondelete="SET NULL"))

    automation = relationship("Automation", back_populates="runs")
    steps = relationship("AutomationRunStep", back_populates="run", cascade="all, delete-orphan")


class AutomationRunStep(Base):
    __tablename__ = "automation_run_steps"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    run_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("automation_runs.id", ondelete="CASCADE"), nullable=False, index=True)
    node_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("automation_nodes.id", ondelete="CASCADE"), nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="pending", nullable=False) # pending, running, completed, failed, skipped
    
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    result: Mapped[dict | None] = mapped_column(JSONB)

    run = relationship("AutomationRun", back_populates="steps")
