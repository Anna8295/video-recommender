from pydantic import BaseModel

class ProfileResponse(BaseModel):
    email: str
    preferences_set: bool
