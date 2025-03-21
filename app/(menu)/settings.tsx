import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons, Ionicons as Icon } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useTheme, ThemeMode } from '../context/themeContext';

// Custom radio button component for theme selection
type ThemeRadioButtonProps = {
  selected: boolean;
  onPress: () => void;
  label: string;
  icon: keyof typeof Icon.glyphMap;
};

const ThemeRadioButton: React.FC<ThemeRadioButtonProps> = ({ selected, onPress, label, icon }) => {
  const { isDarkMode } = useTheme();
  
  return (
    <TouchableOpacity 
      style={[
        styles.radioOption, 
        selected && styles.radioSelected,
        isDarkMode && styles.darkRadioOption,
        selected && isDarkMode && styles.darkRadioSelected
      ]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.radioIconContainer}>
        <Ionicons 
          name={icon} 
          size={24} 
          color={selected ? '#0039A6' : isDarkMode ? '#888' : '#555'} 
        />
      </View>
      <Text style={[
        styles.radioLabel, 
        selected && styles.radioLabelSelected,
        isDarkMode && styles.darkText
      ]}>
        {label}
      </Text>
      <View style={[
        styles.radioButton, 
        selected && styles.radioButtonSelected,
        isDarkMode && styles.darkRadioButton,
        selected && isDarkMode && styles.darkRadioButtonSelected
      ]}>
        {selected && (
          <View style={styles.radioButtonInner} />
        )}
      </View>
    </TouchableOpacity>
  );
};

// Settings section component
type SettingsSectionProps = {
  title: string;
  children: React.ReactNode;
};

const SettingsSection: React.FC<SettingsSectionProps> = ({ title, children }) => {
  const { isDarkMode } = useTheme();
  
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
        {title}
      </Text>
      <BlurView 
        intensity={isDarkMode ? 20 : 40} 
        tint={isDarkMode ? 'dark' : 'light'} 
        style={[
          styles.sectionContent,
          isDarkMode && styles.darkSectionContent
        ]}
      >
        {children}
      </BlurView>
    </View>
  );
};

// Settings item component
type SettingsItemProps = {
  icon: keyof typeof Icon.glyphMap;
  title: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
};

const SettingsItem: React.FC<SettingsItemProps> = ({ icon, title, onPress, rightElement }) => {
  const { isDarkMode } = useTheme();
  
  return (
    <TouchableOpacity 
      style={styles.settingsItem} 
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      <View style={styles.settingsItemLeft}>
        <View style={[
          styles.iconContainer, 
          isDarkMode && styles.darkIconContainer
        ]}>
          <Ionicons 
            name={icon} 
            size={20} 
            color={isDarkMode ? '#fff' : '#0039A6'} 
          />
        </View>
        <Text style={[
          styles.settingsItemTitle,
          isDarkMode && styles.darkText
        ]}>
          {title}
        </Text>
      </View>
      {rightElement ? (
        rightElement
      ) : (
        <Ionicons 
          name="chevron-forward" 
          size={20} 
          color={isDarkMode ? '#888' : '#999'} 
        />
      )}
    </TouchableOpacity>
  );
};

export default function SettingsHome() {
  const { themeMode, isDarkMode, setThemeMode } = useTheme();

  return (
    <ScrollView 
      style={[styles.container, isDarkMode && styles.darkBackground]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={[styles.title, isDarkMode && styles.darkText]}>Settings</Text>
      </View>
      
      {/* Appearance Section */}
      <SettingsSection title="Appearance">
        <View style={styles.themeOptions}>
          <ThemeRadioButton 
            selected={themeMode === 'system'} 
            onPress={() => setThemeMode('system')}
            label="System"
            icon="phone-portrait-outline"
          />
          <ThemeRadioButton 
            selected={themeMode === 'light'} 
            onPress={() => setThemeMode('light')}
            label="Light"
            icon="sunny-outline"
          />
          <ThemeRadioButton 
            selected={themeMode === 'dark'} 
            onPress={() => setThemeMode('dark')}
            label="Dark"
            icon="moon-outline"
          />
        </View>
      </SettingsSection>
      
      {/* Account Section */}
      <SettingsSection title="Account">
        <SettingsItem 
          icon="person-outline" 
          title="Profile" 
          onPress={() => router.push('/(menu)/profile')}
        />
        <View style={styles.divider} />
        <SettingsItem 
          icon="notifications-outline" 
          title="Notifications" 
          onPress={() => router.push('/(menu)/notifications')}
        />
      </SettingsSection>
      
      {/* App Settings Section removed as requested */}
      
      {/* About Section */}
      <SettingsSection title="About">
        <SettingsItem 
          icon="information-circle-outline" 
          title="About Panther Transit" 
          onPress={() => {}}
        />
        <View style={styles.divider} />
        <SettingsItem 
          icon="help-circle-outline" 
          title="Help & Support" 
          onPress={() => {}}
        />
        <View style={styles.divider} />
        <SettingsItem 
          icon="document-text-outline" 
          title="Privacy Policy" 
          onPress={() => {}}
        />
      </SettingsSection>
      
      <View style={styles.versionContainer}>
        <Text style={[styles.versionText, isDarkMode && styles.darkVersionText]}>
          Panther Transit v1.0.0
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  darkBackground: {
    backgroundColor: '#121212',
  },
  contentContainer: {
    paddingBottom: 40,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#0039A6',
  },
  darkText: {
    color: '#FFFFFF',
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#0039A6',
    paddingLeft: 8,
  },
  sectionContent: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  darkSectionContent: {
    backgroundColor: 'rgba(50, 50, 50, 0.5)',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 57, 166, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  darkIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingsItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  divider: {
    height: 0.5,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    marginHorizontal: 16,
  },
  settingValue: {
    fontSize: 16,
    color: '#888',
  },
  darkSettingValue: {
    color: '#aaa',
  },
  themeOptions: {
    paddingVertical: 8,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
  },
  darkRadioOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  radioSelected: {
    backgroundColor: 'rgba(0, 57, 166, 0.1)',
  },
  darkRadioSelected: {
    backgroundColor: 'rgba(0, 57, 166, 0.2)',
  },
  radioIconContainer: {
    marginRight: 16,
  },
  radioLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  radioLabelSelected: {
    color: '#0039A6',
    fontWeight: '600',
  },
  radioButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkRadioButton: {
    borderColor: '#555',
  },
  radioButtonSelected: {
    borderColor: '#0039A6',
  },
  darkRadioButtonSelected: {
    borderColor: '#0039A6',
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#0039A6',
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  versionText: {
    fontSize: 14,
    color: '#888',
  },
  darkVersionText: {
    color: '#666',
  },
});
