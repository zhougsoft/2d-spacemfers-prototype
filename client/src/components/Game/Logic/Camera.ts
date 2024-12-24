import Phaser from 'phaser'

export class Camera {
  private readonly MIN_ZOOM = 0.25
  private readonly MAX_ZOOM = 3
  private readonly ZOOM_SPEED = 0.5

  private camera: Phaser.Cameras.Scene2D.Camera
  private currentZoom: number = 1

  constructor(scene: Phaser.Scene, onZoom: (zoom: number, width: number, height: number) => void) {
    this.camera = scene.cameras.main
    this.camera.setZoom(this.currentZoom)
    this.camera.setBackgroundColor('#000000')

    scene.input.on('wheel', (_: any, __: any, ___: any, deltaY: number) => {
      this.updateZoom(deltaY)
      onZoom(this.currentZoom, this.camera.worldView.width, this.camera.worldView.height)
    })
  }

  // ~~~ PUBLIC METHODS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  /**
   * Returns a Phaser Rectangle object representing the world space visible in the camera
   */
  public getWorldView() {
    return this.camera.worldView
  }

  /**
   * Returns the current zoom level of the camera
   */
  public getZoom() {
    return this.currentZoom
  }

  /**
   * Returns the current scroll position of the camera
   */
  public getScroll() {
    return { x: this.camera.scrollX, y: this.camera.scrollY }
  }

  /**
   * Centers the camera on the given target game object
   * @param target The Phaser game object to follow
   */
  public follow(target: Phaser.GameObjects.GameObject) {
    this.camera.startFollow(target, false, 0.75, 0.75)
  }

  // ~~~ PRIVATE METHODS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  private updateZoom(deltaY: number) {
    const zoomCalc = this.camera.zoom - (deltaY * this.ZOOM_SPEED) / 1000
    this.currentZoom = this.clamp(zoomCalc, this.MIN_ZOOM, this.MAX_ZOOM)
    this.camera.setZoom(this.currentZoom)
  }

  // TODO: put this in a utils file
  private clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max)
  }
}
