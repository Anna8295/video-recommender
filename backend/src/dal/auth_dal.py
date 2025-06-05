from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorCollection
from passlib.context import CryptContext
import jwt
from datetime import datetime, timedelta
import os

from dal.preferences_dal import Preferences

SECRET_KEY = os.environ["SECRET_KEY"]
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class User:
    def __init__(self, id: str, email: str, hashed_password: str, preferences: Preferences):
        self.id = id
        self.email = email
        self.hashed_password = hashed_password
        self.preferences = preferences

    @staticmethod
    def hash_password(password: str) -> str:
        return pwd_context.hash(password)

    def verify_password(self, password: str) -> bool:
        return pwd_context.verify(password, self.hashed_password)

    @staticmethod
    def from_db_doc(doc) -> "User":
        return User(
            id=str(doc["_id"]),
            email=doc["email"],
            hashed_password=doc["hashed_password"],
            preferences=Preferences.from_db_doc(doc) 
        )
    
    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "email": self.email,
            "hashed_password": self.hashed_password,
            "preferences" : self.preferences.to_dict(),  
        }


class AuthDAL:
    def __init__(self, user_collection: AsyncIOMotorCollection):
        self._user_collection = user_collection

    async def register_user(self, email: str, password: str) -> str:
        hashed_password = User.hash_password(password)
        preferences = Preferences()  
        response = await self._user_collection.insert_one(
            {"email": email, "hashed_password": hashed_password, "preferences": preferences.to_dict()}
        )
        print(f"User inserted with ID: {response.inserted_id}")
        return str(response.inserted_id)

    async def login_user(self, email: str, password: str) -> str:
        doc = await self._user_collection.find_one({"email": email})
        if doc:
            user = User.from_db_doc(doc)
            if user.verify_password(password):
                return create_access_token(data={"sub": user.id, "preferences_set": user.preferences.preferences_set})
        return None

    async def get_user_by_id(self, user_id: str) -> "User":
        doc = await self._user_collection.find_one({"_id": ObjectId(user_id)})
        if doc:
            return User.from_db_doc(doc)
        return None
    
def create_access_token(data: dict, expires_delta: timedelta = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verify_access_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload  
    except jwt.ExpiredSignatureError:
        return None  
    except jwt.InvalidTokenError:
        return None  
