import Phaser from 'phaser'

import bgLayerBase from '../../../assets/bg/base.png'
import bgLayerFar from '../../../assets/bg/far.png'
import bgLayerMid from '../../../assets/bg/mid.png'
import bgLayerNear from '../../../assets/bg/near.png'

export class Background {
  // Phaser game object keys
  private readonly LAYER_KEY_BASE = 'bg-base'
  private readonly LAYER_KEY_FAR = 'bg-far'
  private readonly LAYER_KEY_MID = 'bg-mid'
  private readonly LAYER_KEY_NEAR = 'bg-near'

  // Parallax control factors
  private readonly PARALLAX_FAR = 0.01
  private readonly PARALLAX_MID = 0.1
  private readonly PARALLAX_NEAR = 0.2

  private scene: Phaser.Scene
  private screenWidth: number
  private screenHeight: number

  private bgLayerBase: Phaser.GameObjects.Image | null
  private bgLayerFar: Phaser.GameObjects.TileSprite | null
  private bgLayerMid: Phaser.GameObjects.TileSprite | null
  private bgLayerNear: Phaser.GameObjects.TileSprite | null

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.screenWidth = scene.sys.canvas.width
    this.screenHeight = scene.sys.canvas.height

    this.bgLayerBase = null
    this.bgLayerFar = null
    this.bgLayerMid = null
    this.bgLayerNear = null

    scene.scale.on('resize', () => {
      this.setScreenSize(scene.sys.canvas.width, scene.sys.canvas.height)
    })
  }

  // Preloads the background layer images, run on scene preload
  public preload() {
    this.scene.load.image(this.LAYER_KEY_BASE, bgLayerBase)
    this.scene.load.image(this.LAYER_KEY_FAR, bgLayerFar)
    this.scene.load.image(this.LAYER_KEY_MID, bgLayerMid)
    this.scene.load.image(this.LAYER_KEY_NEAR, bgLayerNear)
  }

  // Instantiates the background layer tilesprites, run on scene create
  public create() {
    const width = this.screenWidth
    const height = this.screenHeight

    // Add static base background layer
    const base = this.scene.add
      .image(0, 0, this.LAYER_KEY_BASE)
      .setDisplaySize(width, height)
      .setOrigin(0, 0)
      .setScrollFactor(0)

    // Add far background layer
    const far = this.scene.add
      .tileSprite(0, 0, width, height, this.LAYER_KEY_FAR)
      .setTileScale(0.2)
      .setOrigin(0, 0)
      .setScrollFactor(0)

    // Add mid background layer
    const mid = this.scene.add
      .tileSprite(0, 0, width, height, this.LAYER_KEY_MID)
      .setTileScale(0.2)
      .setOrigin(0, 0)
      .setScrollFactor(0)

    // Add near background layer
    const near = this.scene.add
      .tileSprite(0, 0, width, height, this.LAYER_KEY_NEAR)
      .setTileScale(0.2)
      .setOrigin(0, 0)
      .setScrollFactor(0)

    this.bgLayerBase = base
    this.bgLayerFar = far
    this.bgLayerMid = mid
    this.bgLayerNear = near
  }

  public getScreenSize() {
    return { width: this.screenWidth, height: this.screenHeight }
  }

  public setScreenSize(width: number, height: number) {
    this.screenWidth = width
    this.screenHeight = height
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
