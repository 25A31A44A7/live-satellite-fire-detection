'use client';

import React, { useState } from 'react';
import { useAuth } from '@/components/AuthContext';
import { 
  Sliders, 
  Bell, 
  Mail, 
  ShieldCheck, 
  Globe, 
  Save, 
  CheckCircle2,
  Activity
} from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  const [criticalAlerts, setCriticalAlerts] = useState(true);
  const [highAlerts, setHighAlerts] = useState(true);
  const [moderateAlerts, setModerateAlerts] = useState(false);
  const [browserNotify, setBrowserNotify] = useState(true);
  const [targetRegion, setTargetRegion] = useState('All Regions');
  const [minFRP, setMinFRP] = useState(10);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl space-y-6 pb-12">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-wider flex items-center gap-2">
          <Sliders className="w-6 h-6 text-amber-400" />
          <span>ALERT & TELEMETRY PREFERENCES</span>
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Configure notification thresholds, target regions, and browser dispatch triggers
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>Alert preferences updated and synchronized with operations terminal.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Severity Subscriptions */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-cyan-400" />
            <span>Alert Severity Subscriptions</span>
          </h3>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer">
              <div>
                <span className="text-xs font-bold text-red-400">Critical Alerts</span>
                <p className="text-[11px] text-slate-400">
                  Immediate dispatch for high-risk industrial fires and severe wildland perimeters
                </p>
              </div>
              <input
                type="checkbox"
                checked={criticalAlerts}
                onChange={(e) => setCriticalAlerts(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer">
              <div>
                <span className="text-xs font-bold text-orange-400">High Risk Anomalies</span>
                <p className="text-[11px] text-slate-400">
                  Elevated thermal radiance (FRP &gt; 50 MW) or facility proximity &lt; 2km
                </p>
              </div>
              <input
                type="checkbox"
                checked={highAlerts}
                onChange={(e) => setHighAlerts(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer">
              <div>
                <span className="text-xs font-bold text-yellow-400">Moderate Alerts</span>
                <p className="text-[11px] text-slate-400">
                  Standard daytime agricultural burning and medium-confidence detections
                </p>
              </div>
              <input
                type="checkbox"
                checked={moderateAlerts}
                onChange={(e) => setModerateAlerts(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
              />
            </label>
          </div>
        </div>

        {/* Region & Thresholds */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>Target Region & Sensitivity</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Primary Surveillance Region
              </label>
              <select
                value={targetRegion}
                onChange={(e) => setTargetRegion(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-cyan-500"
              >
                <option value="All Regions">All Regions & Industrial Belts</option>
                <option value="Andhra Pradesh">Andhra Pradesh (Visakhapatnam, KG Basin, Rajahmundry)</option>
                <option value="Gujarat">Gujarat (Jamnagar, Hazira, Vadodara)</option>
                <option value="Odisha">Odisha (Angul, Paradip, Kalinganagar)</option>
                <option value="Maharashtra">Maharashtra (Mumbai, Chembur, Mahul)</option>
                <option value="Tamil Nadu">Tamil Nadu (Manali, Ennore, Chennai)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Minimum FRP Filter Threshold ({minFRP} MW)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={minFRP}
                onChange={(e) => setMinFRP(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400 mt-2"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-lg shadow-orange-500/20 flex items-center gap-2 transition-all active:scale-95"
        >
          <Save className="w-4 h-4" />
          <span>Save Operational Preferences</span>
        </button>
      </form>
    </div>
  );
}
