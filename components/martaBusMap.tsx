import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker, MapStyleElement } from 'react-native-maps';
import { fetchMartaBusData, BusPosition } from '../app/utils/martaAPI';

interface BusMapProps {
  isDarkMode?: boolean;
}

const BusMap: React.FC<BusMapProps> = ({ isDarkMode = false }) => {
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

  // Dark mode map style
  const darkMapStyle: MapStyleElement[] = [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#242f3e"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#746855"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#242f3e"
        }
      ]
    },
    {
      "featureType": "administrative.locality",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#d59563"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#38414e"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#212a37"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9ca5b3"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#746855"
        }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#2f3948"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#17263c"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#515c6d"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#17263c"
        }
      ]
    }
  ];

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        customMapStyle={isDarkMode ? darkMapStyle : []}
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
        <View style={[styles.overlay, {
          backgroundColor: isDarkMode ? 'rgba(30, 30, 30, 0.8)' : 'rgba(255, 255, 255, 0.8)'
        }]}>
          <Text style={[styles.overlayText, {
            color: isDarkMode ? '#4DA6FF' : '#0039A6'
          }]}>Loading bus locations...</Text>
        </View>
      )}
      
      {error && (
        <View style={[styles.overlay, {
          backgroundColor: isDarkMode ? 'rgba(30, 30, 30, 0.8)' : 'rgba(255, 255, 255, 0.8)'
        }]}>
          <Text style={[styles.overlayText, {
            color: isDarkMode ? '#4DA6FF' : '#0039A6'
          }]}>{error}</Text>
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