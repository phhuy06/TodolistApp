from fastapi.security import HTTPBearer
from passlib.context import CryptContext
from fastapi.security import HTTPBearer
from fastapi import Depends, HTTPException
from pydantic import ValidationError
from datetime import datetime
import jwt
import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
SECURITY_ALGORITHM = os.getenv("SECURITY_ALGORITHM")



reusable_oauth2 = HTTPBearer(scheme_name="Authorization") # for access token
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto") # for hash password


def password_hash(password:str):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def validate_token(header =Depends(reusable_oauth2)) -> str:
    try:
        payload = jwt.decode(header.credentials, SECRET_KEY, SECURITY_ALGORITHM)
        if datetime.utcfromtimestamp(payload.get('exp')) < datetime.utcnow():
            raise HTTPException(status_code=403, detail="Token expired")
    except (jwt.PyJWTError, ValidationError):
        raise HTTPException(
            status_code=403,
            detail=f"Could not validate credentials",
        )

        