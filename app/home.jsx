// home.jsx
import { useState, useEffect } from 'react'
import {
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  View,
  FlatList,
  Image,
  ImageBackground,
  Alert,
  Platform,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Linking from 'expo-linking'

// Firebase
import { auth, db } from '../firebaseConfig'
import { signOut, onAuthStateChanged } from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'

// 🔹 Hoverable button (adds hover style on web)
export const HoverableButton = ({ style, hoverStyle, children, ...props }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Pressable
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      style={[style, isHovered && hoverStyle]}
      {...props}
    >
      {children}
    </Pressable>
  )
}

const twoDAnime = [
  { id: '1', title: 'Naruto Shippuden', image: 'https://th.bing.com/th/id/OIP.A8PLHsjNOCYCJnc9kPu5VgHaKs?w=115&h=180&c=7&r=0&o=7&pid=1.7&rm=3', link: 'https://9animetv.to/search?keyword=naruto' },
  { id: '2', title: 'One Piece', image: 'https://cdn.myanimelist.net/images/anime/6/73245.jpg', link: 'https://9animetv.to/search?keyword=one+piece' },
  { id: '3', title: 'Attack on Titan', image: 'https://cdn.myanimelist.net/images/anime/10/47347.jpg', link: 'https://9animetv.to/search?keyword=attack+on+titan' },
  { id: '4', title: 'Jujutsu Kaisen', image: 'https://cdn.myanimelist.net/images/anime/1171/109222.jpg', link: 'https://9animetv.to/search?keyword=jujutsu+kaisen' },
  { id: '5', title: 'Demon Slayer', image: 'https://cdn.myanimelist.net/images/anime/1286/99889.jpg', link: 'https://9animetv.to/search?keyword=demonslayer' },
]

const threeDAnime = [
  { id: '21', title: 'Battle Through the Heavens', image: 'https://animexin.dev/wp-content/uploads/2024/10/BTTH-S5-Ax.jpg', link: 'https://animexin.dev/btth-season-5/' },
  { id: '22', title: 'Renegade Immortal', image: 'https://animexin.dev/wp-content/uploads/2023/09/renegade-immortal-AX-HD.jpg', link: 'https://animexin.dev/renegade-immortal-episode-106-indonesia-english-sub/' },
]

