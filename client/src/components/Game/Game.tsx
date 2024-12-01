import { useCallback, useRef, useState } from 'react'
import shipImage from '../../assets/ship.png'
import PhaserContainer from './PhaserContainer'

const MAP_SIZE = 1000
const LINE_SPACING = 10

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

  const onPreload = useCallback((scene: Phaser.Scene) => {
    scene.load.image('ship', shipImage)
  }, [])

  const onCreate = useCallback((scene: Phaser.Scene) => {
    // add stuff to the scene
    drawGrid(scene.add.graphics())
    shipRef.current = scene.add.image(MAP_SIZE / 2, MAP_SIZE / 2, 'ship')

    // camera setup
    scene.cameras.main.setBackgroundColor('#000000')
    scene.cameras.main.setZoom(1)
    scene.cameras.main.startFollow(shipRef.current, true)
  }, [])

  const onUpdate = useCallback((scene: Phaser.Scene) => {
    // move the ship upwards
    if (shipRef.current) {
      shipRef.current.y -= 1
    }
  }, [])

  return (
    <div style={{ position: 'relative' }}>
      <button
        style={{ position: 'absolute', top: 0, left: 0 }}
        onClick={() => setReloadKey(prev => prev + 1)}>
        RELOAD
      </button>
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
