import { useState } from 'react'
import { StyleSheet, Text, TextInput, Pressable, Keyboard, View, ImageBackground, Alert, Image } from 'react-native'
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

    // ✅ Show success alert
    Alert.alert('Login Successful', `Welcome back, ${userCredential.user.email}!`)

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
        {/* 🔥 Round Logo */}
        <Image source={require('../assets/logo.png')} style={styles.logoImage} />

        {/* 🔥 Title + Tagline */}
        
        <Text style={styles.tagline}>Welcome back! Log in to continue watching</Text>

        <View style={styles.card}>
          <Text style={styles.formTitle}>Log In</Text>

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

          {/* 🔥 Button with hover/press swap */}
          <Pressable
            onPress={handleLogin}
            style={({ hovered, pressed }) => [
              styles.button,
              (hovered || pressed) && { backgroundColor: '#fff' }, // white on hover/press
            ]}
          >
            {({ hovered, pressed }) => (
              <Text
                style={[
                  styles.buttonText,
                  (hovered || pressed) && { color: '#21cc8d' }, // green text on hover/press
                ]}
              >
                Log In
              </Text>
            )}
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

  /* 🔥 Round Logo Styling */
  logoImage: {
    width: 140,
    height: 140,
    borderRadius: 70,     // makes it perfectly round
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 3,       // optional outline
    borderColor: '#21cc8d',
    resizeMode: 'cover',
  },

 
  
  tagline: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 30,
    textAlign: 'center',
  },

  card: {
    width: '80%',
    padding: 20,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  formTitle: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '700',
    marginBottom: 15,
    textAlign: 'center',
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
    paddingVertical: 14,
    backgroundColor: '#21cc8d', // ✅ default green
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#21cc8d',
  },
  buttonText: {
    color: '#fff', // ✅ default white text
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
