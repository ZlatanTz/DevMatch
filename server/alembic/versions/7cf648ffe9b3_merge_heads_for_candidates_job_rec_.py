"""merge heads for candidates/job rec changes

Revision ID: 7cf648ffe9b3
Revises: 9a84b4161f3c, d75fba1611ec
Create Date: 2025-09-26 02:54:25.286414

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '7cf648ffe9b3'
down_revision: Union[str, Sequence[str], None] = ('9a84b4161f3c', 'd75fba1611ec')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
