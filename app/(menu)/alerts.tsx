import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { MaterialCommunityIcons, Ionicons, FontAwesome } from '@expo/vector-icons';
import { api } from '../utils/api';
import { useAppTheme } from '@/hooks/useAppTheme';

// Define the structure of a weather alert
type WeatherAlert = {
  type: string;
  severity: string; // Using string instead of enum for flexibility
  title: string;
  message: string;
  time: string;
  expires: string;
};

// Define the structure of a transit alert
type TransitAlert = {
  id: string;
  routeId: string;
  routeName: string;
  type: string;
  severity: string;
  title: string;
  message: string;
  time: string;
  expires: string;
  affectedStops?: string[];
};

export default function AlertsHome() {
  const [activeTab, setActiveTab] = useState('weather');
  const [weatherAlerts, setWeatherAlerts] = useState<WeatherAlert[]>([]);
  const [transitAlerts, setTransitAlerts] = useState<TransitAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { isDarkMode, colors } = useAppTheme();

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

  const fetchTransitAlerts = async () => {
    try {
      setLoading(true);
      // Mock data for transit alerts
      const mockTransitAlerts: TransitAlert[] = [
        {
          id: 'ta-001',
          routeId: 'blue',
          routeName: 'Blue Route',
          type: 'delay',
          severity: 'warning',
          title: 'Significant Delays on Blue Route',
          message: 'Due to construction on Decatur St, Blue Route buses are experiencing delays of 15-20 minutes. Please plan accordingly.',
          time: new Date().toISOString(),
          expires: new Date(new Date().setHours(23, 59, 59, 999)).toISOString(),
          affectedStops: ['Student Center', 'Piedmont North', 'Centennial Hall']
        },
        {
          id: 'ta-002',
          routeId: 'green',
          routeName: 'Green Route',
          type: 'route-change',
          severity: 'info',
          title: 'Green Route Detour',
          message: 'Green Route buses are temporarily rerouted via Peachtree Street due to road work on Courtland St. Expect slight delays.',
          time: new Date().toISOString(),
          expires: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(),
          affectedStops: ['College of Law', 'Aderhold Learning Center']
        },
        {
          id: 'ta-003',
          routeId: 'red',
          routeName: 'Red Route',
          type: 'service-change',
          severity: 'info',
          title: 'Schedule Adjustment on Red Route',
          message: 'Starting next week, Red Route will run every 15 minutes instead of every 10 minutes due to driver shortages.',
          time: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
          expires: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString()
        },
        {
          id: 'ta-004',
          routeId: 'purple',
          routeName: 'Purple Route',
          type: 'outage',
          severity: 'error',
          title: 'Purple Route Temporarily Suspended',
          message: 'All Purple Route service is suspended today due to emergency road repairs. Please use Blue or Green routes as alternatives.',
          time: new Date().toISOString(),
          expires: new Date(new Date().setHours(23, 59, 59, 999)).toISOString()
        },
        {
          id: 'ta-005',
          routeId: 'gold',
          routeName: 'Gold Route',
          type: 'stop-closure',
          severity: 'advisory',
          title: 'Student Center Stop Closure',
          message: 'The Student Center stop on Gold Route is temporarily closed due to construction. Please use the Library South stop instead.',
          time: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
          expires: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString()
        }
      ];
      
      setTransitAlerts(mockTransitAlerts);
    } catch (error) {
      console.error('Error fetching transit alerts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    if (activeTab === 'weather') {
      await fetchWeatherAlerts();
    } else if (activeTab === 'transit') {
      await fetchTransitAlerts();
    }
  };

  useEffect(() => {
    if (activeTab === 'weather') {
      fetchWeatherAlerts();
    } else if (activeTab === 'transit') {
      fetchTransitAlerts();
    }
  }, [activeTab]);

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

  // Get appropriate icon for transit alert type
  const getTransitAlertIcon = (alertType: string) => {
    switch (alertType) {
      case 'delay':
        return { icon: 'clock-outline', color: '#ff9500' };
      case 'route-change':
        return { icon: 'routes', color: '#0080ff' };
      case 'service-change':
        return { icon: 'calendar-clock', color: '#5856d6' };
      case 'outage':
        return { icon: 'close-octagon', color: '#ff3b30' };
      case 'stop-closure':
        return { icon: 'bus-stop', color: '#ff9500' };
      case 'overcrowding':
        return { icon: 'account-group', color: '#ff9500' };
      case 'accident':
        return { icon: 'car-emergency', color: '#ff3b30' };
      case 'special-event':
        return { icon: 'star-circle', color: '#5856d6' };
      case 'all-clear':
        return { icon: 'check-circle', color: '#34c759' };
      default:
        return { icon: 'information', color: '#007aff' };
    }
  };

  // Get route color based on GSU bus route ID
  const getRouteColor = (routeId: string) => {
    switch (routeId.toLowerCase()) {
      case 'blue':
        return '#0039A6';
      case 'green':
        return '#34c759';
      case 'red':
        return '#ff3b30';
      case 'gold':
        return '#ff9500';
      case 'purple':
        return '#5856d6';
      default:
        return '#007aff';
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
    <View style={[styles.container, { backgroundColor: isDarkMode ? colors.background : '#F8F9FA' }]}>
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Text style={styles.headerTitle}>Alerts</Text>
      </View>
      
      <View style={[styles.tabContainer, { 
        backgroundColor: isDarkMode ? colors.card : '#fff',
        borderBottomColor: isDarkMode ? colors.border : '#E1E1E1'
      }]}>
        <Pressable 
          style={[styles.tabButton, activeTab === 'weather' && [styles.activeTabButton, { 
            backgroundColor: isDarkMode ? colors.surfaceHighlight : '#f0f5ff'
          }]]}
          onPress={() => setActiveTab('weather')}
        >
          <Ionicons 
            name="cloud" 
            size={20} 
            color={activeTab === 'weather' ? colors.primary : isDarkMode ? colors.textMuted : '#666'} 
          />
          <Text style={[styles.tabText, 
            { color: isDarkMode ? colors.textMuted : '#666' },
            activeTab === 'weather' && [styles.activeTabText, { color: colors.primary }]
          ]}>Weather</Text>
        </Pressable>
        
        <Pressable 
          style={[styles.tabButton, activeTab === 'campus' && [styles.activeTabButton, { 
            backgroundColor: isDarkMode ? colors.surfaceHighlight : '#f0f5ff'
          }]]}
          onPress={() => setActiveTab('campus')}
        >
          <Ionicons 
            name="school" 
            size={20} 
            color={activeTab === 'campus' ? colors.primary : isDarkMode ? colors.textMuted : '#666'} 
          />
          <Text style={[styles.tabText, 
            { color: isDarkMode ? colors.textMuted : '#666' },
            activeTab === 'campus' && [styles.activeTabText, { color: colors.primary }]
          ]}>Campus</Text>
        </Pressable>
        
        <Pressable 
          style={[styles.tabButton, activeTab === 'transit' && [styles.activeTabButton, { 
            backgroundColor: isDarkMode ? colors.surfaceHighlight : '#f0f5ff'
          }]]}
          onPress={() => setActiveTab('transit')}
        >
          <Ionicons 
            name="bus" 
            size={20} 
            color={activeTab === 'transit' ? colors.primary : isDarkMode ? colors.textMuted : '#666'} 
          />
          <Text style={[styles.tabText, 
            { color: isDarkMode ? colors.textMuted : '#666' },
            activeTab === 'transit' && [styles.activeTabText, { color: colors.primary }]
          ]}>Transit</Text>
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
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={[styles.loadingText, { color: isDarkMode ? colors.textMuted : '#666' }]}>Loading alerts...</Text>
              </View>
            ) : weatherAlerts.length > 0 ? (
              weatherAlerts.map((alert, index) => {
                const { icon, color } = getAlertIcon(alert.type);
                const severityColor = getSeverityColor(alert.severity);
                
                return (
                  <View key={index} style={[styles.alertCard, { 
                    backgroundColor: isDarkMode ? colors.card : '#fff',
                    shadowColor: isDarkMode ? '#000' : '#000',
                    shadowOpacity: isDarkMode ? 0.3 : 0.1,
                  }]}>
                    <View style={[styles.alertIconContainer, {
                      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : '#F0F5FF'
                    }]}>
                      <MaterialCommunityIcons name={icon as any} size={28} color={color} />
                    </View>
                    <View style={styles.alertContent}>
                      <Text style={[styles.alertTitle, { color: isDarkMode ? colors.text : '#333' }]}>{alert.title}</Text>
                      <Text style={[styles.alertMessage, { color: isDarkMode ? colors.textMuted : '#666' }]}>{alert.message}</Text>
                      <View style={styles.alertMeta}>
                        <View style={[styles.severityBadge, { backgroundColor: severityColor }]}>
                          <Text style={styles.severityText}>{alert.severity.toUpperCase()}</Text>
                        </View>
                        <Text style={[styles.alertTime, { color: isDarkMode ? colors.textMuted : '#999' }]}>Updated {formatTime(alert.time)}</Text>
                      </View>
                    </View>
                  </View>
                );
              })
            ) : (
              <View style={styles.emptyContainer}>
                <MaterialCommunityIcons name="weather-sunny" size={50} color={isDarkMode ? colors.textMuted : '#999'} />
                <Text style={[styles.emptyText, { color: isDarkMode ? colors.textMuted : '#666' }]}>No weather alerts at this time</Text>
              </View>
            )}
          </ScrollView>
        ) : activeTab === 'campus' ? (
          <View style={styles.placeholderContainer}>
            <Ionicons name="school-outline" size={60} color={isDarkMode ? colors.textMuted : '#999'} />
            <Text style={[styles.placeholderText, { color: isDarkMode ? colors.textMuted : '#666' }]}>Campus alerts coming soon</Text>
          </View>
        ) : (
          <ScrollView 
            style={styles.alertsList}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {loading && !refreshing ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={[styles.loadingText, { color: isDarkMode ? colors.textMuted : '#666' }]}>Loading transit alerts...</Text>
              </View>
            ) : transitAlerts.length > 0 ? (
              transitAlerts.map((alert, index) => {
                const { icon, color } = getTransitAlertIcon(alert.type);
                const routeColor = getRouteColor(alert.routeId);
                const severityColor = getSeverityColor(alert.severity);
                
                return (
                  <View key={index} style={[styles.transitAlertCard, { 
                    backgroundColor: isDarkMode ? colors.card : '#fff',
                    shadowColor: isDarkMode ? '#000' : '#000',
                    shadowOpacity: isDarkMode ? 0.3 : 0.1,
                  }]}>
                    <View style={[styles.routeIndicator, { backgroundColor: routeColor }]}>
                      <Text style={styles.routeIndicatorText}>{alert.routeId.toUpperCase()}</Text>
                    </View>
                    <View style={styles.transitAlertHeader}>
                      <View style={styles.transitAlertTitleContainer}>
                        <MaterialCommunityIcons name={icon as any} size={22} color={color} style={styles.transitAlertTypeIcon} />
                        <Text style={[styles.transitAlertTitle, { color: isDarkMode ? colors.text : '#333' }]}>{alert.title}</Text>
                      </View>
                      <View style={[styles.severityBadge, { backgroundColor: severityColor }]}>
                        <Text style={styles.severityText}>{alert.severity.toUpperCase()}</Text>
                      </View>
                    </View>
                    <View style={styles.alertContent}>
                      <Text style={[styles.alertMessage, { color: isDarkMode ? colors.textMuted : '#666' }]}>{alert.message}</Text>
                    </View>
                    {alert.affectedStops && alert.affectedStops.length > 0 && (
                      <View style={[styles.affectedStopsContainer, {
                        backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#f8f8f8'
                      }]}>
                        <Text style={[styles.affectedStopsTitle, { color: isDarkMode ? colors.text : '#333' }]}>Affected Stops:</Text>
                        <View style={styles.stopsList}>
                          {alert.affectedStops.map((stop, stopIndex) => (
                            <View key={stopIndex} style={styles.stopItem}>
                              <FontAwesome name="map-marker" size={14} color={routeColor} style={styles.stopIcon} />
                              <Text style={[styles.stopName, { color: isDarkMode ? colors.textMuted : '#555' }]}>{stop}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}
                    <View style={styles.alertMeta}>
                      <Text style={[styles.alertTime, { color: isDarkMode ? colors.textMuted : '#999' }]}>Updated {formatTime(alert.time)}</Text>
                      <View style={styles.routeBadge}>
                        <FontAwesome name="bus" size={12} color="#fff" />
                        <Text style={styles.routeBadgeText}>{alert.routeName}</Text>
                      </View>
                    </View>
                  </View>
                );
              })
            ) : (
              <View style={styles.emptyContainer}>
                <MaterialCommunityIcons name="bus-clock" size={50} color={isDarkMode ? colors.textMuted : '#999'} />
                <Text style={[styles.emptyText, { color: isDarkMode ? colors.textMuted : '#666' }]}>No transit alerts at this time</Text>
              </View>
            )}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const GSU_BLUE = '#0039A6';
const GSU_BLUE_LIGHT = '#E6F3FF';

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
  // Transit alert styles
  transitAlertCard: {
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
  routeIndicator: {
    height: 24,
    borderRadius: 4,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  routeIndicatorText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Montserrat-Bold',
  },
  transitAlertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  transitAlertTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 8,
  },
  transitAlertTypeIcon: {
    marginRight: 8,
  },
  transitAlertTitle: {
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
    color: '#333',
    flex: 1,
  },
  affectedStopsContainer: {
    marginTop: 12,
    marginBottom: 8,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 12,
  },
  affectedStopsTitle: {
    fontSize: 14,
    fontFamily: 'Montserrat-SemiBold',
    color: '#333',
    marginBottom: 8,
  },
  stopsList: {
    marginLeft: 4,
  },
  stopItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  stopIcon: {
    marginRight: 8,
  },
  stopName: {
    fontSize: 13,
    fontFamily: 'Montserrat-Regular',
    color: '#555',
  },
  routeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0039A6',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  routeBadgeText: {
    fontSize: 11,
    fontFamily: 'Montserrat-Medium',
    color: '#fff',
    marginLeft: 4,
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