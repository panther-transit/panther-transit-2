import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, ActivityIndicator, RefreshControl, ImageBackground, TouchableOpacity } from 'react-native';
import { ThemedText as Text } from '@/components/ThemedText';
import { api } from '@/app/utils/api';
import { FontAwesome } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useAppTheme } from '@/hooks/useAppTheme';

type WeatherData = {
  hourly: {
    time: string[];
    temperature_2m: number[];
    relative_humidity_2m: number[];
    apparent_temperature: number[];
    precipitation_probability: number[];
    precipitation: number[];
    weather_code: number[];
    wind_speed_10m: number[];
    wind_direction_10m: number[];
    visibility: number[];
    cloud_cover: number[];
    pressure_msl: number[];
    dew_point_2m: number[];
    soil_temperature_0cm: number[];
    is_day: number[];
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    apparent_temperature_max: number[];
    apparent_temperature_min: number[];
    sunrise: string[];
    sunset: string[];
    uv_index_max: number[];
    precipitation_sum: number[];
    precipitation_hours: number[];
    precipitation_probability_max: number[];
    wind_speed_10m_max: number[];
    wind_gusts_10m_max: number[];
    wind_direction_10m_dominant: number[];
    sunshine_duration: number[];
  };
  hourly_units?: {
    [key: string]: string;
  };
  daily_units?: {
    [key: string]: string;
  };
};

