import Phaser from 'phaser'

const MIN_ZOOM = 0.25
const MAX_ZOOM = 3
const ZOOM_SPEED = 0.5

export class Camera {
  private camera: Phaser.Cameras.Scene2D.Camera

  constructor(scene: Phaser.Scene) {
    this.camera = scene.cameras.main
    this.camera.setBackgroundColor('#000000')

    scene.input.on('wheel', (_: any, __: any, ___: number, deltaY: number) => {
      this.zoom(deltaY)
    })
  }

  public getScroll() {
    return { x: this.camera.scrollX, y: this.camera.scrollY }
  }

  public follow(target: Phaser.GameObjects.GameObject) {
    this.camera.startFollow(target, false, 0.75, 0.75)
  }

  public zoom(deltaY: number) {
    const zoom = this.camera.zoom - (deltaY * ZOOM_SPEED) / 1000
    this.camera.setZoom(Math.min(Math.max(zoom, MIN_ZOOM), MAX_ZOOM))
  }
}
