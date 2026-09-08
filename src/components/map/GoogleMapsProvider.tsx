import React, { createContext, useContext, useMemo } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';

interface MapsContextValue {
  hasApiKey: boolean;
  apiKey: string;
}

const MapsContext = createContext<MapsContextValue>({
  hasApiKey: false,
  apiKey: '',
});

export const useMapsContext = () => useContext(MapsContext);

interface GoogleMapsProviderProps {
  children: React.ReactNode;
}

export const GoogleMapsProvider: React.FC<GoogleMapsProviderProps> = ({ children }) => {
  const apiKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || '';
  const hasApiKey = Boolean(apiKey && apiKey.trim().length > 0);

  const contextValue = useMemo(
    () => ({
      hasApiKey,
      apiKey,
    }),
    [hasApiKey, apiKey]
  );

  if (!hasApiKey) {
    return <MapsContext.Provider value={contextValue}>{children}</MapsContext.Provider>;
  }

  return (
    <APIProvider
      apiKey={apiKey}
      libraries={['places', 'routes', 'geometry', 'marker']}
      region="IN"
      language="en"
    >
      <MapsContext.Provider value={contextValue}>{children}</MapsContext.Provider>
    </APIProvider>
  );
};
