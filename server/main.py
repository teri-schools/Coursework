from fastapi import FastAPI
from tortoise.contrib.fastapi import register_tortoise

from server.config import DATABASE_URL

from server.routers import person_router, crime_router

app = FastAPI()
app.include_router(person_router)
app.include_router(crime_router)

register_tortoise(
    app,
    db_url=DATABASE_URL,
    modules={"models": ["server.models"]},
    generate_schemas=True,
)


