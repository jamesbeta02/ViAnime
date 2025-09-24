import { addDoc, collection } from "firebase/firestore"
import { createContext, useState, useEffect } from "react"
import { auth, db } from "../firebaseConfig"
import { signOut, onAuthStateChanged } from "firebase/auth"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useRouter } from "expo-router"

export const ViAnimeContext = createContext()

export function ViAnimeProvider({ children }) {
  const [viAnimes, setViAnimes] = useState([])
  const [user, setUser] = useState(null)
  const router = useRouter()

  // ✅ Watch auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u)
      if (!u) {
        router.replace("/login") // kick out to login if signed out
      }
    })
    return () => unsubscribe()
  }, [router])

  // ==============================
  // 🔹 CRUD FUNCTIONS
  // ==============================

  async function fetchViAnimes() {
    // TODO: load from Firestore
  }

  async function createViAnime(viAnimeData) {
    console.log("Creating ViAnime:", viAnimeData)
    await addDoc(collection(db, "vianimes"), viAnimeData)
  }

  async function deleteViAnime() {
    // TODO
  }

  async function updateViAnime() {
    // TODO
  }

  // ==============================
  // 🔹 LOGOUT FUNCTION
  // ==============================
  async function logout() {
    try {
      await signOut(auth)
      await AsyncStorage.multiRemove(["myList", "userToken"])
      setViAnimes([])
      setUser(null)
      router.replace("/login")
    } catch (err) {
      console.error("❌ Logout failed:", err)
    }
  }

  return (
    <ViAnimeContext.Provider
      value={{
        viAnimes,
        fetchViAnimes,
        createViAnime,
        deleteViAnime,
        updateViAnime,
        user,
        logout, // ✅ expose logout
      }}
    >
      {children}
    </ViAnimeContext.Provider>
  )
}
