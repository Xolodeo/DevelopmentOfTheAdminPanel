from fastapi import FastAPI, Depends
from sqlalchemy import Column, Integer, String, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from typing import List
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

DATABASE_URL = "postgresql://user:password@db:5432/students_db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Разрешаем запросы с любых источников
    allow_credentials=True,
    allow_methods=["*"],  # Разрешаем все HTTP-методы
    allow_headers=["*"],  # Разрешаем все заголовки
)

class Student(Base):
    __tablename__ = "students"
    id = Column(Integer, primary_key=True, index=True)
    last_name = Column(String, index=True)
    first_name = Column(String, index=True)
    middle_name = Column(String, index=True)
    course = Column(Integer)
    group = Column(String)
    faculty = Column(String)

Base.metadata.create_all(bind=engine)

# Pydantic модель для сериализации ответов
class StudentSchema(BaseModel):
    id: int
    last_name: str
    first_name: str
    middle_name: str
    course: int
    group: str
    faculty: str

    class Config:
        orm_mode = True  # Указывает FastAPI, что модель может быть использована для преобразования объектов SQLAlchemy в JSON

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/students/", response_model=List[StudentSchema])  # Используем StudentSchema
def read_students(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):  # Используем Session
    students = db.query(Student).offset(skip).limit(limit).all()
    return students

@app.get("/students/count")
def get_student_count(db: Session = Depends(get_db)):
    student_count = db.query(Student).count()  # Получаем общее количество студентов
    return {"count": student_count}


