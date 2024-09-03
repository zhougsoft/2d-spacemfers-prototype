-- Create the players table
CREATE TABLE players (
    player_id INTEGER PRIMARY KEY AUTOINCREMENT,
    fid INTEGER NOT NULL UNIQUE
);

CREATE INDEX idx_players_fid ON players(fid);

-- Create the actions table
CREATE TABLE actions (
    action_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
);

-- Create the location_types table
CREATE TABLE location_types (
    location_type_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
);

-- Create the locations table
CREATE TABLE locations (
    location_id INTEGER PRIMARY KEY AUTOINCREMENT,
    location_type_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    FOREIGN KEY (location_type_id) REFERENCES location_types(location_type_id)
);

-- Create the player_location table
CREATE TABLE player_location (
    player_id INTEGER NOT NULL,
    location_id INTEGER NOT NULL,
    arrival_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (player_id, location_id),
    FOREIGN KEY (player_id) REFERENCES players(player_id),
    FOREIGN KEY (location_id) REFERENCES locations(location_id)
);

-- Create the location_action table
CREATE TABLE location_action (
    location_id INTEGER NOT NULL,
    action_id INTEGER NOT NULL,
    PRIMARY KEY (location_id, action_id),
    FOREIGN KEY (location_id) REFERENCES locations(location_id),
    FOREIGN KEY (action_id) REFERENCES actions(action_id)
);

-- Create the items table
CREATE TABLE items (
    item_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    size INTEGER NOT NULL
);

-- Create the ships table
CREATE TABLE ships (
    ship_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    size INTEGER NOT NULL,
    max_cargo_size INTEGER NOT NULL
);

-- Create the player_ships table
CREATE TABLE player_ships (
    player_ship_id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_id INTEGER NOT NULL,
    ship_id INTEGER NOT NULL,
    location_id INTEGER NOT NULL,
    condition INTEGER NOT NULL,
    FOREIGN KEY (player_id) REFERENCES players(player_id),
    FOREIGN KEY (ship_id) REFERENCES ships(ship_id),
    FOREIGN KEY (location_id) REFERENCES locations(location_id)
);

-- Create the player_active_ship table
CREATE TABLE player_active_ship (
    player_id INTEGER PRIMARY KEY,
    player_ship_id INTEGER UNIQUE,
    FOREIGN KEY (player_ship_id) REFERENCES player_ships(player_ship_id)
);

-- Create the player_ship_inventory table
CREATE TABLE player_ship_inventory (
    player_ship_id INTEGER NOT NULL,
    item_id INTEGER NOT NULL,
    amount INTEGER NOT NULL,
    FOREIGN KEY (player_ship_id) REFERENCES player_ships(player_ship_id),
    FOREIGN KEY (item_id) REFERENCES items(item_id),
    PRIMARY KEY (player_ship_id, item_id)
);
