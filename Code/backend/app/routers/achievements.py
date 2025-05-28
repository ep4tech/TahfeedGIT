from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from ..database import get_db
from ..models import Achievement, User
from pydantic import BaseModel
from datetime import date

router = APIRouter()

class AchievementIn(BaseModel):
    user_id: int
    date: str  # YYYY-MM-DD
    surah_from: str
    ayah_from: int
    surah_to: str
    ayah_to: int

class AchievementOut(BaseModel):
    id: int
    user_id: int
    date: str
    surah_from: str
    ayah_from: int
    surah_to: str
    ayah_to: int
    timestamp: str
    class Config:
        orm_mode = True

@router.post("/add", response_model=AchievementOut)
async def add_achievement(data: AchievementIn, db: AsyncSession = Depends(get_db)):
    achievement = Achievement(
        user_id=data.user_id,
        date=data.date,
        surah_from=data.surah_from,
        ayah_from=data.ayah_from,
        surah_to=data.surah_to,
        ayah_to=data.ayah_to
    )
    db.add(achievement)
    await db.commit()
    await db.refresh(achievement)
    return achievement

@router.get("/user/{user_id}", response_model=list[AchievementOut])
async def get_user_achievements(user_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Achievement).where(Achievement.user_id == user_id))
    return result.scalars().all()
