import { StyleSheet, View, Text, Image, Pressable, Animated } from 'react-native';
import { Link, router } from 'expo-router';
import { useFonts } from 'expo-font';
import { useEffect, useRef } from 'react';

export default function Index() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  const [fontsLoaded] = useFonts({
    'Montserrat-Bold': require('../assets/fonts/Montserrat-Bold.ttf'),
    'Montserrat-SemiBold': require('../assets/fonts/Montserrat-SemiBold.ttf'),
  });

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Panther Transit</Text>
        <Text style={styles.subtitle}>Your Campus Journey Made Easy</Text>
      </View>

      <Animated.View style={[styles.logoContainer, { opacity: fadeAnim }]}>
        <Image
          source={require('../assets/images/gsu-panther.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      <View style={styles.buttonContainer}>
        <Pressable 
          style={({pressed}) => [styles.button, pressed && styles.buttonPressed]}
          onPress={() => router.push('/(auth)/login')}
        >
          <Text style={styles.buttonText}>Log in</Text>
        </Pressable>

        <Pressable 
          style={({pressed}) => [styles.button, pressed && styles.buttonPressed]}
          onPress={() => router.push('/(auth)/signup')}
        >
          <Text style={styles.buttonText}>Sign up</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',  // Light gray background
    paddingHorizontal: 24,
  },
  header: {
    marginTop: '15%',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 36,
    color: '#0039A6',  // GSU Blue
    textAlign: 'center',
    textShadowColor: 'rgba(0, 57, 166, 0.15)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  logo: {
    width: 220,
    height: 220,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
    marginBottom: 40,
    paddingHorizontal: 12,
  },
  button: {
    backgroundColor: '#0039A6',  // GSU Blue
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    letterSpacing: 0.5,
  },
});
