import React from 'react';
import { LocationData } from '../../types/krishi';
import { CinematicLeafletMap } from '../map/CinematicLeafletMap';

interface IndiaMapZoomExperienceProps {
  location: LocationData;
  onConfirm: () => void;
  onChangeLocationClick: () => void;
  onSelectCoordinates?: (lat: number, lng: number) => Promise<void> | void;
  isDetecting: boolean;
  onRetryGps?: () => void;
}

export const IndiaMapZoomExperience: React.FC<IndiaMapZoomExperienceProps> = ({
  location,
  onConfirm,
  onChangeLocationClick,
  onSelectCoordinates,
  isDetecting,
  onRetryGps,
}) => {
  return (
    <div className="w-full">
      <CinematicLeafletMap
        location={location}
        onConfirm={onConfirm}
        onChangeLocationClick={onChangeLocationClick}
        onSelectCoordinates={onSelectCoordinates}
        onRetryGps={onRetryGps}
        isDetecting={isDetecting}
      />
    </div>
  );
};
