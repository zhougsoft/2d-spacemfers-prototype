import Phaser from 'phaser'
import { pixelsToMeters } from '../../../utils/measurements'
import { Background } from './Background'

const MIN_ZOOM = 0.25
const MAX_ZOOM = 3
const ZOOM_SPEED = 0.5

export class Camera {
  private scene: Phaser.Scene
  private camera: Phaser.Cameras.Scene2D.Camera

  private viewportWidth: number
  private viewportHeight: number
  private currentZoom: number = 1

  constructor(scene: Phaser.Scene, background: Background) {
    this.scene = scene

    this.camera = scene.cameras.main
    this.camera.setZoom(this.currentZoom)
    this.camera.setBackgroundColor('#000000')

    this.viewportWidth = scene.sys.canvas.width
    this.viewportHeight = scene.sys.canvas.height

    // Update zoom level & viewport size on scroll
    scene.input.on('wheel', (_: any, __: any, ___: number, deltaY: number) => {
      this.updateZoom(deltaY)
      this.updateViewport()
      const { width, height } = this.getViewportSize()
      background.resize(width, height)
    })

    // Update viewport size on screen resize
    scene.scale.on('resize', () => {
      this.updateViewport()
      const { width, height } = this.getViewportSize()
      background.resize(width, height)
    })
  }

  /**
   * Returns the amount of game world units (pixels) visible in the viewport
   */
  public getViewportSize() {
    return { width: this.viewportWidth, height: this.viewportHeight }
  }

  /**
   * Returns the amount of game world meters visible in the viewport
   */
  public getViewportSizeMeters() {
    return {
      width: pixelsToMeters(this.viewportWidth),
      height: pixelsToMeters(this.viewportHeight),
    }
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

  private clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max)
  }

  private updateZoom(deltaY: number) {
    const zoomCalc = this.camera.zoom - (deltaY * ZOOM_SPEED) / 1000
    this.currentZoom = this.clamp(zoomCalc, MIN_ZOOM, MAX_ZOOM)
    this.camera.setZoom(this.currentZoom)
  }

  private updateViewport() {
    const { width, height } = this.scene.sys.canvas
    if (this.currentZoom > 0) {
      // zoomed in
      this.viewportHeight = height / this.currentZoom
      this.viewportWidth = width / this.currentZoom
    } else if (this.currentZoom < 0) {
      // zoomed out
      this.viewportHeight = height * this.currentZoom
      this.viewportWidth = width * this.currentZoom
    } else {
      // zoom is 0
      this.viewportHeight = height
      this.viewportWidth = width
    }
  }
}
