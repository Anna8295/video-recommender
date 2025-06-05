from fastapi import APIRouter
import httpx

from config import OMDB_API_KEY, OMDB_URL

router = APIRouter()

@router.get("/movie")
async def get_movie(title: str, limit: int = 15):
    async with httpx.AsyncClient() as client:
        response = await client.get(OMDB_URL, params={"s": title, "type": "movie", "apikey": OMDB_API_KEY})
        data = response.json()

        if response.status_code != 200 or data.get('Response') == 'False':
            return {"error": "Movie not found"}
        movies = []
        for movie in data["Search"][:limit]:
            imdb_id = movie.get("imdbID")
            movie_response = await client.get(OMDB_URL, params={"i": imdb_id, "apikey": OMDB_API_KEY})
            movie_details = movie_response.json()

            if movie_response.status_code == 200 and movie_details.get("Response") == "True":
                movies.append({
                    "Title": movie_details.get("Title"),
                    "Year": movie_details.get("Year"),
                    "imdbID": movie_details.get("imdbID"),
                    "Type": movie_details.get("Type"),
                    "Poster": movie_details.get("Poster"),
                    "Rated": movie_details.get("Rated"),
                })

        return {"movies": movies}

@router.get("/series")
async def get_series(title: str, limit: int = 15):
    async with httpx.AsyncClient() as client:
        response = await client.get(OMDB_URL, params={"s": title, "type": "series", "apikey": OMDB_API_KEY})
        data = response.json()

        if response.status_code != 200 or data.get('Response') == 'False':
            return {"error": "TV series not found"}
        series = []
        for serie in data["Search"][:limit]:
            imdb_id = serie.get("imdbID")
            series_response = await client.get(OMDB_URL, params={"i": imdb_id, "apikey": OMDB_API_KEY})
            series_details = series_response.json()

            if series_response.status_code == 200 and series_details.get("Response") == "True":
                series.append({
                    "Title": series_details.get("Title"),
                    "Year": series_details.get("Year"),
                    "imdbID": series_details.get("imdbID"),
                    "Type": series_details.get("Type"),
                    "Poster": series_details.get("Poster"),
                    "Rated": series_details.get("Rated"),
                })

        return {"series": series}
    
@router.get("/trending")
async def get_trending_movies(limit: int = 5):
    async with httpx.AsyncClient() as client:
        response = await client.get(OMDB_URL, params={"s": "movie", "type": "movie", "apikey": OMDB_API_KEY, "sort": "year"})
        data = response.json()

        if response.status_code != 200 or data.get('Response') == 'False':
            return {"error": "Could not fetch trending movies"}

        movies = []
        for movie in data.get("Search", [])[:limit]:
            imdb_id = movie.get("imdbID")
            movie_response = await client.get(OMDB_URL, params={"i": imdb_id, "apikey": OMDB_API_KEY})
            movie_details = movie_response.json()

            if movie_response.status_code == 200 and movie_details.get("Response") == "True":
                movies.append({
                    "Title": movie_details.get("Title"),
                    "Year": movie_details.get("Year"),
                    "imdbID": movie_details.get("imdbID"),
                    "Type": movie_details.get("Type"),
                    "Poster": movie_details.get("Poster"),
                    "Rated": movie_details.get("Rated"),
                })

        return {"movies": movies}