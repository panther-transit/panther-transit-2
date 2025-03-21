import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, Pressable, ScrollView,
  ActivityIndicator, RefreshControl
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/themeContext';
import { api } from '../utils/api';
import { fetchMartaBusData } from '../utils/martaAPI';

export default function AlertsHome() {
  const { isDarkMode } = useTheme();

  const [activeTab, setActiveTab] = useState('weather');
  const [weatherAlerts, setWeatherAlerts] = useState([]);
  const [transitAlerts, setTransitAlerts] = useState([]);
  const [campusAlerts, setCampusAlerts] = useState([]);
  const [parkingAlerts, setParkingAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [alertsEnabled, setAlertsEnabled] = useState({
    weather: false,
    martaBus: false,
    martaTrain: false,
    gsuShuttle: false,
    campusSafety: false,
    parking: false,
  });

  useEffect(() => {
    const loadPreferences = async () => {
      const keys = [
        'weatherAlerts',
        'martaBusAlerts',
        'martaTrainAlerts',
        'shuttleAlerts',
        'campusSafetyAlerts',
        'parkingAlerts',
      ];
      const values = await AsyncStorage.multiGet(keys);
      const prefs = { ...alertsEnabled };

      values.forEach(([key, val]) => {
        if (val !== null) {
          const parsed = JSON.parse(val);
          if (key === 'weatherAlerts') prefs.weather = parsed;
          if (key === 'martaBusAlerts') prefs.martaBus = parsed;
          if (key === 'martaTrainAlerts') prefs.martaTrain = parsed;
          if (key === 'shuttleAlerts') prefs.gsuShuttle = parsed;
          if (key === 'campusSafetyAlerts') prefs.campusSafety = parsed;
          if (key === 'parkingAlerts') prefs.parking = parsed;
        }
      });

      setAlertsEnabled(prefs);
    };

    loadPreferences();
  }, []);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      if (alertsEnabled.weather) {
        const weather = await api.weather.getGSUWeatherAlerts();
        setWeatherAlerts(weather);
      }

      if (alertsEnabled.martaBus || alertsEnabled.martaTrain || alertsEnabled.gsuShuttle) {
        const transit = await fetchMartaBusData();
        setTransitAlerts(transit);
      }

      if (alertsEnabled.campusSafety) {
        setCampusAlerts([{ title: 'Campus Alert', message: 'Test campus safety alert' }]);
      }

      if (alertsEnabled.parking) {
        // Use mock data here for parking alerts
        setParkingAlerts([
          { title: 'K Deck', message: 'Only 5 spots left!' },
          { title: 'M Deck', message: 'Full – try another deck.' },
        ]);
      }
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [alertsEnabled]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAlerts();
  };

  const renderAlerts = () => {
    switch (activeTab) {
      case 'weather':
        return weatherAlerts.map((alert, index) => (
          <View key={index} style={styles.alertCard}>
            <MaterialCommunityIcons name="weather-lightning" size={24} color="red" />
            <Text style={styles.alertText}>{alert.title}: {alert.message}</Text>
          </View>
        ));
      case 'transit':
        return transitAlerts.map((bus, index) => (
          <View key={index} style={styles.alertCard}>
            <MaterialCommunityIcons name="bus" size={24} color="blue" />
            <Text style={styles.alertText}>{bus.route}: {bus.latitude}, {bus.longitude}</Text>
          </View>
        ));
      case 'campus':
        return campusAlerts.map((alert, index) => (
          <View key={index} style={styles.alertCard}>
            <MaterialCommunityIcons name="school" size={24} color="green" />
            <Text style={styles.alertText}>{alert.title}: {alert.message}</Text>
          </View>
        ));
      case 'parking':
        return parkingAlerts.map((alert, index) => (
          <View key={index} style={styles.alertCard}>
            <MaterialCommunityIcons name="parking" size={24} color="#888" />
            <Text style={styles.alertText}>{alert.title}: {alert.message}</Text>
          </View>
        ));
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkBackground]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, isDarkMode && styles.darkText]}>Alerts</Text>
      </View>

      <View style={styles.tabContainer}>
        {['weather', 'transit', 'campus', 'parking'].map((tab) => (
          <Pressable
            key={tab}
            style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
            onPress={() => setActiveTab(tab)}
          >
            <Ionicons
              name={tab === 'weather' ? 'cloud' : tab === 'transit' ? 'bus' : tab === 'campus' ? 'school' : 'car'}
              size={20}
              color={activeTab === tab ? '#0039A6' : '#666'}
            />
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.content}>
        <ScrollView
          style={styles.alertsList}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {loading ? (
            <ActivityIndicator size="large" color="#0039A6" />
          ) : (
            renderAlerts()
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  darkBackground: {
    backgroundColor: '#1E1E1E',
  },
  header: {
    backgroundColor: '#0039A6',
    paddingTop: 60,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  darkText: {
    color: '#FFFFFF',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  tabButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#0039A6',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    fontWeight: 'bold',
    color: '#0039A6',
  },
  content: {
    flex: 1,
  },
  alertsList: {
    padding: 20,
  },
  alertCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
  },
  alertText: {
    fontSize: 14,
    color: '#333',
  },
});
