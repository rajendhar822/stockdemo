# app/models.py

from pydantic import BaseModel
from typing import List
import psycopg2

class Client(BaseModel):
    client_id: int
    display_name: str
    api_key: str
    pin: str
    mtm: float
    available_margin: float
    max_profit: float
    max_loss: float
    multiplier: float
    commodity_margin: float
    exit_time: str
    qty_by_exposure: int

def fetch_clients(conn):
    """ Fetches all client data from the client table. """
    cursor = conn.cursor()
    query = "SELECT client_id, display_name, api_key, pin, mtm, available_margin, max_profit, max_loss, multiplier, commodity_margin, exit_time, qty_by_exposure FROM client_data"
    cursor.execute(query)
    clients = cursor.fetchall()
    cursor.close()

    # Convert the data into a list of dictionaries for compatibility
    column_names = [desc[0] for desc in cursor.description]
    client_list = [dict(zip(column_names, row)) for row in clients]

    return client_list


def add_client(conn, client: Client):
    """ Adds a new client to the database. """
    cursor = conn.cursor()
    query = """
        INSERT INTO client_data 
        (client_id, display_name, api_key, pin, mtm, available_margin, max_profit, max_loss, multiplier, commodity_margin, exit_time, qty_by_exposure)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    cursor.execute(query, (
        client.client_id, client.display_name, client.api_key, client.pin, client.mtm, client.available_margin, 
        client.max_profit, client.max_loss, client.multiplier, client.commodity_margin, client.exit_time, client.qty_by_exposure))
    conn.commit()
    cursor.close()

def update_client(conn, client_id: int, client: Client):
    """ Updates an existing client in the database. """
    cursor = conn.cursor()
    query = """
        UPDATE client_data 
        SET display_name = %s, api_key = %s, pin = %s, mtm = %s, available_margin = %s, 
            max_profit = %s, max_loss = %s, multiplier = %s, commodity_margin = %s, exit_time = %s, qty_by_exposure = %s
        WHERE client_id = %s
    """
    cursor.execute(query, (
        client.display_name, client.api_key, client.pin, client.mtm, client.available_margin, client.max_profit,
        client.max_loss, client.multiplier, client.commodity_margin, client.exit_time, client.qty_by_exposure, client_id))
    conn.commit()
    cursor.close()

def delete_client(conn, client_id: int):
    """ Deletes a client from the database. """
    cursor = conn.cursor()
    query = "DELETE FROM client_data WHERE client_id = %s"
    cursor.execute(query, (client_id,))
    conn.commit()
    cursor.close()
