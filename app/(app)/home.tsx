import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';


//Now using index file inside (tabs) folder as the home screen


export default function HomeScreen() {
  return (
    <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to Panther Transit</Text>
        <Text style={styles.subtitle}></Text>

      <Text style={styles.subtitle}>Georgia State reminds you to always be aware of your surroundings.</Text>
      <Text style={styles.subtitle}>Safe commuting!</Text>

      <View style={styles.buttonGroup}>
        <Pressable 
          style={({pressed}) => [styles.button, pressed && styles.buttonPressed]} 
          onPress={() => router.push('/(tabs)/martaHome')}
        >
          <Text style={styles.buttonText}>MARTA</Text>
        </Pressable>

        <Pressable 
          style={({pressed}) => [styles.button, pressed && styles.buttonPressed]} 
          onPress={() => router.push('/(tabs)/parkingHome')}
        >
          <Text style={styles.buttonText}>GSU Parking</Text>
        </Pressable>

        <Pressable 
          style={({pressed}) => [styles.button, pressed && styles.buttonPressed]} 
          onPress={() => router.push('/(tabs)/trafficHome')}
        >
          <Text style={styles.buttonText}>Vehicle Traffic</Text>
        </Pressable>
      </View>

      <Pressable 
        style={({pressed}) => [styles.logoutButton, pressed && styles.buttonPressed]} 
        onPress={() => {
          router.replace('/');
        }}
      >
        <Text style={styles.buttonText}>Log Out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F8F9FA',
  },
  header: {
    position: 'absolute',
    top: 60,
  },
  welcome: {
    fontSize: 24,
    fontFamily: 'Montserrat-Bold',
    color: '#0039A6',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonGroup: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  button: {
    backgroundColor: '#0039A6',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: 200,
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#A60000', // Red for logout
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
  },
});
