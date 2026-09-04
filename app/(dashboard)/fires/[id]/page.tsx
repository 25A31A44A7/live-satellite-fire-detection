'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Flame, 
  ArrowLeft, 
  Building2, 
  ShieldAlert, 
  Radio, 
  Activity, 
  Calendar, 
  Layers, 
  FileText, 
  Download,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Compass
} from 'lucide-react';
import MapWrapper from '@/components/MapWrapper';
import { FireEventDto } from '@/types';

export default function FireDetailPage() {
  const params = useParams();
  const router = useRouter();
  const fireId = params?.id as string;

  const [fire, setFire] = useState<FireEventDto | null>(null);
  const [osmFacility, setOsmFacility] = useState<any | null>(null);
  const [osmDistanceKm, setOsmDistanceKm] = useState<number | null>(null);
  const [nearbyDetections, setNearbyDetections] = useState<FireEventDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!fireId) return;
    fetch(`/api/fires/${fireId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.fire) {
          setFire(data.fire);
          setOsmFacility(data.osmFacility);
          setOsmDistanceKm(data.osmDistanceKm);
          setNearbyDetections(data.nearbyDetections || []);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [fireId]);

  if (loading) {
    return (
      <div className="p-16 text-center text-slate-400 space-y-3">
        <Activity className="w-8 h-8 text-cyan-400 mx-auto animate-spin" />
        <p className="text-xs">Accessing orbital telemetry archive and OSM spatial vectors...</p>
      </div>
    );
  }

  if (!fire) {
    return (
      <div className="p-12 text-center space-y-4">
        <div className="text-red-400 text-sm font-bold">Incident profile not found.</div>
        <button
          onClick={() => router.push('/dashboard')}
          className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const mapList = [fire, ...nearbyDetections];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Back Nav & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  fire.alertLevel === 'CRITICAL'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                    : fire.alertLevel === 'HIGH'
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                    : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40'
                }`}
              >
                {fire.alertLevel} ALERT
              </span>
              <span className="font-mono text-xs text-cyan-400 font-semibold">
                ID: {fire.id.slice(0, 13)}
              </span>
            </div>
            <h1 className="text-lg sm:text-2xl font-black text-white mt-1">
              {fire.locationName}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/reports"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold transition-all"
          >
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>Generate Report</span>
          </Link>
        </div>
      </div>

      {/* Main Grid: Left Map + Right Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Focused Map */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>High-Resolution Geospatial Context</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              {fire.latitude.toFixed(4)}°N, {fire.longitude.toFixed(4)}°E
            </span>
          </div>

          <MapWrapper
            fires={mapList}
            selectedFire={fire}
            height="460px"
          />

          {/* Timeline of nearby proximal detections */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-orange-400" />
              <span>Proximal Temporal Detections (within 25 km)</span>
            </h4>

            {nearbyDetections.length === 0 ? (
              <p className="text-xs text-slate-400">
                No secondary proximate satellite detections observed during current sensor orbit.
              </p>
            ) : (
              <div className="divide-y divide-slate-800/80">
                {nearbyDetections.map((det) => (
                  <div key={det.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-white">{det.locationName}</span>
                      <div className="text-[11px] text-slate-400">
                        Sensor: {det.satellite.replace('_', ' ')} &bull; {new Date(det.detectionTime).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right font-mono">
                      <span className="font-bold text-orange-400">{det.frp.toFixed(1)} MW</span>
                      <div className="text-[10px] text-cyan-400">{det.confidence}% conf</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Detailed Telemetry Cards */}
        <div className="space-y-4">
          {/* Card 1: Sensor Telemetry */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              <span>Satellite Sensor Telemetry</span>
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Radiative Power</span>
                <span className="text-base font-black text-orange-400 font-mono">
                  {fire.frp.toFixed(1)} MW
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Sensor Confidence</span>
                <span className="text-base font-black text-cyan-400 font-mono">
                  {fire.confidence}%
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Brightness (I-4)</span>
                <span className="text-sm font-bold text-slate-200 font-mono">
                  {fire.brightnessTemp.toFixed(1)} K
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Satellite Orbit</span>
                <span className="text-xs font-semibold text-slate-300 truncate block">
                  {fire.satellite.replace('_', ' ')}
                </span>
              </div>
            </div>

            <div className="text-xs text-slate-400 space-y-1 pt-1 border-t border-slate-800">
              <div className="flex justify-between">
                <span>Detection Timestamp:</span>
                <span className="text-slate-200 font-mono">
                  {new Date(fire.detectionTime).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Day/Night Pass:</span>
                <span className="text-slate-200 font-semibold">{fire.dayNight === 'D' ? 'Daytime Pass' : 'Nighttime Pass'}</span>
              </div>
              <div className="flex justify-between">
                <span>Scan Resolution:</span>
                <span className="text-slate-200 font-mono">{fire.scanTrack || '0.375 km x 0.375 km'}</span>
              </div>
            </div>
          </div>

          {/* Card 2: AI Classification & Explainability */}
          <div className="p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 shadow-xl space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center justify-between">
              <span>AI Classification Engine</span>
              <span className="font-mono text-white">{fire.classificationConfidence}% Confidence</span>
            </h3>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
              <div className="text-xs font-bold text-purple-300">
                {fire.fireType.replace(/_/g, ' ')}
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Multi-factor heuristic classification indicates severe thermal emission consistent with industrial combustion / facility processing flaring.
              </p>
            </div>
          </div>

          {/* Card 3: OSM Industrial Proximity Match */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              <span>OSM Industrial Registry Match</span>
            </h3>

            {osmFacility ? (
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-1">
                  <div className="font-bold text-white text-sm">{osmFacility.name}</div>
                  <div className="text-purple-300 text-[11px]">{osmFacility.type} &bull; {osmFacility.category}</div>
                  <div className="text-slate-300 text-[11px] pt-1 border-t border-purple-500/20">
                    Proximity Distance: <span className="font-bold text-cyan-400">{osmDistanceKm?.toFixed(2)} km</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">
                No registered heavy industrial facility within immediate 6km spatial buffer.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
