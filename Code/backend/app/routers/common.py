from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from ..database import get_db
from ..models import Announcement, Advice
from pydantic import BaseModel
from datetime import date

router = APIRouter()

class AnnouncementOut(BaseModel):
    id: int
    text: str
    active: bool
    created_at: str
    class Config:
        orm_mode = True

class AdviceOut(BaseModel):
    id: int
    text: str
    date_generated: str
    class Config:
        orm_mode = True

@router.get("/announcements", response_model=list[AnnouncementOut])
async def get_announcements(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Announcement).where(Announcement.active == True))
    return result.scalars().all()

@router.get("/advices/today", response_model=AdviceOut)
async def get_today_advice(db: AsyncSession = Depends(get_db)):
    today = date.today()
    result = await db.execute(select(Advice).where(Advice.date_generated == today))
    advice = result.scalar_one_or_none()
    if not advice:
        raise HTTPException(status_code=404, detail="No advice for today")
    return advice
