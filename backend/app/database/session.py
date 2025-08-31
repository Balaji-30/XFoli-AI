from typing import Annotated
from fastapi import Depends
from sqlalchemy import create_engine
from sqlmodel import SQLModel, Session
from dotenv import load_dotenv
import os

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("Please set DATABASE_URL in your .env file")

engine = create_engine(DATABASE_URL)

def create_db_tables():
    
    SQLModel.metadata.create_all(bind=engine)

def create_session():
    with Session(bind=engine) as session:
        yield session

SessionDep =  Annotated[Session,Depends(create_session)]