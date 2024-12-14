import Phaser from 'phaser'

export const drawDebugGrid = (
  scene: Phaser.Scene,
  mapSize: number,
  pixelsPerMeter: number
) => {
  // Draw the smallest scale first so that larger scale lines appear on top.

  // 1m grid lines (minor)
  const minorGraphics = scene.add.graphics()
  minorGraphics.lineStyle(1, 0x333333, 0.25)
  for (let x = 0; x <= mapSize; x += pixelsPerMeter) {
    minorGraphics.moveTo(x, 0)
    minorGraphics.lineTo(x, mapSize)
  }
  for (let y = 0; y <= mapSize; y += pixelsPerMeter) {
    minorGraphics.moveTo(0, y)
    minorGraphics.lineTo(mapSize, y)
  }
  minorGraphics.strokePath()

  // 10m grid lines (intermediate)
  const mediumInterval = 10 * pixelsPerMeter
  const mediumGraphics = scene.add.graphics()
  mediumGraphics.lineStyle(2, 0x666666, 0.5)
  for (let x = 0; x <= mapSize; x += mediumInterval) {
    mediumGraphics.moveTo(x, 0)
    mediumGraphics.lineTo(x, mapSize)
  }
  for (let y = 0; y <= mapSize; y += mediumInterval) {
    mediumGraphics.moveTo(0, y)
    mediumGraphics.lineTo(mapSize, y)
  }
  mediumGraphics.strokePath()

  // 100m grid lines (major)
  const majorInterval = 100 * pixelsPerMeter
  const majorGraphics = scene.add.graphics()
  majorGraphics.lineStyle(3, 0xcccccc, 0.75)
  for (let x = 0; x <= mapSize; x += majorInterval) {
    majorGraphics.moveTo(x, 0)
    majorGraphics.lineTo(x, mapSize)
  }
  for (let y = 0; y <= mapSize; y += majorInterval) {
    majorGraphics.moveTo(0, y)
    majorGraphics.lineTo(mapSize, y)
  }
  majorGraphics.strokePath()
}
