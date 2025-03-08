import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';

export default function ParkingHome() {
  const [selectedDeck, setSelectedDeck] = useState('');

  const handleCheckPress = () => {
    if (selectedDeck) {
      router.push(`../(parkingFiles)/parkingAvailability?deck=${selectedDeck}`);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/gsu.png')} style={styles.logo} />
      <Text style={styles.heading}>Looking for parking?</Text>
      <Text style={styles.subtitle}>Select a parking deck</Text>
      <Picker
        selectedValue={selectedDeck}
        onValueChange={(itemValue) => setSelectedDeck(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label=" " value="" />
        <Picker.Item label="M Deck" value="M" />
        <Picker.Item label="N Deck" value="N" />
        <Picker.Item label="G Deck" value="G" />
        <Picker.Item label="K Deck" value="K" />
        <Picker.Item label="S Deck" value="S" />
        <Picker.Item label="T Deck" value="T" />
        <Picker.Item label="U Deck" value="U" />
      </Picker>
      <Pressable 
        style={[styles.button, !selectedDeck && styles.buttonDisabled]} 
        disabled={!selectedDeck}
        onPress={handleCheckPress}
      >
        <Text style={styles.buttonText}>Check</Text>
      </Pressable>
      <Image source={require('../../assets/images/gsu-panther.png')} style={styles.pantherLogo} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: '#E8F4FD',
  },
  logo: {
    width: 200,
    height: 100,
    marginBottom: 70,
    resizeMode: 'contain',
  },
  heading: {
    fontSize: 22,
    fontFamily: 'Montserrat-Bold',
    color: '#0039A6',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Montserrat-SemiBold',
    color: '#666',
    marginBottom: 10,
    textAlign: 'center',
  },
  picker: {
    height: 50,
    width: '80%',
    marginBottom: 150,
  },
  button: {
    backgroundColor: '#0039A6',
    paddingVertical: 12,
    paddingHorizontal: 34,
    borderRadius: 8,
    marginTop: 30,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Montserrat-SemiBold',
  },
  pantherLogo: {
    width: 150,
    height: 100,
    marginTop: 20,
    resizeMode: 'contain',
  },
});
