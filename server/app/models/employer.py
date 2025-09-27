from __future__ import annotations

from typing import List, Optional, TYPE_CHECKING
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, Text, Boolean, ForeignKey, Index, text
from app.core import Base

if TYPE_CHECKING:
    from .user import User
    from .job import Job

class Employer(Base):
    __tablename__ = "employers"
  

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    company_name: Mapped[str] = mapped_column(String(255), nullable=False)
    website: Mapped[Optional[str]] = mapped_column(String(255))
    about: Mapped[Optional[str]] = mapped_column(Text)
    location: Mapped[Optional[str]] = mapped_column(String(255))
    country: Mapped[Optional[str]] = mapped_column(String(100))
    tel: Mapped[Optional[str]] = mapped_column(String(50))
    company_logo: Mapped[Optional[str]] = mapped_column(String(255))
    user: Mapped["User"] = relationship(back_populates="employer")
    jobs: Mapped[List["Job"]] = relationship(
        back_populates="employer", cascade="all, delete-orphan", lazy="selectin"
    )
    __table_args__ = (Index("ix_employers_company_name", "company_name"),)    