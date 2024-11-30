import { Phaser, usePhaser } from '../../hooks/usePhaser'

const PHASER_CONTAINER_ID = 'phaser'

const getConfig = (
  parent: string,
  onCreate: (scene: Phaser.Scene) => void,
  onUpdate: (scene: Phaser.Scene) => void
) => {
  class MainScene extends Phaser.Scene {
    constructor() {
      super('MainScene')
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
    scene: [MainScene],
  }

  return phaserConfig
}

interface PhaserContainerProps {
  onCreate: (scene: Phaser.Scene) => void
  onUpdate: (scene: Phaser.Scene) => void
}

const PhaserContainer = ({ onCreate, onUpdate }: PhaserContainerProps) => {
  usePhaser(getConfig(PHASER_CONTAINER_ID, onCreate, onUpdate))
  return (
    <div
      id={PHASER_CONTAINER_ID}
      style={{ width: '100vw', height: '100vh' }}></div>
  )
}

export default PhaserContainer
