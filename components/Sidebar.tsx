'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from './AuthContext';
import {
  LayoutDashboard,
  MapPin,
  Flame,
  Clock,
  Radio,
  AlertTriangle,
  BarChart3,
  FileText,
  Database,
  Activity,
  Sliders,
  Shield,
  Info,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Live Satellite Map', href: '/map', icon: MapPin },
    { name: 'Historical Fires', href: '/historical', icon: Clock },
    { name: 'Thermal Sources', href: '/thermal-sources', icon: Radio },
    { name: 'Real-Time Alerts', href: '/alerts', icon: AlertTriangle, badge: 'Live' },
    { name: 'Fire Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Incident Reports', href: '/reports', icon: FileText },
    { name: 'Data Sources & NASA', href: '/sources', icon: Database },
    { name: 'System Status', href: '/status', icon: Activity },
    { name: 'Alert Preferences', href: '/settings', icon: Sliders },
  ];

  if (user?.role === 'ADMIN') {
    navItems.push({ name: 'Admin Console', href: '/admin', icon: Shield, badge: 'Admin' });
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-[57px] bottom-0 left-0 z-30 w-64 bg-[#070c18] border-r border-slate-800/80 flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Navigation List */}
        <div className="p-3 space-y-1 overflow-y-auto">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-300">
            Monitoring & Intelligence
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-500/20 to-cyan-500/10 text-white border border-orange-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-orange-400' : 'text-slate-400 group-hover:text-cyan-400'
                    }`}
                  />
                  <span>{item.name}</span>
                </div>

                {item.badge ? (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      item.badge === 'Live'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse'
                        : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    }`}
                  >
                    {item.badge}
                  </span>
                ) : (
                  <ChevronRight
                    className={`w-3.5 h-3.5 transition-opacity ${
                      isActive ? 'opacity-100 text-orange-400' : 'opacity-0 group-hover:opacity-60'
                    }`}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Footer / Telemetry Badge */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800/80">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span className="text-[11px] font-semibold text-slate-200">VIIRS & MODIS Sensors</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Active Satellites: NOAA-20/21, S-NPP, Terra & Aqua
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
