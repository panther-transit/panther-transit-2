const API_URL = 'http://localhost:3000/api';

// Open-Meteo API for weather data
const OPEN_METEO_WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';
// Open-Meteo API for air quality data
const OPEN_METEO_AIR_QUALITY_API_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';

// Georgia State University coordinates
const GSU_LATITUDE = 33.75278;
const GSU_LONGITUDE = -84.38611;

export const api = {
  auth: {
    login: async (email: string, password: string) => {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
      }

      return response.json();
    },

    signup: async (email: string, password: string) => {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Signup failed');
      }

      return response.json();
    },
  },
  
  weather: {
    // Get current and forecast weather for Georgia State University
    getGSUWeather: async () => {
      try {
        const response = await fetch(
          `${OPEN_METEO_WEATHER_API_URL}?latitude=${GSU_LATITUDE}&longitude=${GSU_LONGITUDE}&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,wind_speed_10m,wind_direction_10m,visibility,cloud_cover,pressure_msl,dew_point_2m,soil_temperature_0cm,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_hours,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant,sunshine_duration&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&timezone=America%2FNew_York&forecast_days=7`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch GSU weather data');
        }
        
        return response.json();
      } catch (error) {
        console.error('Weather API error:', error);
        throw error;
      }
    },
    
    // Get air quality data (including pollen) for Georgia State University
    getGSUAirQuality: async () => {
      try {
        const response = await fetch(
          `${OPEN_METEO_AIR_QUALITY_API_URL}?latitude=${GSU_LATITUDE}&longitude=${GSU_LONGITUDE}&hourly=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,ozone,european_aqi,us_aqi,grass_pollen,birch_pollen,ragweed_pollen&timezone=America%2FNew_York`
        );
        
        if (!response.ok) {
          const errorBody = await response.text(); // Try to get error body
          console.error(`Air Quality API Error: Status ${response.status} - ${response.statusText}`, errorBody);
          throw new Error(`Failed to fetch GSU air quality data (Status: ${response.status})`);
        }
        
        return response.json();
      } catch (error) {
        console.error('Air Quality API error:', error);
        throw error;
      }
    },
    
    // Get weather alerts for Georgia State University based on weather conditions
    getGSUWeatherAlerts: async () => {
      try {
        // Get weather data
        const weatherData = await api.weather.getGSUWeather();
        
        // Define threshold values for different alert types
        const alertThresholds = {
          highTemp: 95, // °F
          lowTemp: 32, // °F
          highWindSpeed: 20, // mph
          heavyRain: 0.5, // inches in a day
          highUV: 8, // UV index
          thunderstorm: [95, 96, 99], // WMO weather codes
          snowfall: [71, 73, 75, 77, 85, 86], // WMO weather codes
          freezingRain: [66, 67], // WMO weather codes
          fog: [45, 48], // WMO weather codes
          highPrecipProb: 60, // %
        };
        
        // Array to store alerts
        const alerts = [];
        
        // Check for current day high temperature alert
        if (weatherData.daily.temperature_2m_max[0] >= alertThresholds.highTemp) {
          alerts.push({
            type: 'high-temperature',
            severity: 'warning',
            title: 'High Temperature Alert',
            message: `High temperature of ${Math.round(weatherData.daily.temperature_2m_max[0])}°F expected today.`,
            time: new Date().toISOString(),
            expires: new Date(new Date().setHours(23, 59, 59, 999)).toISOString(),
          });
        }
        
        // Check for current day low temperature alert
        if (weatherData.daily.temperature_2m_min[0] <= alertThresholds.lowTemp) {
          alerts.push({
            type: 'low-temperature',
            severity: 'warning',
            title: 'Low Temperature Alert',
            message: `Low temperature of ${Math.round(weatherData.daily.temperature_2m_min[0])}°F expected today.`,
            time: new Date().toISOString(),
            expires: new Date(new Date().setHours(23, 59, 59, 999)).toISOString(),
          });
        }
        
        // Check for high wind speeds
        if (weatherData.daily.wind_speed_10m_max[0] >= alertThresholds.highWindSpeed) {
          alerts.push({
            type: 'high-wind',
            severity: 'warning',
            title: 'High Wind Alert',
            message: `High winds of ${Math.round(weatherData.daily.wind_speed_10m_max[0])} mph expected today.`,
            time: new Date().toISOString(),
            expires: new Date(new Date().setHours(23, 59, 59, 999)).toISOString(),
          });
        }
        
        // Check for heavy precipitation
        if (weatherData.daily.precipitation_sum[0] >= alertThresholds.heavyRain) {
          alerts.push({
            type: 'heavy-rain',
            severity: 'advisory',
            title: 'Heavy Rain Expected',
            message: `Heavy rainfall of ${weatherData.daily.precipitation_sum[0].toFixed(2)} inches expected today.`,
            time: new Date().toISOString(),
            expires: new Date(new Date().setHours(23, 59, 59, 999)).toISOString(),
          });
        }
        
        // Check for high UV index
        if (weatherData.daily.uv_index_max[0] >= alertThresholds.highUV) {
          alerts.push({
            type: 'uv-exposure',
            severity: 'advisory',
            title: 'High UV Index',
            message: `High UV index of ${Math.round(weatherData.daily.uv_index_max[0])} expected today. Wear sunscreen and protective clothing.`,
            time: new Date().toISOString(),
            expires: new Date(new Date().setHours(23, 59, 59, 999)).toISOString(),
          });
        }
        
        // Check for severe weather based on weather codes
        const todayWeatherCode = weatherData.daily.weather_code[0];
        
        // Check for thunderstorm
        if (alertThresholds.thunderstorm.includes(todayWeatherCode)) {
          alerts.push({
            type: 'thunderstorm',
            severity: 'warning',
            title: 'Thunderstorm Warning',
            message: 'Thunderstorms expected in the area today. Stay indoors and avoid open areas.',
            time: new Date().toISOString(),
            expires: new Date(new Date().setHours(23, 59, 59, 999)).toISOString(),
          });
        }
        
        // Check for snow
        if (alertThresholds.snowfall.includes(todayWeatherCode)) {
          alerts.push({
            type: 'snow',
            severity: 'advisory',
            title: 'Snow Expected',
            message: 'Snowfall expected today. Travel may be difficult. Plan accordingly.',
            time: new Date().toISOString(),
            expires: new Date(new Date().setHours(23, 59, 59, 999)).toISOString(),
          });
        }
        
        // Check for freezing rain
        if (alertThresholds.freezingRain.includes(todayWeatherCode)) {
          alerts.push({
            type: 'freezing-rain',
            severity: 'warning',
            title: 'Freezing Rain Warning',
            message: 'Freezing rain expected today. Roads and walkways may be icy and dangerous.',
            time: new Date().toISOString(),
            expires: new Date(new Date().setHours(23, 59, 59, 999)).toISOString(),
          });
        }
        
        // Check for fog
        if (alertThresholds.fog.includes(todayWeatherCode)) {
          alerts.push({
            type: 'fog',
            severity: 'advisory',
            title: 'Fog Advisory',
            message: 'Dense fog expected today. Reduced visibility may impact travel.',
            time: new Date().toISOString(),
            expires: new Date(new Date().setHours(23, 59, 59, 999)).toISOString(),
          });
        }
        
        // Check for high precipitation probability
        if (weatherData.daily.precipitation_probability_max[0] >= alertThresholds.highPrecipProb) {
          alerts.push({
            type: 'precipitation',
            severity: 'advisory',
            title: 'Precipitation Likely',
            message: `${weatherData.daily.precipitation_probability_max[0]}% chance of precipitation today. Bring an umbrella!`,
            time: new Date().toISOString(),
            expires: new Date(new Date().setHours(23, 59, 59, 999)).toISOString(),
          });
        }
        
        // If no alerts, add a default "all clear" message
        if (alerts.length === 0) {
          alerts.push({
            type: 'all-clear',
            severity: 'info',
            title: 'No Weather Alerts',
            message: 'There are currently no weather alerts for Georgia State University.',
            time: new Date().toISOString(),
            expires: new Date(new Date().setHours(23, 59, 59, 999)).toISOString(),
          });
        }
        
        return alerts;
      } catch (error) {
        console.error('Weather Alerts error:', error);
        // Return a system error alert
        return [{
          type: 'system-error',
          severity: 'error',
          title: 'Weather Alert System Unavailable',
          message: 'Unable to retrieve weather alerts at this time. Please try again later.',
          time: new Date().toISOString(),
          expires: new Date(new Date().setHours(23, 59, 59, 999)).toISOString(),
        }];
      }
    }
  },
};
