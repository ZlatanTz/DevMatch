from __future__ import annotations

from typing import List, Optional, TYPE_CHECKING
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, Text, ForeignKey, Index, Boolean
from app.core import Base
from .associations import candidate_skills

if TYPE_CHECKING:
    from .user import User
    from .skill import Skill
    from .application import Application
class Candidate(Base):
    __tablename__ = "candidates"
   

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    first_name: Mapped[str] = mapped_column(String(255), nullable=False)
    last_name: Mapped[str] = mapped_column(String(255), nullable=False)
    location: Mapped[Optional[str]] = mapped_column(String(255))
    years_exp: Mapped[Optional[int]] = mapped_column(Integer)
    bio: Mapped[Optional[str]] = mapped_column(Text)
    resume_url: Mapped[Optional[str]] = mapped_column(String(255))
    seniority: Mapped[Optional[str]] = mapped_column(String)
    desired_salary: Mapped[Optional[int]] = mapped_column(Integer)
    prefers_remote: Mapped[Optional[bool]] = mapped_column(Boolean)
    country: Mapped[Optional[str]] = mapped_column(String(100))
    tel: Mapped[Optional[str]] = mapped_column(String(20))
    img_path: Mapped[Optional[str]] = mapped_column(String(255))
    user: Mapped["User"] = relationship(back_populates="candidate")
    applications: Mapped[list["Application"]] = relationship(back_populates="candidate", cascade="all, delete-orphan")
    skills: Mapped[List["Skill"]] = relationship(
        "Skill",
        secondary=candidate_skills,
        backref="candidates",
        lazy="selectin",
    )
    __table_args__ = (Index("ix_candidates_name", "first_name", "last_name"),)
