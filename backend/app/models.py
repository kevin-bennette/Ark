from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    city = Column(String, nullable=False)
    platform = Column(String, nullable=False)
    avg_hours_per_week = Column(Float, nullable=False)
    hourly_rate = Column(Float, nullable=False)
    risk_profile_score = Column(Float, default=1.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    policies = relationship("Policy", back_populates="user")
    claims = relationship("Claim", back_populates="user")

class Policy(Base):
    __tablename__ = "policies"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    weekly_premium = Column(Float, nullable=False)
    coverage_hours = Column(Float, nullable=False)
    active_status = Column(Boolean, default=True)
    risk_score = Column(Float, default=1.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="policies")

class Trigger(Base):
    __tablename__ = "triggers"

    id = Column(Integer, primary_key=True, index=True)
    trigger_type = Column(String, index=True) # "rain", "heat", "pollution", "platform_down"
    severity = Column(Float)
    zone = Column(String)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

class Claim(Base):
    __tablename__ = "claims"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    trigger_id = Column(Integer, ForeignKey("triggers.id"))
    disruption_hours = Column(Float, nullable=False)
    loss_calculated = Column(Float, nullable=False)
    status = Column(String, default="pending") # "pending", "approved", "rejected"
    fraud_confidence = Column(Float, default=0.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="claims")
    trigger = relationship("Trigger")
    payout = relationship("Payout", back_populates="claim", uselist=False)

class Payout(Base):
    __tablename__ = "payouts"

    id = Column(Integer, primary_key=True, index=True)
    claim_id = Column(Integer, ForeignKey("claims.id"))
    amount = Column(Float, nullable=False)
    status = Column(String, default="processing") # "processing", "completed"
    processed_at = Column(DateTime(timezone=True), server_default=func.now())

    claim = relationship("Claim", back_populates="payout")
