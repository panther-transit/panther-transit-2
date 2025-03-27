import { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  TextInput, 
  ScrollView, 
  Alert,
  KeyboardTypeOptions,
  Platform
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '@/hooks/useAppTheme';

export default function ProfilePage() {
  const { isDarkMode, colors } = useAppTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'johndoe@example.com',
    phone: '',
    address: ''
  });
  
  // Create temporary state for editing
  const [editedUser, setEditedUser] = useState({ ...user });
  
  // Refs for inputs to allow for focus management
  const emailInputRef = useRef<TextInput>(null);
  const phoneInputRef = useRef<TextInput>(null);
  const addressInputRef = useRef<TextInput>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const storedProfile = await AsyncStorage.getItem('userProfile');
      if (storedProfile) {
        const parsedProfile = JSON.parse(storedProfile);
        const updatedUser = {
          ...user,
          ...parsedProfile,
          email: parsedProfile.email || user.email,
        };
        setUser(updatedUser);
        setEditedUser(updatedUser);
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  };

  const handleSave = async () => {
    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(editedUser.email)) {
        Alert.alert('Invalid Email', 'Please enter a valid email address.');
        return;
      }

      // Save to AsyncStorage
      await AsyncStorage.setItem('userProfile', JSON.stringify(editedUser));
      
      // Update main user state
      setUser(editedUser);
      setIsEditing(false);
      
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile.');
    }
  };

  const handleCancel = () => {
    // Reset edited values to original user values
    setEditedUser({ ...user });
    setIsEditing(false);
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  // Interface for ProfileField props
  interface ProfileFieldProps {
    label: string;
    value: string;
    icon: React.ComponentProps<typeof Ionicons>['name'];
    placeholder: string;
    secureTextEntry?: boolean;
    keyboardType?: KeyboardTypeOptions;
    onChangeText: (text: string) => void;
    inputRef?: React.RefObject<TextInput>;
    onSubmitEditing?: () => void;
  }

  // Field component for both display and edit modes
  const ProfileField = ({ 
    label, 
    value, 
    icon, 
    placeholder, 
    secureTextEntry = false, 
    keyboardType = 'default', 
    onChangeText, 
    inputRef, 
    onSubmitEditing 
  }: ProfileFieldProps) => {
    return (
      <View style={styles.fieldContainer}>
        <View style={styles.fieldIconContainer}>
          <Ionicons name={icon} size={22} color="#0039A6" />
        </View>
        <View style={styles.fieldContent}>
          <Text style={styles.fieldLabel}>{label}</Text>
          {isEditing ? (
            <TextInput
              style={styles.fieldInput}
              value={value}
              onChangeText={onChangeText}
              placeholder={placeholder}
              secureTextEntry={secureTextEntry}
              keyboardType={keyboardType}
              ref={inputRef}
              onSubmitEditing={onSubmitEditing}
              returnKeyType={onSubmitEditing ? "next" : "done"}
            />
          ) : (
            <Text style={[styles.fieldValue, !value && styles.fieldValueEmpty]}>
              {value || `Not provided`}
            </Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        style={{backgroundColor: colors.background}}
      >
        <View style={[styles.header, {backgroundColor: colors.background}]}>
          <ThemedText type="title" style={styles.pageTitle}>Profile</ThemedText>
          
          {!isEditing && (
            <Pressable 
              style={[styles.editButton, { backgroundColor: colors.primary + '20' }]} 
              onPress={toggleEditMode}
            >
              <Ionicons name="pencil" size={18} color={colors.primary} />
              <Text style={[styles.editButtonText, { color: colors.primary }]}>Edit Profile</Text>
            </Pressable>
          )}
        </View>
        
        <View style={[styles.card, { 
          backgroundColor: colors.card,
          shadowColor: colors.shadow
        }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Personal Information</Text>
          
          <View style={[styles.fieldContainer, {borderBottomColor: colors.border}]}>
            <View style={[styles.fieldIconContainer, { backgroundColor: colors.primary + '15' }]}>
              <Ionicons name="person-outline" size={22} color={colors.icon} />
            </View>
            <View style={styles.fieldContent}>
              <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Name</Text>
              {isEditing ? (
                <TextInput
                  style={[styles.fieldInput, { 
                    color: colors.inputText,
                    borderBottomColor: colors.primary,
                    backgroundColor: colors.input + '30',
                  }]}
                  value={editedUser.name}
                  onChangeText={(text: string) => setEditedUser({...editedUser, name: text})}
                  placeholder="Full Name"
                  placeholderTextColor={colors.placeholder}
                  onSubmitEditing={() => emailInputRef.current?.focus()}
                  returnKeyType="next"
                  autoFocus
                />
              ) : (
                <Text style={[styles.fieldValue, { color: colors.text }]}>
                  {user.name}
                </Text>
              )}
            </View>
          </View>
        </View>
        
        <View style={[styles.card, { 
          backgroundColor: colors.card,
          shadowColor: colors.shadow,
          marginTop: 16
        }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Contact Information</Text>
          
          <View style={[styles.fieldContainer, {borderBottomColor: colors.border}]}>
            <View style={[styles.fieldIconContainer, { backgroundColor: colors.primary + '15' }]}>
              <Ionicons name="mail-outline" size={22} color={colors.icon} />
            </View>
            <View style={styles.fieldContent}>
              <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Email</Text>
              {isEditing ? (
                <TextInput
                  style={[styles.fieldInput, { 
                    color: colors.inputText,
                    borderBottomColor: colors.primary,
                    backgroundColor: colors.input + '30',
                  }]}
                  value={editedUser.email}
                  onChangeText={(text: string) => setEditedUser({...editedUser, email: text})}
                  placeholder="Enter your email"
                  placeholderTextColor={colors.placeholder}
                  keyboardType="email-address"
                  ref={emailInputRef}
                  onSubmitEditing={() => phoneInputRef.current?.focus()}
                  returnKeyType="next"
                />
              ) : (
                <Text style={[styles.fieldValue, !user.email && styles.fieldValueEmpty, { color: colors.text }]}>
                  {user.email || 'Not provided'}
                </Text>
              )}
            </View>
          </View>
          
          <View style={[styles.fieldContainer, {borderBottomColor: colors.border}]}>
            <View style={[styles.fieldIconContainer, { backgroundColor: colors.primary + '15' }]}>
              <Ionicons name="call-outline" size={22} color={colors.icon} />
            </View>
            <View style={styles.fieldContent}>
              <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Phone</Text>
              {isEditing ? (
                <TextInput
                  style={[styles.fieldInput, { 
                    color: colors.inputText,
                    borderBottomColor: colors.primary,
                    backgroundColor: colors.input + '30',
                  }]}
                  value={editedUser.phone}
                  onChangeText={(text: string) => setEditedUser({...editedUser, phone: text})}
                  placeholder="Enter your phone number"
                  placeholderTextColor={colors.placeholder}
                  keyboardType="phone-pad"
                  ref={phoneInputRef}
                  onSubmitEditing={() => addressInputRef.current?.focus()}
                  returnKeyType="next"
                />
              ) : (
                <Text style={[styles.fieldValue, !user.phone && styles.fieldValueEmpty, { color: colors.text }]}>
                  {user.phone || 'Not provided'}
                </Text>
              )}
            </View>
          </View>
          
          <View style={[styles.fieldContainer, {borderBottomColor: colors.border}]}>
            <View style={[styles.fieldIconContainer, { backgroundColor: colors.primary + '15' }]}>
              <Ionicons name="home-outline" size={22} color={colors.icon} />
            </View>
            <View style={styles.fieldContent}>
              <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Address</Text>
              {isEditing ? (
                <TextInput
                  style={[styles.fieldInput, { 
                    color: colors.inputText,
                    borderBottomColor: colors.primary,
                    backgroundColor: colors.input + '30',
                  }]}
                  value={editedUser.address}
                  onChangeText={(text: string) => setEditedUser({...editedUser, address: text})}
                  placeholder="Enter your address"
                  placeholderTextColor={colors.placeholder}
                  ref={addressInputRef}
                  returnKeyType="done"
                />
              ) : (
                <Text style={[styles.fieldValue, !user.address && styles.fieldValueEmpty, { color: colors.text }]}>
                  {user.address || 'Not provided'}
                </Text>
              )}
            </View>
          </View>
          

        </View>
        
        {isEditing && (
          <View style={[styles.actionButtons, {backgroundColor: colors.background}]}>
            <Pressable 
              style={[styles.button, styles.cancelButton, { borderColor: colors.border }]} 
              onPress={handleCancel}
            >
              <Text style={[styles.cancelButtonText, { color: colors.textSecondary }]}>Cancel</Text>
            </Pressable>
            <Pressable 
              style={[styles.button, styles.saveButton, { backgroundColor: colors.primary }]} 
              onPress={handleSave}
            >
              <Text style={[styles.saveButtonText, { color: isDarkMode ? '#fff' : '#fff' }]}>Save Changes</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 10,
    paddingHorizontal: 16,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  editButtonText: {
    marginLeft: 5,
    fontWeight: '500',
  },
  card: {
    borderRadius: 12,
    marginHorizontal: 16,
    padding: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  fieldContainer: {
    flexDirection: 'row',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: undefined, // Will be set dynamically with colors.border
  },
  fieldIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  fieldContent: {
    flex: 1,
    justifyContent: 'center',
  },
  fieldLabel: {
    fontSize: 14,
    marginBottom: 6,
  },
  fieldValue: {
    fontSize: 16,
  },
  fieldValueEmpty: {
    fontStyle: 'italic',
  },
  fieldInput: {
    fontSize: 16,
    paddingVertical: Platform.OS === 'ios' ? 8 : 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderBottomWidth: 1,
    marginTop: 2,
    marginBottom: 2,
    minHeight: 40,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginHorizontal: 16,
    marginBottom: 10,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    marginRight: 10,
  },
  cancelButtonText: {
    fontWeight: '600',
  },
  saveButton: {
    marginLeft: 10,
  },
  saveButtonText: {
    fontWeight: '600',
  },
});
