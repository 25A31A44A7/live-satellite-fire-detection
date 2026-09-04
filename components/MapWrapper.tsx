'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import { Radio, Flame } from 'lucide-react';
import { FireEventDto } from '@/types';

interface MapWrapperProps {
  fires: FireEventDto[];
  selectedFire?: FireEventDto | null;
  onSelectFire?: (fire: FireEventDto) => void;
  height?: string;
  enableControls?: boolean;
}

const DynamicMap = dynamic(() => import('./SatelliteMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[650px] rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col items-center justify-center p-6 text-center space-y-4 animate-pulse">
      <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-cyan-950 border border-cyan-500/30">
        <Radio className="w-8 h-8 text-cyan-400 animate-spin" />
        <Flame className="absolute w-5 h-5 text-orange-400" />
      </div>
      <div>
        <h3 className="text-sm font-bold text-white tracking-wider">INITIALIZING SATELLITE RADAR</h3>
        <p className="text-xs text-slate-400 mt-1">Connecting to VIIRS / MODIS Geospatial Layer & OSM Registry...</p>
      </div>
    </div>
  ),
});

export default function MapWrapper(props: MapWrapperProps) {
  return <DynamicMap {...props} />;
}
