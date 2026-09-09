import React, { useState } from 'react';
import { LandingHeroView } from '../landing/LandingHeroView';
import { Language, LocationData } from '../../types/krishi';

type Props = {
  language: Language;
  onStartWorkflow: (step?: number) => void;
};

export const PlatformOverview: React.FC<Props> = ({ language, onStartWorkflow }) => {
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationData>({
    latitude: 20.5937,
    longitude: 78.9629,
    country: 'India',
    state: 'India',
    district: '',
    city: '',
    town: '',
    formattedAddress: 'India',
    source: 'search',
  });

  const detectLocation = () => {
    if (!navigator.geolocation) {
      onStartWorkflow(1);
      return;
    }
    setIsDetectingGps(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation((previous) => ({
          ...previous,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          formattedAddress: `${position.coords.latitude.toFixed(5)}, ${position.coords.longitude.toFixed(5)}`,
          source: 'gps',
        }));
        setIsDetectingGps(false);
        onStartWorkflow(1);
      },
      () => {
        setIsDetectingGps(false);
        onStartWorkflow(1);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
    );
  };

  return (
    <LandingHeroView
      language={language}
      onStartJourney={() => onStartWorkflow(2)}
      onDetectLocation={detectLocation}
      isDetectingGps={isDetectingGps}
      currentLocation={currentLocation}
    />
  );
};
