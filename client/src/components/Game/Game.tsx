import { useCallback, useRef } from 'react'
import PhaserContainer from './PhaserContainer'

const Game = () => {
  const textRef = useRef<Phaser.GameObjects.Text | null>(null)
  const countRef = useRef(0)

  const onCreate = useCallback((scene: Phaser.Scene) => {
    textRef.current = scene.add.text(100, 100, 'check console for test')
  }, [])

  const onUpdate = useCallback((scene: Phaser.Scene) => {
    textRef.current?.setText(`count: ${countRef.current}`)
    countRef.current++
  }, [])

  return (
    <>
      <button onClick={() => (countRef.current = 0)}>reset count</button>
      <PhaserContainer onCreate={onCreate} onUpdate={onUpdate} />
    </>
  )
}

export default Game
