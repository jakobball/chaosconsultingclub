from typing import List
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
from dotenv import load_dotenv

# Lade Umgebungsvariablen aus backend/.env
load_dotenv()


#Test
app = FastAPI()

# CORS Middleware für Frontend-URLs
# Hole erlaubte Frontend-URL aus .env oder nutze Standard
origins = [
    os.getenv("FRONTEND_ORIGIN", "https://chaosconsultingclub.vercel.app")
]

# CORS Middleware einrichten
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

# In-Memory-Datenbank
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
