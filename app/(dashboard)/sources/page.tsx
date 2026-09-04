'use client';

import React from 'react';
import { 
  Database, 
  Satellite, 
  Map, 
  ShieldAlert, 
  Layers, 
  ExternalLink,
  Info,
  CheckCircle2
} from 'lucide-react';

export default function DataSourcesPage() {
  return (
    <div className="max-w-4xl space-y-8 pb-16">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-wider flex items-center gap-2">
          <Database className="w-6 h-6 text-cyan-400" />
          <span>DATA SOURCES & SATELLITE SENSORS</span>
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Scientific documentation of earth observation satellites, spatial query APIs, and sensor calibration
        </p>
      </div>

      {/* NASA FIRMS Section */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-400">
            <Satellite className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">NASA FIRMS (Fire Information for Resource Management System)</h2>
            <p className="text-xs text-slate-400">Near Real-Time (NRT) Satellite Active Fire & Thermal Anomaly Feeds</p>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          The <strong>LIVE-SATELLITE</strong> platform ingests thermal radiative observations distributed by NASA EOSDIS FIRMS. Thermal anomaly pixels are detected by multispectral radiometers using middle-infrared (~3.7–4.0 µm) and thermal infrared (~11 µm) spectral bands to identify sub-pixel thermal sources significantly hotter than surrounding background surfaces.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
            <div className="font-bold text-cyan-400">VIIRS (375m I-Band Active Fire)</div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Carried onboard <strong>Suomi-NPP</strong> and <strong>NOAA-20 / NOAA-21</strong> satellites. Provides 375m spatial resolution at nadir with enhanced detection of small/low-intensity industrial and agricultural fires.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
            <div className="font-bold text-orange-400">MODIS (1 km Active Fire Product)</div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Flown aboard NASA's <strong>Terra</strong> and <strong>Aqua</strong> sun-synchronous satellites. Detects thermal anomalies with a 1km spatial footprint, capturing high-FRP industrial plumes and wildland fires.
            </p>
          </div>
        </div>
      </div>

      {/* OpenStreetMap Overpass Section */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-400">
            <Map className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">OpenStreetMap (OSM) & Overpass Spatial Infrastructure</h2>
            <p className="text-xs text-slate-400">Spatial Proximity Matching & Industrial Infrastructure Mapping</p>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          To distinguish wildland and agricultural fires from industrial hazards, the system correlates satellite hotspot coordinates against OSM tags including: <code className="text-cyan-400">landuse=industrial</code>, <code className="text-cyan-400">power=plant</code>, <code className="text-cyan-400">man_made=refinery</code>, <code className="text-cyan-400">man_made=works</code>, and <code className="text-cyan-400">amenity=fuel</code>.
        </p>
      </div>

      {/* Sensor Limitations & Scientific Caveats */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-xl">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span>Operational Considerations & Accuracy Caveats</span>
        </h3>

        <ul className="text-xs text-slate-300 space-y-2 list-disc pl-4 leading-relaxed">
          <li>
            <strong>Cloud & Smoke Obscuration:</strong> Thick cloud cover, dense overcast, and heavy smoke plumes may attenuate thermal radiance, causing temporary non-detections.
          </li>
          <li>
            <strong>Satellite Overpass Cadence:</strong> Polar-orbiting satellites pass over a specific coordinate 2–4 times per 24-hour cycle. Detections reflect the exact moment of sensor overpass.
          </li>
          <li>
            <strong>Sub-Pixel Anomaly Sensitivity:</strong> Detections represent surface thermal anomalies; ground confirmation is recommended for operational disaster deployment.
          </li>
        </ul>
      </div>
    </div>
  );
}
