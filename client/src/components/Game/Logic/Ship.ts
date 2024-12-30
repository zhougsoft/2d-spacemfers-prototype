import Phaser from 'phaser'
import { metersToPixels, pixelsToMeters } from '../../../utils/measurements'

// Acceleration & speed controls
const ACCELERATION_SPEED = 100 // m/s²
const MAX_SPEED = 500 // m/s
const THRUST_LERP_FACTOR = 0.1 // how fast the ship changes thrust level
const SPEED_DECAY = 0.001 // how fast the ship slows down

// Rotation controls
const ROTATION_SPEED = 90 // degrees per second (max turn rate)
const ROTATION_AGILITY = 4.0 // how quickly we “accelerate” toward the target angle

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
    this.setAngle(-90)

    // Initialize ship position in meters from sprite position in pixels
    this.posX_m = pixelsToMeters(this.sprite.x)
    this.posY_m = pixelsToMeters(this.sprite.y)
  }

  // ~~~ PUBLIC METHODS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  /**
   * Returns the ship's Phaser sprite game object
   */
  public getSprite(): Phaser.GameObjects.Sprite {
    return this.sprite
  }

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
   * Returns the ship's current angle in degrees (0 facing up)
   */
  public getAngle(): number {
    return this.sprite.angle - 90 // subtract 90° for Phaser sprite angle offset
  }

  /**
   * Sets the ship's current angle in degrees (0 facing up)
   */
  public setAngle(angle: number) {
    this.sprite.angle = angle + 90 // add 90° for Phaser sprite angle offset
  }

  /**
   * Returns the ship's current angle in radians
   */
  public getAngleRadians(): number {
    return this.getAngle() * (Math.PI / 180)
  }

  /**
   * Sets the desired rotation angle for the ship in degrees (0 facing up)
   * @param angle 0 to 359
   */
  public setTargetAngle(angle: number) {
    this.targetAngle = Math.max(0, Math.min(359, angle))
  }

  /**
   * Sets the desired thrust level for the ship's engines
   * @param thrust 0 to 1
   */
  public setTargetThrust(thrust: number) {
    this.targetThrust = Math.max(0, Math.min(1, thrust))
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
    const currentAngle = this.getAngle()
    const angleDiff = Phaser.Math.Angle.WrapDegrees(
      this.targetAngle - currentAngle - 90
    )

    const maxStep = ROTATION_SPEED * deltaSeconds
    let rotationStep = angleDiff * ROTATION_AGILITY * deltaSeconds
    rotationStep = Phaser.Math.Clamp(rotationStep, -maxStep, maxStep)

    const newAngle = currentAngle + rotationStep
    this.setAngle(newAngle)
  }

  private updateThrust(deltaSeconds: number) {
    this.currentThrust = this.lerp(
      this.currentThrust,
      this.targetThrust,
      THRUST_LERP_FACTOR
    )

    const currentAngleRadians = this.getAngleRadians()
    const thrustX = Math.cos(currentAngleRadians) * ACCELERATION_SPEED
    const thrustY = Math.sin(currentAngleRadians) * ACCELERATION_SPEED

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

  // TODO: put this in a utils file
  private lerp(start: number, target: number, factor: number) {
    return start + (target - start) * factor
  }
}
