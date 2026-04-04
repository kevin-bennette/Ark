"""initial

Revision ID: 0001
Revises: 
Create Date: 2026-04-04 15:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('city', sa.String(), nullable=False),
    sa.Column('platform', sa.String(), nullable=False),
    sa.Column('avg_hours_per_week', sa.Float(), nullable=False),
    sa.Column('hourly_rate', sa.Float(), nullable=False),
    sa.Column('risk_profile_score', sa.Float(), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)
    
    op.create_table('triggers',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('trigger_type', sa.String(), nullable=True),
    sa.Column('severity', sa.Float(), nullable=True),
    sa.Column('zone', sa.String(), nullable=True),
    sa.Column('timestamp', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_triggers_id'), 'triggers', ['id'], unique=False)
    op.create_index(op.f('ix_triggers_trigger_type'), 'triggers', ['trigger_type'], unique=False)
    
    op.create_table('policies',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('weekly_premium', sa.Float(), nullable=False),
    sa.Column('coverage_hours', sa.Float(), nullable=False),
    sa.Column('active_status', sa.Boolean(), nullable=True),
    sa.Column('risk_score', sa.Float(), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_policies_id'), 'policies', ['id'], unique=False)
    
    op.create_table('claims',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('trigger_id', sa.Integer(), nullable=True),
    sa.Column('disruption_hours', sa.Float(), nullable=False),
    sa.Column('loss_calculated', sa.Float(), nullable=False),
    sa.Column('status', sa.String(), nullable=True),
    sa.Column('fraud_confidence', sa.Float(), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.ForeignKeyConstraint(['trigger_id'], ['triggers.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_claims_id'), 'claims', ['id'], unique=False)
    
    op.create_table('payouts',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('claim_id', sa.Integer(), nullable=True),
    sa.Column('amount', sa.Float(), nullable=False),
    sa.Column('status', sa.String(), nullable=True),
    sa.Column('processed_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.ForeignKeyConstraint(['claim_id'], ['claims.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_payouts_id'), 'payouts', ['id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_payouts_id'), table_name='payouts')
    op.drop_table('payouts')
    op.drop_index(op.f('ix_claims_id'), table_name='claims')
    op.drop_table('claims')
    op.drop_index(op.f('ix_policies_id'), table_name='policies')
    op.drop_table('policies')
    op.drop_index(op.f('ix_triggers_trigger_type'), table_name='triggers')
    op.drop_index(op.f('ix_triggers_id'), table_name='triggers')
    op.drop_table('triggers')
    op.drop_index(op.f('ix_users_id'), table_name='users')
    op.drop_table('users')
