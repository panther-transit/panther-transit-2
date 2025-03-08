import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '@/config/supabase';

export default function ProfilePage() {
  const [user, setUser] = useState<{ name: string; email: string; profilePicture: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
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
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0039A6" />
      </View>
    );
  }

  return (
    <View style={[styles.container, isDarkMode && styles.darkBackground]}>
      {/* Profile Picture */}
      <Image source={{ uri: user?.profilePicture }} style={styles.profileImage} />

      {/* User Info Section (Name & Email) */}
      <View style={styles.infoContainer}>
        <Text style={[styles.name, isDarkMode ? styles.lightText : styles.darkText]}>{user?.name}</Text>
        <Text style={[styles.email, isDarkMode ? styles.lightText : styles.darkText]}>{user?.email}</Text>
      </View>

      {/* Edit Profile Button */}
      <Pressable 
        style={[styles.button, isDarkMode ? styles.darkButton : styles.lightButton]} 
        onPress={() => router.push('/(menu)/editProfile')}
      >
        <Text style={[styles.buttonText, isDarkMode ? styles.darkButtonText : styles.lightButtonText]}>
          Edit Profile
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 60,
    backgroundColor: '#F8F9FA',
  },
  darkBackground: {
    backgroundColor: '#121212',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    marginTop: 10,
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#555',
  },
  darkText: {
    color: '#000',
  },
  lightText: {
    color: '#FFF',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  lightButton: {
    backgroundColor: '#0039A6',
  },
  darkButton: {
    backgroundColor: '#555',
  },
  lightButtonText: {
    color: '#FFF',
  },
  darkButtonText: {
    color: '#FFF',
  },
});
