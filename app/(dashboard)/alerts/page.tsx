'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  AlertTriangle, 
  ShieldAlert, 
  Bell, 
  Check, 
  CheckCircle2, 
  Search, 
  Filter, 
  Volume2, 
  ExternalLink,
  Flame,
  ArrowUpRight
} from 'lucide-react';
import { AlertDto } from '@/types';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [levelFilter, setLevelFilter] = useState('ALL');
  const [showAcknowledged, setShowAcknowledged] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [audioEnabled, setAudioEnabled] = useState(true);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/alerts?alertLevel=${levelFilter}&acknowledged=${showAcknowledged ? '' : 'false'}`);
      if (res.ok) {
        const data = await res.json();
        setAlerts(data.alerts || []);
      }
    } catch (e) {
      console.error('Alerts fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [levelFilter, showAcknowledged]);

  const handleAcknowledge = async (alertId: string) => {
    try {
      const res = await fetch('/api/alerts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alertId, acknowledged: true }),
      });

      if (res.ok) {
        setAlerts((prev) =>
          prev.map((a) => (a.id === alertId ? { ...a, acknowledged: true } : a))
        );
      }
    } catch (e) {
      console.error('Failed to acknowledge alert:', e);
    }
  };

  const testBrowserNotification = () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          new Notification('🚨 LIVE-SATELLITE TEST ALERT', {
            body: 'Critical thermal anomaly simulated: Jamnagar Mega Petrochemical Complex (FRP: 142.3 MW).',
            icon: '/favicon.ico',
          });
        } else {
          alert('Notification permissions were blocked in your browser settings.');
        }
      });
    }
  };

  const filteredAlerts = alerts.filter((a) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      a.title.toLowerCase().includes(q) ||
      a.message.toLowerCase().includes(q) ||
      (a.fireEvent?.locationName && a.fireEvent.locationName.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-wider flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-red-500 animate-pulse" />
            <span>REAL-TIME FIRE ALERT DISPATCH</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated multi-tier incident alerting with satellite telemetry verification
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={testBrowserNotification}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
          >
            <Bell className="w-3.5 h-3.5 text-cyan-400" />
            <span>Test Browser Alerts</span>
          </button>
        </div>
      </div>

      {/* Filter Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 w-full max-w-sm">
          <Search className="w-4 h-4 text-slate-400 mr-2" />
          <input
            type="text"
            placeholder="Search alerts by location or facility..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none w-full"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Alert Levels</option>
            <option value="CRITICAL">Critical Alerts Only</option>
            <option value="HIGH">High Alerts Only</option>
            <option value="MODERATE">Moderate Alerts Only</option>
            <option value="LOW">Low Alerts Only</option>
          </select>

          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showAcknowledged}
              onChange={(e) => setShowAcknowledged(e.target.checked)}
              className="rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-cyan-500"
            />
            <span>Include Acknowledged</span>
          </label>
        </div>
      </div>

      {/* Alerts Grid */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400 bg-slate-900/40 rounded-2xl border border-slate-800">
            No active unacknowledged alerts found. System operational.
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isCritical = alert.alertLevel === 'CRITICAL';
            const isHigh = alert.alertLevel === 'HIGH';

            return (
              <div
                key={alert.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  alert.acknowledged
                    ? 'bg-slate-900/40 border-slate-800 opacity-60'
                    : isCritical
                    ? 'bg-red-950/20 border-red-500/40 shadow-red-950/20'
                    : isHigh
                    ? 'bg-orange-950/20 border-orange-500/40'
                    : 'bg-slate-900/90 border-slate-800'
                }`}
              >
                {/* Left: Info */}
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        isCritical
                          ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                          : isHigh
                          ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                          : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40'
                      }`}
                    >
                      {alert.alertLevel} ALERT
                    </span>

                    {alert.acknowledged && (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>Acknowledged</span>
                      </span>
                    )}

                    <span className="text-xs text-slate-400 font-mono">
                      {new Date(alert.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <h3 className="text-sm font-extrabold text-white leading-snug">
                    {alert.title}
                  </h3>

                  <p className="text-xs text-slate-300">
                    {alert.message}
                  </p>

                  {alert.fireEvent && (
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                      <span>Sensor: {alert.fireEvent.satellite.replace('_', ' ')}</span>
                      <span>&bull;</span>
                      <span className="font-mono text-orange-400 font-semibold">
                        FRP: {alert.fireEvent.frp.toFixed(1)} MW
                      </span>
                      <span>&bull;</span>
                      <span className="text-cyan-400 font-mono">
                        Confidence: {alert.fireEvent.confidence}%
                      </span>
                    </div>
                  )}
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                  {alert.fireEventId && (
                    <Link
                      href={`/fires/${alert.fireEventId}`}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1 transition-colors"
                    >
                      <span>Inspect Map</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  )}

                  {!alert.acknowledged && (
                    <button
                      onClick={() => handleAcknowledge(alert.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Acknowledge</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
