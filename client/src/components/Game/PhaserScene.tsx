import Phaser from 'phaser'
import { useEffect, useRef } from 'react'

const PHASER_CONTAINER_ID = 'phaser'
const PHASER_CONTAINER_STYLES = { width: '100vw', height: '100vh' }

const createPhaserConfig = (
  parent: string,
  onPreload: (scene: Phaser.Scene) => void,
  onCreate: (scene: Phaser.Scene) => void,
  onUpdate: (scene: Phaser.Scene) => void
) => {
  class Scene extends Phaser.Scene {
    constructor() {
      super('MainScene')
    }

    preload() {
      onPreload(this)
    }

    create() {
      onCreate(this)
    }

    update() {
      onUpdate(this)
    }
  }

  const phaserConfig: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    scale: {
      mode: Phaser.Scale.RESIZE,
      width: '100%',
      height: '100%',
      parent,
    },
    physics: {
      default: 'arcade',
      arcade: { debug: false },
    },
    input: { mouse: true },
    backgroundColor: '#000000',
    scene: Scene,
  }

  return phaserConfig
}

const usePhaser = (config: Phaser.Types.Core.GameConfig) => {
  const phaserRef = useRef<Phaser.Game | null>(null)

  useEffect(() => {
    phaserRef.current = new Phaser.Game(config)
    return () => {
      phaserRef.current?.destroy(true)
    }
  }, [])

  return { phaser: phaserRef.current }
}

interface PhaserSceneProps {
  onPreload: (scene: Phaser.Scene) => void
  onCreate: (scene: Phaser.Scene) => void
  onUpdate: (scene: Phaser.Scene) => void
}

const PhaserScene = ({ onPreload, onCreate, onUpdate }: PhaserSceneProps) => {
  usePhaser(
    createPhaserConfig(PHASER_CONTAINER_ID, onPreload, onCreate, onUpdate)
  )
  return <div id={PHASER_CONTAINER_ID} style={PHASER_CONTAINER_STYLES}></div>
}

export default PhaserScene
