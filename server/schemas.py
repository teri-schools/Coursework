import datetime
from typing import Optional, Generic, TypeVar

from pydantic import BaseModel, EmailStr

TItem = TypeVar('TItem')


class CrimeBase(BaseModel):
    date: Optional[datetime.date] = None
    location: Optional[str]
    description: Optional[str]
    investigation_status: Optional[str]


class CrimeCreate(CrimeBase):
    pass


class Crime(CrimeBase):
    id: int
    person_id: int

    class Config:
        orm_mode = True


class Pagination(BaseModel, Generic[TItem]):
    page: int
    per_page: int
    total: int
    items: list[TItem]

    class Config:
        orm_mode = True


class PersonBase(BaseModel):
    last_name: str
    first_name: str
    date_of_birth: datetime.datetime = None
    gender: str = None
    address: str = None
    position: str = None
    citizenship: str = None
    phone_number: str = None
    email: EmailStr = None
    country_of_birth: str = None
    investigation_status: str = None
    danger_level: int = None
    exclusion_reason: str = None


class PersonCreate(PersonBase):
    pass


class Person(PersonBase):
    id: int
    crimes: list[Crime]

    class Config:
        orm_mode = True
