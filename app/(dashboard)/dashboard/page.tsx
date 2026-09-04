'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Flame, 
  AlertTriangle, 
  ShieldAlert, 
  Radio, 
  Activity, 
  Building2, 
  TrendingUp, 
  Zap, 
  RefreshCw, 
  Filter, 
  ArrowUpRight, 
  ChevronRight,
  Clock,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import MapWrapper from '@/components/MapWrapper';
import { FireEventDto, DashboardStats } from '@/types';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [fires, setFires] = useState<FireEventDto[]>([]);
  const [selectedFire, setSelectedFire] = useState<FireEventDto | null>(null);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const [firesRes, analyticsRes] = await Promise.all([
        fetch('/api/fires/live?limit=100'),
        fetch('/api/analytics'),
      ]);

      if (firesRes.ok) {
        const fData = await firesRes.json();
        setFires(fData.fires || []);
        if (fData.fires && fData.fires.length > 0 && !selectedFire) {
          setSelectedFire(fData.fires[0]);
        }
      }

      if (analyticsRes.ok) {
        const aData = await analyticsRes.json();
        setStats(aData.stats);
      }
    } catch (e) {
      console.error('Failed to load dashboard data:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    const handleUpdate = () => fetchDashboardData();
    window.addEventListener('satellite_data_updated', handleUpdate);
    const interval = setInterval(fetchDashboardData, 30000);

    return () => {
      window.removeEventListener('satellite_data_updated', handleUpdate);
      clearInterval(interval);
    };
  }, []);

  const handleManualRefresh = async () => {
    setRefreshing(true);
    try {
      await fetch('/api/data/refresh', { method: 'POST' });
      await fetchDashboardData();
    } catch (e) {
      console.error(e);
      setRefreshing(false);
    }
  };

  const filteredFires = fires.filter((f) => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'CRITICAL') return f.alertLevel === 'CRITICAL';
    if (activeFilter === 'INDUSTRIAL') return f.industrialArea;
    if (activeFilter === 'PERSISTENT') return f.isPersistentSource;
    if (activeFilter === 'WILDLAND') return f.fireType === 'FOREST_FIRE';
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Telemetry Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black tracking-wider text-white">
              SATELLITE COMMAND CENTER
            </h1>
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            AI-Driven Thermal Anomaly & Industrial Fire Surveillance Feed (NASA FIRMS & OSM Spatial Engine)
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="text-right hidden md:block text-[11px] text-slate-400">
            <div>Last Satellite Pass: <span className="font-mono text-cyan-400 font-semibold">04 Sep 2026 18:20 IST</span></div>
            <div className="text-slate-500">Sensors: VIIRS 375m &bull; MODIS 1km</div>
          </div>
          <button
            onClick={handleManualRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold shadow-lg shadow-orange-500/20 transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Ingesting...' : 'Refresh Ingestion'}</span>
          </button>
        </div>
      </div>

      {/* 6 Real-Time Stat KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Card 1: Active Fires */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Active Events</span>
            <Flame className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {stats ? stats.activeFires : <span className="animate-pulse">--</span>}
          </div>
          <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" />
            <span>Live NASA Sync</span>
          </div>
        </div>

        {/* Card 2: Critical Fires */}
        <div className="p-4 rounded-2xl bg-red-950/30 border border-red-500/30 hover:border-red-500/50 transition-all shadow-lg shadow-red-950/20">
          <div className="flex items-center justify-between text-red-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Critical Fires</span>
            <ShieldAlert className="w-4 h-4 text-red-400 animate-pulse" />
          </div>
          <div className="text-2xl font-black text-red-400 font-mono">
            {stats ? stats.criticalFires : <span className="animate-pulse">--</span>}
          </div>
          <div className="text-[10px] text-red-300/80 mt-1">
            Immediate Response Req.
          </div>
        </div>

        {/* Card 3: High Alert Fires */}
        <div className="p-4 rounded-2xl bg-orange-950/20 border border-orange-500/30 hover:border-orange-500/50 transition-all shadow-lg">
          <div className="flex items-center justify-between text-orange-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">High Alerts</span>
            <AlertTriangle className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-2xl font-black text-orange-400 font-mono">
            {stats ? stats.highAlertFires : <span className="animate-pulse">--</span>}
          </div>
          <div className="text-[10px] text-orange-300/80 mt-1">
            High FRP Thermal Signatures
          </div>
        </div>

        {/* Card 4: Persistent Sources */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Thermal Sources</span>
            <Radio className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400 font-mono">
            {stats ? stats.thermalSources : <span className="animate-pulse">--</span>}
          </div>
          <div className="text-[10px] text-cyan-400/80 mt-1">
            Multi-Day Recurring Hubs
          </div>
        </div>

        {/* Card 5: Today's Detections */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Today's Total</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono">
            {stats ? stats.todayDetections : <span className="animate-pulse">--</span>}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Avg FRP: {stats ? `${stats.avgFRP} MW` : '--'}
          </div>
        </div>

        {/* Card 6: Industrial Hotspots */}
        <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30 hover:border-purple-500/50 transition-all shadow-lg">
          <div className="flex items-center justify-between text-purple-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Industrial Sites</span>
            <Building2 className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-400 font-mono">
            {stats ? stats.industrialHotspots : <span className="animate-pulse">--</span>}
          </div>
          <div className="text-[10px] text-purple-300/80 mt-1">
            OSM Proximity &lt; 3km
          </div>
        </div>
      </div>

      {/* Main Map HUD & Filter Strip */}
      <div className="space-y-3">
        {/* Quick Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/90 border border-slate-800">
            {[
              { id: 'ALL', label: 'All Detections' },
              { id: 'CRITICAL', label: 'Critical Only' },
              { id: 'INDUSTRIAL', label: 'Industrial Facilities' },
              { id: 'PERSISTENT', label: 'Persistent Sources' },
              { id: 'WILDLAND', label: 'Forest / Wildland' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeFilter === tab.id
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-400 font-mono">
            Showing <span className="text-white font-bold">{filteredFires.length}</span> of {fires.length} active thermal anomalies
          </div>
        </div>

        {/* Live Satellite Interactive Map */}
        <MapWrapper
          fires={filteredFires}
          selectedFire={selectedFire}
          onSelectFire={(f) => setSelectedFire(f)}
          height="580px"
        />
      </div>

      {/* Split Section: Real-Time Incident Stream & Selected Incident Telemetry HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Anomaly Incident Feed */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-400" />
              <span>Real-Time Anomaly Stream</span>
            </h3>
            <Link href="/map" className="text-xs text-cyan-400 hover:underline flex items-center gap-1">
              <span>Open Fullscreen Map</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 divide-y divide-slate-800/80 overflow-hidden shadow-xl">
            {filteredFires.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No active fire anomalies match the selected filter.
              </div>
            ) : (
              filteredFires.slice(0, 7).map((fire) => (
                <div
                  key={fire.id}
                  onClick={() => setSelectedFire(fire)}
                  className={`p-3.5 sm:p-4 hover:bg-slate-800/50 cursor-pointer transition-colors flex items-center justify-between gap-4 ${
                    selectedFire?.id === fire.id ? 'bg-slate-800/80 border-l-4 border-l-cyan-400' : ''
                  }`}
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          fire.alertLevel === 'CRITICAL'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                            : fire.alertLevel === 'HIGH'
                            ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                            : fire.alertLevel === 'MODERATE'
                            ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        }`}
                      >
                        {fire.alertLevel}
                      </span>
                      <span className="text-xs font-bold text-white truncate">
                        {fire.locationName}
                      </span>
                      {fire.industrialFacilityName && (
                        <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-1.5 py-0.2 rounded truncate">
                          {fire.industrialFacilityName}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span>Coord: {fire.latitude.toFixed(3)}°N, {fire.longitude.toFixed(3)}°E</span>
                      <span>&bull;</span>
                      <span>Sensor: {fire.satellite.replace('_', ' ')}</span>
                      <span>&bull;</span>
                      <span className="font-mono text-orange-400 font-semibold">{fire.frp.toFixed(1)} MW</span>
                    </div>
                  </div>

                  <Link
                    href={`/fires/${fire.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 transition-colors shrink-0"
                    title="View Profile"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right 1 Col: Selected Incident Telemetry HUD */}
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Selected Event Telemetry</span>
          </h3>

          {selectedFire ? (
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      selectedFire.alertLevel === 'CRITICAL'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                        : selectedFire.alertLevel === 'HIGH'
                        ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                        : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40'
                    }`}
                  >
                    {selectedFire.alertLevel} ALERT
                  </span>
                  <h4 className="font-extrabold text-base text-white mt-1.5 leading-snug">
                    {selectedFire.locationName}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {selectedFire.district}, {selectedFire.state}, {selectedFire.country}
                  </p>
                </div>
              </div>

              {/* Sensor Metrics Breakdown */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Radiative Power</span>
                  <span className="text-base font-black text-orange-400 font-mono">
                    {selectedFire.frp.toFixed(1)} MW
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Confidence</span>
                  <span className="text-base font-black text-cyan-400 font-mono">
                    {selectedFire.confidence}%
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Brightness Temp</span>
                  <span className="text-sm font-bold text-slate-200 font-mono">
                    {selectedFire.brightnessTemp.toFixed(1)} K
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Persistence Score</span>
                  <span className="text-sm font-bold text-purple-300 font-mono">
                    {selectedFire.persistenceScore.toFixed(0)}%
                  </span>
                </div>
              </div>

              {/* AI Classification Info */}
              <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-xs space-y-1">
                <div className="font-bold text-cyan-400 flex items-center justify-between">
                  <span>AI Classification</span>
                  <span>{selectedFire.classificationConfidence}% Conf.</span>
                </div>
                <p className="text-slate-200 font-semibold text-sm">
                  {selectedFire.fireType.replace(/_/g, ' ')}
                </p>
                {selectedFire.industrialFacilityName && (
                  <p className="text-[11px] text-slate-300">
                    Proximity: {selectedFire.distanceToIndustrialKm?.toFixed(1)}km to {selectedFire.industrialFacilityName}
                  </p>
                )}
              </div>

              <Link
                href={`/fires/${selectedFire.id}`}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 flex items-center justify-center gap-1.5 transition-all"
              >
                <span>Inspect Detailed Profile</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-slate-900/90 border border-slate-800 text-center text-xs text-slate-400">
              Select a fire marker on the map to inspect telemetry.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