const BrowseMovies = () => {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('2D')
  const [myList, setMyList] = useState([])
  const [isSigningOut, setIsSigningOut] = useState(false)
  const router = useRouter()

  const movies = category === '2D' ? twoDAnime : threeDAnime
  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(query.toLowerCase())
  )

  // 🔹 Listen to auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user ? 'User logged in' : 'User logged out')
      if (!user && !isSigningOut) {
        console.log('No user detected, redirecting to login')
        router.replace('/')
      }
    })
    return () => unsubscribe()
  }, [router, isSigningOut])

  // 🔹 Load My List
  useEffect(() => {
    const loadList = async () => {  
      try {
        const user = auth.currentUser
        if (!user) return
        const userDocRef = doc(db, 'users', user.uid)
        const userDoc = await getDoc(userDocRef)
        if (userDoc.exists()) {
          const list = userDoc.data().myList || []
          setMyList(list)
          await AsyncStorage.setItem('myList', JSON.stringify(list))
        } else setMyList([])
      } catch (err) {
        console.error('Error loading Firestore list:', err)
      }
    }
    loadList()
  }, [])

  const handleAddToList = async (movie) => {
    try {
      const user = auth.currentUser
      if (!user) {
        Alert.alert('Not logged in', 'You must be signed in to save to My List.')
        return
      }
      const userDocRef = doc(db, 'users', user.uid)
      const userDoc = await getDoc(userDocRef)
      let currentList = userDoc.exists() ? userDoc.data().myList || [] : []
      if (currentList.some(m => m.id === movie.id)) {
        Alert.alert('Already added', `${movie.title} is already in your list.`)
        return
      }
      const updatedList = [...currentList, movie]
      await setDoc(userDocRef, { myList: updatedList }, { merge: true })
      setMyList(updatedList)
      await AsyncStorage.setItem('myList', JSON.stringify(updatedList))
      Alert.alert('Added', `${movie.title} was added to your list.`)
    } catch (err) {
      console.error('Error saving to Firestore:', err)
      Alert.alert('Error', 'Could not add to list.')
    }
  }

  const handleWatchNow = (movie) => {
    if (movie.link) Linking.openURL(movie.link)
    else Alert.alert('No link available', 'This anime does not have a watch link yet.')
  }

  const confirmLogout = () => {
    console.log('Logout button clicked!')
    if (isSigningOut) {
      console.log('Already signing out, ignoring click')
      return
    }
    
    // For web, use window.confirm instead of Alert.alert
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Are you sure you want to logout?')
      if (confirmed) {
        handleLogout()
      } else {
        console.log('Logout cancelled')
      }
    } else {
      Alert.alert(
        'Logout',
        'Are you sure you want to logout?',
        [
          { text: 'Cancel', style: 'cancel', onPress: () => console.log('Logout cancelled') },
          { text: 'Logout', style: 'destructive', onPress: handleLogout },
        ],
        { cancelable: true }
      )
    }
  }

  const handleLogout = async () => {
    console.log('handleLogout called!')
    setIsSigningOut(true)
    try {
      console.log('Starting logout process...')
      
      // Sign out from Firebase first
      await signOut(auth)
      console.log('Firebase signout successful')
      
      // Clear local storage
      await AsyncStorage.multiRemove(['myList', 'userToken'])
      console.log('AsyncStorage cleared')
      
      // Reset local state
      setMyList([])
      console.log('Local state reset')
      
      // Navigate to login
      router.replace('/')
      console.log('Navigation completed')
      
      // Show success message
      setTimeout(() => {
        if (Platform.OS === 'web') {
          alert('Successfully logged out')
        } else {
          Alert.alert('Success', 'You have been logged out successfully.')
        }
      }, 100)
      
    } catch (err) {
      console.error('Logout failed:', err)
      if (Platform.OS === 'web') {
        alert('Logout Error: ' + (err?.message || 'An error occurred during logout. Please try again.'))
      } else {
        Alert.alert(
          'Logout Error', 
          err?.message || 'An error occurred during logout. Please try again.',
          [{ text: 'OK' }]
        )
      }
    } finally {
      setIsSigningOut(false)
      console.log('Logout process completed')
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
        {/* 🔹 Logout */}
        <HoverableButton
          style={[styles.logoutButton, isSigningOut && styles.logoutButtonDisabled]}
          hoverStyle={{ backgroundColor: '#e60000' }}
          onPress={confirmLogout}
          disabled={isSigningOut}
        >
          <Text style={styles.logoutText}>
            {isSigningOut ? 'Logging out...' : 'Logout'}
          </Text>
        </HoverableButton>

        <View style={styles.card}>
          <Text style={styles.title}>Browse Anime</Text>
          <Text style={styles.subtitle}>
            Search or choose from {category === '2D' ? '2D Anime' : '3D Anime'}
          </Text>

          {/* Search */}
          <TextInput
            style={styles.input}
            placeholder="Search for anime..."
            placeholderTextColor="#aaa"
            value={query}
            onChangeText={setQuery}
          />

          {/* Toggle */}
          <View style={styles.toggleContainer}>
            <HoverableButton
              style={[styles.toggleButton, category === '2D' && styles.activeToggle]}
              hoverStyle={{ backgroundColor: '#21cc8d' }}
              onPress={() => setCategory('2D')}
            >
              <Text style={styles.toggleText}>2D Anime</Text>
            </HoverableButton>
            <HoverableButton
              style={[styles.toggleButton, category === '3D' && styles.activeToggle]}
              hoverStyle={{ backgroundColor: '#21cc8d' }}
              onPress={() => setCategory('3D')}
            >
              <Text style={styles.toggleText}>3D Anime</Text>
            </HoverableButton>
          </View>

          {/* Movies */}
          <FlatList
            data={filteredMovies}
            keyExtractor={item => item.id}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            renderItem={({ item }) => (
              <View style={styles.movieCard}>
                <Image source={{ uri: item.image }} style={styles.movieImage} />
                <Text style={styles.movieText}>{item.title}</Text>

                <HoverableButton
                  style={styles.addButton}
                  hoverStyle={{ backgroundColor: '#1aa36d' }}
                  onPress={() => handleAddToList(item)}
                >
                  <Text style={styles.addButtonText}>+ My List</Text>
                </HoverableButton>

                <HoverableButton
                  style={styles.watchButton}
                  hoverStyle={{ backgroundColor: '#3385ff' }}
                  onPress={() => handleWatchNow(item)}
                >
                  <Text style={styles.watchButtonText}>▶ Watch</Text>
                </HoverableButton>
              </View>
            )}
            style={styles.list}
          />
        </View>

        {/* Floating Feedback button (bottom-left) */}
        <HoverableButton
          style={styles.feedbackButton}
          hoverStyle={{ backgroundColor: '#1aa3ff' }}
          onPress={() => router.push('/feedback')}
        >
          <Text style={styles.feedbackText}>💬 Feedback</Text>
        </HoverableButton>

        {/* Floating My List button (bottom-right) */}
        <HoverableButton
          style={styles.myListButton}
          hoverStyle={{ backgroundColor: '#1aa36d' }}
          onPress={() => router.push('/mylist')}
        >
          <Text style={styles.myListText}>My List ({myList.length})</Text>
        </HoverableButton>
      </SafeAreaView>
    </ImageBackground>
  )
}

