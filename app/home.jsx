// home.jsx
import { useState, useEffect } from 'react'
import {
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  Keyboard,
  View,
  FlatList,
  Image,
  ImageBackground,
  Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Linking from 'expo-linking'

// 👇 define a base URL once
const BASE_URL = "https://example.com/watch/"

const twoDAnime = [
  { id: '1', title: 'Naruto Shippuden', image: 'https://cdn.myanimelist.net/images/anime/1566/111305.jpg', link: 'https://9animetv.to/search?keyword=naruto' },
  { id: '2', title: 'One Piece', image: 'https://cdn.myanimelist.net/images/anime/6/73245.jpg', link: `https://9animetv.to/search?keyword=one+piece` },
  { id: '3', title: 'Attack on Titan', image: 'https://cdn.myanimelist.net/images/anime/10/47347.jpg', link: `https://9animetv.to/search?keyword=attack+on+titan` },
  { id: '4', title: 'Jujutsu Kaisen', image: 'https://cdn.myanimelist.net/images/anime/1171/109222.jpg', link: `https://9animetv.to/search?keyword=jujutsu+kaisen` },
  { id: '5', title: 'Demon Slayer', image: 'https://cdn.myanimelist.net/images/anime/1286/99889.jpg', link: `https://9animetv.to/search?keyword=demon+slayer` },
  { id: '11', title: 'Fullmetal Alchemist: Brotherhood', image: 'https://cdn.myanimelist.net/images/anime/1223/96541.jpg', link: `https://9animetv.to/watch/fullmetal-alchemist-308?ep=5791` },
  { id: '12', title: 'Death Note', image: 'https://cdn.myanimelist.net/images/anime/9/9453.jpg', link: `https://9animetv.to/search?keyword=death+note` },
  { id: '13', title: 'Bleach', image: 'https://cdn.myanimelist.net/images/anime/3/40451.jpg', link: `https://9animetv.to/search?keyword=bleach` },
  { id: '14', title: 'Dragon Ball Z', image: 'https://cdn.myanimelist.net/images/anime/1607/117271.jpg', link: `https://9animetv.to/search?keyword=dragon+ball+z` },
  { id: '15', title: 'Fairy Tail', image: 'https://cdn.myanimelist.net/images/anime/5/18179.jpg', link: `https://9animetv.to/search?keyword=fairy+tail` },
]

const threeDAnime = [
  {
    id: '21',
    title: 'Battle Through the Heavens',
    image: 'https://via.placeholder.com/150x220.png?text=Battle+Through+the+Heavens',
    link: 'https://animexin.dev/btth-season-5/'
  },
  {
    id: '22',
    title: 'Renegade Immortal',
    image: 'https://via.placeholder.com/150x220.png?text=Renegade+Immortal',
    link: 'https://animexin.dev/renegade-immortal-episode-106-indonesia-english-sub/'
  },
  {
    id: '23',
    title: 'Swallowed Stars',
    image: 'https://via.placeholder.com/150x220.png?text=Swallowed+Star',
    link: 'https://animexin.dev/swallowed-star-movie-blood-luo-continent/'
  },
  {
    id: '24',
    title: 'Soul Land',
    image: 'https://via.placeholder.com/150x220.png?text=Soul+Land',
    link: 'https://animexin.dev/?s=soul%20land'
  },
  {
    id: '25',
    title: 'Throne of Seal',
    image: 'https://via.placeholder.com/150x220.png?text=Throne+of+Seal',
    link: 'https://animexin.dev/?s=throne%20of%20seal'
  },
  {
    id: '26',
    title: 'Purple River',
    image: 'https://via.placeholder.com/150x220.png?text=Purple+River',
    link: 'https://animexin.dev/?s=purple+river'
  },
  {
    id: '27',
    title: 'Azure Legacy',
    image: 'https://via.placeholder.com/150x220.png?text=Azure+Legacy',
    link: 'https://animexin.dev/?s=demon+hunter'
  },
  {
    id: '28',
    title: 'Senior Brother',
    image: 'https://via.placeholder.com/150x220.png?text=Senior+Brother',
    link: 'https://animexin.dev/big-brother/'
  },
]

const BrowseMovies = () => {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('2D')
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [myList, setMyList] = useState([])
  const router = useRouter()

  const movies = category === '2D' ? twoDAnime : threeDAnime
  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(query.toLowerCase())
  )

  useEffect(() => {
    const loadList = async () => {
      try {
        const stored = await AsyncStorage.getItem('myList')
        if (stored) setMyList(JSON.parse(stored))
      } catch (err) {
        console.error('Error loading list:', err)
      }
    }
    loadList()
  }, [])

  const handleAddToList = async (movie) => {
    try {
      const stored = await AsyncStorage.getItem('myList')
      const current = stored ? JSON.parse(stored) : myList

      if (!current.some(m => m.id === movie.id)) {
        const updatedList = [...current, movie]
        setMyList(updatedList)
        await AsyncStorage.setItem('myList', JSON.stringify(updatedList))
      } else {
        Alert.alert('Already added', `${movie.title} is already in your list.`)
      }
    } catch (err) {
      console.error('Error saving list:', err)
      Alert.alert('Error', 'Could not add to list. See console for details.')
    }
  }

  const handleWatchNow = (movie) => {
    if (movie.link) {
      Linking.openURL(movie.link)
    } else {
      Alert.alert("No link available", "This anime does not have a watch link yet.")
    }
  }

  const confirmLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        // use inline arrow to ensure correct binding
        { text: 'Logout', style: 'destructive', onPress: () => handleLogout() },
      ],
      { cancelable: true }
    )
  }

  const handleLogout = async () => {
    try {
      // remove known keys individually (safer on some platforms)
      const keysToRemove = ['myList', 'userToken']
      await Promise.all(keysToRemove.map(k => AsyncStorage.removeItem(k)))

      // OPTIONAL: if you want to clear everything (uncomment)
      // await AsyncStorage.clear()

      setMyList([])
      console.log('Storage cleared:', keysToRemove)

      // Small confirmation for the user
      Alert.alert('Logged out', 'You have been logged out.')

      // Try a few fallback routes so the logout works regardless of which file holds your login screen.
      const possibleRoutes = ['/login', '/', '/index', '/home']
      let navigated = false
      for (const r of possibleRoutes) {
        try {
          router.replace(r)
          navigated = true
          console.log('Navigated to', r)
          break
        } catch (e) {
          console.warn('Navigation attempt failed for', r, e)
        }
      }

      // Final fallback: push '/'
      if (!navigated) {
        router.push('/')
      }
    } catch (err) {
      console.error('Logout failed:', err)
      Alert.alert('Logout failed', err?.message || 'An error occurred.')
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
        {/* Logout Button */}
        <Pressable style={styles.logoutButton} onPress={confirmLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>

        <View style={styles.card}>
          <Text style={styles.title}>Browse Anime</Text>
          <Text style={styles.subtitle}>
            Search or choose from {category === '2D' ? '2D Anime' : '3D Anime'}
          </Text>

          {/* Search bar */}
          <TextInput
            style={styles.input}
            placeholder="Search for anime..."
            placeholderTextColor="#aaa"
            value={query}
            onChangeText={setQuery}
          />

          {/* Toggle category */}
          <View style={styles.toggleContainer}>
            <Pressable
              style={[styles.toggleButton, category === '2D' && styles.activeToggle]}
              onPress={() => setCategory('2D')}
            >
              <Text style={styles.toggleText}>2D Anime</Text>
            </Pressable>
            <Pressable
              style={[styles.toggleButton, category === '3D' && styles.activeToggle]}
              onPress={() => setCategory('3D')}
            >
              <Text style={styles.toggleText}>3D Anime</Text>
            </Pressable>
          </View>

          {/* Movie grid */}
          <FlatList
            data={filteredMovies}
            keyExtractor={item => item.id}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            renderItem={({ item }) => (
              <View style={styles.movieCard}>
                <Image source={{ uri: item.image }} style={styles.movieImage} />
                <Text style={styles.movieText}>{item.title}</Text>

                <Pressable
                  style={styles.addButton}
                  onPress={() => handleAddToList(item)}
                >
                  <Text style={styles.addButtonText}>+ My List</Text>
                </Pressable>

                <Pressable
                  style={styles.watchButton}
                  onPress={() => handleWatchNow(item)}
                >
                  <Text style={styles.watchButtonText}>▶ Watch</Text>
                </Pressable>
              </View>
            )}
            style={styles.list}
          />
        </View>

        {/* Floating "My List" button */}
        <Pressable
          style={styles.myListButton}
          onPress={() => router.push('/mylist')}
        >
          <Text style={styles.myListText}>My List ({myList.length})</Text>
        </Pressable>
      </SafeAreaView>
    </ImageBackground>
  )
}

export default BrowseMovies

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
  logoutText: { color: '#fff', fontWeight: '700', fontSize: 14 },

  card: {
    width: '95%',
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
    right: 20,
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
