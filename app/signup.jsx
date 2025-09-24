import { useState } from 'react'
import { StyleSheet, Text, TextInput, Pressable, Keyboard, View, ImageBackground, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "../firebaseConfig"

const Signup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const router = useRouter()

  const handleSignup = async () => {
    Keyboard.dismiss()
    if (password !== confirmPassword) {
      alert('Passwords do not match!')
      return
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password)
      alert("Account created successfully! Please log in.")
      router.push('/login') // go to login after signup
    } catch (error) {
      console.log(error.message)
      alert(error.message)
    }
  }

  return (
    <ImageBackground
      source={require('../assets/background.gif')} // background gif
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <SafeAreaView style={styles.container}>
        {/* 🔥 Round Logo */}
        <Image source={require('../assets/logo.png')} style={styles.logoImage} />

        {/* Landing Page Header */}
       
        <Text style={styles.tagline}>Your gateway to unlimited anime streaming</Text>

        <View style={styles.card}>
          {/* Signup Inputs */}
          <Text style={styles.formTitle}>Create Account</Text>
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
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#aaa"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          {/* Button with hover + press */}
          <Pressable 
            onPress={handleSignup} 
            style={({ hovered, pressed }) => [
              styles.button,
              (hovered || pressed) && { backgroundColor: '#fff' }, // white when hover/press
            ]}
          >
            {({ hovered, pressed }) => (
              <Text
                style={[
                  styles.buttonText,
                  (hovered || pressed) && { color: '#21cc8d' }, // green text on hover/press
                ]}
              >
                Sign Up
              </Text>
            )}
          </Pressable>

          {/* Redirect to Login */}
          <Pressable onPress={() => router.push('/login')}>
            <Text style={styles.linkText}>
              Already have an account? <Text style={styles.highlight}>Log In</Text>
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </ImageBackground>
  )
}

export default Signup

const styles = StyleSheet.create({
  background: { flex: 1, width: '100%', height: '100%' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },

  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  /* 🔥 Round Logo Styling */
  logoImage: {
    width: 140,
    height: 140,
    borderRadius: 70,     // round shape
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 3,
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
    padding: 25,
    borderRadius: 16,
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
    width: '80%',
    backgroundColor: '#111',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#333',
    fontSize: 14,
    alignSelf: 'center',
  },

  button: {
    width: '80%',
    marginTop: 15,
    paddingVertical: 14,
    backgroundColor: '#21cc8d', // default green background
    borderRadius: 8,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#21cc8d',    // green outline
  },
  buttonText: {
    color: '#fff',             // white text by default
    fontWeight: '500',
    fontSize: 16,
    textAlign: 'center',
  },

  linkText: {
    color: '#ddd',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
  },
  highlight: {
    color: '#ff758c',
    fontWeight: '700',
  },
})
