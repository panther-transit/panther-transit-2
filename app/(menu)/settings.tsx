import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

export default function SettingsHome() {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <View style={[styles.container, isDarkMode && styles.darkBackground]}>
      <Text style={[styles.title, isDarkMode ? styles.lightText : styles.darkText]}>Settings</Text>

      {/* Go to Profile Button */}
      <Pressable 
        style={[styles.button, isDarkMode ? styles.darkButton : styles.lightButton]} 
        onPress={() => router.push('/(menu)/profile')}
      >
        <Text style={[styles.buttonText, isDarkMode ? styles.darkButtonText : styles.lightButtonText]}>
          Go to Profile
        </Text>
      </Pressable>

      {/* Go to Notifications Button */}
      <Pressable 
        style={[styles.button, isDarkMode ? styles.darkButton : styles.lightButton]} 
        onPress={() => router.push('../(menu)/notifications')}
      >
        <Text style={[styles.buttonText, isDarkMode ? styles.darkButtonText : styles.lightButtonText]}>
          Notification Settings
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F8F9FA',
  },
  darkBackground: {
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  darkText: {
    color: '#000',
  },
  lightText: {
    color: '#FFF',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  lightButton: {
    backgroundColor: '#0039A6',
  },
  darkButton: {
    backgroundColor: '#555',
  },
  lightButtonText: {
    color: '#FFF',
  },
  darkButtonText: {
    color: '#FFF',
  },
});
