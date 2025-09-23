from typing import Generic, List, Optional, TypeVar
from pydantic import BaseModel, Field
from typing_extensions import Literal

T = TypeVar("T")

class PageMeta(BaseModel):
    page: int
    page_size: int
    total: int
    pages: int

class Page(BaseModel, Generic[T]):
    items: List[T]
    meta: PageMeta