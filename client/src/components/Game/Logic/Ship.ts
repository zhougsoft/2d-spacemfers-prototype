import Phaser from 'phaser'
import { metersToPixels, pixelsToMeters } from '../../../utils/measurements'

const ACCELERATION_SPEED = 100 // m/s²
const MAX_SPEED = 500 // m/s
const THRUST_LERP_FACTOR = 0.1 // how fast the ship changes thrust level
const SPEED_DECAY = 0.001 // how fast the ship slows down
const ROTATION_SPEED = 100 // degrees per second

export class Ship {
  private sprite: Phaser.GameObjects.Sprite

  private posX_m: number = 0 // ship position X in meters
  private posY_m: number = 0 // ship position Y in meters
  private velX_ms: number = 0 // ship velocity X in m/s
  private velY_ms: number = 0 // ship velocity Y in m/s

  private currentThrust: number = 0 // current thrust level (0 to 1)
  private targetThrust: number = 0 // target thrust level (0 to 1)
  private targetAngle: number = 0 // target angle in degrees (0 to 359, 0 facing up)

  /**
   * Ship constructor
   * @param sprite Phaser sprite object representing the ship
   */
  constructor(sprite: Phaser.GameObjects.Sprite) {
    this.sprite = sprite

    // Initialize ship position in meters from sprite position in pixels
    this.posX_m = pixelsToMeters(this.sprite.x)
    this.posY_m = pixelsToMeters(this.sprite.y)
  }

  // ~~~ PUBLIC METHODS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  /**
   * Returns the ship's current position in meters
   */
  public getPosition(): { x: number; y: number } {
    return { x: this.posX_m, y: this.posY_m }
  }

  /**
   * Returns the ship's current speed in m/s
   */
  public getSpeed(): number {
    return Math.sqrt(this.velX_ms ** 2 + this.velY_ms ** 2)
  }

  /**
   * Returns the ship's current angle in degrees (based on sprite angle)
   */
  public getAngle(): number {
    return this.sprite.angle
  }

  /**
   * Returns the ship's current alignment in radians; use for physics calculations
   */
  public getAlignmentRadians(): number {
    // Subtract 90 degrees to account for Phaser's right-facing default orientation
    return (this.getAngle() - 90) * (Math.PI / 180)
  }

  /**
   * Sets the desired rotation angle for the ship in degrees
   * @param angle 0 to 359
   */
  public setTargetAngle(angle: number) {
    this.targetAngle = Phaser.Math.Clamp(angle, 0, 359)
  }

  /**
   * Sets the desired thrust level for the ship's engines
   * @param thrust 0 to 1
   */
  public setTargetThrust(thrust: number) {
    this.targetThrust = Phaser.Math.Clamp(thrust, 0, 1)
  }

  /**
   * Aligns the ship to face a target game world position
   * @param targetX target X coordinate in meters
   * @param targetY target Y coordinate in meters
   */
  public alignTo(targetX: number, targetY: number) {
    const dx = targetX - this.posX_m
    const dy = targetY - this.posY_m
    const angleRadians = Math.atan2(dy, dx)

    // Convert to degrees and add 90 to account for Phaser's orientation
    const angleDegrees = (angleRadians * 180) / Math.PI + 90

    // Wrap to 0-359 range
    this.setTargetAngle((angleDegrees + 360) % 360)
  }

  /**
   * Main physics update loop for the ship
   * @param delta time since last frame in ms
   */
  public update(delta: number) {
    const deltaSeconds = delta * 0.001
    this.updateAngle(deltaSeconds)
    this.updateThrust(deltaSeconds)
    this.updatePosition(deltaSeconds)
  }

  // ~~~ PRIVATE METHODS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  private updateAngle(deltaSeconds: number) {
    const currentAngle = this.sprite.angle
    const angleDiff = Phaser.Math.Angle.WrapDegrees(
      this.targetAngle - currentAngle
    )

    const maxStep = ROTATION_SPEED * deltaSeconds
    let rotationStep = angleDiff * deltaSeconds
    rotationStep = Phaser.Math.Clamp(rotationStep, -maxStep, maxStep)

    this.sprite.angle = currentAngle + rotationStep
  }

  private updateThrust(deltaSeconds: number) {
    this.currentThrust = Phaser.Math.Linear(
      this.currentThrust,
      this.targetThrust,
      THRUST_LERP_FACTOR
    )

    const currentAlignmentRadians = this.getAlignmentRadians()
    const thrustX = Math.cos(currentAlignmentRadians) * ACCELERATION_SPEED
    const thrustY = Math.sin(currentAlignmentRadians) * ACCELERATION_SPEED

    if (this.targetThrust > 0) {
      this.velX_ms += thrustX * this.currentThrust * deltaSeconds
      this.velY_ms += thrustY * this.currentThrust * deltaSeconds
    } else {
      this.velX_ms *= 1 - SPEED_DECAY * deltaSeconds
      this.velY_ms *= 1 - SPEED_DECAY * deltaSeconds
    }

    const speed = this.getSpeed()
    const allowedMaxSpeed = MAX_SPEED * this.currentThrust

    if (speed > 0 && speed > allowedMaxSpeed) {
      const scale = allowedMaxSpeed / speed
      this.velX_ms *= scale
      this.velY_ms *= scale
    }
  }

  private updatePosition(deltaSeconds: number) {
    // Update position in meters based on velocity
    this.posX_m += this.velX_ms * deltaSeconds
    this.posY_m += this.velY_ms * deltaSeconds

    // Convert meters to pixels and update sprite position for rendering
    this.sprite.x = metersToPixels(this.posX_m)
    this.sprite.y = metersToPixels(this.posY_m)
  }
}
