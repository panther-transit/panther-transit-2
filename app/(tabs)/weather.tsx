import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, ActivityIndicator, RefreshControl, ImageBackground } from 'react-native';
import { ThemedText as Text } from '@/components/ThemedText';
import { api } from '@/app/utils/api';
import { FontAwesome } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

type WeatherData = {
  hourly: {
    time: string[];
    temperature_2m: number[];
    apparent_temperature: number[];
    precipitation_probability: number[];
    weather_code: number[];
    wind_speed_10m: number[];
    wind_direction_10m: number[];
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
  };
};

const getWeatherIcon = (code: number) => {
  // WMO Weather interpretation codes: https://open-meteo.com/en/docs
  if (code === 0) return 'sun-o';
  if (code === 1 || code === 2) return 'cloud';
  if (code === 3) return 'cloud';
  if (code >= 51 && code <= 57) return 'cloud'; // Drizzle
  if (code >= 61 && code <= 67) return 'umbrella'; // Rain
  if (code >= 71 && code <= 77) return 'snowflake-o'; // Snow
  if (code >= 80 && code <= 82) return 'umbrella'; // Rain showers
  if (code >= 95) return 'bolt'; // Thunderstorm
  return 'question';
};

export default function Weather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentDate] = useState(new Date());

  const fetchData = async () => {
    try {
      const weatherData = await api.weather.getGSUWeather();
      setWeather(weatherData);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.tint} />
      </View>
    );
  }

  if (!weather) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Failed to load weather data</Text>
      </View>
    );
  }

  // Use data from the current hour for the current conditions
  const currentHourIndex = new Date().getHours();
  const currentTemp = weather.hourly.temperature_2m[currentHourIndex];
  const currentFeelsLike = weather.hourly.apparent_temperature[currentHourIndex];
  const currentWeatherCode = weather.hourly.weather_code[currentHourIndex];

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0039A6" />
      }
    >
      <View style={styles.header}>
        <Text style={styles.location}>Georgia State University</Text>
        <View style={styles.currentWeather}>
          <FontAwesome 
            name={getWeatherIcon(currentWeatherCode)} 
            size={70} 
            color="#0039A6" 
            style={styles.weatherIcon}
          />
          <View style={styles.tempInfo}>
            <Text style={styles.temperature}>{Math.round(currentTemp)}°F</Text>
            <Text style={styles.feelsLike}>Feels like {Math.round(currentFeelsLike)}°F</Text>
          </View>
        </View>
      </View>

      <View style={styles.forecastContainer}>
        <Text style={styles.sectionTitle}>7-Day Forecast</Text>
        
        <View style={styles.forecastLegend}>
          <Text style={styles.legendDay}>Day</Text>
          <Text style={styles.legendWeather}>Weather</Text>
          <View style={styles.legendTemp}>
            <Text style={styles.legendLabel}>High/Low</Text>
          </View>
          <View style={styles.legendPrecip}>
            <Text style={styles.legendLabel}>Rain</Text>
          </View>
        </View>
        
        <View style={styles.forecastWrapper}>
          {/* Skip the first day (index 0) from the API and start from the second day (index 1) */}
          {weather.daily.time.slice(1).map((day, index) => {
            // Adjust the actual API data index (add 1 since we're skipping the first day)
            const dataIndex = index + 1;
            return (
              <View key={day} style={[styles.forecastDay, index === 0 && styles.todayForecast]}>
                <View style={styles.dayContainer}>
                  <Text style={[styles.dayText, index === 0 && styles.todayText]}>
                    {index === 0 ? 'Today' : new Date(day).toLocaleDateString('en-US', { weekday: 'short' })}
                  </Text>
                  {index === 0 && (
                    <Text style={styles.dateText}>
                      {currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </Text>
                  )}
                </View>
                
                <View style={styles.weatherIconContainer}>
                  <FontAwesome 
                    name={getWeatherIcon(weather.daily.weather_code[dataIndex])} 
                    size={28} 
                    color={index === 0 ? "#0039A6" : "#555"} 
                    style={styles.forecastIcon}
                  />
                </View>
                
                <View style={styles.tempRange}>
                  <Text style={[styles.tempText, index === 0 && styles.todayTemp]}>
                    {Math.round(weather.daily.temperature_2m_max[dataIndex])}°
                  </Text>
                  <Text style={styles.tempDivider}>/</Text>
                  <Text style={styles.tempTextMin}>
                    {Math.round(weather.daily.temperature_2m_min[dataIndex])}°
                  </Text>
                </View>
                
                <View style={styles.precipContainer}>
                  <View style={styles.precipIconContainer}>
                    <View style={[styles.precipBar, {height: `${Math.min(Math.round(weather.daily.precipitation_probability_max[dataIndex]), 100)}%`}]} />
                  </View>
                  <Text style={[styles.precipText, index === 0 && styles.todayPrecip]}>
                    {Math.round(weather.daily.precipitation_probability_max[dataIndex])}%
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}

const GSU_BLUE = '#0039A6';
const GSU_BLUE_LIGHT = '#E6F3FF';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop: 55,
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: GSU_BLUE_LIGHT,
    borderRadius: 30,
    paddingVertical: 25,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  location: {
    fontSize: 24,
    fontWeight: 'bold',
    color: GSU_BLUE,
    marginBottom: 15,
    textAlign: 'center',
  },
  currentWeather: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tempInfo: {
    marginLeft: 15,
    alignItems: 'flex-start',
  },
  temperature: {
    fontSize: 60,
    fontWeight: '300',
    color: GSU_BLUE,
    lineHeight: 70,
  },
  weatherIcon: {
    marginRight: 5,
  },
  feelsLike: {
    fontSize: 18,
    color: '#666',
    marginTop: 5,
  },
  forecastContainer: {
    paddingHorizontal: 20,
  },
  forecastWrapper: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: GSU_BLUE,
    marginBottom: 15,
  },
  forecastLegend: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingBottom: 8,
    marginBottom: 5,
  },
  legendDay: {
    flex: 1,
    fontSize: 12,
    color: '#888',
    fontWeight: '500',
  },
  legendWeather: {
    width: 60,
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
  legendTemp: {
    width: 80,
    alignItems: 'center',
  },
  legendPrecip: {
    width: 45,
    alignItems: 'center',
  },
  legendLabel: {
    fontSize: 12,
    color: '#888',
    fontWeight: '500',
  },
  forecastDay: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  todayForecast: {
    backgroundColor: GSU_BLUE_LIGHT,
    borderRadius: 10,
    marginBottom: 5,
    paddingHorizontal: 10,
  },
  dayContainer: {
    flex: 1,
  },
  dayText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  todayText: {
    color: GSU_BLUE,
    fontWeight: '700',
  },
  dateText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  weatherIconContainer: {
    width: 60,
    alignItems: 'center',
  },
  forecastIcon: {
    width: 30,
    textAlign: 'center',
  },
  tempRange: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 80,
    justifyContent: 'center',
  },
  tempText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  tempDivider: {
    fontSize: 16,
    color: '#999',
    marginHorizontal: 2,
  },
  todayTemp: {
    color: GSU_BLUE,
  },
  tempTextMin: {
    fontSize: 16,
    color: '#666',
  },
  precipContainer: {
    width: 45,
    alignItems: 'center',
  },
  precipIconContainer: {
    height: 24,
    width: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    marginBottom: 4,
    overflow: 'hidden',
  },
  precipBar: {
    width: '100%',
    backgroundColor: '#0039A6',
    position: 'absolute',
    bottom: 0,
  },
  precipText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  todayPrecip: {
    color: GSU_BLUE,
  },
  errorText: {
    textAlign: 'center',
    margin: 20,
    fontSize: 16,
    color: '#ff3b30',
  },
});
