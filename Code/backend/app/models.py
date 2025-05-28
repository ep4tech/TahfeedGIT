from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey, Boolean, Text, Float
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy.sql import func

Base = declarative_base()

# User roles: student, teacher, supervisor
class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, nullable=False)  # student, teacher, supervisor
    phone = Column(String, nullable=True)
    group_id = Column(Integer, ForeignKey('groups.id'))
    # Relationships
    group = relationship('Group', back_populates='users')
    achievements = relationship('Achievement', back_populates='user')
    mistakes = relationship('Mistake', back_populates='user')
    reports = relationship('Report', back_populates='user')
    exams = relationship('Exam', back_populates='user')

class Group(Base):
    __tablename__ = 'groups'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    users = relationship('User', back_populates='group')
    questions = relationship('Question', back_populates='group')

class Achievement(Base):
    __tablename__ = 'achievements'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    date = Column(Date, nullable=False)
    surah_from = Column(String, nullable=False)
    ayah_from = Column(Integer, nullable=False)
    surah_to = Column(String, nullable=False)
    ayah_to = Column(Integer, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    # Relationships
    user = relationship('User', back_populates='achievements')

class Question(Base):
    __tablename__ = 'questions'
    id = Column(Integer, primary_key=True, index=True)
    group_id = Column(Integer, ForeignKey('groups.id'))
    week = Column(Integer, nullable=False)
    text = Column(Text, nullable=False)
    # Relationships
    group = relationship('Group', back_populates='questions')
    answers = relationship('Answer', back_populates='question')

class Answer(Base):
    __tablename__ = 'answers'
    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey('questions.id'))
    model_answer = Column(Text, nullable=False)
    # Relationships
    question = relationship('Question', back_populates='answers')

class Mistake(Base):
    __tablename__ = 'mistakes'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    date = Column(Date, nullable=False)
    mistake_type = Column(String, nullable=False)  # e.g., 'recitation', 'division', 'memorization'
    count = Column(Integer, default=0)
    # Relationships
    user = relationship('User', back_populates='mistakes')

class Report(Base):
    __tablename__ = 'reports'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    month = Column(String, nullable=False)  # e.g., '2025-05'
    total_points = Column(Integer, default=0)
    # Relationships
    user = relationship('User', back_populates='reports')

class Announcement(Base):
    __tablename__ = 'announcements'
    id = Column(Integer, primary_key=True, index=True)
    text = Column(Text, nullable=False)
    active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Advice(Base):
    __tablename__ = 'advices'
    id = Column(Integer, primary_key=True, index=True)
    text = Column(Text, nullable=False)
    date_generated = Column(Date, nullable=False)

class Exam(Base):
    __tablename__ = 'exams'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    date = Column(Date, nullable=False)
    exam_type = Column(String, nullable=False)  # e.g., 'quran', 'review'
    score = Column(Integer, default=0)
    mistakes = Column(Integer, default=0)
    # Relationships
    user = relationship('User', back_populates='exams')

# Note: You can add more fields or refine relationships as needed for your business logic.
