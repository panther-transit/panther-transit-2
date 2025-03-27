import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { useAppTheme } from '@/hooks/useAppTheme';

export default function ParkingAvailability() {
  const { deck } = useLocalSearchParams();
  const [spots, setSpots] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { isDarkMode, colors } = useAppTheme();

  useEffect(() => {
    const fetchParkingData = async () => {
      try {
        const response = await fetch("https://api.gsu.edu/proxy/handler/parking/spaces-available");
        const data = await response.json();
        console.log("API Response:", JSON.stringify(data, null, 2));
  
        const parkingList = data[0];
        const deckNameFormatted = `${deck} Deck`;
        const deckInfo = parkingList.find((item: { location_name: string; }) => item.location_name === deckNameFormatted);
        const availableSpots = deckInfo ? deckInfo.free_spaces : "N/A";
  
        setSpots(availableSpots);
      } catch (error) {
        console.error("Error fetching parking data:", error);
        setSpots("Error fetching data");
      } finally {
        setLoading(false);
      }
    };
  
    fetchParkingData();
  }, [deck]);
  

  return (
    <View style={[styles.container, {
      backgroundColor: isDarkMode ? colors.background : '#E8F4FD'
    }]}>
      <Text style={[styles.heading, {
        color: colors.primary
      }]}>Parking Availability</Text>
      <Text style={[styles.subtitle, {
        color: isDarkMode ? colors.textMuted : '#666'
      }]}>Selected Deck: {deck}</Text>
      {loading ? (
  <ActivityIndicator size="large" color={colors.primary} />
  ) : (
    <View style={styles.spotsContainer}>
      <Text style={[styles.subtitle, {
        color: isDarkMode ? colors.textMuted : '#666'
      }]}>
        Available Spots:
      </Text>
      <Text style={styles.spotsText}>{spots}</Text>
    </View>
  )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#E8F4FD',
  },
  heading: {
    fontSize: 24,
    fontFamily: 'Montserrat-Bold',
    color: '#0039A6',
    marginBottom: 50,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Montserrat-SemiBold',
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  spotsContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  spotsText: {
    fontSize: 32,
    fontFamily: 'Montserrat-Bold',
    color: 'red',
    textAlign: 'center',
    marginTop: 5,
  },  
});
