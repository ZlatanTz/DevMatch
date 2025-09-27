from __future__ import annotations
from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase

from app.core.config import settings

engine = create_async_engine(
    settings.DATABASE_URL,
    echo=True, # TEMP, only for dev, False for prod!
    pool_pre_ping=True,
    future=True,
)

AsyncSessionLocal = async_sessionmaker(
    engine,
    expire_on_commit=False,
    autoflush=False,
)

class Base(DeclarativeBase):
    pass

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session
