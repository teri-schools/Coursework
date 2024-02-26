from fastapi import HTTPException
from tortoise.exceptions import BaseORMException
from typing import Type
from server import schemas as sch
from server.models import Model


async def pagination(model: Type[Model], page: int = 1, per_page: int = 50):
    total = await model.all().count()
    items = await model.all().offset((page - 1) * per_page).limit(per_page)
    return dict(items=items, total=total, page=page, per_page=per_page)


async def create_model(model: Type[Model], data: dict) -> Model:
    obj = await model.create(**data)
    return obj


async def get_model(model: Type[Model], ident: int) -> Model:
    obj = await Model.get_or_none(ident)
    if not obj:
        raise HTTPException(status_code=404, detail="Not found")
    return obj


async def delete_model(model: Type[Model], ident: int):
    obj: Model = await Model.get_or_none(ident)
    if obj:
        await obj.delete()


async def update_model(model: Type[Model], ident: int) -> Model:
    obj = await model.get_or_none(ident)
    if not obj:
        raise HTTPException(status_code=404, detail="Not found")
    try:
        return await obj.update_from_dict(ident)
    except (BaseORMException, ValueError, TypeError):
        raise HTTPException(status_code=400, detail="Data not valid")
