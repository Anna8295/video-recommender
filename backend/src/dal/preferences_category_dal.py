from motor.motor_asyncio import AsyncIOMotorCollection
from typing import List

class PreferencesCategory:
    def __init__(self, user_id: str, movie_or_series: List[str], category: List[str], actors: List[str]):
        self.user_id = user_id
        self.movie_or_series = movie_or_series
        self.category = category
        self.actors = actors

    @staticmethod
    def from_db_doc(doc) -> "PreferencesCategory":
        return PreferencesCategory(
            user_id=str(doc["user_id"]),
            movie_or_series=doc["movie_or_series"],
            category=doc["category"],
            actors=doc["actors"]
        )

    def to_dict(self) -> dict:
        return {
            "user_id": self.user_id,
            "movie_or_series": self.movie_or_series,
            "category": self.category,
            "actors": self.actors
        }

class PreferencesCategoryDAL:
    def __init__(self, preferences_collection: AsyncIOMotorCollection):
        self._collection = preferences_collection

    async def add_specific_preferences(self, preferences: PreferencesCategory) -> str:
        try:
            response = await self._collection.insert_one(preferences.to_dict())
            print(f"Inserted document ID: {response.inserted_id}")
            return str(response.inserted_id)
        except Exception as e:
            print(f"Error adding specific preferences: {e}")
            return None

    async def get_specific_preferences(self, user_id: str) -> List[PreferencesCategory]:
        try:
            docs = await self._collection.find({"user_id": user_id}).to_list(None)
            return [PreferencesCategory.from_db_doc(doc) for doc in docs]
        except Exception as e:
            print(f"Error retrieving specific preferences: {e}")
            return []

    async def update_specific_preferences(self, preferences: PreferencesCategory) -> bool:
        try:
            result = await self._collection.update_one(
                {"user_id": preferences.user_id, "movie_or_series": preferences.movie_or_series},
                {"$set": preferences.to_dict()}
            )
            return result.modified_count > 0
        except Exception as e:
            print(f"Error updating specific preferences: {e}")
            return False
