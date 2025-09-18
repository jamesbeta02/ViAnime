import { addDoc, collection } from "firebase/firestore"
import { createContext, useState } from "react"
import { db } from "../firebaseConfig"

export const ViAnimeContext = createContext()

export function ViAnimeProvider({ children }) {
  const [viAnimes, setViAnimes] = useState([])

  async function fetchViAnimes() {
  }
 
  async function createViAnime(viAnimeData) {
    console.log(viAnimeData)
    await addDoc(collection(db, 'vianimes'), viAnimeData)
  }

  async function deleteViAnime() {
  }

  async function updateViAnime() {
  }

  return (
    <ViAnimeContext.Provider
      value={{ viAnimes, fetchViAnimes, createViAnime, deleteViAnime, updateViAnime }}
    >
      {children}
    </ViAnimeContext.Provider>
  )
}
