CREATE TABLE location_types (
    location_type_id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

INSERT INTO location_types (name) 
VALUES 
    ('planet'),  -- ID 1
    ('station'), -- ID 2
    ('moon'),    -- ID 3
    ('belt');    -- ID 4

CREATE TABLE locations (
    location_id SERIAL PRIMARY KEY,
    location_type_id INTEGER NOT NULL REFERENCES location_types(location_type_id),
    location_entity_id INTEGER NOT NULL,
    UNIQUE (location_type_id, location_entity_id)
);

CREATE TABLE systems (
    system_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE planets (
    planet_id SERIAL PRIMARY KEY,
    system_id INTEGER REFERENCES systems(system_id),
    name VARCHAR(255) NOT NULL
);

CREATE TABLE stations (
    station_id SERIAL PRIMARY KEY,
    planet_id INTEGER REFERENCES planets(planet_id),
    name VARCHAR(255) NOT NULL
);

CREATE TABLE moons (
    moon_id SERIAL PRIMARY KEY,
    planet_id INTEGER REFERENCES planets(planet_id),
    name VARCHAR(255) NOT NULL
);

CREATE TABLE belts (
    belt_id SERIAL PRIMARY KEY,
    planet_id INTEGER REFERENCES planets(planet_id),
    name VARCHAR(255) NOT NULL
);

CREATE TABLE items (
    item_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    size INTEGER NOT NULL
);

CREATE TABLE planet_items (
    planet_id INTEGER REFERENCES planets(planet_id),
    item_id INTEGER REFERENCES items(item_id),
    PRIMARY KEY (planet_id, item_id)
);

CREATE TABLE moon_items (
    moon_id INTEGER REFERENCES moons(moon_id),
    item_id INTEGER REFERENCES items(item_id),
    PRIMARY KEY (moon_id, item_id)
);

CREATE TABLE belt_items (
    belt_id INTEGER REFERENCES belts(belt_id),
    item_id INTEGER REFERENCES items(item_id),
    PRIMARY KEY (belt_id, item_id)
);

CREATE TABLE players (
    player_id SERIAL PRIMARY KEY
);

CREATE TABLE player_location (
    player_id INTEGER PRIMARY KEY REFERENCES players(player_id),
    target_location_id INTEGER REFERENCES locations(location_id),
    prev_location_id INTEGER REFERENCES locations(location_id),
    departure_time TIMESTAMP,
    arrival_time TIMESTAMP
);

CREATE TABLE ships (
    ship_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    size INTEGER NOT NULL,
    max_cargo_size INTEGER NOT NULL
);

CREATE TABLE player_ships (
    player_ship_id SERIAL PRIMARY KEY,
    player_id INTEGER REFERENCES players(player_id) NOT NULL,
    ship_id INTEGER REFERENCES ships(ship_id) NOT NULL,
    condition INTEGER NOT NULL,
    station_id INTEGER REFERENCES stations(station_id)
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
    station_id INTEGER REFERENCES stations(station_id),
    item_id INTEGER REFERENCES items(item_id),
    amount INTEGER NOT NULL,
    PRIMARY KEY (player_id, station_id, item_id)
);

CREATE INDEX idx_locations_location_type_id ON locations(location_type_id);
CREATE INDEX idx_locations_location_entity_id ON locations(location_entity_id);
CREATE INDEX idx_planets_system_id ON planets(system_id);
CREATE INDEX idx_moons_planet_id ON moons(planet_id);
CREATE INDEX idx_belts_planet_id ON belts(planet_id);
CREATE INDEX idx_stations_planet_id ON stations(planet_id);
CREATE INDEX idx_player_ships_player_id ON player_ships(player_id);
CREATE INDEX idx_player_ship_inventory_player_ship_id ON player_ship_inventory(player_ship_id);
CREATE INDEX idx_player_station_inventory_player_id ON player_station_inventory(player_id);
CREATE INDEX idx_player_station_inventory_station_id ON player_station_inventory(station_id);
