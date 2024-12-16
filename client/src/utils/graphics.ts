import Phaser from 'phaser'
import { PIXELS_PER_METER } from './constants'

export const createDebugGridTexture = (
  scene: Phaser.Scene,
  meters: number,
  textureKey: string
) => {
  // Create an offscreen graphics object
  const graphics = scene.make.graphics({ x: 0, y: 0 }, false)

  // Draw 1m lines
  graphics.lineStyle(1, 0x333333, 0.25)
  graphics.beginPath()
  for (let x = 0; x <= meters; x += PIXELS_PER_METER) {
    graphics.moveTo(x, 0)
    graphics.lineTo(x, meters)
  }
  for (let y = 0; y <= meters; y += PIXELS_PER_METER) {
    graphics.moveTo(0, y)
    graphics.lineTo(meters, y)
  }
  graphics.strokePath()

  // Draw 10m lines
  const mediumInterval = 10 * PIXELS_PER_METER
  graphics.lineStyle(2, 0x666666, 0.5)
  graphics.beginPath()
  for (let x = 0; x <= meters; x += mediumInterval) {
    graphics.moveTo(x, 0)
    graphics.lineTo(x, meters)
  }
  for (let y = 0; y <= meters; y += mediumInterval) {
    graphics.moveTo(0, y)
    graphics.lineTo(meters, y)
  }
  graphics.strokePath()

  // Draw 100m lines
  const majorInterval = 100 * PIXELS_PER_METER
  graphics.lineStyle(3, 0xcccccc, 0.75)
  graphics.beginPath()
  for (let x = 0; x <= meters; x += majorInterval) {
    graphics.moveTo(x, 0)
    graphics.lineTo(x, meters)
  }
  for (let y = 0; y <= meters; y += majorInterval) {
    graphics.moveTo(0, y)
    graphics.lineTo(meters, y)
  }
  graphics.strokePath()

  graphics.generateTexture(textureKey, meters, meters)
  graphics.destroy()
}
