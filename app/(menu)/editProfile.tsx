import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Alert } from 'react-native';
import { supabase } from '@/config/supabase';
import { router } from 'expo-router';

export default function EditProfilePage() {
  const [name, setName] = useState('');
  const [profilePicture, setProfilePicture] = useState('');

  const handleSave = async () => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: { full_name: name, avatar_url: profilePicture }
      });

      if (error) throw error;

      Alert.alert('Success', 'Profile updated successfully!');
      router.back(); // Navigate back to profile
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Could not update profile. Try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>

      <Text style={styles.label}>Name</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Enter your new name" 
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Profile Picture URL</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Enter new profile picture URL" 
        value={profilePicture}
        onChangeText={setProfilePicture}
      />

      {/* Save Button */}
      <Pressable style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Changes</Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    width: '90%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#0039A6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
