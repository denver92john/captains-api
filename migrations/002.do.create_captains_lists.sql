CREATE TABLE captains_lists (
    id SERIAL PRIMARY KEY,
    list_name TEXT NOT NULL,
    user_id INTEGER REFERENCES captains_users(id) ON DELETE CASCADE
);