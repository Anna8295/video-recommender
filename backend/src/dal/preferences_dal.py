from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorCollection

class Preferences:
    def __init__(self, preferences_set: bool = False, make_it_later: bool = False):
        self.preferences_set = preferences_set
        self.make_it_later = make_it_later

    @staticmethod
    def from_db_doc(doc: dict) -> "Preferences":
        preferences_doc = doc.get("preferences", {})
        return Preferences(
            preferences_set=preferences_doc.get("preferences_set", False),
            make_it_later=preferences_doc.get("make_it_later", False),
        )

    def to_dict(self) -> dict:
        return {
            "preferences_set": self.preferences_set,
            "make_it_later": self.make_it_later,
        }

class PreferencesDAL:
    def __init__(self, user_collection: AsyncIOMotorCollection):
        self._user_collection = user_collection

    async def set_preferences(self, user_id: str) -> bool:
        preferences = Preferences(preferences_set=True, make_it_later=False).to_dict()
        result = await self._user_collection.update_one(
            {"_id": ObjectId(user_id)}, {"$set": {"preferences": preferences}}
        )
        return result.modified_count > 0

    async def set_make_it_later(self, user_id: str) -> bool:
        result = await self._user_collection.update_one(
            {"_id": ObjectId(user_id)}, {"$set": {"preferences.preferences_set": True, "preferences.make_it_later": True}}
        )
        print(f'{result}')
        return result.modified_count > 0

    async def get_user_preferences_status(self, user_id: str) -> bool:
        doc = await self._user_collection.find_one({"_id": ObjectId(user_id)})
        if doc:
            preferences = Preferences.from_db_doc(doc)
            return preferences.preferences_set
        return False
