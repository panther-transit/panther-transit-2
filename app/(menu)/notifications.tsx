import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/themeContext';

export default function NotificationsSettings() {
  const { isDarkMode } = useTheme();
  
  // State for toggles
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [transitAlerts, setTransitAlerts] = useState(false);
  const [weatherAlerts, setWeatherAlerts] = useState(false);

  // Load saved settings from AsyncStorage
  useEffect(() => {
    const loadSettings = async () => {
      const savedNotifications = await AsyncStorage.getItem('notificationsEnabled');
      const savedTransitAlerts = await AsyncStorage.getItem('transitAlerts');
      const savedWeatherAlerts = await AsyncStorage.getItem('weatherAlerts');

      if (savedNotifications !== null) setNotificationsEnabled(JSON.parse(savedNotifications));
      if (savedTransitAlerts !== null) setTransitAlerts(JSON.parse(savedTransitAlerts));
      if (savedWeatherAlerts !== null) setWeatherAlerts(JSON.parse(savedWeatherAlerts));
    };

    loadSettings();
  }, []);

  // Save settings to AsyncStorage when toggled
  const toggleSetting = async (settingKey: string, value: boolean, setter: (value: boolean) => void) => {
    setter(value);
    await AsyncStorage.setItem(settingKey, JSON.stringify(value));
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkBackground]}>
      <Text style={[styles.title, isDarkMode && styles.darkText]}>Notification Settings</Text>

      {/* Master Toggle */}
      <View style={styles.settingRow}>
        <Text style={[styles.settingText, isDarkMode && styles.darkText]}>Enable Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={(value) => toggleSetting('notificationsEnabled', value, setNotificationsEnabled)}
        />
      </View>

      {/* Transit Alerts */}
      <View style={styles.settingRow}>
        <Text style={[styles.settingText, isDarkMode && styles.darkText]}>Transit Alerts</Text>
        <Switch
          value={transitAlerts}
          onValueChange={(value) => toggleSetting('transitAlerts', value, setTransitAlerts)}
          disabled={!notificationsEnabled} // Disables when notifications are off
        />
      </View>

      {/* Weather Alerts */}
      <View style={styles.settingRow}>
        <Text style={[styles.settingText, isDarkMode && styles.darkText]}>Weather Alerts</Text>
        <Switch
          value={weatherAlerts}
          onValueChange={(value) => toggleSetting('weatherAlerts', value, setWeatherAlerts)}
          disabled={!notificationsEnabled} // Disables when notifications are off
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
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
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E1E1',
  },
  settingText: {
    fontSize: 16,
    color: '#333',
  },
});

