"""add company_logo to employers

Revision ID: dd5de4337320
Revises: 7cf648ffe9b3
Create Date: 2025-09-28 00:08:54.835151
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "dd5de4337320"
down_revision: Union[str, Sequence[str], None] = "7cf648ffe9b3"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # keep the migration single-purpose
    op.add_column("employers", sa.Column("company_logo", sa.String(length=255), nullable=True))

    # if you truly need this unique constraint, keep it; otherwise remove it too
    op.create_unique_constraint(
        "uq_application_job_candidate",
        "applications",
        ["job_id", "candidate_id"],
    )


def downgrade() -> None:
    # reverse of upgrade, in safe order
    op.drop_constraint("uq_application_job_candidate", "applications", type_="unique")
    op.drop_column("employers", "company_logo")
