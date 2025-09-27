from __future__ import annotations

from typing import List, Optional, TYPE_CHECKING
from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, Text, Boolean, DateTime, ForeignKey, Index, CheckConstraint, func, text
from sqlalchemy.dialects.postgresql import ARRAY
from app.core import Base
from .associations import job_skills

if TYPE_CHECKING:
    from .employer import Employer
    from .skill import Skill
    from .application import Application
class Job(Base):
    __tablename__ = "jobs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    location: Mapped[Optional[str]] = mapped_column(String(255))
    employment_type: Mapped[Optional[str]] = mapped_column(String(100))
    seniority: Mapped[Optional[str]] = mapped_column(String(50))
    min_salary: Mapped[Optional[int]] = mapped_column(Integer)
    max_salary: Mapped[Optional[int]] = mapped_column(Integer)
    is_remote: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("false"))
    status: Mapped[str] = mapped_column(String(50), nullable=False, server_default=text("'open'"))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text)
    company_description: Mapped[Optional[str]] = mapped_column(Text)
    benefits: Mapped[Optional[List[str]]] = mapped_column(ARRAY(String), default=list)

    employer_id: Mapped[int] = mapped_column(ForeignKey("employers.id", ondelete="CASCADE"), index=True, nullable=False)
    employer: Mapped["Employer"] = relationship(back_populates="jobs", lazy="selectin")
    applications: Mapped[list["Application"]] = relationship(back_populates="job", cascade="all, delete-orphan")

    skills: Mapped[List["Skill"]] = relationship(
        "Skill",
        secondary=job_skills,
        backref="jobs",
        lazy="selectin",
    )
    __table_args__ = (
    Index("ix_jobs_title", "title"),
    CheckConstraint(
        "(min_salary IS NULL) OR (max_salary IS NULL) OR (min_salary <= max_salary)",
        name="ck_salary_range",
        )
    )
    def __repr__(self) -> str:
        return f"<Job id={self.id} title={self.title!r} status={self.status}>"
