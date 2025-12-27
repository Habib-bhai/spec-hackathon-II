-- Migration: Change user_id columns from UUID to VARCHAR(64)
-- This is needed because Better Auth uses string IDs, not UUIDs

-- First, drop foreign key constraints
ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_user_id_fkey;
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_user_id_fkey;
ALTER TABLE tags DROP CONSTRAINT IF EXISTS tags_user_id_fkey;

-- Alter users.id from UUID to VARCHAR(64)
ALTER TABLE users ALTER COLUMN id TYPE VARCHAR(64) USING id::VARCHAR(64);

-- Alter user_id columns in related tables
ALTER TABLE tasks ALTER COLUMN user_id TYPE VARCHAR(64) USING user_id::VARCHAR(64);
ALTER TABLE projects ALTER COLUMN user_id TYPE VARCHAR(64) USING user_id::VARCHAR(64);
ALTER TABLE tags ALTER COLUMN user_id TYPE VARCHAR(64) USING user_id::VARCHAR(64);

-- Re-add foreign key constraints
ALTER TABLE tasks ADD CONSTRAINT tasks_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE projects ADD CONSTRAINT projects_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE tags ADD CONSTRAINT tags_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
