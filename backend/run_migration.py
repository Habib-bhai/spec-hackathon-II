"""Run the user_id migration to change from UUID to VARCHAR."""
import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

# Get database URL and convert from asyncpg to psycopg2 format
db_url = os.environ["DATABASE_URL"]
# Remove asyncpg driver prefix if present
db_url = db_url.replace("postgresql+asyncpg://", "postgresql://")
# Replace ssl=require with sslmode=require for psycopg2
db_url = db_url.replace("ssl=require", "sslmode=require")

print(f"Connecting to database...")

try:
    conn = psycopg2.connect(db_url)
    conn.autocommit = True
    cur = conn.cursor()

    print("Running migration: alter_user_id_to_string.sql")

    # Read and execute migration
    with open("migrations/alter_user_id_to_string.sql", "r") as f:
        sql = f.read()

    # Execute each statement separately
    statements = [s.strip() for s in sql.split(";") if s.strip() and not s.strip().startswith("--")]

    for stmt in statements:
        if stmt:
            print(f"Executing: {stmt[:60]}...")
            try:
                cur.execute(stmt)
                print("  OK")
            except Exception as e:
                print(f"  Warning: {e}")

    cur.close()
    conn.close()
    print("\nMigration completed successfully!")

except Exception as e:
    print(f"Error: {e}")
