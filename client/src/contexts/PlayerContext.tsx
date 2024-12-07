import { createContext, useContext, type ReactNode } from 'react'

// player id is hardcoded for dev/testing purposes
const PLAYER_ID = 1

interface PlayerContextProps {
  playerId: number
}

const PlayerContext = createContext<PlayerContextProps>(
  {} as PlayerContextProps
)

export const usePlayerContext = () => useContext(PlayerContext)

export const PlayerProvider = ({
  children,
}: {
  children: ReactNode | ReactNode[]
}) => {
  return (
    <PlayerContext.Provider value={{ playerId: PLAYER_ID }}>
      {children}
    </PlayerContext.Provider>
  )
}
