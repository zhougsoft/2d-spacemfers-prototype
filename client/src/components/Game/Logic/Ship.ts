import Phaser from 'phaser'

const BASE_ROTATION_SPEED = 2 // Maximum rotation speed in degrees per frame
const BASE_ACCELERATION_SPEED = 0.1 // Base acceleration per frame
const MAX_SPEED = 10 // Maximum possible speed at 100% thrust

const THRUST_LERP_FACTOR = 0.1 // How quickly thrust changes (0-1)
const BRAKE_LERP_FACTOR = 0.1 // How quickly the ship stops (0-1)

export class Ship {
  private sprite: Phaser.GameObjects.Sprite
  private velocityX: number = 0
  private velocityY: number = 0
  private currentThrust: number = 0
  private targetThrust: number = 0
  private targetAngle: number = 0

  constructor(sprite: Phaser.GameObjects.Sprite) {
    this.sprite = sprite
  }

  /**
   * Get the ship's Phaser sprite object
   */
  public getSprite() {
    return this.sprite
  }

  /**
   * Get the ship's current speed (velocity magnitude)
   */
  public getSpeed() {
    return Math.sqrt(this.velocityX ** 2 + this.velocityY ** 2)
  }

  /**
   * Update the ship's target rotation angle
   * @param angle Target angle in degrees (0-359)
   */
  public setTargetAngle(angle: number) {
    this.targetAngle = Math.max(0, Math.min(359, angle))
  }

  /**
   * Update the ship's target thrust level
   * @param thrust Thrust value (0.0-1.0) where 1.0 = 100% thrust
   */
  public setTargetThrust(thrust: number) {
    this.targetThrust = Math.max(0, Math.min(1, thrust))
  }

  /**
   * Update the ship's physics state; call on every iteration of the game loop
   */
  public update() {
    this.updateAngle()
    this.updateThrust()
    this.updatePosition()
  }

  private updateAngle() {
    // Calculate shortest rotation path to target angle
    const angleDifference = this.targetAngle - this.sprite.angle

    // Normalize to -180/+180 to ensure ship rotates the shortest direction
    const normalizedDifference = ((angleDifference + 180) % 360) - 180

    // Apply rotation with speed limiting
    if (Math.abs(normalizedDifference) > BASE_ROTATION_SPEED) {
      this.sprite.angle += Math.sign(normalizedDifference) * BASE_ROTATION_SPEED
    } else {
      this.sprite.angle = this.targetAngle
    }
  }

  private updateThrust() {
    // Smoothly interpolate thrust towards target thrust
    this.currentThrust = this.lerp(
      this.currentThrust,
      this.targetThrust,
      THRUST_LERP_FACTOR
    )

    // Convert ship angle to radians & adjust for Phaser's coordinate system
    // (subtract 90° because Phaser's 0° points right, we want it to point up)
    const currentAngleRadians = (this.sprite.angle - 90) * (Math.PI / 180)

    // Calculate thrust vectors based on ship orientation
    const thrustX = Math.cos(currentAngleRadians) * BASE_ACCELERATION_SPEED
    const thrustY = Math.sin(currentAngleRadians) * BASE_ACCELERATION_SPEED

    if (this.targetThrust > 0) {
      // If thrusting, apply thrust to velocity
      this.velocityX += thrustX * this.currentThrust
      this.velocityY += thrustY * this.currentThrust
    } else {
      // If not thrusting, gradually slow down velocity
      this.velocityX = this.lerp(this.velocityX, 0, BRAKE_LERP_FACTOR)
      this.velocityY = this.lerp(this.velocityY, 0, BRAKE_LERP_FACTOR)
    }

    // Calculate current speed (velocity magnitude)
    const currentSpeed = Math.sqrt(this.velocityX ** 2 + this.velocityY ** 2)

    // Limit speed based on current thrust setting
    const maxSpeed = MAX_SPEED * this.currentThrust

    if (this.getSpeed() > maxSpeed) {
      // If exceeding max speed, proportionally scale down velocity
      const scale = maxSpeed / currentSpeed
      this.velocityX *= scale
      this.velocityY *= scale
    }
  }

  private updatePosition() {
    // Apply current velocity to ship position
    this.sprite.x += this.velocityX
    this.sprite.y += this.velocityY
  }

  /**
   * Linear interpolation helper
   * @param start Starting value
   * @param end Target value
   * @param factor Interpolation factor (0-1)
   */
  private lerp(start: number, end: number, factor: number) {
    return start + (end - start) * factor
  }
}
