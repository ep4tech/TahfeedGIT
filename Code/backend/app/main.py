from fastapi import FastAPI
import asyncio
from .database import init_db
from .routers import users, common, achievements, questions, reports, mistakes

app = FastAPI()

app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(common.router, prefix="/common", tags=["common"])
app.include_router(achievements.router, prefix="/achievements", tags=["achievements"])
app.include_router(questions.router, prefix="/questions", tags=["questions"])
app.include_router(reports.router, prefix="/reports", tags=["reports"])
app.include_router(mistakes.router, prefix="/mistakes", tags=["mistakes"])

@app.on_event("startup")
async def on_startup():
    await init_db()

@app.get("/")
def read_root():
    return {"msg": "Tahfeed Backend Running"}
