# spacemfers todos

## the BIG STAR SYSTEM REFACTOR
- [x] refactor ship class to do all state calculations in seconds, meters, and meters-per-second
    - use the sprite's x & y pixel coordinates as source of truth, but wrap it all in realistic measurements
- [x] Represent the star system as a single massive 2D plane in meters.
    - the system's star is always at (0,0)
    - player’s coordinates are (playerX, playerY) in meters
    - convert the measurements to pixels at render time using the constants
    - no partitioning since there arent a ton of objects; no complexity needed beyond a single coordinate space
- [x] make the debug grid do a tiled display thingy with the camera so it doesnt need to render tons of graphics
- [ ] add some stuff to the world and try flying around it and stuff
- [ ] try warping to something far AF away
- [ ] yeet the old instance-based timestamp-ey celestial system


## other thangs
- [x] finish parallaxing
- [ ] add a cool foreground parallax layer that sits between the camera and ship and is really fast with little wispy light & semi-transparent specks
- [ ] use the ship stats to determine the speed and turn speed (with max speed and mass attributes)
- [ ] figure out this background/camera/zoom/tiling situation
    - maybe a tiling nebula background is needed? any specialized AI for generating this?
    - maybe there's a way to do a "skybox" with a 2d view?
