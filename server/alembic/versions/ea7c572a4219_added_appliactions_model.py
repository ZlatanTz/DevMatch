from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = "ea7c572a4219"
down_revision = "fd3e838e0970"
branch_labels = None
depends_on = None

def upgrade() -> None:
  # This migration has been replaced by 9936bb6087fd.
  pass

def downgrade() -> None:
    # Nothing to drop here because handled in 9936bb6087fd.
    pass