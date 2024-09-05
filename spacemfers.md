# spacemfers

> mfers, in space

spacemfers is a web-based, open-universe, idle-clicker, lofi space sandbox MMO inspired by EVE Online.

## database tables

each table in the spacemfers game database

### players
the players in the game

- player_id (pk)

### items
the items in the game that can be owned by a player

- item_id (pk)
- name
- size

### ships
represents the different space ships in the game

- ship_id (pk)
- name
- size
- max_cargo_size

### player_ships

- player_ship_id (pk)
- player_id (fk players)
- ship_id (fk ships)
- condition

### player_active_ship
represents a player's active ship (can only be one at a time)

- player_id (pk, unique)
- player_ship_id (fk player_ships, unique, nullable)

### player_ship_inventory
represents the items in a player's ship

- player_ship_id (fk player_ships)
- item_id (fk items)
- amount

### systems
the solar systems to explore in the game

- system_id (pk)
- name

### planets
the planets that orbit the star of a solar system

- planet_id (pk)
- system_id (fk systems)
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

### stations
space stations that orbit planets where players can store items & do business

- station_id (pk)
- planet_id (fk planets)
- name

### player_station_inventory
represents the player's items in a space station

- player_id (fk players)
- station_id (fk stations)
- item_id (fk items)
- amount

### player_location
represents the location of the player in the universe

- player_id (fk players)
- system_id (fk systems)
- station_id (fk stations, nullable) (if not null, it means they are docked)
- last_docked
- x
- y
