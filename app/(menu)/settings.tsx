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
import { useAppTheme } from '../../hooks/useAppTheme';

// Custom radio button component for theme selection
type ThemeRadioButtonProps = {
  selected: boolean;
  onPress: () => void;
  label: string;
  icon: keyof typeof Icon.glyphMap;
};

const ThemeRadioButton: React.FC<ThemeRadioButtonProps> = ({ selected, onPress, label, icon }) => {
  const { isDarkMode, colors } = useAppTheme();
  
  return (
    <TouchableOpacity 
      style={[
        styles.radioOption, 
        { 
          backgroundColor: isDarkMode 
            ? colors.surfaceHighlight
            : 'rgba(0, 0, 0, 0.03)'
        },
        selected && {
          borderColor: colors.primary
        }
      ]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.radioIconContainer}>
        <Ionicons 
          name={icon} 
          size={24} 
          color={selected ? colors.primary : isDarkMode ? colors.textMuted : colors.textSecondary} 
        />
      </View>
      <Text style={[
        styles.radioLabel, 
        { color: isDarkMode ? colors.text : colors.textSecondary },
        selected && { color: colors.primary, fontWeight: '600' }
      ]}>
        {label}
      </Text>
      <View style={[
        styles.radioButton, 
        { 
          borderColor: selected 
            ? colors.primary 
            : isDarkMode ? colors.border : colors.borderLight 
        }
      ]}>
        {selected && (
          <View style={[styles.radioButtonInner, { backgroundColor: colors.primary }]} />
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
  const { isDarkMode, colors } = useAppTheme();
  
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.primary }]}>
        {title}
      </Text>
      <BlurView 
        intensity={isDarkMode ? 20 : 40} 
        tint={isDarkMode ? 'dark' : 'light'} 
        style={[
          styles.sectionContent,
          { backgroundColor: isDarkMode ? 'rgba(50, 50, 50, 0.5)' : 'rgba(255, 255, 255, 0.7)' }
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
  const { isDarkMode, colors } = useAppTheme();
  
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
            color={isDarkMode ? colors.text : colors.primary} 
          />
        </View>
        <Text style={[
          styles.settingsItemTitle,
          { color: colors.text }
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
          color={isDarkMode ? colors.textMuted : colors.textSecondary} 
        />
      )}
    </TouchableOpacity>
  );
};

export default function SettingsHome() {
  const { themeMode, setThemeMode } = useTheme();
  const { isDarkMode, colors } = useAppTheme();

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.primary }]}>Settings</Text>
      </View>
      
      {/* Account Section - Moved to top */}
      <SettingsSection title="Account">
        <SettingsItem 
          icon="person-outline" 
          title="Profile" 
          onPress={() => router.push('/(menu)/profile')}
        />
        <View style={[styles.divider, { backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }]} />
        <SettingsItem 
          icon="notifications-outline" 
          title="Notifications" 
          onPress={() => router.push('/(menu)/notifications')}
        />
      </SettingsSection>
      
      {/* Appearance Section - Moved below account */}
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
      
      {/* App Settings Section removed as requested */}
      
      {/* About Section */}
      <SettingsSection title="About">
        <SettingsItem 
          icon="information-circle-outline" 
          title="About Panther Transit" 
          onPress={() => {}}
        />
        <View style={[styles.divider, { backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }]} />
        <SettingsItem 
          icon="help-circle-outline" 
          title="Help & Support" 
          onPress={() => {}}
        />
        <View style={[styles.divider, { backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }]} />
        <SettingsItem 
          icon="document-text-outline" 
          title="Privacy Policy" 
          onPress={() => {}}
        />
      </SettingsSection>
      
      <View style={styles.versionContainer}>
        <Text style={[styles.versionText, { color: colors.textMuted }]}>
          Panther Transit v1.0.0
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    paddingLeft: 8,
  },
  sectionContent: {
    borderRadius: 16,
    overflow: 'hidden',
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
  },
  divider: {
    height: 0.5,
    marginHorizontal: 16,
  },
  settingValue: {
    fontSize: 16,
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
    borderWidth: 1,
    borderColor: 'transparent',
  },
  radioIconContainer: {
    marginRight: 16,
  },
  radioLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  radioButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  versionText: {
    fontSize: 14,
  },
});
