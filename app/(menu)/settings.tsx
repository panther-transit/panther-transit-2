import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Switch } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/themeContext';

export default function SettingsHome() {
  const { isDarkMode, toggleDarkMode, setIsDarkMode } = useTheme();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadThemePreference = async () => {
      const storedTheme = await AsyncStorage.getItem('darkMode');
      if (storedTheme !== null) {
        setIsDarkMode(storedTheme === 'true');
      }
      setLoaded(true);
    };

    loadThemePreference();
  }, []);

  if (!loaded) {
    return null; // Prevents flickering while loading
  }

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#F8F9FA' }]}>
      <Text style={[styles.title, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>Settings</Text>

      <Pressable
        style={[styles.button, isDarkMode ? styles.darkButton : styles.lightButton]}
        onPress={() => router.push('/(menu)/profile')}
      >
        <Text style={[styles.buttonText, isDarkMode ? styles.darkButtonText : styles.lightButtonText]}>
          Go to Profile
        </Text>
      </Pressable>

      <Pressable
        style={[styles.button, isDarkMode ? styles.darkButton : styles.lightButton]}
        onPress={() => router.push('/(menu)/notification')}
      >
        <Text style={[styles.buttonText, isDarkMode ? styles.darkButtonText : styles.lightButtonText]}>
          Notification Settings
        </Text>
      </Pressable>

      <View style={styles.switchContainer}>
        <Text style={[styles.switchLabel, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>Enable Dark Mode</Text>
        <Switch
          value={isDarkMode}
          onValueChange={toggleDarkMode}
          trackColor={{ false: '#767577', true: '#1E88E5' }}
          thumbColor={isDarkMode ? '#BB86FC' : '#f4f3f4'}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 20,
  },
  darkButton: {
    backgroundColor: '#333333',
  },
  lightButton: {
    backgroundColor: '#0039A6',
  },
  darkButtonText: {
    color: '#FFFFFF',
  },
  lightButtonText: {
    color: '#FFFFFF',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  switchLabel: {
    fontSize: 16,
    marginRight: 10,
  },
});
