import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Telemetry(BaseModel):
    load: float
    solar: float
    soc: float

latest_data = {"load": 0.0, "solar": 0.0, "soc": 0.0}

@app.post("/api/telemetry")
async def update_telemetry(data: Telemetry):
    global latest_data
    latest_data = data.dict()
    return {"status": "success", "data": latest_data}

@app.get("/api/telemetry")
async def get_telemetry():
    return latest_data
@app.get("/api/telemetry")
def get_telemetry():
    return latest_data