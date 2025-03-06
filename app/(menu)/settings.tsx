import { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';

export default function SettingsHome() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <View style={[styles.container, darkMode ? styles.darkContainer : null]}>
      <Text style={[styles.title, darkMode ? styles.darkText : null]}>Settings</Text>

      {/* Navigate to Profile */}
      <Pressable 
        style={styles.button} 
        onPress={() => router.push('/(menu)/profile')}
      >
        <Text style={styles.buttonText}>Go to Profile</Text>
      </Pressable>

      {/* Toggle Dark Mode */}
      <Pressable 
        style={styles.button} 
        onPress={() => setDarkMode(!darkMode)}
      >
        <Text style={styles.buttonText}>{darkMode ? 'Disable' : 'Enable'} Dark Mode</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F8F9FA',
  },
  darkContainer: {
    backgroundColor: '#333', // Dark mode background
  },
  title: {
    fontSize: 24,
    fontFamily: 'Montserrat-Bold',
    color: '#0039A6',
    marginBottom: 20,
    textAlign: 'center',
  },
  darkText: {
    color: '#fff', // Text color for dark mode
  },
  button: {
    backgroundColor: '#0039A6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 15,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
  },
});
