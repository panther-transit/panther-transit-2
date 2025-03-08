import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function ParkingAvailability() {
  const { deck } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Parking Availability</Text>
      <Text style={styles.subtitle}>Selected Deck: {deck}</Text>
      <Text style={styles.subtitle}>Parking Spots Available: </Text>
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
