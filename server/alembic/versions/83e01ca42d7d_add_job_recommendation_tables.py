"""add job recommendation tables

Revision ID: 83e01ca42d7d
Revises: 9936bb6087fd
Create Date: 2025-09-25 16:28:00.597838

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '83e01ca42d7d'
down_revision: Union[str, Sequence[str], None] = '9936bb6087fd'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.add_column(
        "candidates",
        sa.Column("seniority", sa.String(), nullable=True),
    )
    op.add_column(
        "candidates",
        sa.Column("prefers_remote", sa.Boolean(), nullable=True),
    )

def downgrade():
    op.drop_column("candidates", "prefers_remote")
    op.drop_column("candidates", "seniority")