import { pixelsToMeters } from '../../../utils/measurements'

export interface GameEntity {
  id: string
  sprite: Phaser.GameObjects.Sprite
}

export interface EntityInfo {
  id: string
  distance: number
}

export class EntityManager {
  private entities: GameEntity[] = []

  addEntity(entity: GameEntity) {
    this.entities.push(entity)
  }

  getEntities() {
    return this.entities
  }

  getEntityById(id: string) {
    return this.entities.find(entity => entity.id === id)
  }

  /**
   * Returns all entities as an array of info objects, sorted by distance to the player in meters
   * @param playerX X coordinate of the player location in meters
   * @param playerY Y coordinate of the player location in meters
   */
  getEntitiesInfo(playerX: number, playerY: number): EntityInfo[] {
    return this.entities
      .map(entity => ({
        id: entity.id,
        distance: Math.sqrt(
          (pixelsToMeters(entity.sprite.x) - playerX) ** 2 +
            (pixelsToMeters(entity.sprite.y) - playerY) ** 2
        ),
      }))
      .sort((a, b) => a.distance - b.distance)
  }
}
