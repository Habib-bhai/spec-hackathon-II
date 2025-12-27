"""Fix the users table id column type."""
import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

db_url = os.environ["DATABASE_URL"]
db_url = db_url.replace("postgresql+asyncpg://", "postgresql://")
db_url = db_url.replace("ssl=require", "sslmode=require")

print("Connecting to database...")

try:
    conn = psycopg2.connect(db_url)
    conn.autocommit = True
    cur = conn.cursor()

    # Check current type of users.id
    cur.execute("""
        SELECT data_type FROM information_schema.columns
        WHERE table_name = 'users' AND column_name = 'id'
    """)
    result = cur.fetchone()
    print(f"Current users.id type: {result[0] if result else 'table not found'}")

    if result and result[0] == 'uuid':
        print("\nAltering users.id from UUID to VARCHAR(64)...")

        # Drop constraints that reference users.id
        print("Dropping foreign key constraints...")
        cur.execute("ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_user_id_fkey")
        cur.execute("ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_user_id_fkey")
        cur.execute("ALTER TABLE tags DROP CONSTRAINT IF EXISTS tags_user_id_fkey")

        # Alter users.id
        print("Altering users.id column...")
        cur.execute("ALTER TABLE users ALTER COLUMN id TYPE VARCHAR(64) USING id::VARCHAR(64)")

        # Alter tasks.user_id (may already be VARCHAR from previous run)
        print("Altering tasks.user_id column...")
        try:
            cur.execute("ALTER TABLE tasks ALTER COLUMN user_id TYPE VARCHAR(64) USING user_id::VARCHAR(64)")
        except Exception as e:
            print(f"  (already VARCHAR or error: {e})")

        # Re-add foreign key constraints
        print("Re-adding foreign key constraints...")
        cur.execute("ALTER TABLE tasks ADD CONSTRAINT tasks_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE")
        cur.execute("ALTER TABLE projects ADD CONSTRAINT projects_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE")
        cur.execute("ALTER TABLE tags ADD CONSTRAINT tags_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE")

        print("\nMigration completed successfully!")
    else:
        print("users.id is already VARCHAR, no migration needed")

    # Verify
    cur.execute("""
        SELECT data_type FROM information_schema.columns
        WHERE table_name = 'users' AND column_name = 'id'
    """)
    result = cur.fetchone()
    print(f"\nFinal users.id type: {result[0] if result else 'unknown'}")

    cur.close()
    conn.close()

except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
