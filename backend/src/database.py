from contextlib import asynccontextmanager
from motor.motor_asyncio import AsyncIOMotorClient

from config import MONGODB_URI, USER_COLLECTION, PREFERENCES_COLLECTION
from dal.auth_dal import AuthDAL
from dal.preferences_dal import PreferencesDAL
from dal.preferences_category_dal import PreferencesCategoryDAL

@asynccontextmanager
async def lifespan(app):

    client = AsyncIOMotorClient(MONGODB_URI)
    database = client.get_default_database()

    pong = await database.command("ping")
    if int(pong["ok"]) != 1:
        raise Exception("Cluster connection is not okay!")

    app.auth_dal = AuthDAL(database.get_collection(USER_COLLECTION))
    app.preferences_dal = PreferencesDAL(database.get_collection(USER_COLLECTION))
    app.preferences_category_dal = PreferencesCategoryDAL(database.get_collection(PREFERENCES_COLLECTION))

    yield

    client.close()