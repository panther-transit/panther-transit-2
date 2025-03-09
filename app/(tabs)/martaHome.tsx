import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import BusMap from '@/components/martaBusMap';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

export default function MartaHome() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcome}>Welcome to MARTA</Text>
        <Text style={styles.subtitle}>Real-time bus tracking at your fingertips</Text>
      </View>
      <View style={styles.mapContainer}>
        <BusMap />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    width: '100%',
    paddingTop: 40, 
    paddingBottom: 20, 
    backgroundColor: '#0039A6',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1, 
  },
  welcome: {
    fontSize: 28,
    fontFamily: 'Montserrat-Bold',
    color: '#fff',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
    color: '#f8f8f8',
    textAlign: 'center',
  },
  mapContainer: {
    flex: 1, 
    width: '100%',
    marginTop: 80, 
    borderRadius: 12,
    overflow: 'hidden',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0039A6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
    marginLeft: 8,
  },
  icon: {
    marginRight: 8,
  },
});

