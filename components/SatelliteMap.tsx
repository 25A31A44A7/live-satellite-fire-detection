'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Popup, 
  Circle, 
  useMap, 
  LayersControl, 
  LayerGroup,
  useMapEvents
} from 'react-leaflet';
import L from 'leaflet';
import Link from 'next/link';
import { 
  Flame, 
  Search, 
  Navigation, 
  Layers, 
  Eye, 
  ShieldAlert, 
  Radio, 
  Activity, 
  Info,
  Maximize2,
  Minimize2,
  Compass,
  Building2,
  ExternalLink
} from 'lucide-react';
import { FireEventDto } from '@/types';
import { MAJOR_INDUSTRIAL_REGISTRY, calculateHaversineDistance } from '@/lib/osmOverpass';

// Custom SVG Icons for Fire Severity Levels
const createCustomMarkerIcon = (level: string, isIndustrial: boolean, isPersistent: boolean) => {
  let color = '#10b981';
  let pulseClass = 'fire-low';

  if (level === 'CRITICAL') {
    color = '#ef4444';
    pulseClass = 'fire-critical';
  } else if (level === 'HIGH') {
    color = '#f97316';
    pulseClass = 'fire-high';
  } else if (level === 'MODERATE') {
    color = '#eab308';
    pulseClass = 'fire-moderate';
  }

  const iconHtml = `
    <div class="fire-marker-pulse ${pulseClass}" style="width: 32px; height: 32px;">
      <div style="
        background: ${color};
        width: 18px;
        height: 18px;
        border-radius: 50%;
        border: 2px solid #ffffff;
        box-shadow: 0 0 12px ${color};
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2">
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
        </svg>
      </div>
    </div>
  `;

  return L.divIcon({
    html: iconHtml,
    className: 'custom-fire-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

const industrialIcon = L.divIcon({
  html: `
    <div style="
      background: #38bdf8;
      width: 20px;
      height: 20px;
      border-radius: 6px;
      border: 1.5px solid #ffffff;
      box-shadow: 0 0 8px #38bdf8;
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0f172a" stroke-width="2.5">
        <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
        <path d="M9 22v-4h6v4"/>
        <path d="M8 6h.01"/>
        <path d="M16 6h.01"/>
        <path d="M8 10h.01"/>
        <path d="M16 10h.01"/>
        <path d="M8 14h.01"/>
        <path d="M16 14h.01"/>
      </svg>
    </div>
  `,
  className: 'custom-industrial-icon',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

// Map Controller for Search / Pan / Zoom
function MapController({ targetCoords }: { targetCoords: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (targetCoords) {
      map.flyTo(targetCoords, 12, { duration: 1.5 });
    }
  }, [targetCoords, map]);
  return null;
}

interface SatelliteMapProps {
  fires: FireEventDto[];
  selectedFire?: FireEventDto | null;
  onSelectFire?: (fire: FireEventDto) => void;
  height?: string;
  enableControls?: boolean;
}

export default function SatelliteMap({
  fires,
  selectedFire,
  onSelectFire,
  height = '650px',
  enableControls = true,
}: SatelliteMapProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [targetCoords, setTargetCoords] = useState<[number, number] | null>(null);
  const [activeLayers, setActiveLayers] = useState({
    fires: true,
    industrial: true,
    persistent: true,
    heat: false,
    satelliteTiles: true,
  });
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [nearbyAlertMsg, setNearbyAlertMsg] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    const q = searchQuery.toLowerCase().trim();

    // Check if coordinates format: lat,lng
    if (q.includes(',')) {
      const parts = q.split(',').map((p) => parseFloat(p.trim()));
      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        setTargetCoords([parts[0], parts[1]]);
        setIsSearching(false);
        return;
      }
    }

    // Check against active fires location names
    const matchedFire = fires.find(
      (f) =>
        f.locationName.toLowerCase().includes(q) ||
        (f.state && f.state.toLowerCase().includes(q)) ||
        (f.district && f.district.toLowerCase().includes(q)) ||
        (f.industrialFacilityName && f.industrialFacilityName.toLowerCase().includes(q))
    );

    if (matchedFire) {
      setTargetCoords([matchedFire.latitude, matchedFire.longitude]);
      if (onSelectFire) onSelectFire(matchedFire);
      setIsSearching(false);
      return;
    }

    // Check against registered industrial facilities
    const matchedFacility = MAJOR_INDUSTRIAL_REGISTRY.find(
      (fac) =>
        fac.name.toLowerCase().includes(q) ||
        (fac.state && fac.state.toLowerCase().includes(q)) ||
        fac.type.toLowerCase().includes(q)
    );

    if (matchedFacility) {
      setTargetCoords([matchedFacility.lat, matchedFacility.lng]);
      setIsSearching(false);
      return;
    }

    // Quick geographic centers lookup
    const geoMap: Record<string, [number, number]> = {
      visakhapatnam: [17.6868, 83.2185],
      vizag: [17.6868, 83.2185],
      rajahmundry: [16.9891, 81.7821],
      mumbai: [19.0760, 72.8777],
      chennai: [13.0827, 80.2707],
      jamnagar: [22.4707, 70.0577],
      hazira: [21.1278, 72.6582],
      surat: [21.1702, 72.8311],
      delhi: [28.6139, 77.2090],
      angul: [20.8415, 85.1472],
      singrauli: [24.1032, 82.6781],
      hyderabad: [17.3850, 78.4867],
      bhubaneswar: [20.2961, 85.8245],
      paradip: [20.2789, 86.6341],
      jamshedpur: [22.8046, 86.2029],
      panipat: [29.3909, 76.9635],
    };

    if (geoMap[q]) {
      setTargetCoords(geoMap[q]);
    } else {
      // Fallback coordinate search
      setNearbyAlertMsg(`No exact coordinates found for "${searchQuery}". Showing national thermal overview.`);
      setTimeout(() => setNearbyAlertMsg(null), 4000);
    }
    setIsSearching(false);
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserLocation(coords);
        setTargetCoords(coords);

        // Find closest fire
        let closestDist = Infinity;
        let closestFire: FireEventDto | null = null;
        for (const fire of fires) {
          const dist = calculateHaversineDistance(coords[0], coords[1], fire.latitude, fire.longitude);
          if (dist < closestDist) {
            closestDist = dist;
            closestFire = fire;
          }
        }

        if (closestFire) {
          setNearbyAlertMsg(
            `Located! Nearest thermal detection is ${closestDist.toFixed(1)}km away at ${closestFire.locationName} (${closestFire.alertLevel} Alert, ${closestFire.frp.toFixed(1)} MW).`
          );
        } else {
          setNearbyAlertMsg(`Located at ${coords[0].toFixed(2)}, ${coords[1].toFixed(2)}. No active fires nearby.`);
        }
        setTimeout(() => setNearbyAlertMsg(null), 8000);
      },
      (err) => {
        console.warn('Geolocation denied or failed:', err);
        alert('Could not retrieve current location. Please grant location permissions.');
      }
    );
  };

  const initialCenter: [number, number] = selectedFire
    ? [selectedFire.latitude, selectedFire.longitude]
    : [20.5937, 78.9629]; // Center of India

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-[#060913]">
      {/* Top Floating Command HUD Bar */}
      {enableControls && (
        <div className="absolute top-3 left-3 right-3 z-[1000] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          {/* Search Box */}
          <form
            onSubmit={handleSearch}
            className="pointer-events-auto flex items-center bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl px-3 py-1.5 shadow-xl w-full max-w-sm sm:max-w-md"
          >
            <Search className="w-4 h-4 text-cyan-400 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search city, facility, state or 'lat,lng'..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none w-full"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="ml-2 px-2.5 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold text-[11px] transition-colors"
            >
              Locate
            </button>
          </form>

          {/* Map Controls */}
          <div className="pointer-events-auto flex items-center gap-2">
            <button
              onClick={handleGeolocation}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700 text-slate-200 hover:text-cyan-400 text-xs font-semibold shadow-xl transition-colors active:scale-95"
              title="Locate Me"
            >
              <Navigation className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Use My Location</span>
            </button>

            {/* Layer Filter Toggles */}
            <div className="flex items-center bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-xl p-1 gap-1 shadow-xl">
              <button
                onClick={() => setActiveLayers((p) => ({ ...p, industrial: !p.industrial }))}
                className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-colors flex items-center gap-1 ${
                  activeLayers.industrial ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Toggle OSM Industrial Facilities"
              >
                <Building2 className="w-3 h-3" />
                <span className="hidden md:inline">OSM Sites</span>
              </button>

              <button
                onClick={() => setActiveLayers((p) => ({ ...p, satelliteTiles: !p.satelliteTiles }))}
                className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-colors flex items-center gap-1 ${
                  activeLayers.satelliteTiles ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Toggle Satellite vs Dark Map"
              >
                <Layers className="w-3 h-3" />
                <span className="hidden md:inline">{activeLayers.satelliteTiles ? 'Satellite' : 'Dark Map'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Proximity / Geolocation Notification Banner */}
      {nearbyAlertMsg && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-[1000] px-4 py-2 rounded-xl bg-slate-900/95 border border-cyan-500/40 shadow-2xl text-xs text-slate-200 flex items-center gap-2 animate-in fade-in slide-in-from-top-4 max-w-lg">
          <Activity className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{nearbyAlertMsg}</span>
        </div>
      )}

      {/* Actual Leaflet Map */}
      <MapContainer
        center={initialCenter}
        zoom={5}
        style={{ height, width: '100%', zIndex: 1 }}
        attributionControl={false}
      >
        <MapController targetCoords={targetCoords} />

        {/* Tile Layers */}
        {activeLayers.satelliteTiles ? (
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution="&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
            maxZoom={18}
          />
        ) : (
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution="&copy; CartoDB &copy; OpenStreetMap"
            maxZoom={19}
          />
        )}

        {/* User Geolocation Marker */}
        {userLocation && (
          <Circle
            center={userLocation}
            radius={5000}
            pathOptions={{ color: '#00e5ff', fillColor: '#00e5ff', fillOpacity: 0.2 }}
          />
        )}

        {/* OSM Industrial Facilities Layer */}
        {activeLayers.industrial &&
          MAJOR_INDUSTRIAL_REGISTRY.map((fac, idx) => (
            <React.Fragment key={`fac-${idx}`}>
              <Marker position={[fac.lat, fac.lng]} icon={industrialIcon}>
                <Popup>
                  <div className="p-2 space-y-1.5 min-w-[200px] text-slate-200">
                    <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-xs">
                      <Building2 className="w-3.5 h-3.5" />
                      <span>{fac.category}</span>
                    </div>
                    <div className="font-semibold text-sm text-white">{fac.name}</div>
                    <p className="text-[11px] text-slate-400">{fac.type} &bull; {fac.state}, {fac.country}</p>
                    <div className="pt-1.5 border-t border-slate-700 text-[10px] text-slate-300">
                      OSM Buffer: <span className="text-cyan-400 font-semibold">5.0 km Monitoring Radius</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
              <Circle
                center={[fac.lat, fac.lng]}
                radius={3000}
                pathOptions={{ color: '#38bdf8', fillColor: '#38bdf8', fillOpacity: 0.05, weight: 1, dashArray: '4, 4' }}
              />
            </React.Fragment>
          ))}

        {/* Active Fire Detection Hotspots */}
        {activeLayers.fires &&
          fires.map((fire) => (
            <Marker
              key={fire.id}
              position={[fire.latitude, fire.longitude]}
              icon={createCustomMarkerIcon(
                fire.alertLevel,
                fire.industrialArea,
                fire.isPersistentSource
              )}
              eventHandlers={{
                click: () => {
                  if (onSelectFire) onSelectFire(fire);
                },
              }}
            >
              <Popup>
                <div className="p-2.5 space-y-2 min-w-[240px] max-w-[280px] text-slate-100 font-sans">
                  {/* Header Badge */}
                  <div className="flex items-center justify-between border-b border-slate-700 pb-1.5">
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
                      {fire.alertLevel} ALERT
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {fire.satellite.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Location & Title */}
                  <div>
                    <h4 className="font-bold text-sm text-white leading-tight">
                      {fire.locationName}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Coordinates: {fire.latitude.toFixed(4)}°N, {fire.longitude.toFixed(4)}°E
                    </p>
                  </div>

                  {/* Telemetry Metrics Grid */}
                  <div className="grid grid-cols-2 gap-1.5 py-1.5 px-2 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Fire Radiative Power</span>
                      <span className="font-bold text-orange-400 font-mono">{fire.frp.toFixed(1)} MW</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Confidence</span>
                      <span className="font-bold text-cyan-400 font-mono">{fire.confidence}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Brightness Temp</span>
                      <span className="font-bold text-slate-200 font-mono">{fire.brightnessTemp.toFixed(1)} K</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Classification</span>
                      <span className="font-semibold text-purple-300 truncate block">
                        {fire.fireType.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Industrial Correlation Note */}
                  {fire.industrialFacilityName && (
                    <div className="text-[11px] text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded p-1.5">
                      <strong>Industrial Proximity:</strong> {fire.distanceToIndustrialKm?.toFixed(1)}km from {fire.industrialFacilityName}
                    </div>
                  )}

                  {/* Footer Link */}
                  <div className="pt-1 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-slate-400">
                      {new Date(fire.detectionTime).toLocaleDateString([], { month: 'short', day: 'numeric' })}{' '}
                      {new Date(fire.detectionTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <Link
                      href={`/fires/${fire.id}`}
                      className="inline-flex items-center gap-1 font-semibold text-cyan-400 hover:text-cyan-300 hover:underline"
                    >
                      <span>Full Profile</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>

      {/* Bottom Floating Legend */}
      <div className="absolute bottom-3 left-3 z-[1000] p-2.5 rounded-xl bg-slate-950/90 backdrop-blur-md border border-slate-800 text-[11px] shadow-2xl space-y-1.5 hidden sm:block">
        <div className="font-bold text-slate-300 text-[10px] uppercase tracking-wider flex items-center gap-1">
          <Flame className="w-3 h-3 text-orange-400" />
          <span>Thermal Severity Legend</span>
        </div>
        <div className="flex items-center gap-3 text-slate-300">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm shadow-red-500" />
            <span>Critical</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-sm shadow-orange-500" />
            <span>High</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 shadow-sm shadow-yellow-500" />
            <span>Moderate</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500" />
            <span>Low</span>
          </div>
        </div>
      </div>
    </div>
  );
}
