from typing import Optional
from sqlmodel import Field, SQLModel
from .engine import engine
from datetime import date


class User(SQLModel, table=True):
    __tablename__ = "user"

    user_id : Optional[int] = Field(default=None, primary_key=True)
    user_email: str = Field(nullable=True)
    user_account: str = Field(nullable=False)
    user_password: str = Field(nullable=False)


class Todolist(SQLModel, table=True):
    __tablename__ = "todolist"

    list_id : Optional[int] = Field(default=None, primary_key=True)
    user_id : int = Field(foreign_key="user.user_id")
    list_day : date = Field(default=date.today())
    list_work : str = Field(nullable=False)
    list_time : str


def init():
    SQLModel.metadata.create_all(engine)
