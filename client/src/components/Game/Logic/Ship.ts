import Phaser from 'phaser'

const ACCELERATION_SPEED = 0.1 // Base acceleration speed per frame
const MAX_SPEED = 10 // Maximum possible speed at 100% thrust
const THRUST_LERP_FACTOR = 0.05 // How quickly thrust changes (0-1)

const ROTATION_SPEED = 3 // Base rotation speed per frame
const ROTATION_DAMPING_FACTOR = 0.01 // How quickly the ship starts & stops rotating (0-1)
const ROTATION_STOP_THRESHOLD = 0.15 // How close to target angle before stopping rotation acceleration

export class Ship {
  private sprite: Phaser.GameObjects.Sprite
  private velocityX: number = 0
  private velocityY: number = 0
  private rotationVelocity: number = 0
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
  public update(delta: number) {
    this.updateAngle(delta)
    this.updateThrust(delta)
    this.updatePosition()
  }

  private updateAngle(delta: number) {
    const angleDifference = this.targetAngle - this.sprite.angle
    const normalizedDifference = ((angleDifference + 180) % 360) - 180

    const stoppingDistance =
      (this.rotationVelocity * this.rotationVelocity) /
      (2 * ROTATION_DAMPING_FACTOR)

    // Smoothly interpolate rotation towards target angle
    if (Math.abs(normalizedDifference) > ROTATION_STOP_THRESHOLD) {
      if (Math.abs(normalizedDifference) > stoppingDistance) {
        // Far from target angle and enough distance to accelerate
        this.rotationVelocity +=
          Math.sign(normalizedDifference) * ROTATION_DAMPING_FACTOR * delta
      } else {
        // Close to target, start decelerating
        this.rotationVelocity *= 1 - ROTATION_DAMPING_FACTOR * delta
      }
    } else {
      // Very close to target, stop completely
      this.rotationVelocity = 0
      this.sprite.angle = this.targetAngle
    }

    // Limit rotation speed
    this.rotationVelocity = Math.max(
      -ROTATION_SPEED,
      Math.min(ROTATION_SPEED, this.rotationVelocity)
    )

    this.sprite.angle += this.rotationVelocity
  }

  private updateThrust(delta: number) {
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
    const thrustX = Math.cos(currentAngleRadians) * ACCELERATION_SPEED
    const thrustY = Math.sin(currentAngleRadians) * ACCELERATION_SPEED

    if (this.targetThrust > 0) {
      // If thrusting, apply thrust to velocity
      this.velocityX += thrustX * this.currentThrust * delta
      this.velocityY += thrustY * this.currentThrust * delta
    } else {
      // If not thrusting, gradually slow down velocity
      this.velocityX = this.lerp(this.velocityX, 0, THRUST_LERP_FACTOR) * delta
      this.velocityY = this.lerp(this.velocityY, 0, THRUST_LERP_FACTOR) * delta
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
