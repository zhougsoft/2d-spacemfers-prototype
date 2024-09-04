# spacemfers

> mfers, in space


## database tables

each data entity in spacemfers

### players
the players in the game

- player_id (pk)
- fid (indexed)

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
- player_id (fk)
- ship_id (fk)
- condition

### player_active_ship
represents a player's active ship (can only be one at a time)

- player_id (pk, unique)
- player_ship_id (fk, unique, nullable)

### player_ship_inventory
represents the items in a player's ship

- player_ship_id (fk)
- item_id (fk)
- amount


### systems
the solar systems to explore in the game

- system_id (pk)
- name

### planets
the planets that orbit the star of a solar system

- planet_id (pk)
- system_id (fk)
- name

### moons
moons that orbit planets where player actions can be taken

- moon_id (pk)
- planet_id (fk)
- name

### belts
asteroid belts that orbit planets where player actions can be taken

- belt_id (pk)
- planet_id (fk)
- name

### stations
space stations that orbit planets where players can store items & do business

- station_id (pk)
- planet_id (fk)
- name

### player_station_inventory
represents the player's items in a space station

- player_id (fk)
- station_id (fk)
- item_id (fk)
- amount

### location_types
the types of location a player can be

- location_type_id (pk)
- type (system, planet, moon, belt or station)

TODO:
### locations
places in the game where a player can be

- location_id (pk)
- location_type_id (fk)