export default BrowseMovies

// Styles
const styles = StyleSheet.create({
  background: { flex: 1, width: '100%', height: '100%' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  logoutButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#ff4d4d',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    zIndex: 9999,
  },
  logoutButtonDisabled: { backgroundColor: '#c86a6a', opacity: 0.9 },
  logoutText: { color: '#fff', fontWeight: '700', fontSize: 14 },

  feedbackButton: {
    position: 'absolute',
    bottom: 30,
    left: 20, // ⬅️ bottom-left
    backgroundColor: '#4da6ff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    elevation: 5,
    zIndex: 9999,
  },
  feedbackText: { color: 'white', fontWeight: '700', fontSize: 14 },

  card: {
    width: '90%',
    padding: 15,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: { fontSize: 14, color: '#ccc', marginBottom: 20, textAlign: 'center' },
  input: {
    width: '100%',
    backgroundColor: '#111',
    color: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 5,
    borderRadius: 8,
    backgroundColor: '#333',
  },
  activeToggle: { backgroundColor: '#21cc8d' },
  toggleText: { color: '#fff', fontWeight: '600' },

  list: { maxHeight: 350, marginBottom: 20 },
  movieCard: {
    width: '48%',
    marginBottom: 15,
    backgroundColor: '#1f1f1f',
    borderRadius: 12,
    alignItems: 'center',
    padding: 10,
  },
  movieImage: { width: 120, height: 170, borderRadius: 8, marginBottom: 8 },
  movieText: { color: 'white', fontSize: 14, textAlign: 'center' },

  addButton: {
    marginTop: 6,
    backgroundColor: '#21cc8d',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  addButtonText: { color: 'white', fontWeight: '600', fontSize: 12 },

  watchButton: {
    marginTop: 6,
    backgroundColor: '#4da6ff',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  watchButtonText: { color: 'white', fontWeight: '600', fontSize: 12 },

  myListButton: {
    position: 'absolute',
    bottom: 30,
    right: 20, // ⬅️ bottom-right
    backgroundColor: '#21cc8d',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    elevation: 5,
  },
  myListText: { color: 'white', fontWeight: '700', fontSize: 14 },
})