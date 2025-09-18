from datetime import datetime
from sqlalchemy import (
    Table, Column, Integer, String, Text, Boolean, DateTime, ForeignKey
)
from sqlalchemy.orm import relationship, Mapped, mapped_column
from app.db import Base

class Jobs(Base):
  __tablename__ = "jobs"

  id: Mapped[int] = mapped_column(Integer, primary_key=True)
  title: Mapped[str] = mapped_column(String(200), index=True)
  company: Mapped[str] = mapped_column(String(200), index=True)
  location: Mapped[str] = mapped_column(String(200))
  employment_type: Mapped[str] = mapped_column(String(50))     
  seniority: Mapped[str] = mapped_column(String(50))           
  min_salary: Mapped[int | None] = mapped_column(Integer, nullable=True)
  max_salary: Mapped[int | None] = mapped_column(Integer, nullable=True)
  is_remote: Mapped[bool] = mapped_column(Boolean, default=False)
  status: Mapped[str] = mapped_column(String(50), index=True)  
  created_at: Mapped[datetime] = mapped_column(
    DateTime(timezone=True), default=datetime.now()
  )
  description: Mapped[str] = mapped_column(Text)
  company_description: Mapped[str | None] = mapped_column(Text, nullable=True)



#  "id": 1,
#     "title": "Frontend Developer (React)",
#     "company": "TechNova",
#     "company_img": "https://static.vecteezy.com/system/resources/previews/008/214/517/non_2x/abstract-geometric-logo-or-infinity-line-logo-for-your-company-free-vector.jpg",
#     "location": "Remote",
#     "employment_type": "Full-time",
#     "seniority": "Junior",
#     "min_salary": 2000,
#     "max_salary": 3000,
#     "is_remote": true,
#     "status": "open",
#     "skills": [1, 2, 8],
#     "created_at": "2025-09-01T10:00:00Z",
#     "description": "Work on building responsive and dynamic user interfaces using React. Collaborate with designers and backend developers to deliver high-quality web applications.",
#     "company_description": "TechNova is a young software company founded in 2018, focused on creating modern web and mobile applications for clients worldwide. They are known for innovations in UI/UX design and an agile approach to development.",
#     "benefits": [