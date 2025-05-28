from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from ..database import get_db
from ..models import Report, User
from pydantic import BaseModel

router = APIRouter()

class ReportIn(BaseModel):
    user_id: int
    month: str
    total_points: int

class ReportOut(BaseModel):
    id: int
    user_id: int
    month: str
    total_points: int
    class Config:
        orm_mode = True

@router.post("/add", response_model=ReportOut)
async def add_report(data: ReportIn, db: AsyncSession = Depends(get_db)):
    report = Report(
        user_id=data.user_id,
        month=data.month,
        total_points=data.total_points
    )
    db.add(report)
    await db.commit()
    await db.refresh(report)
    return report

@router.get("/user/{user_id}", response_model=list[ReportOut])
async def get_user_reports(user_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Report).where(Report.user_id == user_id))
    return result.scalars().all()
