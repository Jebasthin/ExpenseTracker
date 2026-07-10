import os
import psycopg
from dotenv import load_dotenv

# Load env file
load_dotenv()

db_name = os.getenv("DB_NAME", "expense_db")
db_user = os.getenv("DB_USER", "postgres")
db_password = os.getenv("DB_PASSWORD", "postgres")
db_host = os.getenv("DB_HOST", "localhost")
db_port = os.getenv("DB_PORT", "5432")

print(f"Attempting to connect to PostgreSQL at {db_host}:{db_port} as user '{db_user}'...")

try:
    # Connect to the default 'postgres' database to check/create the target database
    conn = psycopg.connect(
        dbname="postgres",
        user=db_user,
        password=db_password,
        host=db_host,
        port=db_port,
        autocommit=True
    )
    
    with conn.cursor() as cur:
        # Check if database exists
        cur.execute("SELECT 1 FROM pg_database WHERE datname = %s;", (db_name,))
        exists = cur.fetchone()
        
        if not exists:
            print(f"Database '{db_name}' does not exist. Creating it...")
            cur.execute(f"CREATE DATABASE {db_name};")
            print(f"Database '{db_name}' created successfully!")
        else:
            print(f"Database '{db_name}' already exists.")
            
    conn.close()
    print("Database check completed successfully.")

except Exception as e:
    print(f"\nConnection Error: {e}")
    print("\nPlease verify that:")
    print("1. Your PostgreSQL service is running on port 5432.")
    print("2. The database password in backend/.env is correct.")
    print(f"   Currently using DB_PASSWORD='{db_password}'")
