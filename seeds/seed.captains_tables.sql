BEGIN;

TRUNCATE 
    captains_items,
    captains_lists,
    captains_users
    RESTART IDENTITY CASCADE;

INSERT INTO captains_users (username, password)
VALUES
    ('JDenver', '$2a$12$di5w7VrQbqvUswwBppcu3.oYWi1bALO4i1A7sXp/xJC3ScNjWCFYG');

INSERT INTO captains_lists (list_name, user_id)
VALUES
    ('New Years Eve', '1'),
    ('Turkey Bowl', '1');

INSERT INTO captains_items (item_name, list_id)
VALUES
    ('Bill', '1'),
    ('Tyler', '1'),
    ('Cline', '1'),
    ('Ann', '1'),
    ('Cormac', '2'),
    ('Ava', '2'),
    ('Ken', '2'),
    ('Joe', '2');

COMMIT;