from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = "ea7c572a4219"
down_revision = "fd3e838e0970"
branch_labels = None
depends_on = None

application_status = sa.Enum(
    "pending", "review", "accepted", "rejected",
    name="application_status"
)

def upgrade() -> None:
    # Create enum if it doesn't exist (idempotent guard for dev)
    op.execute("""
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'application_status') THEN
        CREATE TYPE application_status AS ENUM ('pending','review','accepted','rejected');
      END IF;
    END$$;
    """)

    op.create_table(
        "applications",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("candidate_id", sa.Integer, sa.ForeignKey("candidates.id", ondelete="CASCADE"), nullable=False),
        sa.Column("job_id", sa.Integer, sa.ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False),

        sa.Column("first_name", sa.String(length=100), nullable=False),
        sa.Column("last_name", sa.String(length=100), nullable=False),
        sa.Column("email", sa.Text, nullable=False),

        sa.Column("year_of_birth", sa.Integer),
        sa.Column("phone", sa.String(length=50)),
        sa.Column("location", sa.String(length=120)),

        sa.Column("years_experience", sa.Integer),
        sa.Column("seniority_level", sa.String(length=50)),

        sa.Column("skills", postgresql.ARRAY(sa.String())),  # text[] in Postgres

        sa.Column("cv_path", sa.Text),
        sa.Column("cover_letter", sa.Text),

        sa.Column("status", application_status, nullable=False, server_default=sa.text("'pending'")),
        sa.Column("created_at", sa.TIMESTAMP(timezone=True), server_default=sa.text("now()"), nullable=False),
    )

    # Helpful indexes
    op.create_index("ix_applications_candidate_id", "applications", ["candidate_id"])
    op.create_index("ix_applications_job_id", "applications", ["job_id"])
    op.create_index("ix_applications_status", "applications", ["status"])


def downgrade() -> None:
    # Drop table first
    op.drop_index("ix_applications_status", table_name="applications")
    op.drop_index("ix_applications_job_id", table_name="applications")
    op.drop_index("ix_applications_candidate_id", table_name="applications")
    op.drop_table("applications")

    # Drop enum only if nothing else uses it
    op.execute("""
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM pg_type t
        JOIN pg_depend d ON d.refobjid = t.oid
        WHERE t.typname = 'application_status'
          AND d.classid = 'pg_type'::regclass
          AND d.deptype = 'e'  -- external dependency
      ) THEN
        DROP TYPE IF EXISTS application_status;
      END IF;
    END$$;
    """)
