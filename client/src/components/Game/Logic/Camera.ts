import Phaser from 'phaser'

export class Camera {
  private readonly MIN_ZOOM = 0.25
  private readonly MAX_ZOOM = 3
  private readonly STARTING_ZOOM = 1
  private readonly ZOOM_SPEED = 0.5

  private readonly ZOOM_TIERS = [
    { tier: 1, width: 480, height: 270 },
    { tier: 2, width: 720, height: 405 },
    { tier: 3, width: 1366, height: 768 },
    { tier: 4, width: 1920, height: 1080 },
    { tier: 5, width: 2560, height: 1440 },
    { tier: 6, width: 3840, height: 2160 },
  ]

  private camera: Phaser.Cameras.Scene2D.Camera

  constructor(
    scene: Phaser.Scene,
    onZoom: (zoom: number, zoomTeir: number) => void
  ) {
    this.camera = scene.cameras.main
    this.camera.setZoom(this.STARTING_ZOOM)
    this.camera.setBackgroundColor('#000000')

    scene.input.on('wheel', (_: any, __: any, ___: any, deltaY: number) => {
      this.updateZoom(deltaY)
      onZoom(this.getZoom(), this.getZoomTier())
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
    return this.camera.zoom
  }

  /**
   * Returns the current zoom tier of the camera (between 1-7)
   */
  public getZoomTier() {
    const { width, height } = this.getWorldView()

    const tier = this.ZOOM_TIERS.find(
      tier => width < tier.width || height < tier.height
    )

    return tier ? tier.tier : 7
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
    this.camera.startFollow(target, false)
  }

  // ~~~ PRIVATE METHODS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  private updateZoom(deltaY: number) {
    const newZoom = this.camera.zoom - (deltaY * this.ZOOM_SPEED) * 0.001
    this.camera.setZoom(this.clamp(newZoom, this.MIN_ZOOM, this.MAX_ZOOM))
  }

  // TODO: put this in a utils file
  private clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max)
  }
}
