import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Alert } from 'react-native';
import { supabase } from '@/config/supabase';
import { router } from 'expo-router';

export default function EditProfilePage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSaveName = async () => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: name },
      });

      if (error) throw error;

      Alert.alert('Success', 'Name updated successfully!');
      router.back(); // Navigate back to profile
    } catch (error) {
      console.error('Error updating name:', error);
      Alert.alert('Error', 'Could not update name. Try again.');
    }
  };

  const handleSaveEmail = async () => {
    try {
      const { error } = await supabase.auth.updateUser({
        email,
      });

      if (error) throw error;

      Alert.alert('Success', 'Email updated successfully!');
      router.back(); // Navigate back to profile
    } catch (error) {
      console.error('Error updating email:', error);
      Alert.alert('Error', 'Could not update email. Try again.');
    }
  };

  const handleSavePassword = async () => {
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) throw error;

      Alert.alert('Success', 'Password updated successfully!');
      router.back(); // Navigate back to profile
    } catch (error) {
      console.error('Error updating password:', error);
      Alert.alert('Error', 'Could not update password. Try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>

      {/* Edit Name Section */}
      <Text style={styles.label}>Name</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Enter your new name" 
        value={name}
        onChangeText={setName}
      />
      <Pressable style={styles.button} onPress={handleSaveName}>
        <Text style={styles.buttonText}>Save Name</Text>
      </Pressable>

      {/* Edit Email Section */}
      <Text style={styles.label}>Email</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Enter your new email" 
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Pressable style={styles.button} onPress={handleSaveEmail}>
        <Text style={styles.buttonText}>Save Email</Text>
      </Pressable>

      {/* Edit Password Section */}
      <Text style={styles.label}>Password</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Enter your new password" 
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Pressable style={styles.button} onPress={handleSavePassword}>
        <Text style={styles.buttonText}>Save Password</Text>
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
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
