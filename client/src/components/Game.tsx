import { useEffect } from 'react'
import { Phaser, usePhaser } from '../hooks/usePhaser'

const CONTAINER_ID = 'game'

class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene')
  }

  create() {
    console.log('create()')
  }

  update() {
    console.log('update()')
  }
}

const phaserConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.RESIZE,
    parent: CONTAINER_ID,
    width: '100%',
    height: '100%',
  },
  physics: {
    default: 'arcade',
    arcade: { debug: false },
  },
  input: { mouse: true },
  backgroundColor: '#000000',
  scene: [MainScene],
}

const Game = () => {
  const { phaser } = usePhaser(phaserConfig)

  useEffect(() => {
    if (!phaser) return
    console.log('phaser mounted:', phaser)
  })

  return (
    <div id={CONTAINER_ID} style={{ width: '100vw', height: '100vh' }}></div>
  )
}

export default Game
