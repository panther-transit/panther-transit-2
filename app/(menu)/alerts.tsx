import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { api } from '../utils/api';

// Define the structure of a weather alert
type WeatherAlert = {
  type: string;
  severity: string; // Using string instead of enum for flexibility
  title: string;
  message: string;
  time: string;
  expires: string;
};

export default function AlertsHome() {
  const [activeTab, setActiveTab] = useState('weather');
  const [weatherAlerts, setWeatherAlerts] = useState<WeatherAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchWeatherAlerts = async () => {
    try {
      setLoading(true);
      const alerts = await api.weather.getGSUWeatherAlerts();
      setWeatherAlerts(alerts);
    } catch (error) {
      console.error('Error fetching weather alerts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchWeatherAlerts();
  };

  useEffect(() => {
    fetchWeatherAlerts();
  }, []);

  // Get appropriate icon for alert type
  const getAlertIcon = (alertType: string) => {
    switch (alertType) {
      case 'high-temperature':
        return { icon: 'thermometer-high', color: '#ff9500' };
      case 'low-temperature':
        return { icon: 'thermometer-low', color: '#0080ff' };
      case 'high-wind':
        return { icon: 'weather-windy', color: '#ff9500' };
      case 'heavy-rain':
        return { icon: 'weather-pouring', color: '#0080ff' };
      case 'uv-exposure':
        return { icon: 'weather-sunny-alert', color: '#ff9500' };
      case 'thunderstorm':
        return { icon: 'weather-lightning', color: '#ff3b30' };
      case 'snow':
        return { icon: 'weather-snowy', color: '#0080ff' };
      case 'freezing-rain':
        return { icon: 'weather-snowy-rainy', color: '#ff3b30' };
      case 'fog':
        return { icon: 'weather-fog', color: '#a0a0a0' };
      case 'precipitation':
        return { icon: 'umbrella', color: '#0080ff' };
      case 'all-clear':
        return { icon: 'check-circle', color: '#34c759' };
      case 'system-error':
        return { icon: 'alert-circle', color: '#ff3b30' };
      default:
        return { icon: 'information', color: '#007aff' };
    }
  };

  // Get color for alert severity
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'info':
        return '#007aff';
      case 'advisory':
        return '#ff9500';
      case 'warning':
        return '#ff3b30';
      case 'error':
        return '#ff2d55';
      default:
        return '#007aff';
    }
  };

  // Format timestamp to readable date
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Alerts</Text>
      </View>
      
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
      </View>
      
      <View style={styles.content}>
        {activeTab === 'weather' ? (
          <ScrollView 
            style={styles.alertsList}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {loading && !refreshing ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0039A6" />
                <Text style={styles.loadingText}>Loading alerts...</Text>
              </View>
            ) : weatherAlerts.length > 0 ? (
              weatherAlerts.map((alert, index) => {
                const { icon, color } = getAlertIcon(alert.type);
                const severityColor = getSeverityColor(alert.severity);
                
                return (
                  <View key={index} style={styles.alertCard}>
                    <View style={styles.alertIconContainer}>
                      <MaterialCommunityIcons name={icon as any} size={28} color={color} />
                    </View>
                    <View style={styles.alertContent}>
                      <Text style={styles.alertTitle}>{alert.title}</Text>
                      <Text style={styles.alertMessage}>{alert.message}</Text>
                      <View style={styles.alertMeta}>
                        <View style={[styles.severityBadge, { backgroundColor: severityColor }]}>
                          <Text style={styles.severityText}>{alert.severity.toUpperCase()}</Text>
                        </View>
                        <Text style={styles.alertTime}>Updated {formatTime(alert.time)}</Text>
                      </View>
                    </View>
                  </View>
                );
              })
            ) : (
              <View style={styles.emptyContainer}>
                <MaterialCommunityIcons name="weather-sunny" size={50} color="#999" />
                <Text style={styles.emptyText}>No weather alerts at this time</Text>
              </View>
            )}
          </ScrollView>
        ) : activeTab === 'campus' ? (
          <View style={styles.placeholderContainer}>
            <Ionicons name="school-outline" size={60} color="#999" />
            <Text style={styles.placeholderText}>Campus alerts coming soon</Text>
          </View>
        ) : (
          <View style={styles.placeholderContainer}>
            <Ionicons name="bus-outline" size={60} color="#999" />
            <Text style={styles.placeholderText}>Transit alerts coming soon</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#0039A6',
    paddingTop: 60,
    paddingBottom: 15,
    paddingHorizontal: 20,
    width: '100%',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Montserrat-Bold',
    color: '#fff',
    textAlign: 'left',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E1E1',
    width: '100%',
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 8,
  },
  activeTabButton: {
    backgroundColor: '#f0f5ff',
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Montserrat-Medium',
    color: '#666',
    marginLeft: 6,
  },
  activeTabText: {
    color: '#0039A6',
    fontFamily: 'Montserrat-SemiBold',
  },
  content: {
    flex: 1,
    width: '100%',
  },
  alertsList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
    color: '#666',
  },
  alertCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  alertIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F0F5FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
    color: '#333',
    marginBottom: 4,
  },
  alertMessage: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  alertMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  severityText: {
    fontSize: 10,
    fontFamily: 'Montserrat-Bold',
    color: '#fff',
  },
  alertTime: {
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    color: '#999',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
    color: '#666',
    textAlign: 'center',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
    color: '#666',
    textAlign: 'center',
  },
  welcome: {
    fontSize: 24,
    fontFamily: 'Montserrat-Bold',
    color: '#0039A6',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Montserrat-SemiBold',
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#0039A6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
  },
});
