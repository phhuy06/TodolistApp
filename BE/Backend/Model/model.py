from datetime import date
from pydantic import BaseModel


class register_form(BaseModel):
    account: str
    email: str
    password: str

class login_form(BaseModel):
    account: str
    password: str

class create_work_form(BaseModel):
    account: str
    day: str
    work: str
    time: str 

class delete_work_form(BaseModel):
    account: str
    day: str
    work: str
