/**
 * Comprehensive color system for the Panther Transit app.
 * Defines colors for both light and dark themes with semantic names.
 */

// Base color palette - GSU colors and complementary colors
const pantherBlue = '#0039A6';      // GSU primary blue 
const pantherBlueLight = '#0A7EA4'; // Lighter blue (previously used)
const pantherBlueAccent = '#005CE6'; // Slightly lighter blue for accents
const pantherBlueDark = '#002C7F';  // Darker blue for dark mode

// Common colors
const white = '#FFFFFF';
const black = '#000000';
const gray50 = '#F8F9FA';
const gray100 = '#F1F3F5';
const gray200 = '#E9ECEF';
const gray300 = '#DEE2E6';
const gray400 = '#CED4DA';
const gray500 = '#ADB5BD';
const gray600 = '#6C757D';
const gray700 = '#495057';
const gray800 = '#343A40';
const gray900 = '#212529';

// Dark mode specific colors
const darkBackground = '#121212';
const darkSurface = '#1E1E1E';
const darkSurfaceHighlight = '#2D2D2D';
const darkBorder = '#333333';
const darkTabBackground = '#000000'; // Pure black for tab bar

// For interactive elements like buttons
const success = '#28A745';
const successDark = '#1E7E34';
const warning = '#FFC107';
const warningDark = '#D39E00';
const danger = '#DC3545';
const dangerDark = '#BD2130';
const info = '#17A2B8';
const infoDark = '#138496';

// Semantic color mapping
export const Colors = {
  light: {
    // Base colors
    primary: pantherBlue,
    primaryLight: pantherBlueLight,
    primaryDark: pantherBlueDark,
    accent: pantherBlueAccent,
    
    // Background colors
    background: white,
    surface: gray50,
    surfaceHighlight: gray100,
    card: white,
    cardHighlight: gray100,
    
    // Text colors
    text: gray900,
    textSecondary: gray700,
    textMuted: gray600,
    textInverted: white,
    
    // Border colors
    border: gray300,
    borderLight: gray200,
    borderDark: gray400,
    
    // Icon colors
    icon: pantherBlue,
    iconMuted: gray600,
    iconDisabled: gray400,
    
    // Status colors
    success: success,
    warning: warning,
    danger: danger,
    info: info,
    
    // Tab navigation
    tabBackground: gray50,
    tabIconDefault: gray600,
    tabIconSelected: pantherBlue,
    tint: pantherBlue,
    
    // Specific UI elements
    divider: gray200,
    input: gray100,
    inputText: gray900,
    placeholder: gray500,
    shadow: gray400,
  },
  dark: {
    // Base colors
    primary: pantherBlueLight,    // Lighter blue in dark mode for better contrast
    primaryLight: pantherBlueAccent,
    primaryDark: pantherBlue,
    accent: '#3D8EF7',            // Brighter blue for accents in dark mode
    
    // Background colors
    background: darkBackground,
    surface: darkSurface,
    surfaceHighlight: darkSurfaceHighlight,
    card: darkSurface,
    cardHighlight: darkSurfaceHighlight,
    
    // Text colors
    text: white,
    textSecondary: gray300,
    textMuted: gray400,
    textInverted: gray900,
    
    // Border colors
    border: darkBorder,
    borderLight: '#444444',
    borderDark: '#555555',
    
    // Icon colors
    icon: pantherBlueLight,
    iconMuted: gray400,
    iconDisabled: gray600,
    
    // Status colors
    success: successDark,
    warning: warningDark,
    danger: dangerDark,
    info: infoDark,
    
    // Tab navigation
    tabBackground: darkTabBackground,
    tabIconDefault: '#888888', // Medium gray for unselected icons
    tabIconSelected: '#4DA6FF', // Bright blue for selected icons
    tint: '#4DA6FF', // Matching tint color
    
    // Specific UI elements
    divider: darkBorder,
    input: darkSurfaceHighlight,
    inputText: white,
    placeholder: gray500,
    shadow: 'rgba(0, 0, 0, 0.5)',
  },
};
