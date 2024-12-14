# spacemfers todos

## the BIG GAME WORLD REFACTOR
- [ ] make a scaled grid for speed/navigation debugging and developing all of this
- [ ] create a basic static JSON file for the star system to start fleshing out the schema for new location system
- SPATIAL PARTITIONING: WHERE DO WE START???
    - [ ] make a lil prototype-ey thing in phaser-land with the new location system from static file data
- [ ] make sure everything is tight in Ship class with the pixels-to-meters ratio stuff
- [ ] yeet the celestial system from db land in favour of the static file


## other thangs
- [x] finish parallaxing
- [ ] add a cool foreground parallax layer that sits between the camera and ship and is really fast with little wispy light & semi-transparent specks
- [ ] use the ship stats to determine the speed and turn speed (with max speed and mass attributes)
- [ ] figure out this background/camera/zoom/tiling situation
    - tldr; we'll need a tiling nebula background, any specialized AI for generating this?
