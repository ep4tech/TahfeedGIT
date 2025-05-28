from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from .models import Base
import os

# SQLite database URL
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, 'tahfeed.db')
DATABASE_URL = f"sqlite+aiosqlite:///{DB_PATH}"

# Async engine and session
engine = create_async_engine(
    DATABASE_URL, echo=True, future=True
)

async_session = sessionmaker(
    engine, expire_on_commit=False, class_=AsyncSession
)

def get_db():
    db = async_session()
    try:
        yield db
    finally:
        db.close()

# Create all tables on startup
async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
