import { useState, useEffect } from 'react'
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  Pressable, 
  Image, 
  ImageBackground 
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Linking from 'expo-linking'
import { useRouter } from 'expo-router'

// 🔹 Firebase
import { auth, db } from '../firebaseConfig'
import { doc, setDoc } from 'firebase/firestore'

const MyList = () => {
  const [myList, setMyList] = useState([])
  const router = useRouter()

  // Load saved list
  useEffect(() => {
    const loadList = async () => {
      try {
        const stored = await AsyncStorage.getItem('myList')
        if (stored) {
          let parsed = JSON.parse(stored)
          // Ensure each movie has a default link
          parsed = parsed.map(m => ({
            ...m,
            link: m.link || `https://example.com/watch/${m.id}`
          }))
          setMyList(parsed)
        }
      } catch (err) {
        console.error('Error loading list:', err)
      }
    }
    loadList()
  }, [])

  // Save list (local + Firestore)
  const saveList = async (list) => {
    try {
      setMyList(list)
      await AsyncStorage.setItem('myList', JSON.stringify(list))

      const user = auth.currentUser
      if (user) {
        const userDocRef = doc(db, 'users', user.uid)
        await setDoc(userDocRef, { myList: list }, { merge: true })
      }
    } catch (err) {
      console.error('Error saving list:', err)
    }
  }

  const handleRemove = (id) => {
    const updatedList = myList.filter(m => m.id !== id)
    saveList(updatedList)
  }

  const handleWatch = (movie) => {
    if (movie.link && movie.link.trim() !== "") {
      Linking.openURL(movie.link)
    } else {
      alert("No link available for this anime.")
    }
  }

  return (
    <ImageBackground
      source={require('../assets/background.gif')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <SafeAreaView style={styles.container}>
        
        {/* Back Button */}
        <Pressable style={styles.backButton} onPress={() => router.push('/home')}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>

        <Text style={styles.title}>My List</Text>

        {myList.length === 0 ? (
          <Text style={styles.emptyText}>Your list is empty. Add some anime!</Text>
        ) : (
          <FlatList
            data={myList}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.movieCard}>
                <Pressable style={styles.movieInfo} onPress={() => handleWatch(item)}>
                  <Image 
                    source={{ uri: item.image }} 
                    style={styles.movieImage} 
                    onError={() => console.log(`Image failed to load: ${item.title}`)}
                  />
                  <Text style={styles.movieText}>{item.title}</Text>
                </Pressable>

                <View style={styles.actions}>
                  <Pressable style={styles.removeButton} onPress={() => handleRemove(item.id)}>
                    <Text style={styles.removeText}>Remove</Text>
                  </Pressable>
                </View>
              </View>
            )}
          />
        )}
      </SafeAreaView>
    </ImageBackground>
  )
}

export default MyList

const styles = StyleSheet.create({
  background: { flex: 1, width: '100%', height: '100%' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },
  container: { flex: 1, padding: 16 },
  backButton: { alignSelf: 'flex-start', marginBottom: 10, padding: 6 },
  backText: { color: '#21cc8d', fontSize: 16, fontWeight: '600' },
  title: { fontSize: 26, fontWeight: '700', color: '#fff', marginBottom: 20, textAlign: 'center' },
  emptyText: { color: '#ccc', textAlign: 'center', marginTop: 50, fontSize: 16 },
  movieCard: { backgroundColor: 'rgba(0,0,0,0.7)', padding: 10, marginBottom: 12, borderRadius: 10 },
  movieInfo: { flexDirection: 'row', alignItems: 'center' },
  movieImage: { width: 60, height: 90, borderRadius: 6, marginRight: 12 },
  movieText: { color: 'white', fontSize: 16, flexShrink: 1 },
  actions: { flexDirection: 'row', marginTop: 8, justifyContent: 'flex-end' },
  removeButton: { backgroundColor: '#ff4d4d', padding: 6, borderRadius: 6 },
  removeText: { color: 'white', fontWeight: '600' },
})
