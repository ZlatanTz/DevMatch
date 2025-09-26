"""add candidate.seniority and prefers_remote

Revision ID: 032f1351c529
Revises: 83e01ca42d7d
Create Date: 2025-09-25 16:31:02.940469

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '032f1351c529'
down_revision: Union[str, Sequence[str], None] = '83e01ca42d7d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
