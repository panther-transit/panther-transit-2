import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Switch } from 'react-native';
import { router } from 'expo-router';

export default function SettingsHome() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle Dark Mode (only for session)
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkBackground]}>
      <Text style={[styles.title, isDarkMode ? styles.lightText : styles.darkText]}>Settings</Text>

      {/* App Configuration Section */}
      <View style={[styles.section, isDarkMode && styles.darkSection]}>
        <Text style={[styles.sectionTitle, isDarkMode ? styles.lightText : styles.darkText]}>App Configuration</Text>
        <View style={styles.optionRow}>
          <Text style={[styles.optionText, isDarkMode ? styles.lightText : styles.darkText]}>Dark Mode</Text>
          <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
        </View>
      </View>

      {/* Navigation Section */}
      <View style={[styles.section, isDarkMode && styles.darkSection]}>
        <Text style={[styles.sectionTitle, isDarkMode ? styles.lightText : styles.darkText]}>Navigation</Text>
        <Pressable 
          style={[styles.button, isDarkMode ? styles.darkButton : styles.lightButton]} 
          onPress={() => router.push('/(menu)/profile')}
        >
          <Text style={[styles.buttonText, isDarkMode ? styles.darkButtonText : styles.lightButtonText]}>
            Go to Profile
          </Text>
        </Pressable>
      </View>
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
  section: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#EEE',
  },
  darkSection: {
    backgroundColor: '#333', // Darker background for better contrast
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  optionText: {
    fontSize: 16,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
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
