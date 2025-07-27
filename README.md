# 2d spacemfers prototype

![demo](demo.gif "demo")

this repo is a proof-of-concept for an mmo spaceship video game. this PoC isn't fully wired up for server-authoritive stuff, but some general ideas are there.

### run locally:
1. install deps: `npm install`
1. make a copy of `server/.env.example` named `server/.env`
1. run postgres: `npm run db:up`
    - to bring the container down, run `npm run db:down`
1. run the game server: `npm run server`
1. run the game client: `npm run client`
