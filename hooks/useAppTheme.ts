import { useTheme } from '../app/context/themeContext';
import { Colors } from '../constants/Colors';
import { ColorSchemeName, useColorScheme as useDeviceColorScheme } from 'react-native';

/**
 * A hook that provides access to all theme-related values and colors
 * This combines both the custom theme settings and the system's color scheme
 */
export function useAppTheme() {
  const { themeMode, isDarkMode, setThemeMode } = useTheme();
  const deviceColorScheme = useDeviceColorScheme();
  
  // If themeMode is 'system', use the device's color scheme, otherwise use our themeMode value
  const effectiveColorScheme: ColorSchemeName = 
    themeMode === 'system' 
      ? deviceColorScheme 
      : themeMode === 'dark' ? 'dark' : 'light';
      
  // Get the appropriate color palette based on the effective color scheme
  const colors = effectiveColorScheme === 'dark' ? Colors.dark : Colors.light;
  
  return {
    // Theme mode state and controls
    themeMode,
    isDarkMode: effectiveColorScheme === 'dark',
    setThemeMode,
    
    // System color scheme
    deviceColorScheme,
    
    // The color scheme that should actually be used
    colorScheme: effectiveColorScheme,
    
    // All colors for the current theme
    colors,
    
    // Helper function to create styles that adapt to the theme
    createThemedStyles: (lightStyles: object, darkStyles: object) => {
      return effectiveColorScheme === 'dark' ? { ...lightStyles, ...darkStyles } : lightStyles;
    }
  };
}
