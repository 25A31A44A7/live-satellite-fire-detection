'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area,
  CartesianGrid,
  Legend
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  Flame, 
  ShieldAlert, 
  Building2, 
  Radio, 
  Zap, 
  Activity,
  RefreshCw
} from 'lucide-react';

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/analytics');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error('Analytics fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading || !data) {
    return (
      <div className="p-12 text-center text-slate-400 space-y-3 animate-pulse">
        <Activity className="w-8 h-8 text-cyan-400 mx-auto animate-spin" />
        <p className="text-xs">Computing satellite thermal distributions and geospatial vectors...</p>
      </div>
    );
  }

  const { stats, dailyTrend, classificationData, alertLevelData, regionalRankings, satelliteDistribution } = data;

  const COLORS = ['#a855f7', '#ef4444', '#f59e0b', '#06b6d4', '#3b82f6', '#64748b'];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-wider flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-cyan-400" />
            <span>SATELLITE THERMAL ANALYTICS & INTELLIGENCE</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Geospatial energy output (MW), classification metrics, and multi-sensor telemetry
          </p>
        </div>

        <button
          onClick={fetchAnalytics}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Analytics</span>
        </button>
      </div>

      {/* Top Stat Summary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
          <span className="text-[11px] text-slate-400 font-semibold uppercase">Total Thermal Output</span>
          <div className="text-2xl font-black text-orange-400 font-mono mt-1">
            {stats.totalRadiativeEnergyMW} <span className="text-xs text-slate-400 font-normal">MW</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Summed Fire Radiative Power</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
          <span className="text-[11px] text-slate-400 font-semibold uppercase">Peak FRP Observed</span>
          <div className="text-2xl font-black text-red-400 font-mono mt-1">
            {stats.maxFRP} <span className="text-xs text-slate-400 font-normal">MW</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">High-Intensity Hotspot</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
          <span className="text-[11px] text-slate-400 font-semibold uppercase">Industrial Ratio</span>
          <div className="text-2xl font-black text-purple-400 font-mono mt-1">
            {stats.activeFires > 0 ? ((stats.industrialHotspots / stats.activeFires) * 100).toFixed(0) : 0}%
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">{stats.industrialHotspots} within OSM sites</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
          <span className="text-[11px] text-slate-400 font-semibold uppercase">Persistent Hubs</span>
          <div className="text-2xl font-black text-cyan-400 font-mono mt-1">
            {stats.thermalSources}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Multi-week recurring clusters</div>
        </div>
      </div>

      {/* Charts Grid 1: Daily Trend Area Chart & Classification Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Time Series */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>7-Day Satellite Detection Timeline</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">Detections / Day</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyTrend}>
                <defs>
                  <linearGradient id="colorIndustrial" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorWildland" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="industrial" stroke="#a855f7" fillOpacity={1} fill="url(#colorIndustrial)" name="Industrial / Flares" />
                <Area type="monotone" dataKey="wildland" stroke="#ef4444" fillOpacity={1} fill="url(#colorWildland)" name="Wildland / Forest" />
                <Area type="monotone" dataKey="total" stroke="#06b6d4" fillOpacity={0} name="Total Anomaly Count" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Classification Distribution */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-400" />
            <span>AI Classification Distribution</span>
          </h3>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={classificationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {classificationData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-300">
            {classificationData.map((item: any, idx: number) => (
              <div key={item.name} className="flex items-center gap-1.5 truncate">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                <span className="truncate">{item.name} ({item.count})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Grid 2: Regional Rankings & Alert Level Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Regional Hotspot Ranking */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Building2 className="w-4 h-4 text-purple-400" />
            <span>Top Geographic Hotspot Regions (Detections)</span>
          </h3>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionalRankings} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#64748b" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={10} width={110} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#38bdf8" radius={[0, 4, 4, 0]} name="Fire Detections" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alert Level Distribution */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <span>Severity & Alert Level Breakdown</span>
          </h3>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={alertLevelData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="count" name="Incidents">
                  {alertLevelData.map((entry: any, index: number) => (
                    <Cell key={`cell-alert-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