type AirQualityData = {
  hourly: {
    time: string[];
    pm10: number[];
    pm2_5: number[];
    carbon_monoxide: number[];
    nitrogen_dioxide: number[];
    ozone: number[];
    european_aqi: number[];
    us_aqi: number[];
    grass_pollen: number[];
    birch_pollen: number[];
    ragweed_pollen: number[];
  };
  hourly_units?: {
    [key: string]: string;
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
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentDate] = useState(new Date());
  const [showAllDays, setShowAllDays] = useState(false);

  const fetchData = async () => {
    try {
      // Fetch both weather and air quality data in parallel
      const [weatherData, airQualityData] = await Promise.all([
        api.weather.getGSUWeather(),
        api.weather.getGSUAirQuality()
      ]);
      setWeather(weatherData);
      setAirQuality(airQualityData);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Optionally set an error state here to display a message
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

  const { isDarkMode, colors } = useAppTheme();

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!weather || !airQuality) { // Check for both weather and airQuality
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>Failed to load weather or air quality data</Text>
      </View>
    );
  }

  // Use data from the current hour for the current conditions
  const currentHourIndex = new Date().getHours();
  const currentTemp = weather.hourly.temperature_2m[currentHourIndex];
  const currentFeelsLike = weather.hourly.apparent_temperature[currentHourIndex];
  const currentWeatherCode = weather.hourly.weather_code[currentHourIndex];
  // Get current pollen data
  const currentGrassPollen = airQuality.hourly.grass_pollen?.[currentHourIndex];
  const currentBirchPollen = airQuality.hourly.birch_pollen?.[currentHourIndex];
  const currentRagweedPollen = airQuality.hourly.ragweed_pollen?.[currentHourIndex];

  // Helper function to format pollen levels
  const formatPollenLevel = (value: number | undefined): string => {
    if (value === undefined || value === null) return 'N/A';
    // Example interpretation: Adjust thresholds as needed based on API docs or standards
    if (value < 5) return 'Low';
    if (value < 20) return 'Moderate';
    if (value < 50) return 'High';
    return 'Very High'; 
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
      }
    >
      <View style={styles.compactHeader}>
        <View style={[styles.currentTempContainer, { 
          backgroundColor: isDarkMode ? colors.cardHighlight : GSU_BLUE_LIGHT 
        }]}>
          <FontAwesome 
            name={getWeatherIcon(currentWeatherCode)} 
            size={40} 
            color={colors.primary} 
            style={styles.weatherIcon}
          />
          <View style={styles.tempInfo}>
            <Text style={[styles.temperature, { color: colors.text }]}>Current Temp: {Math.round(currentTemp)}°F</Text>
            <Text style={[styles.feelsLike, { color: colors.textMuted }]}>Feels like {Math.round(currentFeelsLike)}°F</Text>
          </View>
        </View>
        
        {/* Sunrise/Sunset Info - Enhanced */}
        <View style={styles.sunTimesContainer}>
          <View style={[styles.sunTimeItem, { backgroundColor: colors.card }]}>
            <View style={[styles.sunIconCircle, { backgroundColor: isDarkMode ? 'rgba(255, 149, 0, 0.15)' : '#FFF8E1' }]}>
              <FontAwesome name="arrow-up" size={18} color="#FF9500" />
            </View>
            <Text style={[styles.sunTimeLabel, { color: colors.textMuted }]}>Sunrise</Text>
            <Text style={[styles.sunTimeValue, { color: colors.text }]}>
              {new Date(weather.daily.sunrise[0]).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </Text>
          </View>
          <View style={[styles.sunTimeItem, { backgroundColor: colors.card }]}>
            <View style={[styles.sunIconCircle, { backgroundColor: isDarkMode ? 'rgba(255, 59, 48, 0.15)' : '#FFF8E1' }]}>
              <FontAwesome name="arrow-down" size={18} color="#FF3B30" />
            </View>
            <Text style={[styles.sunTimeLabel, { color: colors.textMuted }]}>Sunset</Text>
            <Text style={[styles.sunTimeValue, { color: colors.text }]}>
              {new Date(weather.daily.sunset[0]).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </Text>
          </View>
        </View>
      </View>

      {/* 7-Day Forecast - Moved up */}
      <View style={styles.forecastContainer}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>7-Day Forecast</Text>
        
        <View style={styles.forecastLegend}>
          <Text style={[styles.legendDay, { color: colors.textMuted }]}>Day</Text>
          <Text style={[styles.legendWeather, { color: colors.textMuted }]}>Weather</Text>
          <View style={styles.legendTemp}>
            <Text style={[styles.legendLabel, { color: colors.textMuted }]}>High/Low</Text>
          </View>
          <View style={styles.legendPrecip}>
            <Text style={[styles.legendLabel, { color: colors.textMuted }]}>Rain</Text>
          </View>
        </View>
        
        <View style={[styles.forecastWrapper, { backgroundColor: colors.card }]}>
          {/* Skip the first day (index 0) from the API and start from the second day (index 1) */}
          {weather.daily.time.slice(1).map((day, index) => {
            // Only show first 3 days if showAllDays is false
            if (!showAllDays && index >= 3) return null;
            
            // Adjust the actual API data index (add 1 since we're skipping the first day)
            const dataIndex = index + 1;
            return (
              <View key={day} style={[
                styles.forecastDay, 
                index === 0 && [styles.todayForecast, { backgroundColor: isDarkMode ? colors.surfaceHighlight : GSU_BLUE_LIGHT }],
                { borderBottomColor: isDarkMode ? colors.border : '#f0f0f0' }
              ]}>
                <View style={styles.dayContainer}>
                  <Text style={[
                    styles.dayText, 
                    { color: colors.text },
                    index === 0 && [styles.todayText, { color: colors.primary }]
                  ]}>
                    {index === 0 ? 'Today' : new Date(day).toLocaleDateString('en-US', { weekday: 'short' })}
                  </Text>
                  {index === 0 && (
                    <Text style={[styles.dateText, { color: colors.textMuted }]}>
                      {currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </Text>
                  )}
                </View>
                
                <View style={styles.weatherIconContainer}>
                  <FontAwesome 
                    name={getWeatherIcon(weather.daily.weather_code[dataIndex])} 
                    size={28} 
                    color={index === 0 ? colors.primary : isDarkMode ? colors.textSecondary : "#555"} 
                    style={styles.forecastIcon}
                  />
                </View>
                
                <View style={styles.tempRange}>
                  <Text style={[
                    styles.tempText, 
                    { color: isDarkMode ? colors.text : '#333' },
                    index === 0 && styles.todayTemp
                  ]}>
                    {Math.round(weather.daily.temperature_2m_max[dataIndex])}°
                  </Text>
                  <Text style={[styles.tempDivider, { color: isDarkMode ? colors.textMuted : '#999' }]}>/</Text>
                  <Text style={[styles.tempTextMin, { color: isDarkMode ? colors.textMuted : '#666' }]}>
                    {Math.round(weather.daily.temperature_2m_min[dataIndex])}°
                  </Text>
                </View>
                
                <View style={styles.precipContainer}>
                  <View style={[styles.precipIconContainer, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : '#f0f0f0' }]}>
                    <View style={[styles.precipBar, {
                      height: `${Math.min(Math.round(weather.daily.precipitation_probability_max[dataIndex]), 100)}%`,
                      backgroundColor: colors.primary
                    }]} />
                  </View>
                  <Text style={[
                    styles.precipText, 
                    { color: isDarkMode ? colors.textMuted : '#666' },
                    index === 0 && [styles.todayPrecip, { color: colors.primary }]
                  ]}>
                    {Math.round(weather.daily.precipitation_probability_max[dataIndex])}%
                  </Text>
                </View>
              </View>
            );
          })}
          
          {/* Show More / Show Less button */}
          <TouchableOpacity 
            style={[styles.showMoreButton, {
              borderTopColor: isDarkMode ? colors.border : '#f0f0f0',
              backgroundColor: isDarkMode ? colors.surfaceHighlight : 'transparent'
            }]} 
            onPress={() => setShowAllDays(!showAllDays)}
          >
            <Text style={[styles.showMoreText, { color: colors.primary }]}>
              {showAllDays ? 'Show Less' : 'Show More'}
            </Text>
            <FontAwesome 
              name={showAllDays ? 'chevron-up' : 'chevron-down'} 
              size={16} 
              color={colors.primary} 
              style={styles.showMoreIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Current Conditions Details - Moved down */}
      <View style={[styles.detailsContainer, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Current Conditions</Text>
        <View style={styles.detailsGrid}>
          <View style={[styles.detailItem, { backgroundColor: isDarkMode ? colors.surfaceHighlight : GSU_BLUE_LIGHT }]}>
            <FontAwesome name="tint" size={20} color={colors.primary} />
            <Text style={[styles.detailLabel, { color: isDarkMode ? colors.textMuted : '#666' }]}>Humidity</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>{weather.hourly.relative_humidity_2m[currentHourIndex]}%</Text>
          </View>
          <View style={[styles.detailItem, { backgroundColor: isDarkMode ? colors.surfaceHighlight : GSU_BLUE_LIGHT }]}>
            <FontAwesome name="umbrella" size={20} color={colors.primary} />
            <Text style={[styles.detailLabel, { color: isDarkMode ? colors.textMuted : '#666' }]}>Precipitation</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>{weather.hourly.precipitation_probability[currentHourIndex]}%</Text>
          </View>
          <View style={[styles.detailItem, { backgroundColor: isDarkMode ? colors.surfaceHighlight : GSU_BLUE_LIGHT }]}>
            <FontAwesome name="arrows" size={20} color={colors.primary} />
            <Text style={[styles.detailLabel, { color: isDarkMode ? colors.textMuted : '#666' }]}>Wind</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>{Math.round(weather.hourly.wind_speed_10m[currentHourIndex])} mph</Text>
          </View>
          <View style={[styles.detailItem, { backgroundColor: isDarkMode ? colors.surfaceHighlight : GSU_BLUE_LIGHT }]}>
            <FontAwesome name="sun-o" size={20} color={colors.primary} />
            <Text style={[styles.detailLabel, { color: isDarkMode ? colors.textMuted : '#666' }]}>UV Index</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>{Math.round(weather.daily.uv_index_max[0])}</Text>
          </View>
          <View style={[styles.detailItem, { backgroundColor: isDarkMode ? colors.surfaceHighlight : GSU_BLUE_LIGHT }]}>
            <FontAwesome name="cloud" size={20} color={colors.primary} />
            <Text style={[styles.detailLabel, { color: isDarkMode ? colors.textMuted : '#666' }]}>Cloud Cover</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>{weather.hourly.cloud_cover[currentHourIndex]}%</Text>
          </View>
          <View style={[styles.detailItem, { backgroundColor: isDarkMode ? colors.surfaceHighlight : GSU_BLUE_LIGHT }]}>
            <FontAwesome name="eye" size={20} color={colors.primary} />
            <Text style={[styles.detailLabel, { color: isDarkMode ? colors.textMuted : '#666' }]}>Visibility</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>{(weather.hourly.visibility[currentHourIndex] / 1609).toFixed(1)} mi</Text>
          </View>
          <View style={[styles.detailItem, { backgroundColor: isDarkMode ? colors.surfaceHighlight : GSU_BLUE_LIGHT }]}>
            <FontAwesome name="arrow-down" size={20} color={colors.primary} />
            <Text style={[styles.detailLabel, { color: isDarkMode ? colors.textMuted : '#666' }]}>Pressure</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>{Math.round(weather.hourly.pressure_msl[currentHourIndex] / 33.864)} inHg</Text>
          </View>
          <View style={[styles.detailItem, { backgroundColor: isDarkMode ? colors.surfaceHighlight : GSU_BLUE_LIGHT }]}>
            <FontAwesome name="clock-o" size={20} color={colors.primary} />
            <Text style={[styles.detailLabel, { color: isDarkMode ? colors.textMuted : '#666' }]}>Dew Point</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>{Math.round(weather.hourly.dew_point_2m[currentHourIndex])}°F</Text>
          </View>
        </View>
      </View>

      {/* Air Quality (Pollen) Section */}
      <View style={[styles.detailsContainer, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Air Quality - Pollen</Text>
        <View style={styles.detailsGrid}>
          <View style={[styles.detailItem, { backgroundColor: isDarkMode ? colors.surfaceHighlight : GSU_BLUE_LIGHT }]}>
            <FontAwesome name="leaf" size={20} color={colors.primary} />
            <Text style={[styles.detailLabel, { color: isDarkMode ? colors.textMuted : '#666' }]}>Grass Pollen</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>{formatPollenLevel(currentGrassPollen)}</Text>
          </View>
          <View style={[styles.detailItem, { backgroundColor: isDarkMode ? colors.surfaceHighlight : GSU_BLUE_LIGHT }]}>
            <FontAwesome name="tree" size={20} color={colors.primary} />
            <Text style={[styles.detailLabel, { color: isDarkMode ? colors.textMuted : '#666' }]}>Birch Pollen</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>{formatPollenLevel(currentBirchPollen)}</Text>
          </View>
          <View style={[styles.detailItem, { backgroundColor: isDarkMode ? colors.surfaceHighlight : GSU_BLUE_LIGHT }]}>
            {/* Using a generic icon for Ragweed, adjust if a better one is available */}
            <FontAwesome name="pagelines" size={20} color={colors.primary} /> 
            <Text style={[styles.detailLabel, { color: isDarkMode ? colors.textMuted : '#666' }]}>Ragweed Pollen</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>{formatPollenLevel(currentRagweedPollen)}</Text>
          </View>
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
  },
  contentContainer: {
    paddingTop: 60,
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
    marginLeft: 8,
    alignItems: 'flex-start',
  },
  temperature: {
    fontSize: 28,
    fontWeight: '600',
    color: GSU_BLUE,
    lineHeight: 30,
  },
  weatherIcon: {
    marginRight: 5,
  },
  feelsLike: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  forecastContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  forecastWrapper: {
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
  showMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    marginTop: 5,
  },
  showMoreText: {
    color: GSU_BLUE,
    fontSize: 16,
    fontWeight: '500',
    marginRight: 8,
  },
  showMoreIcon: {
    marginTop: 2,
  },
  errorText: {
    textAlign: 'center',
    margin: 20,
    fontSize: 16,
    color: '#ff3b30',
  },
  // Current conditions details styles
  detailsContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  detailItem: {
    width: '48%',
    padding: 12,
    marginBottom: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 6,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: '600',
    color: GSU_BLUE,
  },
  // Header styles
  compactHeader: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 5,
    flexDirection: 'column',
    marginBottom: 15,
  },
  currentTempContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderRadius: 12,
    padding: 8,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  // Sunrise/Sunset styles
  sunTimesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  sunTimeItem: {
    width: '48%',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sunIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF8E1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  sunTimeLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  sunTimeValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});
