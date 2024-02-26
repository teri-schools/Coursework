from fastapi import APIRouter

from server import database as db
from server import schemas as sch
from server.models import Person

person_router = APIRouter(prefix="/persons", tags=["persons"])


@person_router.get("/", response_model=sch.Pagination[sch.Person])
async def get_persons(page: int = 1, per_page: int = 50):
    return await db.pagination(Person, page, per_page)


@person_router.post("/", status_code=201)
async def create_person(person_data: sch.PersonCreate) -> sch.Person:
    return await db.create_model(Person, person_data.to_dict())


@person_router.get("/<ident>", status_code=201)
async def get_person(ident: int) -> sch.Person:
    return await db.get_model(Person, ident)


@person_router.delete("/<ident>", status_code=200)
async def delete_person(ident: int) -> None:
    return await db.delete_model(Person, ident)
