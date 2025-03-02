import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';
import { supabase } from '../../config/supabase';
; // Correct path

export default function ProfilePage() {
  const [user, setUser] = useState<{ name: string; email: string; profilePicture: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if Supabase is available
    const fetchUserProfile = async () => {
      try {
        const { data: userData, error } = await supabase.auth.getUser();
        if (error || !userData?.user) {
          console.warn("Using mock data due to authentication issue.");
          setUser({
            name: 'John Doe',
            email: 'johndoe@example.com',
            profilePicture: 'https://via.placeholder.com/100',
          });
        } else {
          setUser({
            name: userData.user.user_metadata?.full_name || 'User',
            email: userData.user.email,
            profilePicture: userData.user.user_metadata?.avatar_url || 'https://via.placeholder.com/100',
          });
        }
      } catch (err) {
        console.error('Error fetching user:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" color="#0039A6" />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Image source={{ uri: user?.profilePicture }} style={styles.profileImage} />
      <ThemedText type="title" style={styles.name}>{user?.name}</ThemedText>
      <ThemedText type="subtitle" style={styles.email}>{user?.email}</ThemedText>

      {/* Edit Profile Button (Future Expansion) */}
      <Pressable style={styles.button} onPress={() => router.push('/menu/editProfile')}>
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
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  name: {
    marginBottom: 8,
  },
  email: {
    color: '#666',
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
