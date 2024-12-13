/**
 * Creates a starfield background using sprites
 * @param scene Phaser scene to add stars to
 * @param mapSize Size of the map in pixels
 */
export const drawStarfieldBackground = (
  scene: Phaser.Scene,
  mapSize: number
) => {
  const SMALL_STAR_COUNT = 5000
  const MEDIUM_STAR_COUNT = 250
  const LARGE_STAR_COUNT = 100

  // Create multiple star textures
  const createStarTexture = (name: string, size: number, color: number) => {
    const graphics = scene.add.graphics()
    graphics.clear()
    graphics.fillStyle(color)
    graphics.fillCircle(size / 2, size / 2, size / 2)
    graphics.generateTexture(name, size, size)
    graphics.destroy()
  }

  // Generate different star types
  createStarTexture('smallStar', 4, 0xcccccc)
  createStarTexture('mediumStar', 8, 0xffffff)
  createStarTexture('largeStar', 12, 0xfff4e8)

  // Add small stars
  for (let i = 0; i < SMALL_STAR_COUNT; i++) {
    const x = Math.random() * mapSize
    const y = Math.random() * mapSize
    const star = scene.add.sprite(x, y, 'smallStar')
    star.setAlpha(Math.random() * 0.7 + 0.6)
    star.setScale(Math.random() * 0.7 + 0.3)
  }

  // Add medium stars
  for (let i = 0; i < MEDIUM_STAR_COUNT; i++) {
    const x = Math.random() * mapSize
    const y = Math.random() * mapSize
    const star = scene.add.sprite(x, y, 'mediumStar')
    star.setAlpha(Math.random() * 0.7 + 0.6)
    star.setScale(Math.random() * 0.5 + 0.6)
  }

  // Add large stars
  for (let i = 0; i < LARGE_STAR_COUNT; i++) {
    const x = Math.random() * mapSize
    const y = Math.random() * mapSize
    const star = scene.add.sprite(x, y, 'largeStar')
    star.setAlpha(0.5)
    star.setScale(Math.random() * 0.5 + 0.8)
  }
}

/**
 * Draws the game world grid
 * @param graphics Phaser graphics object to draw with
 * @param mapSize Size of the map in pixels
 * @param lineSpacing Spacing between grid lines in pixels
 */
export const drawMapGrid = (
  scene: Phaser.Scene,
  mapSize: number,
  lineSpacing: number
) => {
  const graphics = scene.add.graphics()
  graphics.lineStyle(2, 0x333333, 0.25)

  // Draw vertical lines
  for (let x = 0; x <= mapSize; x += lineSpacing) {
    graphics.moveTo(x, 0)
    graphics.lineTo(x, mapSize)
  }

  // Draw horizontal lines
  for (let y = 0; y <= mapSize; y += lineSpacing) {
    graphics.moveTo(0, y)
    graphics.lineTo(mapSize, y)
  }

  graphics.strokePath()
}
