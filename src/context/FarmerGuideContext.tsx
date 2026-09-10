import React, { createContext, useContext, useState, useEffect } from 'react';

export type GuideStepId =
  | 'start-language'
  | 'start-location'
  | 'start-role'
  | 'farmer-crop'
  | 'farmer-details'
  | 'farmer-photos'
  | 'farmer-quality'
  | 'farmer-markets'
  | 'farmer-contact'
  | 'farmer-publish'
  | 'buyer-browse'
  | 'buyer-bid'
  | 'idle';

interface FarmerGuideContextType {
  guideStepId: GuideStepId;
  setGuideStepId: (step: GuideStepId) => void;
  targetSelector: string;
  setTargetSelector: (sel: string) => void;
  isGuideVisible: boolean;
  setIsGuideVisible: (visible: boolean) => void;
  toggleGuide: () => void;
  isDismissed: boolean;
  dismissGuide: () => void;
  resetGuide: () => void;
}

const FarmerGuideContext = createContext<FarmerGuideContextType | undefined>(undefined);

export const FarmerGuideProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [guideStepId, setGuideStepId] = useState<GuideStepId>('start-language');
  const [targetSelector, setTargetSelector] = useState<string>('#guide-language-step');
  const [isGuideVisible, setIsGuideVisible] = useState<boolean>(true);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  const toggleGuide = () => {
    setIsGuideVisible((prev) => !prev);
  };

  const dismissGuide = () => {
    setIsGuideVisible(false);
    setIsDismissed(true);
  };

  const resetGuide = () => {
    setIsDismissed(false);
    setIsGuideVisible(true);
  };

  return (
    <FarmerGuideContext.Provider
      value={{
        guideStepId,
        setGuideStepId,
        targetSelector,
        setTargetSelector,
        isGuideVisible,
        setIsGuideVisible,
        toggleGuide,
        isDismissed,
        dismissGuide,
        resetGuide,
      }}
    >
      {children}
    </FarmerGuideContext.Provider>
  );
};

const defaultGuideContext: FarmerGuideContextType = {
  guideStepId: 'idle',
  setGuideStepId: () => {},
  targetSelector: '',
  setTargetSelector: () => {},
  isGuideVisible: false,
  setIsGuideVisible: () => {},
  toggleGuide: () => {},
  isDismissed: true,
  dismissGuide: () => {},
  resetGuide: () => {},
};

export const useFarmerGuide = (): FarmerGuideContextType => {
  const ctx = useContext(FarmerGuideContext);
  if (!ctx) {
    return defaultGuideContext;
  }
  return ctx;
};
