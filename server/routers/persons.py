from fastapi import APIRouter

from server import schemas as sch
from server.database import Repository
from server.models import Person

person_router = APIRouter(prefix="/persons", tags=["persons"])

person_repo = Repository(Person, ["crimes"])


@person_router.get("/", response_model=sch.Pagination[sch.Person])
async def get_persons(page: int = 1, per_page: int = 50):
    return await person_repo.pagination(page, per_page)


@person_router.post("/", status_code=201)
async def create_person(person_data: sch.PersonCreate) -> sch.Person:
    return await person_repo.create_model(person_data.to_dict())


@person_router.get("/{ident}", status_code=201)
async def get_person(ident: int) -> sch.Person:
    return await person_repo.get_model(ident)


@person_router.delete("/{ident}", status_code=200)
async def delete_person(ident: int) -> None:
    return await person_repo.delete_model(ident)
