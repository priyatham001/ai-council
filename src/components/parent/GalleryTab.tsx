import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { GalleryPhoto, Student } from '../../types';
import { Calendar, Tag, Eye, Download, Sparkles, Filter } from 'lucide-react';

interface ParentGalleryTabProps {
  child: Student;
  onSelectPhoto: (photo: GalleryPhoto) => void;
}

export const ParentGalleryTab: React.FC<ParentGalleryTabProps> = ({
  child,
  onSelectPhoto
}) => {
  const { galleryPhotos } = useSchoolData();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Classroom', 'Activities', 'Art & Craft', 'Sports', 'Celebrations', 'Field Trips'];

  // Filter only photos tagged with this child or class-level public photos
  const childPhotos = galleryPhotos.filter(p => {
    const isTagMatched = p.studentIds.includes(child.id) || p.classTag === `${child.class} - A` || p.classTag === 'All Classes' || p.isPublic;
    if (!isTagMatched) return false;
    if (selectedCategory === 'All') return true;
    return p.category === selectedCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-pink-400 via-rose-400 to-amber-400 rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
            Captured Memories 📸
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading mt-1">
            {child.name}’s School Gallery
          </h2>
          <p className="text-xs sm:text-sm text-pink-50 max-w-md">
            All candid activity snaps, art masterpieces, and sports day celebrations tagged for your child.
          </p>
        </div>

        <div className="bg-white/90 text-slate-800 px-4 py-3 rounded-2xl text-center shadow-md">
          <span className="text-[10px] uppercase font-bold text-pink-600 block">Total Photos</span>
          <span className="text-2xl font-black text-slate-900">{childPhotos.length}</span>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25 scale-105'
                : 'bg-white text-slate-700 hover:bg-amber-50 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Photo Grid */}
      {childPhotos.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border-2 border-slate-200">
          <p className="text-3xl mb-2">📷</p>
          <h4 className="font-heading font-bold text-slate-700">No photos in this category yet.</h4>
          <p className="text-xs text-slate-400">Our teachers upload new album updates every Friday!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {childPhotos.map((photo, idx) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -5 }}
              onClick={() => onSelectPhoto(photo)}
              className="group bg-white rounded-3xl overflow-hidden shadow-xs hover:shadow-xl border-2 border-slate-200 hover:border-amber-300 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-amber-50">
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-white text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-amber-500" /> Open Full Screen
                  </span>
                </div>
                <span className="absolute top-3 left-3 bg-white/95 text-amber-900 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs">
                  {photo.category}
                </span>
              </div>

              <div className="p-4">
                <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 mb-1">
                  <Calendar className="w-3 h-3 text-amber-500" />
                  <span>{photo.date}</span>
                </div>
                <h4 className="font-heading font-bold text-sm text-slate-800 group-hover:text-amber-600 transition-colors line-clamp-1">
                  {photo.title}
                </h4>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                  {photo.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
