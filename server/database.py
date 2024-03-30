from typing import Type, TypeVar

from fastapi import HTTPException
from tortoise.exceptions import BaseORMException

from server.models import Model

ModelType = TypeVar('ModelType', bound=Model)


class Repository:
    def __init__(self, model: Type[ModelType], with_models: list[str] = None):
        self.model = model
        self.with_models = with_models or []

    async def pagination(self, page: int = 1, per_page: int = 50, filters: dict = None):
        base_query = self.model.all().filter(**(filters or {}))
        total = await base_query.count()
        items = await base_query.prefetch_related(*self.with_models).offset((page - 1) * per_page).limit(per_page)
        return dict(items=items, total=total, page=page, per_page=per_page)

    async def create(self, data: dict) -> ModelType:
        obj = await self.model.create(**data)
        return obj

    async def get(self, ident: int) -> ModelType:
        obj = await self.model.prefetch_related(*self.with_models).get_or_none(ident)
        if not obj:
            raise HTTPException(status_code=404, detail="Not found")
        return obj

    async def delete(self, ident: int):
        obj: Model = await self.model.get_or_none(ident)
        if obj:
            await obj.delete()

    async def update(self, ident: int) -> ModelType:
        obj = await self.model.prefetch_related(*self.with_models).get_or_none(ident)
        if not obj:
            raise HTTPException(status_code=404, detail="Not found")
        try:
            return await obj.update_from_dict(ident)
        except (BaseORMException, ValueError, TypeError):
            raise HTTPException(status_code=400, detail="Data not valid")
