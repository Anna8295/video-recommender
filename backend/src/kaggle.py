import httpx
import asyncio
from fastapi import HTTPException
from typing import List
import pandas as pd
import kagglehub
import os

from config import OMDB_API_KEY, OMDB_URL 

def create_filtered_table():
    path = kagglehub.dataset_download("amanbarthwal/imdb-movies-data")
    csv_file_path = os.path.join(path, 'imdb-movies-dataset.csv')
    movies_df = pd.read_csv(csv_file_path)
    
    filtered_df = movies_df[['Title', 'Year', 'Genre', 'Cast', 'Rating']]
    filtered_df = filtered_df.dropna()
    
    return filtered_df

async def fetch_poster_from_omdb(title: str):
    """Fetch movie details from the OMDB API and return the poster URL."""
    async with httpx.AsyncClient() as client:
        response = await client.get(OMDB_URL, params={"t": title, "apikey": OMDB_API_KEY})
        data = response.json()
        if response.status_code == 200 and data.get("Response") == "True":
            return data.get("Poster", "")
        return ""

async def recommend_movies(user_genre_preferences: List[str], user_actors_preferences: List[str]):
    filtered_table = create_filtered_table()
    print(f'{filtered_table}')

    filtered_movies = filtered_table[
        (filtered_table['Genre'].apply(lambda x: any(genre in x.split(',') for genre in user_genre_preferences))) &
        (filtered_table['Cast'].apply(lambda x: any(actor in x.split(',') for actor in user_actors_preferences)))
    ]

    if filtered_movies.empty:
        raise HTTPException(status_code=404, detail="No movies match the user's preferences.")

    top_recommended_movies = filtered_movies.head(10).copy()
    poster_urls = await asyncio.gather(
        *[fetch_poster_from_omdb(title) for title in top_recommended_movies['Title']]
    )
    print(f'{[poster_urls]}')
    top_recommended_movies['Poster'] = poster_urls
    print(f'{top_recommended_movies}')

    return top_recommended_movies[['Poster', 'Title', 'Year', 'Genre', 'Cast', 'Rating']].to_dict(orient='records')

