# spacemfers

> mfers, in space


## tables

each data type in spacemfers

### players
the players in the game

- player_id (pk)
- fid (indexed)

### actions
the actions that players can take

- action_id (pk)
- name

### location_types
the different types of locations in the game

- location_type_id (pk)
- name

### locations
the locations that the players can go

- location_id (pk)
- location_type (fk)
- name

### player_location
represents a player's current location and travel state

- player_id (fk)
- location_id (fk)
- arrival_time (timestamp)

### location_action
represents which actions are available at a location

- location_id (fk)
- action_id (fk)

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
- location_id (fk)
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
