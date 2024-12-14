import Phaser from 'phaser'

// Acceleration & speed controls
const ACCELERATION_SPEED = 5 // Base acceleration rate in m/s^2
const MAX_SPEED = 10 // Maximum velocity in m/s
const THRUST_LERP_FACTOR = 0.1 // Thrust response smoothing
const DECEL_LERP_FACTOR = 0.05 // Deceleration smoothing
const SPEED_DECAY = 0.1 // Velocity reduction with no thrust

// Rotation controls
const ROTATION_SPEED = 10 // Maximum rotation speed per frame
const ROTATION_DAMPING_FACTOR = 0.01 // Rotation acceleration/deceleration rate
const ROTATION_STOP_THRESHOLD = 0.15 // Angle difference before stopping rotation

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
   * Returns the ship's Phaser sprite object
   */
  public getSprite() {
    return this.sprite
  }

  /**
   * Returns the ship's current position as a 2D vector
   */
  public getPosition(): { x: number; y: number } {
    return { x: this.sprite.x, y: this.sprite.y }
  }

  /**
   * Returns the ship's current velocity magnitude
   */
  public getSpeed() {
    return Math.sqrt(this.velocityX ** 2 + this.velocityY ** 2)
  }

  /**
   * Returns the ship's current angle in degrees (0 facing up)
   */
  public getAngle() {
    return this.sprite.angle - 90
  }

  /**
   * Returns the ship's current angle in radians
   */
  public getAngleRadians() {
    return this.getAngle() * (Math.PI / 180)
  }

  /**
   * Sets the desired rotation angle for the ship
   */
  public setTargetAngle(angle: number) {
    this.targetAngle = Math.max(0, Math.min(359, angle))
  }

  /**
   * Sets the desired thrust level for the ship's engines
   */
  public setTargetThrust(thrust: number) {
    this.targetThrust = Math.max(0, Math.min(1, thrust))
  }

  /**
   * Main physics update loop for the ship
   */
  public update(delta: number) {
    this.updateAngle(delta)
    this.updateThrust(delta)
    this.updatePosition()
  }

  private updateAngle(delta: number) {
    // Calculate shortest rotation path to target angle
    const angleDifference = this.targetAngle - this.sprite.angle
    const normalizedDifference = ((angleDifference + 180) % 360) - 180

    // Calculate distance needed to stop rotation at current velocity
    const stoppingDistance =
      (this.rotationVelocity * this.rotationVelocity) /
      (2 * ROTATION_DAMPING_FACTOR)

    // Handle rotation acceleration and deceleration
    if (Math.abs(normalizedDifference) > ROTATION_STOP_THRESHOLD) {
      if (Math.abs(normalizedDifference) > stoppingDistance) {
        this.rotationVelocity +=
          Math.sign(normalizedDifference) * ROTATION_DAMPING_FACTOR * delta
      } else {
        this.rotationVelocity *= 1 - ROTATION_DAMPING_FACTOR * delta
      }
    } else {
      this.rotationVelocity = 0
      this.sprite.angle = this.targetAngle
    }

    // Apply rotation speed limits
    this.rotationVelocity = Math.max(
      -ROTATION_SPEED,
      Math.min(ROTATION_SPEED, this.rotationVelocity)
    )
    this.sprite.angle += this.rotationVelocity
  }

  private updateThrust(delta: number) {
    const deltaSeconds = delta / 1000

    // Smooth thrust changes
    this.currentThrust = this.lerp(
      this.currentThrust,
      this.targetThrust,
      THRUST_LERP_FACTOR
    )

    // Convert ship angle to radians for thrust calculation
    const currentAngleRadians = this.getAngleRadians()
    const thrustX = Math.cos(currentAngleRadians) * ACCELERATION_SPEED
    const thrustY = Math.sin(currentAngleRadians) * ACCELERATION_SPEED

    // Apply velocity forces based on thrust level
    if (this.targetThrust > 0) {
      this.velocityX += thrustX * this.currentThrust * deltaSeconds
      this.velocityY += thrustY * this.currentThrust * deltaSeconds
    } else {
      this.velocityX *= 1 - SPEED_DECAY * deltaSeconds
      this.velocityY *= 1 - SPEED_DECAY * deltaSeconds
    }

    const currentSpeed = this.getSpeed()
    const maxSpeedForThrust = MAX_SPEED * this.targetThrust

    // Decelerate if over max speed
    if (currentSpeed > maxSpeedForThrust) {
      const scale = maxSpeedForThrust / currentSpeed

      if (this.currentThrust > this.targetThrust) {
        const lerpedScale = this.lerp(1, scale, DECEL_LERP_FACTOR)
        this.velocityX *= lerpedScale
        this.velocityY *= lerpedScale
      } else {
        this.velocityX *= scale
        this.velocityY *= scale
      }
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
