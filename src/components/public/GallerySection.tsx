import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { GalleryPhoto } from '../../types';
import { Eye, Calendar, Tag, Sparkles } from 'lucide-react';

interface GallerySectionProps {
  onSelectPhoto: (photo: GalleryPhoto) => void;
}

export const GallerySection: React.FC<GallerySectionProps> = ({ onSelectPhoto }) => {
  const { galleryPhotos } = useSchoolData();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Classroom', 'Art & Craft', 'Sports', 'Activities', 'Celebrations', 'Field Trips'];

  const filteredPhotos = galleryPhotos.filter(p => {
    if (selectedCategory === 'All') return true;
    return p.category === selectedCategory;
  });

  return (
    <section id="gallery" className="py-16 md:py-24 bg-amber-50/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-extrabold uppercase tracking-wider mb-3">
            <span>📸</span>
            <span>Little Moments, Big Memories</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-800 tracking-tight mb-4">
            A Glimpse into Our Joyful Days 🌈
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Click any memory card to view the high-resolution photo with story notes and tags.
          </p>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25 scale-105'
                  : 'bg-white text-slate-700 hover:bg-amber-100/60 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredPhotos.map((photo, idx) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -6 }}
              onClick={() => onSelectPhoto(photo)}
              className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border-2 border-amber-100 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-amber-50">
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-white/90 backdrop-blur-xs text-slate-800 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                    <Eye className="w-3.5 h-3.5" /> View Photo
                  </span>
                </div>
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-amber-900 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs">
                  {photo.category}
                </span>
              </div>

              <div className="p-4">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 mb-1.5">
                  <Calendar className="w-3 h-3" />
                  <span>{photo.date}</span>
                  {photo.classTag && (
                    <>
                      <span>•</span>
                      <span>{photo.classTag}</span>
                    </>
                  )}
                </div>
                <h3 className="font-heading font-bold text-sm text-slate-800 line-clamp-1 group-hover:text-amber-600 transition-colors">
                  {photo.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                  {photo.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
