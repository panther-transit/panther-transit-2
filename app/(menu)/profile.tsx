import { View, Text, StyleSheet, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function ProfilePage() {
  // Mock user data (replace with actual data later)
  const user = {
    name: 'John Doe',
    email: 'johndoe@example.com',
    profilePicture: 'https://via.placeholder.com/100',
  };

  return (
    <ThemedView style={styles.container}>
      <Image source={{ uri: user.profilePicture }} style={styles.profileImage} />
      <ThemedText type="title" style={styles.name}>{user.name}</ThemedText>
      <ThemedText type="subtitle" style={styles.email}>{user.email}</ThemedText>
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
});
