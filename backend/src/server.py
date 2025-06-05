from fastapi import FastAPI, Depends, HTTPException, APIRouter
import os
import sys
import httpx
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

from config import DEBUG
from models.profile import ProfileResponse
from models.user import UserIn, UserOut
from models.preferences import SpecificPreferences
from dal.preferences_category_dal import PreferencesCategory
from dependencies import get_current_user
from routers.movies import router as movies_router
from database import lifespan
from kaggle import recommend_movies

app = FastAPI(lifespan=lifespan, debug=DEBUG)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],  
)

auth_router = APIRouter()

@auth_router.post("/register", response_model=UserOut)
async def register_user(user_in: UserIn):
    user_id = await app.auth_dal.register_user(user_in.email, user_in.password)
    return {"email": user_in.email, "id": user_id}

@auth_router.post("/login", response_model=str)
async def login_user(user_in: UserIn):
    token = await app.auth_dal.login_user(user_in.email, user_in.password)
    if token:
        return token
    raise HTTPException(status_code=401, detail="Invalid credentials")

@auth_router.get("/profile", response_model=ProfileResponse)
async def get_profile(current_user: str = Depends(get_current_user)):
    user_data = await app.auth_dal.get_user_by_id(current_user)
    if user_data:
        return {"email": user_data.email, "id": current_user, "preferences_set": user_data.preferences.preferences_set}
    raise HTTPException(status_code=404, detail="User not found")

preferences_router = APIRouter()

@preferences_router.post("/preferences")
async def set_preferences(preferences: SpecificPreferences, current_user: str = Depends(get_current_user)):
    await app.preferences_dal.set_preferences(current_user)
    preferences_obj = PreferencesCategory(
        user_id=current_user,
        movie_or_series=preferences.movie_or_series,
        category=preferences.category,
        actors=preferences.actors,
    )
    seted_preferences = await app.preferences_category_dal.add_specific_preferences(preferences_obj)
    if seted_preferences:
        return {"message": "Preferences successfuly set"}
    raise HTTPException(status_code=400, detail="Failed to set preferences")

@preferences_router.post("/preferences-later")
async def set_preferences_later(current_user: str = Depends(get_current_user)):
    print(f'{current_user}')
    updated = await app.preferences_dal.set_make_it_later(current_user)
    if updated:
        return {"message": "Preferences successfully set."}
    raise HTTPException(status_code=400, detail="Failed to set preferences")

@preferences_router.get("/user-preferences")
async def get_user_preferences(current_user: str = Depends(get_current_user)):
    doc = await app.auth_dal.get_user_by_id(current_user)
    if doc: 
        return doc 
    return None

@preferences_router.get("/recommended-movies")
async def get_recommended_movies(current_user: str = Depends(get_current_user)):
    user_preferences = await app.preferences_category_dal.get_specific_preferences(current_user)
    if not user_preferences:
        raise HTTPException(status_code=404, detail="No preferences found for the user.")
    
    user_preferences = user_preferences[0]  
    user_genre_preferences = user_preferences.category 
    user_actors_preferences = user_preferences.actors 
    recommended_movies = await recommend_movies(user_genre_preferences, user_actors_preferences)

    if not recommended_movies:
        raise HTTPException(status_code=404, detail="No recommended movies found.")
    return recommended_movies

app.include_router(auth_router, tags=["auth"])
app.include_router(preferences_router, tags=["preferences"])
app.include_router(movies_router, tags=["movie"])

def main(argv=sys.argv[1:]):
    try:
        uvicorn.run("server:app", host="0.0.0.0", port=3001, reload=DEBUG)
    except KeyboardInterrupt:
        pass
    
if __name__ == "__main__":
    main()
