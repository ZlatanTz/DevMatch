
from __future__ import annotations
from typing import AsyncGenerator
import os
from urllib.parse import urlparse, urlunparse, parse_qsl, urlencode

from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase

from app.core.config import settings


def _to_asyncpg_url(raw: str) -> str:
    if not raw:
        raise ValueError("DATABASE_URL is empty")

    if raw.startswith("postgres://"):
        raw = "postgresql://" + raw[len("postgres://"):]
    if not raw.startswith("postgresql+asyncpg://"):
        raw = "postgresql+asyncpg://" + raw[len("postgresql://"):]

    p = urlparse(raw)
    q = dict(parse_qsl(p.query, keep_blank_values=True))
    q.pop("ssl", None)
    q.pop("sslmode", None)
    return urlunparse(p._replace(query=urlencode(q)))



ASYNC_DATABASE_URL = _to_asyncpg_url(settings.DATABASE_URL)

engine = create_async_engine(
    ASYNC_DATABASE_URL,
    echo=True,             
    pool_pre_ping=True,
    connect_args={"ssl": True}
    
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
