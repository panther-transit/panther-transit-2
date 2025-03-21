import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/themeContext';

export default function NotificationsSettings() {
  const { isDarkMode } = useTheme();

  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [martaTrainAlerts, setMartaTrainAlerts] = useState(false);
  const [martaBusAlerts, setMartaBusAlerts] = useState(false);
  const [shuttleAlerts, setShuttleAlerts] = useState(false);
  const [severeWeatherAlerts, setSevereWeatherAlerts] = useState(false);
  const [campusSafetyAlerts, setCampusSafetyAlerts] = useState(false);
  const [parkingAlerts, setParkingAlerts] = useState(false); // 🆕

  useEffect(() => {
    const loadSettings = async () => {
      const keys = [
        'notificationsEnabled',
        'martaTrainAlerts',
        'martaBusAlerts',
        'shuttleAlerts',
        'severeWeatherAlerts',
        'campusSafetyAlerts',
        'parkingAlerts' // 🆕
      ];
      const values = await AsyncStorage.multiGet(keys);

      values.forEach(([key, val]) => {
        const parsed = val !== null ? JSON.parse(val) : false;
        switch (key) {
          case 'notificationsEnabled': setNotificationsEnabled(parsed); break;
          case 'martaTrainAlerts': setMartaTrainAlerts(parsed); break;
          case 'martaBusAlerts': setMartaBusAlerts(parsed); break;
          case 'shuttleAlerts': setShuttleAlerts(parsed); break;
          case 'severeWeatherAlerts': setSevereWeatherAlerts(parsed); break;
          case 'campusSafetyAlerts': setCampusSafetyAlerts(parsed); break;
          case 'parkingAlerts': setParkingAlerts(parsed); break; // 🆕
        }
      });
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

      {/* Toggles */}
      {[
        { label: 'MARTA Train Alerts', value: martaTrainAlerts, key: 'martaTrainAlerts', setter: setMartaTrainAlerts },
        { label: 'MARTA Bus Alerts', value: martaBusAlerts, key: 'martaBusAlerts', setter: setMartaBusAlerts },
        { label: 'GSU Shuttle Alerts', value: shuttleAlerts, key: 'shuttleAlerts', setter: setShuttleAlerts },
        { label: 'Severe Weather Alerts', value: severeWeatherAlerts, key: 'severeWeatherAlerts', setter: setSevereWeatherAlerts },
        { label: 'Campus Safety Alerts', value: campusSafetyAlerts, key: 'campusSafetyAlerts', setter: setCampusSafetyAlerts },
        { label: 'Parking Alerts', value: parkingAlerts, key: 'parkingAlerts', setter: setParkingAlerts }, // 🆕
      ].map(({ label, value, key, setter }) => (
        <View style={styles.settingRow} key={key}>
          <Text style={[styles.settingText, isDarkMode && styles.darkText]}>{label}</Text>
          <Switch
            value={value}
            onValueChange={(val) => toggleSetting(key, val, setter)}
            disabled={!notificationsEnabled}
          />
        </View>
      ))}

      <View style={styles.settingRow}>
        <Text style={[styles.settingText, isDarkMode && styles.darkText]}>Enable Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={(value) => toggleSetting('notificationsEnabled', value, setNotificationsEnabled)}
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
