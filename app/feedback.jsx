// feedback.jsx
import { useState } from 'react'
import {
  StyleSheet,
  Text,
  TextInput,
  Alert,
  Platform,
  View,
  ImageBackground,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { HoverableButton } from './home'

// Firebase
import { auth, db } from '../firebaseConfig'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

export default function Feedback() {
  const [feedback, setFeedback] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      Alert.alert('Empty Feedback', 'Please enter your feedback before submitting.')
      return
    }

    try {
      setLoading(true)
      const user = auth.currentUser
      const feedbackRef = collection(db, 'feedback')
      await addDoc(feedbackRef, {
        userId: user ? user.uid : 'guest',
        text: feedback,
        createdAt: serverTimestamp(),
      })
      setFeedback('')
      if (Platform.OS === 'web') {
        alert('Thank you for your feedback!')
      } else {
        Alert.alert('Success', 'Thank you for your feedback!')
      }
      router.back()
    } catch (err) {
      console.error('Error submitting feedback:', err)
      Alert.alert('Error', 'Could not submit feedback. Please try again.')
    } finally {
      setLoading(false)
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
        <Text style={styles.title}>💬 Feedback</Text>
        <TextInput
          style={styles.input}
          placeholder="Type your feedback here..."
          placeholderTextColor="#aaa"
          multiline
          numberOfLines={6}
          value={feedback}
          onChangeText={setFeedback}
        />
        <HoverableButton
          style={styles.submitButton}
          hoverStyle={{ backgroundColor: '#1aa36d' }}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitText}>
            {loading ? 'Sending...' : 'Submit Feedback'}
          </Text>
        </HoverableButton>
      </SafeAreaView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  background: { flex: 1, width: '100%', height: '100%' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#111',
    color: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
    padding: 12,
    height: 120,
    textAlignVertical: 'top',
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: '#21cc8d',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignSelf: 'flex-start',
  },
  submitText: { color: 'white', fontWeight: '700', fontSize: 14 },
})
