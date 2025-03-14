import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';

export default function ParkingAvailability() {
  const { deck } = useLocalSearchParams();
  const [spots, setSpots] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
    <View style={styles.container}>
      <Text style={styles.heading}>Parking Availability</Text>
      <Text style={styles.subtitle}>Selected Deck: {deck}</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0039A6" />
      ) : (
        <Text style={styles.subtitle}>Available Spots: {spots}</Text>
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
});
