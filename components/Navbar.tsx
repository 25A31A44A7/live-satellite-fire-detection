'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from './AuthContext';
import { 
  Flame, 
  Radio, 
  RefreshCw, 
  Bell, 
  User, 
  LogOut, 
  ShieldCheck, 
  Activity,
  ChevronDown,
  Menu,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export default function Navbar({ onToggleSidebar }: NavbarProps) {
  const { user, logout } = useAuth();
  const [syncing, setSyncing] = useState(false);
  const [systemStatus, setSystemStatus] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [showAlertsDropdown, setShowAlertsDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const fetchStatusAndAlerts = async () => {
    try {
      const [statusRes, alertsRes] = await Promise.all([
        fetch('/api/status'),
        fetch('/api/alerts?limit=5&acknowledged=false')
      ]);
      if (statusRes.ok) setSystemStatus(await statusRes.json());
      if (alertsRes.ok) {
        const aData = await alertsRes.json();
        setAlerts(aData.alerts || []);
      }
    } catch (e) {
      console.error('Header telemetry fetch error:', e);
    }
  };

  useEffect(() => {
    fetchStatusAndAlerts();
    const interval = setInterval(fetchStatusAndAlerts, 25000);
    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = async () => {
    setSyncing(true);
    try {
      const res = await fetch('/api/data/refresh', { method: 'POST' });
      if (res.ok) {
        await fetchStatusAndAlerts();
        window.dispatchEvent(new CustomEvent('satellite_data_updated'));
      }
    } catch (e) {
      console.error('Data refresh error:', e);
    } finally {
      setTimeout(() => setSyncing(false), 800);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#070c18]/95 backdrop-blur-md px-4 py-2.5">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 md:hidden"
              aria-label="Toggle Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-600 via-red-600 to-amber-500 shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <Flame className="w-5 h-5 text-white" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-wider text-white">LIVE-SATELLITE</span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  AI CORE
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                Industrial Fire & Persistent Thermal Intelligence
              </p>
            </div>
          </Link>
        </div>

        {/* Center: Real-Time Telemetry Pills */}
        <div className="hidden lg:flex items-center gap-3 text-xs">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800">
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${systemStatus?.components?.nasaFirmsApi?.status === 'ONLINE' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span className="text-slate-400">NASA FIRMS:</span>
              <span className="font-medium text-slate-200">
                {systemStatus?.components?.nasaFirmsApi?.status === 'ONLINE' ? 'Live Streaming' : 'Repository Active'}
              </span>
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-slate-400">DB:</span>
              <span className="font-medium text-slate-200">Online</span>
            </div>
          </div>

          <button
            onClick={handleManualRefresh}
            disabled={syncing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 border border-slate-700 text-xs font-medium transition-all active:scale-95"
            title="Sync latest satellite feed"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin text-cyan-400' : ''}`} />
            <span>{syncing ? 'Syncing...' : 'Sync Feeds'}</span>
          </button>
        </div>

        {/* Right: Actions, Alerts, User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowAlertsDropdown(!showAlertsDropdown)}
              className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-colors"
              aria-label="Alerts"
            >
              <Bell className="w-5 h-5" />
              {alerts.length > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-md shadow-red-500/50">
                  {alerts.length}
                </span>
              )}
            </button>

            {showAlertsDropdown && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-400" />
                    <span className="font-semibold text-sm text-white">Active Alerts ({alerts.length})</span>
                  </div>
                  <Link 
                    href="/alerts" 
                    onClick={() => setShowAlertsDropdown(false)}
                    className="text-xs text-cyan-400 hover:underline"
                  >
                    View All
                  </Link>
                </div>
                <div className="mt-2 divide-y divide-slate-800/60 max-h-64 overflow-y-auto">
                  {alerts.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-400">
                      No unacknowledged alerts.
                    </div>
                  ) : (
                    alerts.map((a) => (
                      <div key={a.id} className="py-2.5 px-1 hover:bg-slate-800/40 rounded-lg">
                        <div className="flex items-start justify-between gap-2">
                          <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                            a.alertLevel === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                            a.alertLevel === 'HIGH' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40' :
                            'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40'
                          }`}>
                            {a.alertLevel}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(a.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs font-medium text-slate-200 mt-1 line-clamp-1">{a.title}</p>
                        <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{a.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile / Auth */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-200 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-cyan-600/30 text-cyan-400 flex items-center justify-center font-bold text-xs border border-cyan-500/40">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="font-semibold text-xs text-white leading-tight">{user.name}</div>
                  <div className="text-[10px] text-cyan-400 uppercase tracking-wider">{user.role}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-2 z-50">
                  <div className="px-3 py-2 border-b border-slate-800 text-xs">
                    <p className="font-semibold text-white">{user.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                  </div>
                  <div className="py-1">
                    {user.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        onClick={() => setShowUserDropdown(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
                      >
                        <ShieldCheck className="w-4 h-4 text-cyan-400" />
                        <span>Admin Console</span>
                      </Link>
                    )}
                    <Link
                      href="/settings"
                      onClick={() => setShowUserDropdown(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
                    >
                      <Activity className="w-4 h-4 text-amber-400" />
                      <span>Alert Preferences</span>
                    </Link>
                  </div>
                  <div className="pt-1 border-t border-slate-800">
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        logout();
                      }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 shadow-md shadow-orange-500/20 transition-all"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
