import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext({
  isDarkMode: false,
  toggleDarkMode: () => {},
  setIsDarkMode: (value: boolean) => {},
});

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      const storedTheme = await AsyncStorage.getItem('darkMode');
      if (storedTheme !== null) {
        setIsDarkMode(storedTheme === 'true');
      }
    };
    loadTheme();
  }, []);

  const toggleDarkMode = async () => {
    setIsDarkMode((prevMode) => {
      const newDarkMode = !prevMode;
      AsyncStorage.setItem('darkMode', newDarkMode.toString());
      return newDarkMode;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, setIsDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
