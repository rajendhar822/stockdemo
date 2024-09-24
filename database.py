# app/database.py

import psycopg2
from psycopg2 import pool

DATABASE_URL = "postgresql://postgres:root@localhost:8000/clients"

# Connection pool to manage connections efficiently
connection_pool = psycopg2.pool.SimpleConnectionPool(1, 20, DATABASE_URL)

def get_db():
    conn = connection_pool.getconn()
    try:
        yield conn
    finally:
        connection_pool.putconn(conn)
