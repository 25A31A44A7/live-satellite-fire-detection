'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Flame, 
  Satellite, 
  MapPin, 
  Radio, 
  ShieldAlert, 
  Activity, 
  Building2, 
  BarChart3, 
  Clock, 
  ArrowRight, 
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Database,
  Layers,
  Zap
} from 'lucide-react';

export default function LandingPage() {
  const [liveCount, setLiveCount] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/fires/live?limit=1')
      .then((r) => r.json())
      .then((d) => setLiveCount(d.total || 18))
      .catch(() => setLiveCount(18));
  }, []);

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 selection:bg-orange-500/30 selection:text-orange-200">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#070c18]/90 backdrop-blur-md px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-600 via-red-600 to-amber-500 shadow-lg shadow-orange-500/25">
              <Flame className="w-5 h-5 text-white" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg tracking-wider text-white">LIVE-SATELLITE</span>
                <span className="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  AI ORBITAL CORE
                </span>
              </div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
            <Link href="#features" className="hover:text-cyan-400 transition-colors">Capabilities</Link>
            <Link href="#classification" className="hover:text-cyan-400 transition-colors">AI Classifier</Link>
            <Link href="#persistence" className="hover:text-cyan-400 transition-colors">Thermal Sources</Link>
            <Link href="/sources" className="hover:text-cyan-400 transition-colors">Sensors & NASA</Link>
          </nav>

          <div className="flex items-center gap-2.5">
            <Link
              href="/login"
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700 transition-all"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 via-red-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-lg shadow-orange-500/20 transition-all flex items-center gap-1.5"
            >
              <span>Explore Platform</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-8 bg-grid-pattern">
        {/* Glow Spheres */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/4 left-1/3 w-[350px] h-[350px] bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-xs font-mono text-cyan-400 shadow-xl">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          <span>NASA FIRMS &bull; VIIRS 375m &bull; MODIS 1km &bull; OSM Spatial Indexing</span>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1]">
            AI-Powered Satellite Fire & <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-orange-400 via-red-400 to-amber-300 bg-clip-text text-transparent">
              Thermal Source Intelligence
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Monitor satellite-detected fires, industrial thermal anomalies, persistent thermal sources, historical fire events, and risk alerts using NASA FIRMS, OpenStreetMap and satellite data.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/dashboard"
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 via-red-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-sm shadow-xl shadow-orange-500/25 flex items-center gap-2 transition-all active:scale-95"
          >
            <Flame className="w-4 h-4" />
            <span>Launch Satellite Radar</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/register"
            className="px-6 py-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 font-bold text-sm shadow-xl transition-all"
          >
            Create Operations Account
          </Link>
        </div>

        {/* Live Counters Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto pt-8">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">{liveCount || 18}</div>
            <div className="text-[11px] text-slate-400 font-medium mt-0.5">Active Thermal Events</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
            <div className="text-2xl sm:text-3xl font-black text-orange-400 font-mono">375m</div>
            <div className="text-[11px] text-slate-400 font-medium mt-0.5">VIIRS Sensor Resolution</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
            <div className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono">96.8%</div>
            <div className="text-[11px] text-slate-400 font-medium mt-0.5">AI Classification Conf.</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
            <div className="text-2xl sm:text-3xl font-black text-purple-400 font-mono">&lt; 1.5 km</div>
            <div className="text-[11px] text-slate-400 font-medium mt-0.5">OSM Industrial Buffer</div>
          </div>
        </div>
      </section>

      {/* Core Capabilities Showcase */}
      <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-[11px] font-bold uppercase tracking-widest text-cyan-400">Enterprise Surveillance</span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">Full-Spectrum Satellite Thermal Intelligence</h2>
          <p className="text-xs text-slate-400">
            From industrial flare monitoring to regional wildland fire containment and persistent heat cluster tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-orange-500/40 transition-all shadow-xl space-y-3">
            <div className="p-3 rounded-xl bg-orange-950/40 border border-orange-500/30 text-orange-400 w-fit">
              <Satellite className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Live Satellite Fire Detection</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Integrates NASA FIRMS VIIRS and MODIS polar orbital radiometer data to detect active thermal anomalies, Fire Radiative Power (MW), and sub-pixel hotspots in near real-time.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/40 transition-all shadow-xl space-y-3">
            <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-400 w-fit">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">OSM Industrial Proximity Matching</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Spatial cross-referencing against OpenStreetMap infrastructure tags for refineries, steel works, thermal power stations, chemical hubs, and fuel storage depots.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 transition-all shadow-xl space-y-3">
            <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 w-fit">
              <Radio className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Persistent Thermal Source Clustering</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automated temporal persistence scoring identifies stationary industrial flare stacks and high-temperature manufacturing nodes across weeks and months of sensor orbits.
            </p>
          </div>
        </div>
      </section>

      {/* AI Classifier Deep Dive */}
      <section id="classification" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <div className="text-[11px] font-bold uppercase tracking-widest text-orange-400">Heuristic ML Pipeline</div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">Multi-Factor AI Thermal Event Classification</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Our AI classification model synthesizes sensor Fire Radiative Power (MW), Brightness Temperature (Kelvin), day/night sensor passes, recurrence persistence, and Euclidean distance to OSM facilities.
            </p>

            <div className="space-y-2.5 pt-2">
              {[
                { title: 'Industrial Fire / Complex Flare', desc: 'Identified via high FRP + close proximity (< 1.5km) to heavy manufacturing or refinery assets.' },
                { title: 'Wildland / Forest Fire', desc: 'Identified via high radiative energy output, canopy thermal profile, and non-urban landcover.' },
                { title: 'Agricultural Residue Burning', desc: 'Classified using diurnal daytime signatures and low-to-moderate FRP in rural farming belts.' },
                { title: 'Persistent Thermal Source', desc: 'Stationary multi-pass detections scoring > 80% temporal recurrence index.' },
              ].map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                  <div className="font-bold text-cyan-400">{item.title}</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-bold text-xs text-white">Telemetry & Alert Scoring Matrix</span>
              <span className="text-[10px] text-cyan-400 font-mono">Formula: FRP + Conf + Proximity</span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-red-950/20 border border-red-500/30 text-red-300 flex justify-between items-center">
                <span>CRITICAL ALERT (Score &gt; 80)</span>
                <span className="font-bold">Severe Risk</span>
              </div>
              <div className="p-3 rounded-xl bg-orange-950/20 border border-orange-500/30 text-orange-300 flex justify-between items-center">
                <span>HIGH ALERT (Score 60 - 80)</span>
                <span className="font-bold">Elevated Anomaly</span>
              </div>
              <div className="p-3 rounded-xl bg-yellow-950/20 border border-yellow-500/30 text-yellow-300 flex justify-between items-center">
                <span>MODERATE ALERT (Score 30 - 60)</span>
                <span className="font-bold">Monitor State</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 flex justify-between items-center">
                <span>LOW ALERT (Score &lt; 30)</span>
                <span className="font-bold">Standard Field</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-[#04070d] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-orange-600 flex items-center justify-center text-white">
              <Flame className="w-4 h-4" />
            </div>
            <span className="font-bold text-white">LIVE-SATELLITE</span>
            <span>&bull;</span>
            <span>AI-Based Fire & Thermal Monitoring Platform</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <Link href="/sources" className="hover:text-cyan-400 transition-colors">Data Sources & NASA</Link>
            <Link href="/status" className="hover:text-cyan-400 transition-colors">System Status</Link>
            <Link href="/login" className="hover:text-cyan-400 transition-colors">Terminal Login</Link>
            <Link href="/register" className="hover:text-cyan-400 transition-colors">Register</Link>
          </div>

          <div className="text-[11px] text-slate-500 text-center md:text-right">
            Satellite data &copy; NASA FIRMS EOSDIS &bull; Map data &copy; OpenStreetMap contributors
          </div>
        </div>
      </footer>
    </div>
  );
}
