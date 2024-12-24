import Phaser from 'phaser'

import bgLayerFar from '../../../assets/bg/far.png'
import bgLayerMid from '../../../assets/bg/mid.png'
import bgLayerNear from '../../../assets/bg/near.png'

export class Background {
  // Phaser game object keys
  private readonly LAYER_KEY_FAR = 'bg-far'
  private readonly LAYER_KEY_MID = 'bg-mid'
  private readonly LAYER_KEY_NEAR = 'bg-near'

  // Background layer settings
  private readonly LAYER_WIDTH = 1920
  private readonly LAYER_HEIGHT = 1080
  private readonly LAYER_SCALE = 2
  private readonly LAYER_TILE_SCALE = 0.5

  // Parallax control factors
  private readonly PARALLAX_FAR = 0.05
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

    scene.scale.on('resize', () => this.resize())
  }

  // ~~~ PUBLIC METHODS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  // Preloads the background layer images, run on scene preload
  public preload() {
    this.scene.load.image(this.LAYER_KEY_FAR, bgLayerFar)
    this.scene.load.image(this.LAYER_KEY_MID, bgLayerMid)
    this.scene.load.image(this.LAYER_KEY_NEAR, bgLayerNear)
  }

  /**
   * Instantiates the background layer image/tilesprites, run on scene create
   */
  public create() {
    const locX = this.scene.scale.gameSize.width * 0.5
    const locY = this.scene.scale.gameSize.height * 0.5

    const originX = 0.5
    const originY = 0.5

    const width = this.LAYER_WIDTH
    const height = this.LAYER_HEIGHT
    const tileScale = this.LAYER_TILE_SCALE

    // Add far background layer
    const far = this.scene.add
      .tileSprite(locX, locY, width, height, this.LAYER_KEY_FAR)
      .setOrigin(originX, originY)
      .setScale(this.LAYER_SCALE * this.PARALLAX_FAR)
      .setTileScale(tileScale)
      .setScrollFactor(0)

    // Add mid background layer
    const mid = this.scene.add
      .tileSprite(locX, locY, width, height, this.LAYER_KEY_MID)
      .setOrigin(originY, originY)
      .setScale(this.LAYER_SCALE * this.PARALLAX_MID)
      .setTileScale(tileScale)
      .setScrollFactor(0)

    // Add near background layer
    const near = this.scene.add
      .tileSprite(locX, locY, width, height, this.LAYER_KEY_NEAR)
      .setOrigin(originY, originY)
      .setScale(this.LAYER_SCALE * this.PARALLAX_NEAR)
      .setTileScale(tileScale)
      .setScrollFactor(0)

    this.bgLayerFar = far
    this.bgLayerMid = mid
    this.bgLayerNear = near
  }

  /**
   * Zoom the background layers to the given zoom level
   * @param zoom The current zoom level to set the background layers to
   */
  public zoom(zoom: number) {
    if (this.bgLayerFar) {
      this.bgLayerFar.setScale(this.LAYER_SCALE * zoom * this.PARALLAX_FAR)
    }

    if (this.bgLayerMid) {
      this.bgLayerMid.setScale(this.LAYER_SCALE * zoom * this.PARALLAX_MID)
    }

    if (this.bgLayerNear) {
      this.bgLayerNear.setScale(this.LAYER_SCALE * zoom * this.PARALLAX_NEAR)
    }
  }
  /**
   * Update the background layers based on the camera scroll position
   * @param scrollX The current x scroll position of the camera
   * @param scrollY The current y scroll position of the camera
   */
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

  // ~~~ PRIVATE METHODS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  /**
   * Get the current raw, un-modified game width & height
   */
  private getGameSize() {
    return {
      width: this.scene.scale.gameSize.width,
      height: this.scene.scale.gameSize.height,
    }
  }

  /**
   * Resize the background layers to fit the world space pixel dimensions
   */
  private resize() {
    const { width, height } = this.getGameSize()
    const locX = width * 0.5
    const locY = height * 0.5

    if (this.bgLayerFar) {
      this.bgLayerFar.setPosition(locX, locY)
    }
    if (this.bgLayerMid) {
      this.bgLayerMid.setPosition(locX, locY)
    }
    if (this.bgLayerNear) {
      this.bgLayerNear.setPosition(locX, locY)
    }
  }
}
