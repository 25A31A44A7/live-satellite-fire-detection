'use client';

import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Search, 
  Activity, 
  Building2, 
  Flame, 
  Calendar, 
  TrendingUp, 
  ShieldCheck, 
  ArrowUpRight,
  Filter
} from 'lucide-react';
import MapWrapper from '@/components/MapWrapper';
import { PersistentThermalSourceDto } from '@/types';

export default function ThermalSourcesPage() {
  const [sources, setSources] = useState<PersistentThermalSourceDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [minPersistence, setMinPersistence] = useState<number>(0);

  const fetchSources = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/thermal-sources?minPersistence=${minPersistence}&search=${encodeURIComponent(searchQuery)}`);
      if (res.ok) {
        const data = await res.json();
        setSources(data.clusters || []);
      }
    } catch (e) {
      console.error('Persistent sources error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSources();
  }, [minPersistence]);

  const mapFires = sources.map((s) => ({
    id: s.id,
    latitude: s.centroidLat,
    longitude: s.centroidLng,
    detectionTime: s.lastSeen,
    satellite: 'VIIRS_NRT',
    instrument: 'VIIRS',
    confidence: 95,
    brightnessTemp: s.avgBrightnessTemp,
    frp: s.maxFRP,
    source: 'PERSISTENCE_DETECTOR',
    fireType: 'PERSISTENT_THERMAL_SOURCE' as any,
    severity: (s.persistenceScore > 85 ? 'CRITICAL' : 'HIGH') as any,
    alertLevel: (s.persistenceScore > 85 ? 'CRITICAL' : 'HIGH') as any,
    classificationConfidence: s.persistenceScore,
    locationName: s.locationName,
    country: s.country,
    state: s.state,
    industrialArea: true,
    industrialFacilityName: s.facilityName,
    facilityType: s.facilityType,
    distanceToIndustrialKm: 0.2,
    persistenceScore: s.persistenceScore,
    isPersistentSource: true,
    isRealTime: true,
    createdAt: s.createdAt,
  }));

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-wider flex items-center gap-2">
            <Radio className="w-6 h-6 text-cyan-400" />
            <span>PERSISTENT THERMAL SOURCES</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            AI-detected stationary high-recurrence thermal clusters across industrial corridors
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs font-mono text-cyan-400">
            Active Clusters: <span className="font-bold text-white">{sources.length}</span>
          </div>
        </div>
      </div>

      {/* Cluster Map */}
      <div className="space-y-2">
        <h3 className="font-bold text-sm text-white flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-400" />
          <span>Persistent Thermal Cluster Coordinates</span>
        </h3>
        <MapWrapper fires={mapFires as any} height="400px" />
      </div>

      {/* Search & Filter Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchSources();
          }}
          className="flex items-center bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 w-full max-w-sm"
        >
          <Search className="w-4 h-4 text-slate-400 mr-2" />
          <input
            type="text"
            placeholder="Search facility name, state or cluster ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none w-full"
          />
        </form>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Min. Persistence:</span>
          <select
            value={minPersistence}
            onChange={(e) => setMinPersistence(parseFloat(e.target.value))}
            className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500"
          >
            <option value="0">All Persistence Scores</option>
            <option value="50">&ge; 50% Persistence</option>
            <option value="75">&ge; 75% High Persistence</option>
            <option value="90">&ge; 90% Ultra High Persistence</option>
          </select>
        </div>
      </div>

      {/* Cluster Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sources.length === 0 ? (
          <div className="col-span-full p-12 text-center text-xs text-slate-400 bg-slate-900/40 rounded-2xl border border-slate-800">
            No persistent thermal sources match the criteria.
          </div>
        ) : (
          sources.map((source) => (
            <div
              key={source.id}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 shadow-xl space-y-3 transition-all"
            >
              {/* Top Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                      {source.clusterId}
                    </span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 truncate">
                      {source.facilityType || 'Industrial Site'}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-sm text-white mt-1.5 truncate">
                    {source.locationName}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Centroid: {source.centroidLat.toFixed(3)}°N, {source.centroidLng.toFixed(3)}°E
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xl font-black text-cyan-400 font-mono">
                    {source.persistenceScore.toFixed(0)}%
                  </span>
                  <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold">
                    Persistence
                  </span>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Total Detections</span>
                  <span className="font-bold text-white font-mono">{source.detectionCount} passes</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Max FRP</span>
                  <span className="font-bold text-orange-400 font-mono">{source.maxFRP.toFixed(1)} MW</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Average FRP</span>
                  <span className="font-bold text-amber-400 font-mono">{source.avgFRP.toFixed(1)} MW</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Avg Temperature</span>
                  <span className="font-bold text-slate-200 font-mono">{source.avgBrightnessTemp.toFixed(1)} K</span>
                </div>
              </div>

              {/* Timeline Info */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                <div>
                  <span className="text-slate-500">First Seen: </span>
                  <span className="text-slate-300 font-medium">
                    {new Date(source.firstSeen).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Last Seen: </span>
                  <span className="text-slate-300 font-medium">
                    {new Date(source.lastSeen).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
