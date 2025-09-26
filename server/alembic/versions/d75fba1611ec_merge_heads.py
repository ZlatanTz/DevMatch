"""merge heads

Revision ID: d75fba1611ec
Revises: 9936bb6087fd, f323d1cc54c1
Create Date: 2025-09-25 15:21:20.123850

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd75fba1611ec'
down_revision: Union[str, Sequence[str], None] = ('9936bb6087fd', 'f323d1cc54c1')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
