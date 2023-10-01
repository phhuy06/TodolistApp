from datetime import datetime, timedelta
import jwt
import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
SECURITY_ALGORITHM = os.getenv("SECURITY_ALGORITHM")



def generate_token(user_account: str) -> str:
    # print(expire_time)
    expire_time = datetime.utcnow() + timedelta(days=7)
    encode = {
        "exp": expire_time,
        "account": user_account,
        "exp_day": 7,
    }
    token = jwt.encode(encode, SECRET_KEY, algorithm=SECURITY_ALGORITHM)
    return token


