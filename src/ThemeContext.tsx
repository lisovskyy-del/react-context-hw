import React, { createContext, useContext, useState, type ReactNode } from 'react';
import type {ThemeContextType} from './types';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false)

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const nextMode = !prev

      document.body.style.backgroundColor = nextMode ? '#121212' : '#ffffff';
      document.body.style.color = nextMode ? '#ffffff' : '#000000';

      return nextMode
    })
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

  return context
}