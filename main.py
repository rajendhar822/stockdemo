# app/main.py

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from database import get_db
from models import fetch_clients, add_client, update_client, delete_client, Client
import psycopg2

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Or use ["*"] to allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Fetch all clients
@app.get("/clients")
async def get_clients(db: psycopg2.extensions.connection = Depends(get_db)):
    try:
        clients = fetch_clients(db)
        return clients
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Add a new client
@app.post("/clients")
async def add_new_client(client: Client, db: psycopg2.extensions.connection = Depends(get_db)):
    try:
        add_client(db, client)
        return {"message": "Client added successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Edit client
@app.put("/clients/{client_id}")
async def update_client(client_id: str, client: Client, db: psycopg2.extensions.connection = Depends(get_db)):
    try:
        cursor = db.cursor()
        query = """
            UPDATE client_data 
            SET display_name = %s, api_key = %s, pin = %s, mtm = %s, available_margin = %s, 
                max_profit = %s, max_loss = %s, multiplier = %s, commodity_margin = %s, exit_time = %s, qty_by_exposure = %s
            WHERE client_id = %s
        """
        cursor.execute(query, (
            client.display_name, client.api_key, client.pin, client.mtm, client.available_margin, client.max_profit,
            client.max_loss, client.multiplier, client.commodity_margin, client.exit_time, client.qty_by_exposure, client_id))
        db.commit()
        cursor.close()
        return {"message": "Client updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Delete client
@app.delete("/clients/{client_id}")
async def delete_client(client_id: str, db: psycopg2.extensions.connection = Depends(get_db)):
    try:
        cursor = db.cursor()
        query = "DELETE FROM client_data WHERE client_id = %s"
        cursor.execute(query, (client_id,))
        db.commit()
        cursor.close()
        return {"message": "Client deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))