import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { fetchMartaBusData, BusPosition } from '../app/utils/martaAPI';

const BusMap: React.FC = () => {
  const [buses, setBuses] = useState<BusPosition[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBuses = async () => {
      try {
        setLoading(true);
        const busData = await fetchMartaBusData(); 
        setBuses(busData);
        setError(null);
      } catch (err) {
        setError('Failed to load bus data');
        console.error('Error loading bus data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadBuses(); // Fetch on mount
    const interval = setInterval(loadBuses, 15000); // Refresh every 15 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 33.749,
          longitude: -84.388,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        {buses.map((bus) => (
          <Marker
            key={bus.id}
            coordinate={{
              latitude: bus.latitude,
              longitude: bus.longitude
            }}
            title={`Route ${bus.route}`}
            description={`Bus ID: ${bus.id}`}
            pinColor="#0039A6" // MARTA blue color
          />
        ))}
      </MapView>
      
      {loading && !buses.length && (
        <View style={styles.overlay}>
          <Text style={styles.overlayText}>Loading bus locations...</Text>
        </View>
      )}
      
      {error && (
        <View style={styles.overlay}>
          <Text style={styles.overlayText}>{error}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  overlayText: {
    fontFamily: 'Montserrat-SemiBold',
    color: '#0039A6',
  }
});

export default BusMap;