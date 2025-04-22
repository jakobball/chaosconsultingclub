from typing import List
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI()

origins = [
    "http://localhost:5173"  # dein React-Frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Models
class Item(BaseModel):
    name: str

class Items(BaseModel):
    items: List[Item]

# In-memory DB
memory_db = {"items": []}

@app.get("/", response_model=Items)
def get_items() -> Items:
    return Items(items=memory_db["items"])

@app.put("/", response_model=Item)
def put_item(item: Item) -> Item:
    memory_db["items"].append(item)
    return item

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8002)
