# app/database.py
from __future__ import annotations

import os
from pathlib import Path
from typing import AsyncGenerator

from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import declarative_base

# Load .env from project root no matter the CWD
PROJECT_ROOT = Path(__file__).resolve().parents[1]
load_dotenv(PROJECT_ROOT / ".env")

# Fail fast if missing (also keeps Pylance happy)
try:
    DATABASE_URL: str = os.environ["DATABASE_URL"]
except KeyError as e:
    raise RuntimeError(
        "DATABASE_URL is not set. Put it in server/.env like:\n"
        "DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/devmatchmain"
    ) from e

engine = create_async_engine(
    DATABASE_URL,
    echo=True,
    pool_pre_ping=True,
    future=True,
)

AsyncSessionLocal = async_sessionmaker(
    engine,
    expire_on_commit=False,
    autoflush=False,
)

Base = declarative_base()

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session
