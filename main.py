from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import random

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

@app.get("/all-data")
async def get_data(limit: int = 180000):
    events = []
    # Background (99.7%) - Standard Model process
    for _ in range(int(limit * 0.997)):
        mass = np.random.exponential(45) + 101 
        pt = np.random.exponential(15) + 10 
        if 110 <= mass <= 140:
            events.append({"mass": float(mass), "pt": float(pt), "is_signal": False})

    # Signal (0.3%) - Guaranteed to cross 5 sigma at 40 GeV
    for _ in range(int(limit * 0.003)):
        mass = np.random.normal(125.1, 1.4)
        pt = np.random.normal(47, 9) 
        if 110 <= mass <= 140:
            events.append({"mass": float(mass), "pt": float(pt), "is_signal": True})

    random.shuffle(events)
    return events[:limit]