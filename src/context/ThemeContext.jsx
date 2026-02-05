import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('space'); // 'space', 'ocean', 'jungle', 'dino'

  // Sound placeholders
  const playSound = (type) => {
    // In strict browser environments, audio context needs user interaction first.
    // This is where we would trigger distinct, friendly sounds.
    console.log(`Playing sound: ${type}`);
    if (type === 'success') {
      // e.g., chime
    } else if (type === 'error') {
      // e.g., gentle wobble sound
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, playSound }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
