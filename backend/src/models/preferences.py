from pydantic import BaseModel
from typing import List

class SpecificPreferences(BaseModel):
    movie_or_series: List[str]
    category: List[str]
    actors: List[str]
