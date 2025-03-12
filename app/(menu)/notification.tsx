import { View, Text, StyleSheet, Switch, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';

export default function NotificationsSettings() {
  const { isDarkMode } = useTheme(); // Access Dark Mode state
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);

  return (
    <View style={[styles.container, isDarkMode && styles.darkBackground]}>
      <Text style={[styles.title, isDarkMode ? styles.lightText : styles.darkText]}>
        Notification Settings
      </Text>

      {/* Push Notifications Toggle */}
      <View style={[styles.section, isDarkMode && styles.darkSection]}>
        <Text style={[styles.optionText, isDarkMode ? styles.lightText : styles.darkText]}>
          Push Notifications
        </Text>
        <Switch
          value={pushNotifications}
          onValueChange={setPushNotifications}
        />
      </View>

      {/* Email Notifications Toggle */}
      <View style={[styles.section, isDarkMode && styles.darkSection]}>
        <Text style={[styles.optionText, isDarkMode ? styles.lightText : styles.darkText]}>
          Email Notifications
        </Text>
        <Switch
          value={emailNotifications}
          onValueChange={setEmailNotifications}
        />
      </View>

      {/* Save Button */}
      <Pressable style={[styles.button, isDarkMode ? styles.darkButton : styles.lightButton]}>
        <Text style={[styles.buttonText, isDarkMode ? styles.darkButtonText : styles.lightButtonText]}>
          Save Changes
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
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#EEE',
  },
  darkSection: {
    backgroundColor: '#333',
  },
  optionText: {
    fontSize: 16,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
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
