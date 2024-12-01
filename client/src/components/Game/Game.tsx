import { useCallback, useRef, useState } from 'react'
import shipImage from '../../assets/ship.png'
import PhaserContainer from './PhaserContainer'

const MAP_SIZE = 10000
const LINE_SPACING = 10

const SHIP_ROTATION_SPEED = 1

const drawGrid = (graphics: Phaser.GameObjects.Graphics) => {
  graphics.lineStyle(1, 0x222222)

  // draw vertical lines
  for (let x = 0; x <= MAP_SIZE; x += LINE_SPACING) {
    graphics.moveTo(x, 0)
    graphics.lineTo(x, MAP_SIZE)
  }

  // draw horizontal lines
  for (let y = 0; y <= MAP_SIZE; y += LINE_SPACING) {
    graphics.moveTo(0, y)
    graphics.lineTo(MAP_SIZE, y)
  }

  graphics.strokePath()
}

const Game = () => {
  const [reloadKey, setReloadKey] = useState(0)

  const shipRef = useRef<Phaser.GameObjects.Image>()
  const targetAngleRef = useRef(0)

  const alignShip = (angle: number) => {
    targetAngleRef.current = angle
  }

  const onPreload = useCallback((scene: Phaser.Scene) => {
    scene.load.image('ship', shipImage)
  }, [])

  const onCreate = useCallback((scene: Phaser.Scene) => {
    // add stuff to the scene
    drawGrid(scene.add.graphics())
    const shipImage = scene.add.image(MAP_SIZE / 2, MAP_SIZE / 2, 'ship')
    shipImage.setScale(0.5)
    shipRef.current = shipImage

    // camera setup
    scene.cameras.main.setBackgroundColor('#000000')
    scene.cameras.main.setZoom(1)
    scene.cameras.main.startFollow(shipRef.current, false)
  }, [])

  const onUpdate = useCallback((scene: Phaser.Scene) => {
    if (shipRef.current) {
      const currentAngle = shipRef.current.angle
      const angleDiff = targetAngleRef.current - currentAngle
      const normalizedDiff = ((angleDiff + 180) % 360) - 180

      // rotate the ship to the target angle
      if (Math.abs(normalizedDiff) > SHIP_ROTATION_SPEED) {
        shipRef.current.angle += Math.sign(normalizedDiff) * SHIP_ROTATION_SPEED
      } else {
        shipRef.current.angle = targetAngleRef.current
      }
    }
  }, [])

  return (
    <div style={{ position: 'relative' }}>
      <button
        style={{ position: 'absolute', top: 0, left: 0 }}
        onClick={() => setReloadKey(prev => prev + 1)}>
        RELOAD
      </button>
      <div style={{ position: 'absolute', bottom: 100, right: 100 }}>
        <button onClick={() => alignShip(0)}>⬆️</button>
        <button onClick={() => alignShip(180)}>⬇️</button>
        <button onClick={() => alignShip(270)}>⬅️</button>
        <button onClick={() => alignShip(90)}>➡️</button>
      </div>
      <PhaserContainer
        key={reloadKey}
        onPreload={onPreload}
        onCreate={onCreate}
        onUpdate={onUpdate}
      />
    </div>
  )
}

export default Game
