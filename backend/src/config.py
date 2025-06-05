import os
from fastapi.security import OAuth2PasswordBearer
from dotenv import load_dotenv

load_dotenv()
  
MONGODB_URI = os.environ["MONGODB_URI"]  
SECRET_KEY = os.environ["SECRET_KEY"] 
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60  
USER_COLLECTION = "users"
PREFERENCES_COLLECTION = "preferences"
DEBUG = os.environ.get("DEBUG", "").strip().lower() in {"1", "true", "on", "yes"}

OMDB_API_KEY = "14f83216" 
OMDB_URL = "http://www.omdbapi.com/"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

limit: int = 15