import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator, RefreshControl 
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../utils/api';
import { fetchMartaBusData } from '../utils/martaAPI';
import { useTheme } from '../context/themeContext';

export default function AlertsHome() {
  const { isDarkMode } = useTheme();
  
  const [activeTab, setActiveTab] = useState('weather');
  const [weatherAlerts, setWeatherAlerts] = useState([]);
  const [transitAlerts, setTransitAlerts] = useState([]);
  const [campusAlerts, setCampusAlerts] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const [alertsEnabled, setAlertsEnabled] = useState({
    weather: false,
    martaBus: false,
    martaTrain: false,
    gsuShuttle: false,
    campusSafety: false
  });

  // Load user preferences from notifications.tsx
  useEffect(() => {
    const loadPreferences = async () => {
      const weather = await AsyncStorage.getItem('weatherAlerts');
      const martaBus = await AsyncStorage.getItem('martaBusAlerts');
      const martaTrain = await AsyncStorage.getItem('martaTrainAlerts');
      const gsuShuttle = await AsyncStorage.getItem('gsuShuttleAlerts');
      const campusSafety = await AsyncStorage.getItem('campusSafetyAlerts');
      
      setAlertsEnabled({
        weather: JSON.parse(weather) || false,
        martaBus: JSON.parse(martaBus) || false,
        martaTrain: JSON.parse(martaTrain) || false,
        gsuShuttle: JSON.parse(gsuShuttle) || false,
        campusSafety: JSON.parse(campusSafety) || false,
      });
    };

    loadPreferences();
  }, []);

  // Fetch alerts based on preferences
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

  return (
    <View style={[styles.container, isDarkMode && styles.darkBackground]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, isDarkMode && styles.darkText]}>Alerts</Text>
      </View>

      {/* Tab Selection */}
      <View style={styles.tabContainer}>
        <Pressable 
          style={[styles.tabButton, activeTab === 'weather' && styles.activeTabButton]}
          onPress={() => setActiveTab('weather')}
        >
          <Ionicons 
            name="cloud" 
            size={20} 
            color={activeTab === 'weather' ? '#0039A6' : '#666'} 
          />
          <Text style={[styles.tabText, activeTab === 'weather' && styles.activeTabText]}>Weather</Text>
        </Pressable>
        
        <Pressable 
          style={[styles.tabButton, activeTab === 'transit' && styles.activeTabButton]}
          onPress={() => setActiveTab('transit')}
        >
          <Ionicons 
            name="bus" 
            size={20} 
            color={activeTab === 'transit' ? '#0039A6' : '#666'} 
          />
          <Text style={[styles.tabText, activeTab === 'transit' && styles.activeTabText]}>Transit</Text>
        </Pressable>
        
        <Pressable 
          style={[styles.tabButton, activeTab === 'campus' && styles.activeTabButton]}
          onPress={() => setActiveTab('campus')}
        >
          <Ionicons 
            name="school" 
            size={20} 
            color={activeTab === 'campus' ? '#0039A6' : '#666'} 
          />
          <Text style={[styles.tabText, activeTab === 'campus' && styles.activeTabText]}>Campus</Text>
        </Pressable>
      </View>

      {/* Content Area */}
      <View style={styles.content}>
        <ScrollView 
          style={styles.alertsList}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {loading ? (
            <ActivityIndicator size="large" color="#0039A6" />
          ) : (
            activeTab === 'weather' ? weatherAlerts.map((alert, index) => (
              <View key={index} style={styles.alertCard}>
                <MaterialCommunityIcons name="weather-lightning" size={24} color="red" />
                <Text style={styles.alertText}>{alert.title}: {alert.message}</Text>
              </View>
            )) : activeTab === 'transit' ? transitAlerts.map((bus, index) => (
              <View key={index} style={styles.alertCard}>
                <MaterialCommunityIcons name="bus" size={24} color="blue" />
                <Text style={styles.alertText}>{bus.route}: {bus.latitude}, {bus.longitude}</Text>
              </View>
            )) : campusAlerts.map((alert, index) => (
              <View key={index} style={styles.alertCard}>
                <MaterialCommunityIcons name="school" size={24} color="green" />
                <Text style={styles.alertText}>{alert.title}: {alert.message}</Text>
              </View>
            ))
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
  },
  tabButton: {
    paddingVertical: 8,
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#0039A6',
  },
  tabText: {
    fontSize: 16,
  },
  activeTabText: {
    fontWeight: 'bold',
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
  },
});
