from sqlmodel import create_engine
import os
from dotenv import load_dotenv

load_dotenv()

database_path = os.getenv("database_path")
engine = create_engine(database_path, echo=True)