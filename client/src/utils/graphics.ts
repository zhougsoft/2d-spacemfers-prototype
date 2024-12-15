import Phaser from 'phaser'
import { PIXELS_PER_METER } from './constants'

export const drawDebugGrid = (scene: Phaser.Scene, meters: number) => {
  // 1m grid lines
  const minorGraphics = scene.add.graphics()
  minorGraphics.lineStyle(1, 0x333333, 0.25)
  for (let x = 0; x <= meters; x += PIXELS_PER_METER) {
    minorGraphics.moveTo(x, 0)
    minorGraphics.lineTo(x, meters)
  }
  for (let y = 0; y <= meters; y += PIXELS_PER_METER) {
    minorGraphics.moveTo(0, y)
    minorGraphics.lineTo(meters, y)
  }
  minorGraphics.strokePath()

  // 10m grid lines
  const mediumInterval = 10 * PIXELS_PER_METER
  const mediumGraphics = scene.add.graphics()
  mediumGraphics.lineStyle(2, 0x666666, 0.5)
  for (let x = 0; x <= meters; x += mediumInterval) {
    mediumGraphics.moveTo(x, 0)
    mediumGraphics.lineTo(x, meters)
  }
  for (let y = 0; y <= meters; y += mediumInterval) {
    mediumGraphics.moveTo(0, y)
    mediumGraphics.lineTo(meters, y)
  }
  mediumGraphics.strokePath()

  // 100m grid lines
  const majorInterval = 100 * PIXELS_PER_METER
  const majorGraphics = scene.add.graphics()
  majorGraphics.lineStyle(3, 0xcccccc, 0.75)
  for (let x = 0; x <= meters; x += majorInterval) {
    majorGraphics.moveTo(x, 0)
    majorGraphics.lineTo(x, meters)
  }
  for (let y = 0; y <= meters; y += majorInterval) {
    majorGraphics.moveTo(0, y)
    majorGraphics.lineTo(meters, y)
  }
  majorGraphics.strokePath()
}
