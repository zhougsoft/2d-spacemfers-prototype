CREATE TABLE celestial_types (
    celestial_type_id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

INSERT INTO celestial_types (name) 
VALUES 
    ('star'),    -- ID 1
    ('planet'),  -- ID 2
    ('station'), -- ID 3
    ('moon'),    -- ID 4
    ('belt');    -- ID 5

CREATE TABLE celestials (
    celestial_id SERIAL PRIMARY KEY,
    celestial_type_id INTEGER NOT NULL REFERENCES celestial_types(celestial_type_id),
    parent_celestial_id INTEGER REFERENCES celestials(celestial_id),
    distance_from_parent FLOAT NOT NULL, -- in AU (astronomical units); 1 AU = 149,597,870.7 km
    name VARCHAR(255) NOT NULL,
    UNIQUE (celestial_id, parent_celestial_id)
);

CREATE TABLE star_info (
    star_id INTEGER PRIMARY KEY REFERENCES celestials(celestial_id)
)

CREATE TABLE planet_info (
    planet_id INTEGER PRIMARY KEY REFERENCES celestials(celestial_id)
)

CREATE TABLE station_info (
    station_id INTEGER PRIMARY KEY REFERENCES celestials(celestial_id)
)

CREATE TABLE moon_info (
    moon_id INTEGER PRIMARY KEY REFERENCES celestials(celestial_id)
)

CREATE TABLE belt_info (
    belt_id INTEGER PRIMARY KEY REFERENCES celestials(celestial_id)
)

CREATE TABLE ship_types (
    ship_type_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    speed INTEGER NOT NULL,
    size INTEGER NOT NULL,
    max_cargo_size INTEGER NOT NULL
);

CREATE TABLE items (
    item_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    size INTEGER NOT NULL
);

CREATE TABLE players (player_id SERIAL PRIMARY KEY);

CREATE TABLE player_location (
    player_id INTEGER PRIMARY KEY REFERENCES players(player_id),
    target_celestial_id INTEGER REFERENCES celestials(celestial_id),
    prev_celestial_id INTEGER REFERENCES celestials(celestial_id),
    departure_time TIMESTAMP,
    arrival_time TIMESTAMP
);

CREATE TABLE player_ships (
    player_ship_id SERIAL PRIMARY KEY,
    player_id INTEGER REFERENCES players(player_id) NOT NULL,
    ship_type_id INTEGER REFERENCES ship_types(ship_type_id) NOT NULL,
    station_id INTEGER REFERENCES celestials(celestial_id),
    CONSTRAINT fk_station CHECK (
        station_id IS NULL OR 
        station_id IN (SELECT celestial_id FROM celestials WHERE celestial_type_id = 3)  -- ensure it's a station
    )
);

CREATE TABLE player_active_ship (
    player_id INTEGER PRIMARY KEY REFERENCES players(player_id),
    player_ship_id INTEGER UNIQUE REFERENCES player_ships(player_ship_id)
);

CREATE TABLE player_ship_inventory (
    player_ship_id INTEGER REFERENCES player_ships(player_ship_id),
    item_id INTEGER REFERENCES items(item_id),
    amount INTEGER NOT NULL,
    PRIMARY KEY (player_ship_id, item_id)
);

CREATE TABLE player_station_inventory (
    player_id INTEGER REFERENCES players(player_id),
    station_id INTEGER REFERENCES celestials(celestial_id), 
    item_id INTEGER REFERENCES items(item_id),
    amount INTEGER NOT NULL,
    PRIMARY KEY (player_id, station_id, item_id),
    CONSTRAINT fk_station CHECK (
        station_id IN (SELECT celestial_id FROM celestials WHERE celestial_type_id = 3)  -- ensure it's a station
    )
);

CREATE INDEX idx_celestials_celestial_type_id ON celestials(celestial_type_id);
CREATE INDEX idx_celestials_parent_celestial_id ON celestials(parent_celestial_id);
CREATE INDEX idx_celestials_type_and_parent ON celestials(celestial_type_id, parent_celestial_id);
CREATE INDEX idx_player_ships_player_id ON player_ships(player_id);
CREATE INDEX idx_player_ship_inventory_player_ship_id ON player_ship_inventory(player_ship_id);
CREATE INDEX idx_player_station_inventory_player_id ON player_station_inventory(player_id);
CREATE INDEX idx_player_station_inventory_station_id ON player_station_inventory(station_id);
