// notifications.tsx
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/themeContext';

export default function NotificationsSettings() {
  const { isDarkMode } = useTheme();
  
  // State for toggles
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [martaTrainAlerts, setMartaTrainAlerts] = useState(false);
  const [martaBusAlerts, setMartaBusAlerts] = useState(false);
  const [shuttleAlerts, setShuttleAlerts] = useState(false);
  const [severeWeatherAlerts, setSevereWeatherAlerts] = useState(false);
  const [campusSafetyAlerts, setCampusSafetyAlerts] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      const savedNotifications = await AsyncStorage.getItem('notificationsEnabled');
      const savedTrainAlerts = await AsyncStorage.getItem('martaTrainAlerts');
      const savedBusAlerts = await AsyncStorage.getItem('martaBusAlerts');
      const savedShuttleAlerts = await AsyncStorage.getItem('shuttleAlerts');
      const savedWeatherAlerts = await AsyncStorage.getItem('severeWeatherAlerts');
      const savedSafetyAlerts = await AsyncStorage.getItem('campusSafetyAlerts');

      if (savedNotifications !== null) setNotificationsEnabled(JSON.parse(savedNotifications));
      if (savedTrainAlerts !== null) setMartaTrainAlerts(JSON.parse(savedTrainAlerts));
      if (savedBusAlerts !== null) setMartaBusAlerts(JSON.parse(savedBusAlerts));
      if (savedShuttleAlerts !== null) setShuttleAlerts(JSON.parse(savedShuttleAlerts));
      if (savedWeatherAlerts !== null) setSevereWeatherAlerts(JSON.parse(savedWeatherAlerts));
      if (savedSafetyAlerts !== null) setCampusSafetyAlerts(JSON.parse(savedSafetyAlerts));
    };
    loadSettings();
  }, []);

  const toggleSetting = async (key, value, setter) => {
    setter(value);
    await AsyncStorage.setItem(key, JSON.stringify(value));
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkBackground]}>
      <Text style={[styles.title, isDarkMode && styles.darkText]}>Notification Settings</Text>

      <View style={styles.settingRow}>
        <Text style={[styles.settingText, isDarkMode && styles.darkText]}>Enable Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={(value) => toggleSetting('notificationsEnabled', value, setNotificationsEnabled)}
        />
      </View>
      
      <View style={styles.settingRow}>
        <Text style={[styles.settingText, isDarkMode && styles.darkText]}>MARTA Train Alerts</Text>
        <Switch
          value={martaTrainAlerts}
          onValueChange={(value) => toggleSetting('martaTrainAlerts', value, setMartaTrainAlerts)}
          disabled={!notificationsEnabled}
        />
      </View>

      <View style={styles.settingRow}>
        <Text style={[styles.settingText, isDarkMode && styles.darkText]}>MARTA Bus Alerts</Text>
        <Switch
          value={martaBusAlerts}
          onValueChange={(value) => toggleSetting('martaBusAlerts', value, setMartaBusAlerts)}
          disabled={!notificationsEnabled}
        />
      </View>

      <View style={styles.settingRow}>
        <Text style={[styles.settingText, isDarkMode && styles.darkText]}>GSU Shuttle Alerts</Text>
        <Switch
          value={shuttleAlerts}
          onValueChange={(value) => toggleSetting('shuttleAlerts', value, setShuttleAlerts)}
          disabled={!notificationsEnabled}
        />
      </View>

      <View style={styles.settingRow}>
        <Text style={[styles.settingText, isDarkMode && styles.darkText]}>Severe Weather Alerts</Text>
        <Switch
          value={severeWeatherAlerts}
          onValueChange={(value) => toggleSetting('severeWeatherAlerts', value, setSevereWeatherAlerts)}
          disabled={!notificationsEnabled}
        />
      </View>

      <View style={styles.settingRow}>
        <Text style={[styles.settingText, isDarkMode && styles.darkText]}>Campus Safety Alerts</Text>
        <Switch
          value={campusSafetyAlerts}
          onValueChange={(value) => toggleSetting('campusSafetyAlerts', value, setCampusSafetyAlerts)}
          disabled={!notificationsEnabled}
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
