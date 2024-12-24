import Phaser from 'phaser'

import bgLayerFar from '../../../assets/bg/far.png'
import bgLayerMid from '../../../assets/bg/mid.png'
import bgLayerNear from '../../../assets/bg/near.png'

export class Background {
  // Phaser game object keys
  private readonly LAYER_KEY_FAR = 'bg-far'
  private readonly LAYER_KEY_MID = 'bg-mid'
  private readonly LAYER_KEY_NEAR = 'bg-near'

  // Parallax layer control factors
  private readonly LAYER_TILE_SCALE = 0.2
  private readonly PARALLAX_FAR = 0.01
  private readonly PARALLAX_MID = 0.1
  private readonly PARALLAX_NEAR = 0.2

  private scene: Phaser.Scene

  private bgLayerFar: Phaser.GameObjects.TileSprite | null
  private bgLayerMid: Phaser.GameObjects.TileSprite | null
  private bgLayerNear: Phaser.GameObjects.TileSprite | null

  constructor(scene: Phaser.Scene) {
    this.scene = scene

    this.bgLayerFar = null
    this.bgLayerMid = null
    this.bgLayerNear = null
  }

  // Preloads the background layer images, run on scene preload
  public preload() {
    this.scene.load.image(this.LAYER_KEY_FAR, bgLayerFar)
    this.scene.load.image(this.LAYER_KEY_MID, bgLayerMid)
    this.scene.load.image(this.LAYER_KEY_NEAR, bgLayerNear)
  }

  /**
   * Instantiates the background layer image/tilesprites, run on scene create
   * @param width Pixel width of the background layers
   * @param height Pixel height of the background layers
   */
  public create(width: number, height: number) {
    const locX = width * 0.5
    const locY = height * 0.5
    const originX = 0.5
    const originY = 0.5

    // Add far background layer
    const far = this.scene.add
      .tileSprite(locX, locY, width, height, this.LAYER_KEY_FAR)
      .setTileScale(this.LAYER_TILE_SCALE)
      .setOrigin(originX, originY)
      .setScrollFactor(0)

    // Add mid background layer
    const mid = this.scene.add
      .tileSprite(locX, locY, width, height, this.LAYER_KEY_MID)
      .setTileScale(this.LAYER_TILE_SCALE)
      .setOrigin(originX, originY)
      .setScrollFactor(0)

    // Add near background layer
    const near = this.scene.add
      .tileSprite(locX, locY, width, height, this.LAYER_KEY_NEAR)
      .setTileScale(this.LAYER_TILE_SCALE)
      .setOrigin(originX, originY)
      .setScrollFactor(0)

    this.bgLayerFar = far
    this.bgLayerMid = mid
    this.bgLayerNear = near
  }

  // Resize & position background layers on screen resize or zoom change
  public resize(width: number, height: number) {
    const locX = width * 0.5
    const locY = height * 0.5

    this.bgLayerFar?.setSize(width, height)
    this.bgLayerFar?.setPosition(locX, locY)

    this.bgLayerMid?.setSize(width, height)
    this.bgLayerMid?.setPosition(locX, locY)

    this.bgLayerNear?.setSize(width, height)
    this.bgLayerNear?.setPosition(locX, locY)
  }

  public updateParallax(scrollX: number, scrollY: number) {
    if (this.bgLayerFar) {
      this.bgLayerFar.tilePositionX = scrollX * this.PARALLAX_FAR
      this.bgLayerFar.tilePositionY = scrollY * this.PARALLAX_FAR
    }

    if (this.bgLayerMid) {
      this.bgLayerMid.tilePositionX = scrollX * this.PARALLAX_MID
      this.bgLayerMid.tilePositionY = scrollY * this.PARALLAX_MID
    }

    if (this.bgLayerNear) {
      this.bgLayerNear.tilePositionX = scrollX * this.PARALLAX_NEAR
      this.bgLayerNear.tilePositionY = scrollY * this.PARALLAX_NEAR
    }
  }
}
