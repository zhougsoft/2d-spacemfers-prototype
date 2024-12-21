import Phaser from 'phaser'

import bgLayerBase from '../../../assets/bg/base.png'
import bgLayerFar from '../../../assets/bg/far.png'
import bgLayerMid from '../../../assets/bg/mid.png'
import bgLayerNear from '../../../assets/bg/near.png'

export class Background {
  private readonly LAYER_KEY_BASE = 'bg-base'
  private readonly LAYER_KEY_FAR = 'bg-far'
  private readonly LAYER_KEY_MID = 'bg-mid'
  private readonly LAYER_KEY_NEAR = 'bg-near'

  private scene: Phaser.Scene
  private screenWidth: number
  private screenHeight: number

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.screenWidth = scene.sys.canvas.width
    this.screenHeight = scene.sys.canvas.height

    scene.scale.on('resize', () => {
      this.setScreenSize(scene.sys.canvas.width, scene.sys.canvas.height)
    })
  }

  public preload() {
    this.scene.load.image(this.LAYER_KEY_BASE, bgLayerBase)
    this.scene.load.image(this.LAYER_KEY_FAR, bgLayerFar)
    this.scene.load.image(this.LAYER_KEY_MID, bgLayerMid)
    this.scene.load.image(this.LAYER_KEY_NEAR, bgLayerNear)
  }

  public create() {
    // TODO: instantiate the background layer tilesprites here
  }

  public getScreenSize() {
    return { width: this.screenWidth, height: this.screenHeight }
  }

  public setScreenSize(width: number, height: number) {
    this.screenWidth = width
    this.screenHeight = height
  }
}
