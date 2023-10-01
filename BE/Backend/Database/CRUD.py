from datetime import date
from .database import User, Todolist
from sqlmodel import Session, select
from .engine import engine
from Backend.API.auth import password_hash, verify_password


def register(account: str, email: str, password: str):
    user = User(
        user_account=account,
        user_email=email,
        user_password=password_hash(password)
    )
    with Session(engine) as session:
        statement1 = select(User).where(User.user_account == user.user_account)
        statement3 = select(User).where(User.user_email == user.user_email)
        result1 = session.exec(statement1).first()
        result3 = session.exec(statement3).first()
        if result1:
            return "Account is already used!"
        if result3:
            return "Email is already used!"
        session.add(user)
        session.commit()
        session.refresh(user)
        return user


def verify_user(account: str, password: str):
    with Session(engine) as session:
        statement = select(User).where(User.user_account == account)
        result = session.exec(statement).first()
        if result is None:
            return False
        if not verify_password(password, result.user_password):
            return False
        return True
    
def get_email(account: str):
    with Session(engine) as session:
        statement = select(User).where(User.user_account == account)
        result = session.exec(statement).first()
        if result is None:
            return "account not found!"
        return result.user_email
    

def remove_all():
    with Session(engine) as session:
        statement = select(User)
        result = session.exec(statement).all()
        for thing in result:
            session.delete(thing)
        session.commit()
        return "delete success!"
    
def list_all():
    with Session(engine) as session:
        statement = select(User)
        result = session.exec(statement).all()
        return result

def create_work(id_ : int, day: date, work:str, time : str):
    work = Todolist(
        user_id=id_,
        list_day=day,
        list_work=work,
        list_time=time
    )
    with Session(engine) as session:
        session.add(work)
        session.commit()
        session.refresh(work)
    return work

def list_works(list_day: date, user_id: int):
    with Session(engine) as session:
        statement = select(User,Todolist).where(user_id == Todolist.user_id).where(Todolist.list_day == list_day)
        result = session.exec(statement).all()
        datasend = []
        for user,todolist in result:
            datasend.append({"work": todolist.list_work,"time": todolist.list_time})
        return datasend
    
def get_id_by_account(user_account: str):
    with Session(engine) as session:
        statement = select(User).where(user_account == User.user_account)
        result = session.exec(statement).first()
        return result.user_id
    

def delete_work_by_id(user_id:str, day: date, work: str):
    with Session(engine) as session:
        statement = select(Todolist).where(Todolist.user_id == user_id).where(Todolist.list_day == day).where(Todolist.list_work == work)
        result = session.exec(statement).first()
        if result is None:
            return "not found"
        session.delete(result)
        session.commit()
        return "complete"
        