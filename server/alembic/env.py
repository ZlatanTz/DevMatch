# alembic/env.py
from __future__ import annotations

import asyncio
import os
import sys
from pathlib import Path
from logging.config import fileConfig

from alembic import context
from sqlalchemy import pool
from sqlalchemy.ext.asyncio import AsyncEngine, create_async_engine

# Make project root (that contains 'app/' and '.env') importable
PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

# Load .env so DATABASE_URL is present for Alembic runs
try:
    from dotenv import load_dotenv
    load_dotenv(PROJECT_ROOT / ".env")
except Exception:
    pass  # assume env is already exported

# Import Base and register mappers
from app.core.database import Base
import app.models

# Alembic config and logging
config = context.config
if config.config_file_name:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata

# Get the DB URL once, with a clear error if missing (also satisfies Pylance)
try:
    DATABASE_URL: str = os.environ["DATABASE_URL"]
except KeyError as e:
    raise RuntimeError(
        "DATABASE_URL is not set for Alembic. Put it in .env or export it."
    ) from e

# Translate async URL ("postgresql+asyncpg") to sync URL ("postgresql")
if DATABASE_URL.startswith("postgresql+asyncpg"):
    SYNC_DATABASE_URL = DATABASE_URL.replace("postgresql+asyncpg", "postgresql")
else:
    SYNC_DATABASE_URL = DATABASE_URL


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    context.configure(
        url=SYNC_DATABASE_URL,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()

from sqlalchemy import create_engine
from sqlalchemy import pool

def run_migrations_online() -> None:
    # connectable = create_engine(DATABASE_URL, poolclass=pool.NullPool)
    connectable = create_engine(SYNC_DATABASE_URL, poolclass=pool.NullPool)

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
