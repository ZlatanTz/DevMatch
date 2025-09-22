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
from app.database import Base  # type: ignore
# Import model modules explicitly so their mappers register
import app.models.user       # noqa: F401
import app.models.skill      # noqa: F401
from app.models.associations import job_skills, candidate_skills  # noqa: F401
import app.models.candidate  # noqa: F401
import app.models.employer   # noqa: F401
import app.models.job        # noqa: F401


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


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    context.configure(
        url=DATABASE_URL,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode with async engine."""
    connectable: AsyncEngine = create_async_engine(
        DATABASE_URL,
        poolclass=pool.NullPool,
    )

    async def do_run_migrations() -> None:
        async with connectable.connect() as connection:
            await connection.run_sync(
                lambda sync_conn: context.configure(
                    connection=sync_conn, target_metadata=target_metadata
                )
            )
            await connection.run_sync(lambda _c: context.run_migrations())

    asyncio.run(do_run_migrations())


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
