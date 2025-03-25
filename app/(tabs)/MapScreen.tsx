import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert, ActivityIndicator, Animated } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

const DirectionsMap = () => {
  const mapRef = useRef<MapView | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [directions, setDirections] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [buttonsVisible, setButtonsVisible] = useState(true); 
  const [opacity] = useState(new Animated.Value(1)); 

  const destination = { latitude: 33.753746, longitude: -84.386330 }; // Georgia State University

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert("Permission Denied", "Location permission is required to show your location.");
          setLoading(false);
          return;
        }

        let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        const userLatLng = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };

        setUserLocation(userLatLng);

        if (mapRef.current) {
          mapRef.current.animateToRegion({
            ...userLatLng,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          });
        }

        fetchDirections(userLatLng.latitude, userLatLng.longitude);
      } catch (error) {
        Alert.alert("Error", "Could not fetch location. Please enable GPS and try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const fetchDirections = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${lat},${lng}&destination=${destination.latitude},${destination.longitude}&key=${GOOGLE_API_KEY}`
      );
      const data = await response.json();
      if (data.routes.length) {
        const points = data.routes[0].legs[0].steps.map((step: any) => ({
          latitude: step.end_location.lat,
          longitude: step.end_location.lng,
        }));
        setDirections(points);
      }
    } catch (error) {
      Alert.alert("Error", "Could not fetch directions. Please check your internet connection.");
    }
  };

  
  const focusOnGSU = () => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: 33.753746,
          longitude: -84.386330,
          latitudeDelta: 0.10, 
          longitudeDelta: 0.10,
        },
        1000
      );
    }
  };

  const focusOnMyLocation = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.10,
          longitudeDelta: 0.10,
        },
        1000
      );
    }
  };

  
  const fadeOutButtons = () => {
    Animated.timing(opacity, {
      toValue: 0, 
      duration: 300,
      useNativeDriver: true,
    }).start();
    setButtonsVisible(false); 
  };

  
  const showButtons = () => {
    Animated.timing(opacity, {
      toValue: 1, 
      duration: 300,
      useNativeDriver: true,
    }).start();
    setButtonsVisible(true);
  };

  
  const toggleButtonsVisibility = (e: any) => {
    if (buttonsVisible) {
      fadeOutButtons(); 
    } else {
      showButtons(); 
    }
  };

  return (
    <View style={styles.container}>
      {/* Title Section */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Google Maps Traffic</Text>
      </View>

      {/* Show Loading Indicator while Fetching Location */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={{ marginTop: 10, fontSize: 16 }}>Fetching location...</Text>
        </View>
      )}

      {/* Google Maps Component */}
      <MapView
        ref={mapRef}
        style={styles.map}
        showsUserLocation={true}
        showsTraffic={true}
        //provider= default
        initialRegion={{
          latitude: userLocation?.latitude || 33.753746,
          longitude: userLocation?.longitude || -84.386330,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
        onPress={toggleButtonsVisibility} 
      >
        {userLocation && (
          <Marker
            coordinate={userLocation}
            title="You are here"
            description="Current location"
            pinColor="blue"
          />
        )}

        <Marker coordinate={destination} title="Georgia State University" description="Your destination" pinColor="red" />

        {directions && <Polyline coordinates={directions} strokeColor="#FF0000" strokeWidth={4} />}
      </MapView>

      {/* Buttons */}
      {buttonsVisible && (
        <Animated.View style={[styles.buttonContainer, { opacity }]}>
          <TouchableOpacity style={styles.button} onPress={focusOnGSU}>
            <Text style={styles.buttonText}>Focus on GSU Traffic</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={focusOnMyLocation}>
            <Text style={styles.buttonText}>Go to My Location</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

export default DirectionsMap;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingTop: 50, 
    paddingBottom: 15,
    backgroundColor: '#007bff',
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  map: {
    flex: 1, 
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 70, 
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    zIndex: 1, 
  },
  button: {
    backgroundColor: 'white',
    paddingVertical: 8, 
    paddingHorizontal: 12, 
    borderRadius: 20, 
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#007bff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
});
