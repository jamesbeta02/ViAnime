import { useState } from 'react'
import { StyleSheet, Text, TextInput, Pressable, Keyboard, View, ImageBackground, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebaseConfig' // 👈 import Firebase auth

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleLogin = async () => {
    Keyboard.dismiss()
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      console.log("User logged in:", userCredential.user)
      router.push('/home') // ✅ redirect after login
    } catch (error) {
      console.error(error)
      Alert.alert('Login Failed', error.message)
    }
  }

  return (
    <ImageBackground
      source={require('../assets/background.gif')} // 👈 same animated background
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <SafeAreaView style={styles.container}>
        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#aaa"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <Pressable onPress={handleLogin} style={styles.button}>
            <Text style={styles.buttonText}>Log In</Text>
          </Pressable>

          <Pressable onPress={() => router.push('/signup')}>
            <Text style={styles.linkText}>
              Don’t have an account? <Text style={styles.highlight}>Sign Up</Text>
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </ImageBackground>
  )
}

export default Login

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '40%',
    padding: 20,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  input: {
    width: '100%',
    backgroundColor: '#111',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#333',
    fontSize: 14,
  },
  button: {
    marginTop: 15,
    paddingVertical: 12,
    backgroundColor: '#21cc8d',
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  linkText: {
    color: '#ddd',
    textAlign: 'center',
    marginTop: 15,
    fontSize: 13,
  },
  highlight: {
    color: '#21cc8d',
    fontWeight: '600',
  },
})
