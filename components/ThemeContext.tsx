import { createContext, useContext, useState, ReactNode } from 'react';

export type Theme = 'red' | 'blue' | 'black';

export interface ThemeColors {
  primary: string;
  secondary: string;
  tertiary: string;
}

const themeColors: Record<Theme, ThemeColors> = {
  red: {
    primary: '#df3b3b',
    secondary: '#ffc0c0',
    tertiary: '#ffeded'
  },
  blue: {
    primary: '#3526D4',
    secondary: '#D4D0FF',
    tertiary: '#E4E2FF'
  },
  black: {
    primary: '#171717',
    secondary: '#DDDDDD',
    tertiary: '#E9E9E9'
  }
};

interface ThemeContextType {
  theme: Theme;
  colors: ThemeColors;
  cycleTheme: () => void;
  getThemeName: () => string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('red');

  const cycleTheme = () => {
    setTheme(current => {
      switch (current) {
        case 'red': return 'blue';
        case 'blue': return 'black';
        case 'black': return 'red';
        default: return 'red';
      }
    });
  };

  const getThemeName = () => {
    switch (theme) {
      case 'red': return 'Red Theme';
      case 'blue': return 'Blue Theme';
      case 'black': return 'Black Theme';
      default: return 'Red Theme';
    }
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      colors: themeColors[theme],
      cycleTheme,
      getThemeName
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}