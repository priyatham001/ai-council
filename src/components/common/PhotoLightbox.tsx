import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Tag, User, Download, Heart } from 'lucide-react';
import { GalleryPhoto } from '../../types';

interface PhotoLightboxProps {
  photo: GalleryPhoto | null;
  onClose: () => void;
}

export const PhotoLightbox: React.FC<PhotoLightboxProps> = ({ photo, onClose }) => {
  const [isLiked, setIsLiked] = React.useState(false);

  if (!photo) return null;

  return (
    <AnimatePresence>
      <div 
        id="photo-lightbox-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            id="btn-close-lightbox"
            onClick={onClose}
            aria-label="Close lightbox"
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 text-slate-700 hover:bg-white hover:text-slate-900 flex items-center justify-center shadow-md transition-all cursor-pointer hover:scale-105"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[85vh] overflow-y-auto">
            {/* Image side */}
            <div className="lg:col-span-8 bg-amber-50 flex items-center justify-center relative min-h-[300px] lg:min-h-[460px]">
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-full object-cover max-h-[550px]"
                loading="eager"
              />
              <span className="absolute top-4 left-4 bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                {photo.category}
              </span>
            </div>

            {/* Details side */}
            <div className="lg:col-span-4 p-6 flex flex-col justify-between bg-white">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-1 rounded-full w-fit mb-3">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{photo.date}</span>
                </div>

                <h3 className="text-xl font-bold font-heading text-slate-800 mb-2 leading-snug">
                  {photo.title}
                </h3>

                <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                  {photo.description}
                </p>

                <div className="space-y-2.5 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 mb-6">
                  {photo.classTag && (
                    <div className="flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5 text-amber-500" />
                      <span className="font-semibold text-slate-700">Class:</span> {photo.classTag}
                    </div>
                  )}
                  {photo.uploadedBy && (
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="font-semibold text-slate-700">Captured by:</span> {photo.uploadedBy}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <button
                  id="btn-like-photo"
                  onClick={() => setIsLiked(!isLiked)}
                  className={`flex-1 py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-all border ${
                    isLiked
                      ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                  <span>{isLiked ? 'Loved!' : 'Love it'}</span>
                </button>

                <a
                  id="btn-download-photo"
                  href={photo.url}
                  target="_blank"
                  rel="noreferrer"
                  download={photo.title}
                  className="py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
