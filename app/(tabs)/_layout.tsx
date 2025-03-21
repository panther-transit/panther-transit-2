import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useAppTheme } from '@/hooks/useAppTheme';

export default function TabLayout() {
  const { isDarkMode, colors } = useAppTheme();
  
  // Use either the system color scheme or our custom dark mode setting
  const effectiveColorScheme = isDarkMode ? 'dark' : 'light';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colors.tabIconDefault,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: isDarkMode ? {
          backgroundColor: colors.tabBackground,
          borderTopColor: 'rgba(50, 50, 50, 0.5)', // Subtle border
        } : Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="weather"
        options={{
          title: 'Weather',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="cloud.sun.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="martaHome"
        options={{
          title: 'MARTA',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="bus.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="parkingHome"
        options={{
          title: 'Parking',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="car.fill" color={color} />,
        }}
      />
     
      <Tabs.Screen
        name="MapScreen"
        options={{  
          title: 'Google Map',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="car.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
