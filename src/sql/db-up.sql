CREATE TABLE celestial_types (
    celestial_type_id INTEGER PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

INSERT INTO celestial_types (celestial_type_id, name)
VALUES 
    (1, 'star'),
    (2, 'planet'),
    (3, 'moon'),
    (4, 'belt'),
    (5, 'station');

CREATE TABLE celestials (
    celestial_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    celestial_type_id INTEGER NOT NULL REFERENCES celestial_types(celestial_type_id),
    parent_celestial_id INTEGER REFERENCES celestials(celestial_id) ON DELETE CASCADE,
    distance_from_parent DOUBLE PRECISION NOT NULL, -- in AU (astronomical units)
    name VARCHAR(255) NOT NULL,
    CHECK (
        (parent_celestial_id IS NOT NULL AND distance_from_parent > 0) OR
        (parent_celestial_id IS NULL AND distance_from_parent = 0)
    )
);

CREATE FUNCTION enforce_celestial_type() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.celestial_type_id != TG_ARGV[0]::INTEGER THEN
        RAISE EXCEPTION 'celestial % must be of type %', 
        NEW.celestial_id, TG_ARGV[0];
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE star_info (
    star_id INTEGER PRIMARY KEY REFERENCES celestials(celestial_id)
);

CREATE TRIGGER enforce_star_type
    BEFORE INSERT OR UPDATE ON star_info
    FOR EACH ROW
    EXECUTE FUNCTION enforce_celestial_type(1);

CREATE TABLE planet_info (
    planet_id INTEGER PRIMARY KEY REFERENCES celestials(celestial_id)
);

CREATE TRIGGER enforce_planet_type
    BEFORE INSERT OR UPDATE ON planet_info
    FOR EACH ROW
    EXECUTE FUNCTION enforce_celestial_type(2);

CREATE TABLE moon_info (
    moon_id INTEGER PRIMARY KEY REFERENCES celestials(celestial_id)
);

CREATE TRIGGER enforce_moon_type
    BEFORE INSERT OR UPDATE ON moon_info
    FOR EACH ROW
    EXECUTE FUNCTION enforce_celestial_type(3);

CREATE TABLE belt_info (
    belt_id INTEGER PRIMARY KEY REFERENCES celestials(celestial_id)
);

CREATE TRIGGER enforce_belt_type
    BEFORE INSERT OR UPDATE ON belt_info
    FOR EACH ROW
    EXECUTE FUNCTION enforce_celestial_type(4);

CREATE TABLE station_info (
    station_id INTEGER PRIMARY KEY REFERENCES celestials(celestial_id)
);

CREATE TRIGGER enforce_station_type
    BEFORE INSERT OR UPDATE ON station_info
    FOR EACH ROW
    EXECUTE FUNCTION enforce_celestial_type(5);


CREATE TABLE ship_types (
    ship_type_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    speed INTEGER NOT NULL,
    size INTEGER NOT NULL,
    max_cargo_size INTEGER NOT NULL
);

CREATE TABLE items (
    item_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    size INTEGER NOT NULL
);

CREATE TABLE players (player_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY);

CREATE TABLE player_location (
    player_id INTEGER PRIMARY KEY REFERENCES players(player_id),
    target_celestial_id INTEGER REFERENCES celestials(celestial_id),
    prev_celestial_id INTEGER REFERENCES celestials(celestial_id),
    departure_time TIMESTAMP,
    arrival_time TIMESTAMP,
    CHECK (
        -- the arrival time is after the departure time or NULL
        arrival_time IS NULL OR departure_time IS NULL OR arrival_time > departure_time
    )
);

CREATE TABLE player_ships (
    player_ship_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    player_id INTEGER REFERENCES players(player_id) NOT NULL,
    ship_type_id INTEGER REFERENCES ship_types(ship_type_id) NOT NULL,
    station_id INTEGER REFERENCES celestials(celestial_id)
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
    PRIMARY KEY (player_id, station_id, item_id)
);

CREATE INDEX idx_celestials_celestial_type_id ON celestials(celestial_type_id);
CREATE INDEX idx_celestials_celestial_parent_id ON celestials(celestial_parent_id);
CREATE INDEX idx_player_location_target_celestial_id ON player_location(target_celestial_id);
CREATE INDEX idx_player_location_prev_celestial_id ON player_location(prev_celestial_id);
CREATE INDEX idx_player_location_departure_time ON player_location(departure_time);
CREATE INDEX idx_player_location_arrival_time ON player_location(arrival_time);
CREATE INDEX idx_player_ships_player_id ON player_ships(player_id);
CREATE INDEX idx_player_ships_station_id ON player_ships(station_id);
CREATE INDEX idx_player_ship_inventory_player_ship_id ON player_ship_inventory(player_ship_id);
CREATE INDEX idx_player_station_inventory_player_id ON player_station_inventory(player_id);
CREATE INDEX idx_player_station_inventory_station_id ON player_station_inventory(station_id);
