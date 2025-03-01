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

  const currentTemp = weather.hourly.temperature_2m[0];
  const currentFeelsLike = weather.hourly.apparent_temperature[0];
  const currentWeatherCode = weather.hourly.weather_code[0];

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
        <View style={styles.forecastWrapper}>
          {weather.daily.time.map((day, index) => (
            <View key={day} style={styles.forecastDay}>
              <Text style={styles.dayText}>
                {new Date(day).toLocaleDateString('en-US', { weekday: 'short' })}
              </Text>
              <FontAwesome 
                name={getWeatherIcon(weather.daily.weather_code[index])} 
                size={28} 
                color="#0039A6" 
                style={styles.forecastIcon}
              />
              <View style={styles.tempRange}>
                <Text style={styles.tempText}>
                  {Math.round(weather.daily.temperature_2m_max[index])}°
                </Text>
                <Text style={styles.tempTextMin}>
                  {Math.round(weather.daily.temperature_2m_min[index])}°
                </Text>
              </View>
              <View style={styles.precipContainer}>
                <Text style={styles.precipText}>
                  {Math.round(weather.daily.precipitation_probability_max[index])}%
                </Text>
              </View>
            </View>
          ))}
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
  forecastDay: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dayText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  forecastIcon: {
    marginHorizontal: 15,
    width: 30,
    textAlign: 'center',
  },
  tempRange: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 80,
    justifyContent: 'flex-end',
  },
  tempText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
  },
  tempTextMin: {
    fontSize: 16,
    color: '#666',
  },
  precipContainer: {
    width: 40,
    alignItems: 'flex-end',
    marginLeft: 5,
  },
  precipText: {
    fontSize: 14,
    color: GSU_BLUE,
    fontWeight: '500',
  },
  errorText: {
    textAlign: 'center',
    margin: 20,
    fontSize: 16,
    color: '#ff3b30',
  },
});
