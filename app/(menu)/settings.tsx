
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../context/themeContext';

export default function SettingsHome() {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <View style={[styles.container, isDarkMode && styles.darkBackground]}>
      <Text style={[styles.title, isDarkMode && styles.darkText]}>Settings</Text>

      {/* Go to Profile Button */}
      <Pressable
        style={[styles.button, isDarkMode && styles.darkButton]}
        onPress={() => router.push('/(menu)/profile')}
      >
        <Text style={[styles.buttonText, isDarkMode && styles.darkButtonText]}>
          Go to Profile
        </Text>
      </Pressable>

      {/* Go to Notifications Button - FIXED */}
      <Pressable
        style={[styles.button, isDarkMode && styles.darkButton]}
        onPress={() => router.push('/(menu)/notifications')} // 🔹 Ensure it's 'notifications' (plural)
      >
        <Text style={[styles.buttonText, isDarkMode && styles.darkButtonText]}>
          Notification Settings
        </Text>
      </Pressable>

      {/* Dark Mode Toggle */}
      <Pressable
        style={[styles.button, isDarkMode && styles.darkButton]}
        onPress={toggleDarkMode}
      >
        <Text style={[styles.buttonText, isDarkMode && styles.darkButtonText]}>
          {isDarkMode ? 'Disable Dark Mode' : 'Enable Dark Mode'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F8F9FA',
  },
  darkBackground: {
    backgroundColor: '#1E1E1E',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#0039A6',
  },
  darkText: {
    color: '#FFFFFF',
  },
  button: {
    marginVertical: 10,
    backgroundColor: '#0039A6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  darkButton: {
    backgroundColor: '#555',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  darkButtonText: {
    color: '#FFF',
  },
});
