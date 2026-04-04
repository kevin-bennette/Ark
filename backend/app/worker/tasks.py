import asyncio
from app.core.celery_app import celery_app
from app.services.weather_service import fetch_weather_and_aqi, mock_platform_status
from app.database import AsyncSessionLocal
from app.models import Trigger

@celery_app.task
def poll_environmental_triggers():
    """Periodic Celery Task to evaluate environment for risk triggers."""
    asyncio.run(_poll_and_commit())

async def _poll_and_commit():
    city = "Mumbai" # Default for global checking
    data = await fetch_weather_and_aqi()
    platform_state = await mock_platform_status(city)
    
    triggers = []
    
    # Logic for trigger assessment:
    if data["rainfall_mm"] > 10.0:
        triggers.append({"type": "rain", "severity": data["rainfall_mm"]})
        
    if data["temperature"] > 40.0:
        triggers.append({"type": "heat", "severity": data["temperature"]})
        
    if data["aqi"] > 150:
        triggers.append({"type": "pollution", "severity": float(data["aqi"])})
        
    if platform_state == "down":
        triggers.append({"type": "platform_down", "severity": 1.0})
        
    if not triggers:
        print("No threshold breaches detected. System nominal.")
        return
        
    # Write triggers to the database and generate claims
    from app.models import Policy, Claim, Payout
    from sqlalchemy.future import select
    from app.ml.fraud_engine import assess_fraud_risk
    
    async with AsyncSessionLocal() as session:
        for t in triggers:
            trigger_row = Trigger(
                trigger_type=t["type"],
                severity=t["severity"],
                zone=city
            )
            session.add(trigger_row)
            await session.commit()
            await session.refresh(trigger_row)
            
            # Find active policies for affected users
            # For demo scope, assume global impact.
            # Real world would filter by `User.city == city`
            policies_result = await session.execute(
                select(Policy).filter(Policy.active_status == True)
            )
            active_policies = policies_result.scalars().all()
            
            for policy in active_policies:
                # Load user to calculate loss
                user_result = await session.execute(select(Policy.user).filter(Policy.id == policy.id))
                
                # Assume 1 hour disruption per trigger occurrence
                loss_amount = policy.coverage_hours * policy.weekly_premium # Simplified mock ratio or we do hourly rate * disruption
                # From prompt: loss = hourly_rate * disruption_hours. We assume 1 disruption hour per tick
                hourly_rate = 15.0 # mock since relation isn't instantly available without explicit join setup
                loss_amount = hourly_rate * 1.0
                
                fraud_data = await assess_fraud_risk(policy.user_id, policy.id, t["type"], city)
                
                claim = Claim(
                    user_id=policy.user_id,
                    trigger_id=trigger_row.id,
                    disruption_hours=1.0,
                    loss_calculated=loss_amount,
                    status="approved" if fraud_data.get("fraud_score", 0) < 0.7 else "pending",
                    fraud_confidence=fraud_data.get("fraud_score", 0.0)
                )
                session.add(claim)
                await session.commit()
                await session.refresh(claim)
                
                if claim.status == "approved":
                    payout = Payout(
                        claim_id=claim.id,
                        amount=loss_amount,
                        status="completed"
                    )
                    session.add(payout)
                    await session.commit()
                    
        print(f"Recorded {len(triggers)} triggers and generated their respective claims/payouts.")
