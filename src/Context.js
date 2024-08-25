// Context.js
import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [sharedData, setSharedData] = useState('');
  const [advertDetails, setAdvertDetails] = useState('');

  return (
    <AppContext.Provider value={{ sharedData, setSharedData, advertDetails, setAdvertDetails }}>
      {children}
    </AppContext.Provider>
  );
};
