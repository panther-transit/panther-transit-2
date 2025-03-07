import { createContext, useContext, useState, ReactNode } from 'react';
import { Appearance } from 'react-native';

const ThemeContext = createContext({
  darkMode: Appearance.getColorScheme() === 'dark',
  toggleDarkMode: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [darkMode, setDarkMode] = useState(Appearance.getColorScheme() === 'dark');

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
