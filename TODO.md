# spacemfers todos

## ZOOM TIERS
- a solution for viewing the vastness of space within the constraints of top-down 2d without sacrificing close detail and zooming in on your ship and admiring the nice closeup details
- [ ] Implement discrete zoom tiers (e.g. overview, tactical, detailed) rather than continuous zoom
- [ ] Define tier-specific zoom levels and which layers/objects are visible at each
- [ ] Create a function to set camera zoom and toggle object visibility based on the current tier
- [ ] Adjust scroll wheel input to snap between predefined tiers instead of gradually scaling zoom
- [ ] Store references to layers/backgrounds in scene data for easy enable/disable per tier
- [ ] Apply tier-based parallax and detail rules to optimize performance and visual clarity


## the BIG STAR SYSTEM REFACTOR
- [x] refactor ship class to do all state calculations in seconds, meters, and meters-per-second
    - use the sprite's x & y pixel coordinates as source of truth, but wrap it all in realistic measurements
- [x] Represent the star system as a single massive 2D plane in meters.
    - the system's star is always at (0,0)
    - player’s coordinates are (playerX, playerY) in meters
    - convert the measurements to pixels at render time using the constants
    - no partitioning since there arent a ton of objects; no complexity needed beyond a single coordinate space
- [x] make the debug grid do a tiled display thingy with the camera so it doesnt need to render tons of graphics
- [x] add some stuff to the world and try flying around it and stuff
- [ ] try warping to something far AF away
- [ ] yeet the old instance-based timestamp-ey celestial system


## other thangs
- [x] finish parallaxing
- [ ] add a cool foreground parallax layer that sits between the camera and ship and is really fast with little wispy light & semi-transparent specks
- [ ] use the ship stats to determine the speed and turn speed (with max speed and mass attributes)
- [ ] make the offset of the nebula background based on the coordinates within the entire system, place a bright sun thing right in the middle of the nebula background so it will be realistic where the sun is in relation to where you are in the star system
