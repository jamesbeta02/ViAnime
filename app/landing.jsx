import { StyleSheet, Text, Pressable, View, ImageBackground } from 'react-native';
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
        <Text style={styles.logo}>ViAnime</Text>
        <Text style={styles.tagline}>Your gateway to unlimited anime streaming</Text>

        <Pressable style={styles.button} onPress={() => router.push('/signup')}>
          <Text style={styles.buttonText}>Get Started</Text>
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
  logo: { fontSize: 42, fontWeight: '900', color: '#fff', marginBottom: 10, textAlign: 'center', letterSpacing: 2 },
  tagline: { fontSize: 16, color: '#ccc', marginBottom: 40, textAlign: 'center' },
  button: { backgroundColor: '#21cc8d', paddingVertical: 14, paddingHorizontal: 50, borderRadius: 30, marginBottom: 20 },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 18 },
  linkText: { color: '#ddd', textAlign: 'center', fontSize: 14 },
  highlight: { color: '#ff758c', fontWeight: '700' },
});
