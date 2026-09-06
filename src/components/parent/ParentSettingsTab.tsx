import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Bell, Shield, Phone, Mail, Save, CheckCircle2 } from 'lucide-react';

export const ParentSettingsTab: React.FC = () => {
  const { user } = useAuth();
  const [notifyWhatsApp, setNotifyWhatsApp] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyAttendance, setNotifyAttendance] = useState(true);
  const [notifyPhotos, setNotifyPhotos] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-xs space-y-2">
        <h2 className="text-2xl font-bold font-heading text-slate-800 flex items-center gap-2">
          <User className="w-6 h-6 text-amber-500" />
          <span>Parent Profile & Notification Settings</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Manage emergency contact numbers, instant SMS alerts, and app preferences.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Parent Details Card */}
        <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-xs space-y-4">
          <h3 className="font-heading font-bold text-base text-slate-800">
            Primary Contact Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Parent Name</label>
              <input
                type="text"
                defaultValue={user?.name || 'Anita Sharma'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email ID</label>
              <input
                type="email"
                defaultValue={user?.email || 'parent@kforkidz.edu'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number (WhatsApp Alerts)</label>
              <input
                type="tel"
                defaultValue={user?.phone || '+91 98765 43210'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Emergency Secondary Phone</label>
              <input
                type="tel"
                defaultValue="+91 98111 22334"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Notifications Toggles */}
        <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-slate-800 font-heading font-bold text-base">
            <Bell className="w-5 h-5 text-amber-500" />
            <span>Instant Alerts & Notifications</span>
          </div>

          <div className="space-y-3 divide-y divide-slate-100">
            <div className="flex items-center justify-between pt-2">
              <div>
                <p className="text-xs sm:text-sm font-bold text-slate-800">RFID Gate In/Out Notifications</p>
                <p className="text-xs text-slate-400">Receive instant push notification when child arrives & departs</p>
              </div>
              <input
                type="checkbox"
                checked={notifyAttendance}
                onChange={(e) => setNotifyAttendance(e.target.checked)}
                className="w-5 h-5 accent-amber-500 rounded"
              />
            </div>

            <div className="flex items-center justify-between pt-3">
              <div>
                <p className="text-xs sm:text-sm font-bold text-slate-800">New Photo Tag Alerts</p>
                <p className="text-xs text-slate-400">Notify when new class activity or sports photos are uploaded</p>
              </div>
              <input
                type="checkbox"
                checked={notifyPhotos}
                onChange={(e) => setNotifyPhotos(e.target.checked)}
                className="w-5 h-5 accent-amber-500 rounded"
              />
            </div>

            <div className="flex items-center justify-between pt-3">
              <div>
                <p className="text-xs sm:text-sm font-bold text-slate-800">WhatsApp Digest</p>
                <p className="text-xs text-slate-400">Receive weekly teacher notes and reminders on WhatsApp</p>
              </div>
              <input
                type="checkbox"
                checked={notifyWhatsApp}
                onChange={(e) => setNotifyWhatsApp(e.target.checked)}
                className="w-5 h-5 accent-amber-500 rounded"
              />
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="py-3 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md shadow-amber-500/25 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
          {saved && (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Saved successfully!
            </span>
          )}
        </div>
      </form>
    </div>
  );
};
