from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from ..database import get_db
from ..models import Mistake
from pydantic import BaseModel
from datetime import date

router = APIRouter()

class MistakeIn(BaseModel):
    user_id: int
    date: str  # YYYY-MM-DD
    mistake_type: str  # 'recitation', 'division', 'memorization'
    count: int

class MistakeOut(BaseModel):
    id: int
    user_id: int
    date: str
    mistake_type: str
    count: int
    class Config:
        orm_mode = True

@router.post("/add", response_model=MistakeOut)
async def add_mistake(data: MistakeIn, db: AsyncSession = Depends(get_db)):
    mistake = Mistake(
        user_id=data.user_id,
        date=data.date,
        mistake_type=data.mistake_type,
        count=data.count
    )
    db.add(mistake)
    await db.commit()
    await db.refresh(mistake)
    return mistake

@router.get("/user/{user_id}/date/{date}", response_model=list[MistakeOut])
async def get_user_mistakes(user_id: int, date: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Mistake).where(Mistake.user_id == user_id, Mistake.date == date))
    return result.scalars().all()
