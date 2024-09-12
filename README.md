# spacemfers

> mfers, in space

![spacemfers](spacemfers.png)

spacemfers is a web-based, open-universe, idle-clicker, lofi space sandbox MMO inspired by EVE Online.

## database tables

each table in the spacemfers game database

### location_types
types of locations in the game universe

- location_type_id (pk)
- name (unique)

### locations
represents locations in the game universe, combining types with entities (e.g. planets, stations)

- location_id (pk)
- location_type_id (fk location_types)
- location_entity_id
- (unique location_type_id, location_entity_id)

### systems
the solar systems to explore in the game

- system_id (pk)
- name

### planets
the planets that orbit the star of a solar system

- planet_id (pk)
- system_id (fk systems)
- name

### stations
space stations that orbit planets where players can store items & do business

- station_id (pk)
- planet_id (fk planets)
- name

### moons
moons that orbit planets where player actions can be taken

- moon_id (pk)
- planet_id (fk planets)
- name

### belts
asteroid belts that orbit planets where player actions can be taken

- belt_id (pk)
- planet_id (fk planets)
- name

### items
the items in the game that can be owned by a player

- item_id (pk)
- name
- size

### planet_items
represents what items can be found on what planets

- planet_id (fk planets)
- item_id (fk items)

### moon_items
represents what items can be found on what moons

- moon_id (fk moons)
- item_id (fk items)

### belt_items
represents what items can be found on what belts

- belt_id (fk belts)
- item_id (fk items)

### players
the players in the game

- player_id (pk)

### player_location
represents the location of the player in the universe

- player_id (pk, fk players)
- location_id (fk locations)
- prev_location_id (fk locations, nullable)
- departure_time (nullable)
- arrival_time

### ships
represents the different space ships in the game

- ship_id (pk)
- name
- size
- max_cargo_size

### player_ships
represents ships owned by players

- player_ship_id (pk)
- player_id (fk players)
- ship_id (fk ships)
- condition
- station_id (fk stations, nullable)

### player_active_ship
represents a player's active ship (can only be one at a time)

- player_id (pk, unique, fk players)
- player_ship_id (fk player_ships, unique, nullable)

### player_ship_inventory
represents the items in a player's ship

- player_ship_id (fk player_ships)
- item_id (fk items)
- amount

### player_station_inventory
represents the player's items in a space station

- player_id (fk players)
- station_id (fk stations)
- item_id (fk items)
- amount
