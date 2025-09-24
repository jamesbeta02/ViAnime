import { StyleSheet, Text, Pressable, View, ImageBackground, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function LandingPage() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require('../assets/background.gif')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <SafeAreaView style={styles.container}>
        {/* 🔥 Logo Image */}
        <Image source={require('../assets/logo.png')} style={styles.logoImage} />

        <Text style={styles.tagline}>Your gateway to unlimited anime streaming</Text>

        {/* 🔥 Button with hover + press */}
        <Pressable
          onPress={() => router.push('/signup')}
          style={({ hovered, pressed }) => [
            styles.button,
            (hovered || pressed) && { backgroundColor: '#fff' }, // white when hover/press
          ]}
        >
          {({ hovered, pressed }) => (
            <Text
              style={[
                styles.buttonText,
                (hovered || pressed) && { color: '#21cc8d' }, // green text when hover/press
              ]}
            >
              Get Started
            </Text>
          )}
        </Pressable>

        <Pressable onPress={() => router.push('/login')}>
          <Text style={styles.linkText}>
            Already have an account? <Text style={styles.highlight}>Log In</Text>
          </Text>
        </Pressable>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, width: '100%', height: '100%' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  /* 🔥 New Logo Styling */
  logoImage: {
    width: 160,
    height: 160,
    borderRadius: 80,   // round
    overflow: 'hidden',
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#21cc8d',
    resizeMode: 'cover',
  },

  tagline: { fontSize: 16, color: '#ccc', marginBottom: 40, textAlign: 'center' },

  button: {
    backgroundColor: '#21cc8d',
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 30,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#21cc8d',
  },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 18 },
  linkText: { color: '#ddd', textAlign: 'center', fontSize: 14 },
  highlight: { color: '#ff758c', fontWeight: '700' },
});
