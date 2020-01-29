CREATE TABLE captains_items (
    id SERIAL PRIMARY KEY,
    item_name TEXT NOT NULL,
    list_id INTEGER REFERENCES captains_lists(id) ON DELETE CASCADE
);