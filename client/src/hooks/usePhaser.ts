import Phaser from 'phaser'
import { useEffect, useRef } from 'react'

export { default as Phaser } from 'phaser'

export const usePhaser = (config: Phaser.Types.Core.GameConfig) => {
  const phaserRef = useRef<Phaser.Game | null>(null)

  useEffect(() => {
    phaserRef.current = new Phaser.Game(config)
    return () => {
      phaserRef.current?.destroy(true)
    }
  }, [])

  return { phaser: phaserRef.current }
}
