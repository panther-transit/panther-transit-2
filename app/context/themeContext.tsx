import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme as useDeviceColorScheme, AppState, AppStateStatus, ColorSchemeName } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export type ThemeMode = 'system' | 'light' | 'dark';

type ThemeContextType = {
  themeMode: ThemeMode;
  isDarkMode: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  systemColorScheme: ColorSchemeName;
};

const THEME_STORAGE_KEY = 'panthertransit:themeMode';

const ThemeContext = createContext<ThemeContextType>({
  themeMode: 'system',
  isDarkMode: false,
  setThemeMode: () => {},
  systemColorScheme: 'light',
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [isLoaded, setIsLoaded] = useState(false);
  const deviceColorScheme = useDeviceColorScheme();
  
  // Determine if dark mode should be active based on theme mode and device settings
  const isDarkMode = 
    themeMode === 'system' 
      ? deviceColorScheme === 'dark'
      : themeMode === 'dark';

  // Monitor for system theme changes
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      // When app comes back to the foreground, check if system theme changed
      if (nextAppState === 'active' && themeMode === 'system') {
        // No need to update state here since useDeviceColorScheme will update automatically
      }
    });

    return () => {
      subscription.remove();
    };
  }, [themeMode]);

  // Load stored theme on startup
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (storedTheme !== null) {
          setThemeModeState(storedTheme as ThemeMode);
        }
        setIsLoaded(true);
      } catch (error) {
        console.error('Failed to load theme preference:', error);
        setIsLoaded(true);
      }
    };
    loadTheme();
  }, []);

  const setThemeMode = async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
      setThemeModeState(mode);
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };

  // Don't render children until theme is loaded to prevent flashing
  if (!isLoaded) {
    return null;
  }

  return (
    <>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <ThemeContext.Provider 
        value={{
          themeMode, 
          isDarkMode, 
          setThemeMode,
          systemColorScheme: deviceColorScheme,
        }}
      >
        {children}
      </ThemeContext.Provider>
    </>
  );
};

export const useTheme = () => useContext(ThemeContext);
