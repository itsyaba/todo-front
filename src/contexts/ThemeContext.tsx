import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import axios from 'axios';

type Theme = {
  variant: 'professional' | 'tint' | 'vibrant';
  primary: string;
  appearance: 'light' | 'dark' | 'system';
  radius: number;
};

interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  isLoading: boolean;
}

const defaultTheme: Theme = {
  variant: 'professional',
  primary: 'hsl(340, 82%, 52%)',
  appearance: 'dark',
  radius: 0.5
};

const ThemeContext = createContext<ThemeContextProps>({
  theme: defaultTheme,
  toggleTheme: () => {},
  setTheme: () => {},
  isLoading: false
});

// Using a named function instead of arrow function for better React Fast Refresh compatibility
export function useTheme() {
  return useContext(ThemeContext);
}

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load theme from localStorage on initial load
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      try {
        setThemeState(JSON.parse(savedTheme));
      } catch (e) {
        console.error('Error parsing theme from localStorage:', e);
      }
    }
  }, []);

  useEffect(() => {
    // Update localStorage when theme changes
    localStorage.setItem('theme', JSON.stringify(theme));
    
    // Apply theme to HTML element
    document.documentElement.setAttribute('data-theme', theme.appearance);
    
    // Update the document's class for dark mode (using Tailwind's dark mode)
    if (theme.appearance === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Log the theme change for debugging
    console.log('Theme changed to:', theme.appearance);
    
    // Optionally fetch external theme data
    const fetchExternalTheme = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('https://test-project-mu-gules.vercel.app/');
        // Process the response if needed
        console.log('External theme data:', response.data);
        // If you want to apply external theme data, you can do it here
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching external theme:', error);
        setIsLoading(false);
      }
    };

    fetchExternalTheme();
  }, [theme]);

  const toggleTheme = () => {
    setThemeState(prev => ({
      ...prev,
      appearance: prev.appearance === 'dark' ? 'light' : 'dark'
    }));
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
};