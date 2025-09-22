from __future__ import annotations

from datetime import datetime
from typing import List, Optional
from sqlalchemy import (
    Boolean, DateTime, ForeignKey, Integer, String, Text, func,
    Index, Table
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import ARRAY
from database import Base

job_skills = Table(
    "job_skills",
    Base.metadata,
    Index("ix_job_skill", "job_id", "skill_id", unique=True),
    mapped_column("job_id", Integer, ForeignKey(
        "jobs.id", ondelete="CASCADE"), primary_key=True),
    mapped_column("skill_id", Integer, ForeignKey(
        "skills.id", ondelete="CASCADE"), primary_key=True),
)

candidate_skills = Table(
    "candidate_skills",
    Base.metadata,
    Index("ix_candidate_skill", "candidate_id", "skill_id", unique=True),
    mapped_column("candidate_id", Integer, ForeignKey(
        "candidates.id", ondelete="CASCADE"), primary_key=True),
    mapped_column("skill_id", Integer, ForeignKey(
        "skills.id", ondelete="CASCADE"), primary_key=True),
)


class Skill(Base):
    __tablename__ = "skills"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    role: Mapped[str] = mapped_column(String(50), nullable=False)
    email: Mapped[str] = mapped_column(
        String(255), unique=True, nullable=False)
    suspended: Mapped[bool] = mapped_column(
        Boolean, nullable=False, default=False)
    verified: Mapped[bool] = mapped_column(
        Boolean, nullable=False, default=False)

    candidate: Mapped[Optional["Admin"]] = relationship(
        back_populates="user", uselist=False, cascade="all, delete-orphan"
    )
    candidate: Mapped[Optional["Candidate"]] = relationship(
        back_populates="user", uselist=False, cascade="all, delete-orphan"
    )
    employer: Mapped[Optional["Employer"]] = relationship(
        back_populates="user", uselist=False, cascade="all, delete-orphan"
    )


class Admin(Base):
    __tablename__ = "admins"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    user: Mapped["User"] = relationship(back_populates="admin")


class Candidate(Base):
    __tablename__ = "candidates"
    __table_args__ = (Index("ix_candidates_full_name", "full_name"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False
    )
    first_name: Mapped[str] = mapped_column(String(255), nullable=False)
    last_name: Mapped[str] = mapped_column(String(255), nullable=False)
    location: Mapped[Optional[str]] = mapped_column(String(255))
    years_exp: Mapped[Optional[int]] = mapped_column(Integer)
    bio: Mapped[Optional[str]] = mapped_column(Text)
    resume_url: Mapped[Optional[str]] = mapped_column(String(255))
    desired_salary: Mapped[Optional[int]] = mapped_column(Integer)  # NEW

    user: Mapped["User"] = relationship(back_populates="candidate")

    skills: Mapped[List["Skill"]] = relationship(
        "Skill",
        secondary=candidate_skills,
        backref="candidates",
        lazy="selectin",
    )


class Employer(Base):
    __tablename__ = "employers"
    __table_args__ = (Index("ix_employers_company_name", "company_name"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False
    )
    company_name: Mapped[str] = mapped_column(String(255), nullable=False)
    website: Mapped[Optional[str]] = mapped_column(String(255))
    about: Mapped[Optional[str]] = mapped_column(Text)
    location: Mapped[Optional[str]] = mapped_column(String(255))
    verified: Mapped[bool] = mapped_column(Boolean, default=False)
    country: Mapped[Optional[str]] = mapped_column(String(100))
    tel: Mapped[Optional[str]] = mapped_column(String(50))

    user: Mapped["User"] = relationship(back_populates="employer")
    jobs: Mapped[List["Job"]] = relationship(
        back_populates="employer", cascade="all, delete-orphan", lazy="selectin"
    )


class Job(Base):
    __tablename__ = "jobs"
    __table_args__ = (
        Index("ix_jobs_title", "title"),
        Index("ix_jobs_status", "status"),
        Index("ix_jobs_location", "location"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    company: Mapped[Optional[str]] = mapped_column(String(255))
    company_img: Mapped[Optional[str]] = mapped_column(String(255))
    location: Mapped[Optional[str]] = mapped_column(String(255))
    employment_type: Mapped[Optional[str]] = mapped_column(String(100))
    seniority: Mapped[Optional[str]] = mapped_column(String(50))
    min_salary: Mapped[Optional[int]] = mapped_column(Integer)
    max_salary: Mapped[Optional[int]] = mapped_column(Integer)
    is_remote: Mapped[bool] = mapped_column(
        Boolean, default=False, nullable=False)
    status: Mapped[str] = mapped_column(
        String(50), default="open", nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    description: Mapped[Optional[str]] = mapped_column(Text)
    company_description: Mapped[Optional[str]] = mapped_column(Text)
    benefits: Mapped[Optional[List[str]]] = mapped_column(
        ARRAY(String), default=list)

    employer_id: Mapped[int] = mapped_column(
        ForeignKey("employers.id", ondelete="CASCADE"), index=True, nullable=False
    )
    employer: Mapped["Employer"] = relationship(back_populates="jobs")

    skills: Mapped[List["Skill"]] = relationship(
        "Skill",
        secondary=job_skills,
        backref="jobs",
        lazy="selectin",
    )
