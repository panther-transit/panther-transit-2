import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Alert } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EditProfilePage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const handleSave = async () => {
    try {
      // Get the existing profile from AsyncStorage
      const storedProfile = await AsyncStorage.getItem('userProfile');
      let profileData = storedProfile ? JSON.parse(storedProfile) : {};

      // Update only the fields that are changed
      const updatedProfile = {
        name: name || profileData.name, // Keep old name if not changed
        email: email || profileData.email, // Keep old email if not changed
        password: password || profileData.password, // Keep old password if not changed
        phone: phone || profileData.phone, // Keep old phone if not changed
        address: address || profileData.address, // Keep old address if not changed
      };

      // Save updated profile
      await AsyncStorage.setItem('userProfile', JSON.stringify(updatedProfile));

      Alert.alert('Profile Updated', 'Your changes have been saved!');
      router.back(); // Navigate back to profile page
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>

      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Full Name" />
      <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Email" keyboardType="email-address" />
      <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder="New Password" secureTextEntry />
      <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="Phone Number (Optional)" keyboardType="phone-pad" />
      <TextInput style={styles.input} value={address} onChangeText={setAddress} placeholder="Home Address (Optional)" />

      <Pressable style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#0039A6',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
