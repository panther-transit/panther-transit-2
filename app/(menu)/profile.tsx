import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable, ActivityIndicator } from 'react-native';
import { useTheme } from '../context/themeContext';
import { router } from 'expo-router';
import { supabase } from '../../config/supabase';

export default function ProfilePage() {
  const { isDarkMode } = useTheme();
  const [user, setUser] = useState<{ name: string; email: string; profilePicture: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: userData, error } = await supabase.auth.getUser();
        if (error || !userData?.user) {
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
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0039A6" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#FFFFFF' }]}>
      <View style={styles.contentContainer}>
        <Image source={{ uri: user?.profilePicture }} style={styles.profileImage} />
        <Text style={[styles.name, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>{user?.name}</Text>
        <Text style={[styles.email, { color: isDarkMode ? '#AAAAAA' : '#666666' }]}>{user?.email}</Text>

        <Pressable style={styles.button} onPress={() => router.push('/(menu)/editProfile')}>
          <Text style={styles.buttonText}>Edit Profile</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  contentContainer: {
    alignItems: 'center',
    width: '100%',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
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
