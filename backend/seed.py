import asyncio
from app.database import AsyncSessionLocal, engine, Base
from app.models import User, Policy

async def seed_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        # Check if user exists
        import sqlalchemy as sa
        user_result = await session.execute(sa.select(User).filter(User.id == 1))
        user = user_result.scalars().first()
        if not user:
            print("Seeding Initial User...")
            user = User(
                id=1,
                name="Ramesh Kumar",
                city="Mumbai",
                platform="Swiggy",
                avg_hours_per_week=40,
                hourly_rate=15.0,
                risk_profile_score=1.2
            )
            session.add(user)
            await session.commit()
        
        policy_result = await session.execute(sa.select(Policy).filter(Policy.user_id == 1))
        policy = policy_result.scalars().first()
        if not policy:
            print("Seeding Initial Policy...")
            policy = Policy(
                user_id=1,
                weekly_premium=25.0,
                coverage_hours=8.0,
                active_status=True,
                risk_score=1.2
            )
            session.add(policy)
            await session.commit()
    print("Database seeding completed.")

if __name__ == "__main__":
    asyncio.run(seed_db())
