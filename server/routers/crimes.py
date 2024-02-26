from fastapi import APIRouter

from server import database as db
from server import schemas as sch
from server.models import Crime

crime_router = APIRouter(prefix="/crimes", tags=["crimes"])


@crime_router.get("/", response_model=sch.Pagination[sch.Crime])
async def get_crimes(page: int = 1, per_page: int = 50):
    return await db.pagination(Crime, page, per_page)


@crime_router.post("/", status_code=201)
async def create_crime(crime_data: sch.CrimeCreate) -> sch.Crime:
    return await db.create_model(Crime, crime_data.to_dict())


@crime_router.get("/<ident>", status_code=201)
async def get_crime(ident: int) -> sch.Crime:
    return await db.get_model(Crime, ident)


@crime_router.delete("/<ident>", status_code=200)
async def delete_crime(ident: int) -> None:
    return await db.delete_model(Crime, ident)
