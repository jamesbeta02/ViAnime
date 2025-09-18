import { useContext } from "react"
import { ViAnimeContext } from "../contexts/ViAnimeContext"

export function useViAnime() {
  const context = useContext(ViAnimeContext)

  if (!context) {
    throw new Error(`Outside the scope of the ViAnime Provider.`)
  }

  return context
}
