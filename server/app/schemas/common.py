from typing import Generic, List, TypeVar
from pydantic import BaseModel

T = TypeVar("T")

class PageMeta(BaseModel):
    page: int
    page_size: int
    total: int
    pages: int

class Page(BaseModel, Generic[T]):
    items: List[T]
    meta: PageMeta