from datetime import datetime
from sqlalchemy import String, ForeignKey, func, DateTime, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core import Base

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)

    is_active: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_suspended: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False, server_default="false")
    employer: Mapped["Employer"] = relationship(back_populates="user", uselist=False)
    candidate: Mapped["Candidate"] = relationship(back_populates="user", uselist=False)
    admin: Mapped["Admin"] = relationship(back_populates="user", uselist=False)

    # FK on roles
    role_id: Mapped[int] = mapped_column(ForeignKey("roles.id"), nullable=False)
    role: Mapped["Role"] = relationship(back_populates="users")

    def __repr__(self) -> str:
        return f"<User id={self.id} email={self.email!r} role={self.role_id}>"