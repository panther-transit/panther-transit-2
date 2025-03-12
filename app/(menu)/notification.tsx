import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/themeContext';

export default function NotificationsSettings() {
  const { isDarkMode } = useTheme();
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);

  useEffect(() => {
    const loadNotificationPreference = async () => {
      const storedNotifications = await AsyncStorage.getItem('notificationsEnabled');
      if (storedNotifications !== null) {
        setIsNotificationsEnabled(storedNotifications === 'true');
      }
    };
    loadNotificationPreference();
  }, []);

  const toggleNotifications = async () => {
    const newStatus = !isNotificationsEnabled;
    setIsNotificationsEnabled(newStatus);
    await AsyncStorage.setItem('notificationsEnabled', newStatus.toString());
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#FFFFFF' }]}>
      <View style={styles.contentContainer}>
        <Text style={[styles.title, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>Notification Settings</Text>

        <View style={styles.switchContainer}>
          <Text style={[styles.switchLabel, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
            Enable Notifications
          </Text>
          <Switch
            value={isNotificationsEnabled}
            onValueChange={toggleNotifications}
            trackColor={{ false: '#767577', true: '#1E88E5' }}
            thumbColor={isNotificationsEnabled ? '#BB86FC' : '#f4f3f4'}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  contentContainer: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
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
