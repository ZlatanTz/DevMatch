from datetime import datetime
from typing import Optional, TYPE_CHECKING
from sqlalchemy import String, Integer, DateTime, ForeignKey, Text, func, UniqueConstraint
from sqlalchemy import Enum as SAEnum
from app.enums.application_status import ApplicationStatus

from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import ARRAY
from app.core import Base

if TYPE_CHECKING:
    from .job import Job
    from .candidate import Candidate






class Application(Base):
    __tablename__ = "applications"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    candidate_id: Mapped[int] = mapped_column(ForeignKey("candidates.id", ondelete="CASCADE"), index=True, nullable=False)
    job_id: Mapped[int] = mapped_column(ForeignKey("jobs.id", ondelete="CASCADE"), index=True, nullable=False)


    first_name: Mapped[str] = mapped_column(String(100), nullable=False)
    last_name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False)
    year_of_birth: Mapped[int] = mapped_column(Integer, nullable=False)
    phone: Mapped[str] = mapped_column(String(50), nullable=False)
    location: Mapped[str] = mapped_column(String(255), nullable=False)
    years_experience: Mapped[int] = mapped_column(Integer, nullable=False)
    seniority_level: Mapped[str] = mapped_column(String(50), nullable=False)
    skills: Mapped[Optional[list[str]]] = mapped_column(ARRAY(String), nullable=True)
    cv_path: Mapped[str] = mapped_column(String(255), nullable=False)
    cover_letter: Mapped[Optional[str]] = mapped_column(Text)

    status: Mapped[ApplicationStatus] = mapped_column(SAEnum(ApplicationStatus), nullable=False, default=ApplicationStatus.pending)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    candidate: Mapped["Candidate"] = relationship(back_populates="applications")
    job: Mapped["Job"] = relationship(back_populates="applications")

    __table_args__ = (
        UniqueConstraint("job_id", "candidate_id", name="uq_application_job_candidate"),
    )
    def __repr__(self) -> str:
        return f"<Application id={self.id} job_id={self.job_id} candidate_id={self.candidate_id} status={self.status}>"
