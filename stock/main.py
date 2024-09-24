from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random
import time
from typing import List
import csv
import os
import pandas as pd

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Or use ["*"] to allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Data schema
class ClientData(BaseModel):
    client_id: int
    display_name: str
    current_price: float
    mtm: float
    available_margin: float
    max_profit: float
    max_loss: float
    multiplier: float
    commodity_margin: float
    exit_time: str
    qty_by_exposure: float

# Simulated real-time data for multiple clients
clients = [
    {
        "client_id": 1,
        "display_name": "Client A",
        "current_price": 100.0,
        "mtm": 0.0,
        "available_margin": 0.0,
        "max_profit": 0.0,
        "max_loss": 0.0,
        "multiplier": 1.0,
        "commodity_margin": 0.0,
        "exit_time": "N/A",
        "qty_by_exposure": 0.0
    },
    {
        "client_id": 2,
        "display_name": "Client B",
        "current_price": 200.0,
        "mtm": 0.0,
        "available_margin": 5000.0,
        "max_profit": 0.0,
        "max_loss": 0.0,
        "multiplier": 1.2,
        "commodity_margin": 300.0,
        "exit_time": "N/A",
        "qty_by_exposure": 20.0
    },
    {
        "client_id": 3,
        "display_name": "Client C",
        "current_price": 150.0,
        "mtm": 0.0,
        "available_margin": 10000.0,
        "max_profit": 0.0,
        "max_loss": 0.0,
        "multiplier": 1.5,
        "commodity_margin": 500.0,
        "exit_time": "N/A",
        "qty_by_exposure": 50.0
    },
    {
        "client_id": 4,
        "display_name": "Client D",
        "current_price": 250.0,
        "mtm": 0.0,
        "available_margin": 7500.0,
        "max_profit": 0.0,
        "max_loss": 0.0,
        "multiplier": 2.0,
        "commodity_margin": 800.0,
        "exit_time": "N/A",
        "qty_by_exposure": 35.0
    },
    {
        "client_id": 5,
        "display_name": "Client E",
        "current_price": 300.0,
        "mtm": 0.0,
        "available_margin": 12000.0,
        "max_profit": 0.0,
        "max_loss": 0.0,
        "multiplier": 2.5,
        "commodity_margin": 1000.0,
        "exit_time": "N/A",
        "qty_by_exposure": 60.0
    },
    {
        "client_id": 6,
        "display_name": "Client F",
        "current_price": 180.0,
        "mtm": 0.0,
        "available_margin": 6000.0,
        "max_profit": 0.0,
        "max_loss": 0.0,
        "multiplier": 1.8,
        "commodity_margin": 400.0,
        "exit_time": "N/A",
        "qty_by_exposure": 40.0
    },
    {
        "client_id": 7,
        "display_name": "Client G",
        "current_price": 220.0,
        "mtm": 0.0,
        "available_margin": 8000.0,
        "max_profit": 0.0,
        "max_loss": 0.0,
        "multiplier": 2.0,
        "commodity_margin": 600.0,
        "exit_time": "N/A",
        "qty_by_exposure": 45.0
    },
    {
        "client_id": 8,
        "display_name": "Client H",
        "current_price": 280.0,
        "mtm": 0.0,
        "available_margin": 11000.0,
        "max_profit": 0.0,
        "max_loss": 0.0,
        "multiplier": 2.3,
        "commodity_margin": 950.0,
        "exit_time": "N/A",
        "qty_by_exposure": 55.0
    },
    {
        "client_id": 9,
        "display_name": "Client I",
        "current_price": 320.0,
        "mtm": 0.0,
        "available_margin": 14000.0,
        "max_profit": 0.0,
        "max_loss": 0.0,
        "multiplier": 2.8,
        "commodity_margin": 1200.0,
        "exit_time": "N/A",
        "qty_by_exposure": 65.0
    },
    {
        "client_id": 10,
        "display_name": "Client J",
        "current_price": 260.0,
        "mtm": 0.0,
        "available_margin": 9000.0,
        "max_profit": 0.0,
        "max_loss": 0.0,
        "multiplier": 2.1,
        "commodity_margin": 700.0,
        "exit_time": "N/A",
        "qty_by_exposure": 50.0
    }
]


def update_client_data():
    """Function to update client data based on fluctuating current_price."""
    for client in clients:
        # Simulate price fluctuation
        client["current_price"] = round(client["current_price"] * random.uniform(0.95, 1.05), 2)

        # Recalculate the fields (this is just an example logic)
        client["mtm"] = round(client["current_price"] * client["multiplier"], 2)
        client["available_margin"] = round(client["mtm"] * 0.5, 2)
        client["max_profit"] = round(client["current_price"] * 1.5, 2)
        client["max_loss"] = round(client["current_price"] * 0.5, 2)
        client["commodity_margin"] = round(client["current_price"] * 0.75, 2)
        client["qty_by_exposure"] = round(client["current_price"] * 2, 2)

@app.get("/clients/", response_model=List[ClientData])
def get_clients(background_tasks: BackgroundTasks):
    # Run update function in the background
    background_tasks.add_task(update_client_data)
    return clients

# Function to simulate the fluctuation every few seconds
def simulate_continuous_updates():
    while True:
        update_client_data()
        time.sleep(3)  # Update every second

@app.on_event("startup")
async def startup_event():
    import threading
    # Start the continuous update simulation in the background
    threading.Thread(target=simulate_continuous_updates, daemon=True).start()
