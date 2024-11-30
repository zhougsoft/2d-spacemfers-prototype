import { useCallback, useRef } from 'react'
import PhaserContainer from './PhaserContainer'

const defaultGameState = {
  frameCount: 0,
}

const Game = () => {
  // refs can be used for state that needs to be shared between Phaser and React
  const gameState = useRef(defaultGameState)
  const textDisplay = useRef<Phaser.GameObjects.Text | null>(null)

  const onCreate = useCallback((scene: Phaser.Scene) => {
    textDisplay.current = scene.add.text(0, 0, '')
  }, [])

  const onUpdate = useCallback((scene: Phaser.Scene) => {
    const { frameCount } = gameState.current

    if (textDisplay.current) {
      textDisplay.current.setPosition(frameCount, frameCount)
      textDisplay.current.setText(`frame #: ${frameCount}`)
    }

    gameState.current.frameCount++
  }, [])

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => (gameState.current.frameCount = 0)}
        style={{ position: 'absolute', top: 0, left: 0 }}>
        reset
      </button>
      <PhaserContainer onCreate={onCreate} onUpdate={onUpdate} />
    </div>
  )
}

export default Game
