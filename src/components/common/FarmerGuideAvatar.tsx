import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, ChevronRight, MessageSquare } from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

export interface GuideAvatarProps {
  role?: 'farmer' | 'buyer';
  currentContext?:
    | 'welcome'
    | 'cropSelect'
    | 'quantity'
    | 'unit'
    | 'photos'
    | 'publishing'
    | 'bids'
    | 'buyerWelcome'
    | 'buyerSearch'
    | 'buyerBidding';
  onActionClick?: () => void;
  actionText?: string;
}

export const FarmerGuideAvatar: React.FC<GuideAvatarProps> = ({
  role = 'farmer',
  currentContext = 'welcome',
  onActionClick,
  actionText,
}) => {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  if (isDismissed) {
    return (
      <button
        onClick={() => setIsDismissed(false)}
        className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-emerald-600 dark:bg-emerald-500 text-white shadow-xl flex items-center justify-center text-xl hover:scale-110 active:scale-95 transition-all cursor-pointer border-2 border-white dark:border-stone-800"
        title="Open Guide Assistant"
        aria-label="Open Guide Assistant"
      >
        {role === 'farmer' ? '👨‍🌾' : '🏢'}
      </button>
    );
  }

  const getMessage = (): string => {
    switch (currentContext) {
      case 'cropSelect':
        return t('guide.cropSelect', '🌾 Search for your crop or choose it from the catalogue below.');
      case 'quantity':
        return t('guide.quantity', '📦 Enter how much produce you want to sell.');
      case 'unit':
        return t('guide.unit', '⚖️ Choose Kilograms (KG) or Quintals.');
      case 'photos':
        return t('guide.photos', '📸 Upload clear crop photos so buyers can inspect your produce.');
      case 'publishing':
        return t('guide.publishing', '🚀 Great! Your listing is ready to reach buyers.');
      case 'bids':
        return t('guide.bidsReceived', '💰 You have received new offers! Compare them before choosing.');
      case 'buyerSearch':
        return t('guide.buyerSearch', '🔍 Try filtering by crop, distance, and quantity.');
      case 'buyerBidding':
        return t('guide.buyerBidding', '💡 A competitive offer increases your chance of being selected by the farmer.');
      case 'buyerWelcome':
        return t('guide.buyerWelcome', "👋 Welcome! Let's find the right crops near your hub.");
      case 'welcome':
      default:
        return role === 'farmer'
          ? t('guide.welcome', "👋 Welcome! Let's help you find the best market for your crop.")
          : t('guide.buyerWelcome', "👋 Welcome! Let's find the right crops near your hub.");
    }
  };

  return (
    <aside aria-label="Agricultural Guide" className="fixed bottom-6 right-6 z-40 flex flex-col items-end max-w-sm pointer-events-none">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className={`pointer-events-auto mb-3 p-4 rounded-2xl shadow-xl border backdrop-blur-md transition-colors ${
              isDarkMode
                ? 'bg-stone-900/95 border-stone-700 text-stone-100 shadow-stone-950/50'
                : 'bg-white/95 border-stone-200 text-stone-900 shadow-stone-300/40'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{role === 'farmer' ? '👨‍🌾' : '🏢'}</span>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  {role === 'farmer' ? 'AgriSaathi Guide' : 'Procurement Assistant'}
                </span>
              </div>
              <button
                onClick={() => setIsDismissed(true)}
                className="p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                title="Dismiss message"
                aria-label="Dismiss guide message"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Message */}
            <p className="text-xs leading-relaxed text-stone-700 dark:text-stone-300 mb-3 font-medium">
              {getMessage()}
            </p>

            {/* Action button if provided */}
            {onActionClick && (
              <button
                onClick={onActionClick}
                className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
              >
                <span>{actionText || t('guide.letsStart', "Let's Start")}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Avatar trigger */}
      <button
        onClick={() => setIsExpanded((prev) => !prev)}
        className="pointer-events-auto w-14 h-14 rounded-full bg-emerald-600 dark:bg-emerald-500 text-white shadow-2xl flex items-center justify-center text-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer border-2 border-white dark:border-stone-800"
        title="Toggle Assistant"
        aria-label="Toggle Guide Assistant"
      >
        <motion.span
          animate={{ rotate: [0, -6, 6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          {role === 'farmer' ? '👨‍🌾' : '🏢'}
        </motion.span>
      </button>
    </aside>
  );
};
