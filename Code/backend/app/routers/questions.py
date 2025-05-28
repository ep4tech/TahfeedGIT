from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from ..database import get_db
from ..models import Question, Answer
from pydantic import BaseModel

router = APIRouter()

class QuestionIn(BaseModel):
    group_id: int
    week: int
    text: str

class QuestionOut(BaseModel):
    id: int
    group_id: int
    week: int
    text: str
    class Config:
        orm_mode = True

class AnswerIn(BaseModel):
    question_id: int
    model_answer: str

class AnswerOut(BaseModel):
    id: int
    question_id: int
    model_answer: str
    class Config:
        orm_mode = True

@router.post("/add", response_model=QuestionOut)
async def add_question(data: QuestionIn, db: AsyncSession = Depends(get_db)):
    question = Question(
        group_id=data.group_id,
        week=data.week,
        text=data.text
    )
    db.add(question)
    await db.commit()
    await db.refresh(question)
    return question

@router.get("/group/{group_id}/week/{week}", response_model=list[QuestionOut])
async def get_questions(group_id: int, week: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Question).where(Question.group_id == group_id, Question.week == week))
    return result.scalars().all()

@router.post("/answer/add", response_model=AnswerOut)
async def add_answer(data: AnswerIn, db: AsyncSession = Depends(get_db)):
    answer = Answer(question_id=data.question_id, model_answer=data.model_answer)
    db.add(answer)
    await db.commit()
    await db.refresh(answer)
    return answer

@router.get("/answers/{question_id}", response_model=list[AnswerOut])
async def get_answers(question_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Answer).where(Answer.question_id == question_id))
    return result.scalars().all()
