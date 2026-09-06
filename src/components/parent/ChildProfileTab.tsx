import React from 'react';
import { motion } from 'motion/react';
import { Student } from '../../types';
import { 
  User, 
  Calendar, 
  Heart, 
  ShieldAlert, 
  Phone, 
  Mail, 
  MapPin, 
  GraduationCap, 
  Download, 
  Sparkles, 
  Award, 
  Smile, 
  Clock 
} from 'lucide-react';

interface ChildProfileTabProps {
  child: Student;
}

export const ChildProfileTab: React.FC<ChildProfileTabProps> = ({ child }) => {
  return (
    <div className="space-y-6">
      {/* Child ID Passport Card */}
      <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 p-1 rounded-[32px] shadow-xl">
        <div className="bg-white rounded-[30px] p-6 sm:p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            
            {/* Child Photo Frame */}
            <div className="relative">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl overflow-hidden border-4 border-amber-300 shadow-xl bg-amber-100">
                <img
                  src={child.avatar}
                  alt={child.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="absolute -bottom-2 -right-2 bg-amber-500 text-white text-xs font-black px-3 py-1 rounded-full shadow-md border-2 border-white">
                {child.class} - {child.section.split('-')[0]}
              </span>
            </div>

            {/* Child Key Data */}
            <div className="flex-1 text-center md:text-left space-y-3">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="bg-amber-100 text-amber-800 text-xs font-extrabold px-3 py-1 rounded-full">
                  Roll No: {child.rollNo}
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-3 py-1 rounded-full">
                  Active Academic Year {child.academicYear}
                </span>
                <span className="bg-rose-100 text-rose-800 text-xs font-extrabold px-3 py-1 rounded-full">
                  Blood Group: {child.bloodGroup}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-800">
                {child.name} 🌟
              </h2>

              <p className="text-sm text-slate-600 font-medium">
                Age: <strong className="text-slate-800">{child.age}</strong> (DOB: {child.dob}) • Class Teacher: <strong className="text-slate-800">{child.teacherName}</strong>
              </p>

              {/* Attendance & Score Meters */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 max-w-lg">
                <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 text-center">
                  <p className="text-[10px] uppercase font-extrabold text-amber-700">Attendance Rate</p>
                  <p className="text-xl font-black text-amber-900">{child.attendanceRate}%</p>
                </div>
                <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200 text-center">
                  <p className="text-[10px] uppercase font-extrabold text-emerald-700">Overall Score</p>
                  <p className="text-xl font-black text-emerald-900">{child.overallScore}% ⭐</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-2xl border border-purple-200 text-center col-span-2 sm:col-span-1">
                  <p className="text-[10px] uppercase font-extrabold text-purple-700">House / Team</p>
                  <p className="text-xl font-black text-purple-900">Sunshine ☀️</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Grid: Health & Emergency, Parent Contact, Daily Diary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Medical & Safety Card */}
        <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-rose-700 font-heading font-bold text-lg">
            <Heart className="w-5 h-5 text-rose-500" />
            <span>Health, Diet & Allergies</span>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-slate-600">
            <div className="p-3.5 bg-rose-50/70 rounded-2xl border border-rose-100">
              <span className="font-bold text-rose-900 block mb-1">Allergy Advisory:</span>
              <span>{child.allergies || 'No known food or contact allergies recorded.'}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="font-semibold text-slate-700">Blood Group:</span>
              <span className="font-bold text-rose-600">{child.bloodGroup}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="font-semibold text-slate-700">Emergency Phone:</span>
              <span className="font-bold text-slate-800">{child.emergencyContact}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="font-semibold text-slate-700">Vaccinations:</span>
              <span className="font-bold text-emerald-600">100% Up to Date ✅</span>
            </div>
          </div>
        </div>

        {/* Parent & Transportation Card */}
        <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-amber-700 font-heading font-bold text-lg">
            <GraduationCap className="w-5 h-5 text-amber-500" />
            <span>Parent Details & Transport</span>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-slate-600">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="font-semibold text-slate-700">Primary Parent / Guardian:</span>
              <span className="font-bold text-slate-800">{child.parentName}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="font-semibold text-slate-700">Registered Phone:</span>
              <span className="font-bold text-slate-800">{child.parentPhone}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="font-semibold text-slate-700">Home Address:</span>
              <span className="font-medium text-slate-800 text-right max-w-xs">{child.address}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-900">
              <span className="font-semibold">School Bus Route:</span>
              <span className="font-bold">Route 04 (Cab Yellow Bee) 🚌</span>
            </div>
          </div>
        </div>

      </div>

      {/* Today's Daily Nursery Log */}
      {child.dailyStatus && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-6 border-2 border-amber-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📋</span>
              <h3 className="font-heading font-bold text-lg text-slate-800">
                Today's Daily Care Diary
              </h3>
            </div>
            <span className="text-xs font-semibold text-amber-700 bg-white px-3 py-1 rounded-full border border-amber-200">
              Updated {child.dailyStatus.updatedAt}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-xs">
              <p className="text-[11px] font-extrabold uppercase text-amber-700 mb-1">Morning Mood</p>
              <p className="text-sm font-bold text-slate-800">{child.dailyStatus.mood}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-xs">
              <p className="text-[11px] font-extrabold uppercase text-emerald-700 mb-1">Snack & Hydration</p>
              <p className="text-sm font-bold text-slate-800">{child.dailyStatus.snack}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-xs">
              <p className="text-[11px] font-extrabold uppercase text-purple-700 mb-1">Rest & Nap Period</p>
              <p className="text-sm font-bold text-slate-800">{child.dailyStatus.nap}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-xs">
              <p className="text-[11px] font-extrabold uppercase text-rose-700 mb-1">Favorite Activity</p>
              <p className="text-sm font-bold text-slate-800">{child.dailyStatus.activity}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
