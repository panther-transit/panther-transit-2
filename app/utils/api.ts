
const API_URL = 'http://YourIPv4/api';

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
          `${OPEN_METEO_API_URL}/forecast?latitude=${GSU_LATITUDE}&longitude=${GSU_LONGITUDE}&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_hours,precipitation_probability_max&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&timezone=America%2FNew_York&forecast_days=7`
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
    
    // Get air quality data for Georgia State University
    getGSUAirQuality: async () => {
      try {
        const response = await fetch(
          `${OPEN_METEO_API_URL}/air-quality?latitude=${GSU_LATITUDE}&longitude=${GSU_LONGITUDE}&hourly=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,ozone,european_aqi,us_aqi&timezone=America%2FNew_York`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch GSU air quality data');
        }
        
        return response.json();
      } catch (error) {
        console.error('Air Quality API error:', error);
        throw error;
      }
    }
  },
};