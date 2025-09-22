from __future__ import annotations
from typing import Optional
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String
from app.database import Base
from app.schemas.candidate import CandidateRead

from sqlalchemy import (
    Boolean, DateTime, ForeignKey, Integer, String, Text, func,
    Index, Table
)

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    role: Mapped[str] = mapped_column(String(50), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)

    candidate: Mapped[Optional["Candidate"]] = relationship(
        back_populates="user", uselist=False, cascade="all, delete-orphan"
    )
    employer: Mapped[Optional["Employer"]] = relationship(
        back_populates="user", uselist=False, cascade="all, delete-orphan"
    )