'use client';

import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Search, 
  Filter, 
  Flame, 
  Calendar, 
  Download, 
  Activity, 
  Building2, 
  ShieldAlert,
  ArrowUpDown
} from 'lucide-react';
import MapWrapper from '@/components/MapWrapper';
import { HistoricalFireEventDto } from '@/types';

export default function HistoricalPage() {
  const [events, setEvents] = useState<HistoricalFireEventDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [fireType, setFireType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

  const fetchHistorical = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/fires/historical?timeRange=${timeRange}&fireType=${fireType}&search=${encodeURIComponent(searchQuery)}`);
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || []);
      }
    } catch (e) {
      console.error('Historical fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistorical();
  }, [timeRange, fireType]);

  const mapFires = events.map((e) => ({
    ...e,
    classificationConfidence: 90,
    persistenceScore: 0,
    isPersistentSource: false,
    isRealTime: false,
  }));

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-wider flex items-center gap-2">
            <Clock className="w-6 h-6 text-cyan-400" />
            <span>HISTORICAL SATELLITE FIRE INTELLIGENCE</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Multi-temporal analysis archive across sensor passes (MODIS & VIIRS telemetry)
          </p>
        </div>

        {/* Time Range Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 overflow-x-auto">
          {[
            { id: '24h', label: '24 Hours' },
            { id: '7d', label: '7 Days' },
            { id: '30d', label: '30 Days' },
            { id: '6mo', label: '6 Months' },
            { id: '1y', label: '1 Year' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTimeRange(t.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                timeRange === t.id
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Historical Map View */}
      <div className="space-y-2">
        <h3 className="font-bold text-sm text-white flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-400" />
          <span>Historical Incident Density Map</span>
        </h3>
        <MapWrapper fires={mapFires as any} height="400px" />
      </div>

      {/* Filters & Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchHistorical();
          }}
          className="flex items-center bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 w-full max-w-sm"
        >
          <Search className="w-4 h-4 text-slate-400 mr-2" />
          <input
            type="text"
            placeholder="Search location, state, or facility..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none w-full"
          />
        </form>

        <div className="flex items-center gap-2">
          <select
            value={fireType}
            onChange={(e) => setFireType(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Fire Categories</option>
            <option value="INDUSTRIAL_FIRE">Industrial Fire</option>
            <option value="FOREST_FIRE">Forest / Wildland</option>
            <option value="AGRICULTURAL_BURNING">Agricultural Burning</option>
          </select>
        </div>
      </div>

      {/* Historical Archive Table */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3.5">Detection Time</th>
                <th className="p-3.5">Location & Region</th>
                <th className="p-3.5">Satellite / Sensor</th>
                <th className="p-3.5">Classification</th>
                <th className="p-3.5">Alert Level</th>
                <th className="p-3.5">FRP (MW)</th>
                <th className="p-3.5">Confidence</th>
                <th className="p-3.5">Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {events.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    No historical fire incidents found for the selected filters.
                  </td>
                </tr>
              ) : (
                events.map((evt) => (
                  <tr key={evt.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 font-mono text-slate-400">
                      {new Date(evt.detectionTime).toLocaleDateString()}{' '}
                      {new Date(evt.detectionTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-white">{evt.locationName}</div>
                      <div className="text-[11px] text-slate-400">
                        {evt.latitude.toFixed(3)}°N, {evt.longitude.toFixed(3)}°E
                      </div>
                    </td>
                    <td className="p-3.5 font-mono text-cyan-400">
                      {evt.satellite.replace('_', ' ')}
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {evt.fireType.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          evt.alertLevel === 'CRITICAL'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                            : evt.alertLevel === 'HIGH'
                            ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                            : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40'
                        }`}
                      >
                        {evt.alertLevel}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono font-bold text-orange-400">
                      {evt.frp.toFixed(1)}
                    </td>
                    <td className="p-3.5 font-mono text-slate-200">
                      {evt.confidence}%
                    </td>
                    <td className="p-3.5 text-slate-400">
                      {evt.durationHours ? `${evt.durationHours} hrs` : '--'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
