'use client';

import React, { useState, useEffect } from 'react';
import MapWrapper from '@/components/MapWrapper';
import { FireEventDto } from '@/types';
import { 
  Flame, 
  Filter, 
  Layers, 
  RefreshCw, 
  Activity, 
  ShieldAlert, 
  Radio, 
  Building2,
  Download,
  Info
} from 'lucide-react';

export default function MapPage() {
  const [fires, setFires] = useState<FireEventDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [satelliteFilter, setSatelliteFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [minFRP, setMinFRP] = useState<number>(0);
  const [selectedFire, setSelectedFire] = useState<FireEventDto | null>(null);

  const fetchFires = async () => {
    try {
      const res = await fetch('/api/fires/live?limit=300');
      if (res.ok) {
        const data = await res.json();
        setFires(data.fires || []);
      }
    } catch (e) {
      console.error('Map fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFires();
  }, []);

  const filteredFires = fires.filter((f) => {
    if (severityFilter !== 'ALL' && f.severity !== severityFilter) return false;
    if (satelliteFilter !== 'ALL' && !f.satellite.includes(satelliteFilter)) return false;
    if (typeFilter !== 'ALL' && f.fireType !== typeFilter) return false;
    if (minFRP > 0 && f.frp < minFRP) return false;
    return true;
  });

  return (
    <div className="space-y-4 pb-8">
      {/* Header & Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-wider flex items-center gap-2">
            <Flame className="w-6 h-6 text-orange-400" />
            <span>LIVE SATELLITE FIRE RADAR</span>
          </h1>
          <p className="text-xs text-slate-400">
            High-resolution satellite surveillance with OSM industrial infrastructure correlation
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Severity */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Alert Levels</option>
            <option value="CRITICAL">Critical Alerts</option>
            <option value="HIGH">High Alerts</option>
            <option value="MODERATE">Moderate Alerts</option>
            <option value="LOW">Low Alerts</option>
          </select>

          {/* Classification */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Classifications</option>
            <option value="INDUSTRIAL_FIRE">Industrial Fires</option>
            <option value="GAS_FLARE_HOTSPOT">Gas/Oil Flares</option>
            <option value="FOREST_FIRE">Forest / Wildland</option>
            <option value="AGRICULTURAL_BURNING">Agricultural Burning</option>
            <option value="PERSISTENT_THERMAL_SOURCE">Persistent Sources</option>
          </select>

          {/* Satellite Instrument */}
          <select
            value={satelliteFilter}
            onChange={(e) => setSatelliteFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Satellites</option>
            <option value="VIIRS">VIIRS (375m)</option>
            <option value="MODIS">MODIS (1km)</option>
          </select>

          <button
            onClick={fetchFires}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs"
            title="Reload data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Map View */}
      <MapWrapper
        fires={filteredFires}
        selectedFire={selectedFire}
        onSelectFire={(f) => setSelectedFire(f)}
        height="calc(100vh - 180px)"
      />
    </div>
  );
}
