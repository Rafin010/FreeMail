"""Campaign models."""

from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import String, ForeignKey, Integer, Float, DateTime, Text, BigInteger, Boolean
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.base import TimestampMixin, SoftDeleteMixin, generate_uuid


class Campaign(TimestampMixin, SoftDeleteMixin, Base):
    __tablename__ = "campaigns"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=generate_uuid)
    workspace_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    subject: Mapped[str | None] = mapped_column(String(255))
    preview_text: Mapped[str | None] = mapped_column(String(255))
    from_name: Mapped[str | None] = mapped_column(String(100))
    from_email: Mapped[str | None] = mapped_column(String(320))
    reply_to: Mapped[str | None] = mapped_column(String(320))
    type: Mapped[str] = mapped_column(String(20), default="regular", nullable=False) # regular, scheduled, automated, ab_test, newsletter, promotional
    status: Mapped[str] = mapped_column(String(20), default="draft", nullable=False) # draft, scheduled, sending, sent, paused, cancelled, failed
    
    content_json: Mapped[list | dict | None] = mapped_column(JSONB)
    content_html: Mapped[str | None] = mapped_column(Text)
    template_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("email_templates.id", ondelete="SET NULL"))
    
    list_ids: Mapped[list | None] = mapped_column(JSONB)
    segment_ids: Mapped[list | None] = mapped_column(JSONB)
    tag_ids: Mapped[list | None] = mapped_column(JSONB)
    excluded_list_ids: Mapped[list | None] = mapped_column(JSONB)
    suppression_list_ids: Mapped[list | None] = mapped_column(JSONB)
    
    estimated_recipients: Mapped[int] = mapped_column(Integer, default=0)
    total_sent: Mapped[int] = mapped_column(Integer, default=0)
    total_delivered: Mapped[int] = mapped_column(Integer, default=0)
    total_opened: Mapped[int] = mapped_column(Integer, default=0)
    total_clicked: Mapped[int] = mapped_column(Integer, default=0)
    total_bounced: Mapped[int] = mapped_column(Integer, default=0)
    total_complained: Mapped[int] = mapped_column(Integer, default=0)
    total_unsubscribed: Mapped[int] = mapped_column(Integer, default=0)
    
    open_rate: Mapped[float] = mapped_column(Float, default=0.0)
    click_rate: Mapped[float] = mapped_column(Float, default=0.0)
    
    scheduled_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    sent_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    
    ab_test_config: Mapped[dict | None] = mapped_column(JSONB)
    winning_variant_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("ab_test_variants.id", ondelete="SET NULL"))
    
    created_by: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"))


class ABTestVariant(TimestampMixin, Base):
    __tablename__ = "ab_test_variants"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=generate_uuid)
    campaign_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("campaigns.id", ondelete="CASCADE"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    subject: Mapped[str | None] = mapped_column(String(255))
    preview_text: Mapped[str | None] = mapped_column(String(255))
    content_json: Mapped[list | dict | None] = mapped_column(JSONB)
    content_html: Mapped[str | None] = mapped_column(Text)
    percentage: Mapped[int] = mapped_column(Integer, default=50)
    
    total_sent: Mapped[int] = mapped_column(Integer, default=0)
    total_opened: Mapped[int] = mapped_column(Integer, default=0)
    total_clicked: Mapped[int] = mapped_column(Integer, default=0)
    is_winner: Mapped[bool] = mapped_column(Boolean, default=False)


class CampaignRecipient(TimestampMixin, Base):
    __tablename__ = "campaign_recipients"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    campaign_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("campaigns.id", ondelete="CASCADE"), nullable=False, index=True)
    contact_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("contacts.id", ondelete="CASCADE"), nullable=False, index=True)
    variant_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("ab_test_variants.id", ondelete="SET NULL"))
    
    status: Mapped[str] = mapped_column(String(20), default="pending", nullable=False) # pending, sent, delivered, opened, clicked, bounced, complained, unsubscribed, failed
    
    sent_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    delivered_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    opened_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    clicked_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
