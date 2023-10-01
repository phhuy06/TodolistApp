from datetime import date
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from Backend.Model.model import register_form,login_form, create_work_form, delete_work_form
from Backend.Database.CRUD import register, verify_user, get_email, remove_all, list_all, create_work, list_works, get_id_by_account, delete_work_by_id
from Backend.API.auth import validate_token
from Backend.API.token import generate_token


route = APIRouter()

@route.post('/register')
def register_api(form: register_form):
    return register(form.account, form.email, form.password)

@route.post('/login')
def login_api(form: login_form):
    if not verify_user(form.account, form.password):
        raise HTTPException(status_code=404, detail="Wrong account or password")
    else:
        return generate_token(form.account)
    
@route.get('/getemail', dependencies=[Depends(validate_token)])
def getemail_api(account: str):
    return get_email(account)

@route.get('/removeAll', dependencies=[Depends(validate_token)])
def removeAll_api():
    return remove_all()

@route.get('/listAll', dependencies=[Depends(validate_token)])
def listAll_api():
    return list_all()

@route.post('/create_work', dependencies=[Depends(validate_token)])
def create_work_api(form : create_work_form):
    form.day = datetime.strptime(form.day, "%Y-%m-%d").date()
    return create_work(
        get_id_by_account(form.account),
        form.day,
        form.work,
        form.time
    )

@route.get('/list_works', dependencies=[Depends(validate_token)])
def list_works_api(day : str, account : str):
    day = datetime.strptime(day, "%Y-%m-%d").date()
    return list_works(
        list_day=day,
        user_id=get_id_by_account(account)
    )

@route.delete('/delete_works', dependencies=[Depends(validate_token)])
def delete_works_api(form : delete_work_form):
    form.day = datetime.strptime(form.day, "%Y-%m-%d").date()
    return delete_work_by_id(
        get_id_by_account(form.account),
        day=form.day,
        work=form.work
    )