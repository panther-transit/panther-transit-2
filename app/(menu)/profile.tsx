import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfilePage() {
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'johndoe@example.com', // Ensure email is always shown
    phone: '',
    address: '',
    profilePicture: 'https://via.placeholder.com/100',
  });

  useEffect(() => {
    const loadProfile = async () => {
      const storedProfile = await AsyncStorage.getItem('userProfile');
      if (storedProfile) {
        const parsedProfile = JSON.parse(storedProfile);
        setUser((prevUser) => ({
          ...prevUser,
          ...parsedProfile,
          email: parsedProfile.email || prevUser.email, // Ensure email is always present
        }));
      }
    };

    loadProfile();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <Image source={{ uri: user.profilePicture }} style={styles.profileImage} />
      <ThemedText type="title" style={styles.name}>{user.name}</ThemedText>
      <ThemedText type="subtitle" style={styles.email}>{user.email}</ThemedText>

      {user.phone ? (
        <ThemedText style={styles.info}>📞 Phone: {user.phone}</ThemedText>
      ) : (
        <ThemedText style={styles.optionalInfo}>📞 Phone: Not Provided</ThemedText>
      )}

      {user.address ? (
        <ThemedText style={styles.info}>🏠 Address: {user.address}</ThemedText>
      ) : (
        <ThemedText style={styles.optionalInfo}>🏠 Address: Not Provided</ThemedText>
      )}

      <Pressable style={styles.button} onPress={() => router.push('/(menu)/editProfile')}>
        <Text style={styles.buttonText}>Edit Profile</Text>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
  },
  email: {
    fontSize: 18,
    color: '#555',
  },
  info: {
    fontSize: 16,
    marginTop: 10,
    color: '#333',
  },
  optionalInfo: {
    fontSize: 16,
    marginTop: 10,
    fontStyle: 'italic',
    color: '#888',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#0039A6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
