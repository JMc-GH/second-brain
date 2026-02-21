"""create documents table

Revision ID: 0001_create_documents
Revises:
Create Date: 2026-02-21 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


revision = "0001_create_documents"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "documents",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("filename", sa.String(length=255), nullable=False),
        sa.Column("source_type", sa.String(length=64), nullable=False),
        sa.Column("source_url", sa.String(length=1024), nullable=True),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_documents_id"), "documents", ["id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_documents_id"), table_name="documents")
    op.drop_table("documents")
