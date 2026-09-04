// Alert Notification Engine for LIVE-SATELLITE

import { AlertLevel, FireType } from '@/types';

export interface AlertData {
  fireEventId: string;
  alertLevel: AlertLevel;
  fireType: FireType;
  locationName: string;
  frp: number;
  confidence: number;
  industrialFacilityName?: string | null;
  distanceToIndustrialKm?: number | null;
}

export function generateAlertNotification(alert: AlertData): { title: string; message: string } {
  const { alertLevel, fireType, locationName, frp, confidence, industrialFacilityName, distanceToIndustrialKm } = alert;

  const typeLabels: Record<FireType, string> = {
    INDUSTRIAL_FIRE: 'Industrial Thermal Event',
    FOREST_FIRE: 'Wildland/Forest Fire',
    AGRICULTURAL_BURNING: 'Agricultural Biomass Burning',
    PERSISTENT_THERMAL_SOURCE: 'Persistent Thermal Hotspot',
    GAS_FLARE_HOTSPOT: 'Gas/Oil Flare Thermal Emission',
    UNKNOWN_ANOMALY: 'Unverified Satellite Thermal Anomaly',
  };

  let title = `[${alertLevel}] ${typeLabels[fireType] || 'Thermal Anomaly'}`;
  let message = `Detected near ${locationName}. Radiative Power: ${frp.toFixed(1)} MW (Confidence: ${confidence}%).`;

  if (industrialFacilityName && distanceToIndustrialKm !== null && distanceToIndustrialKm !== undefined) {
    message += ` Proximity: ${distanceToIndustrialKm.toFixed(1)}km to ${industrialFacilityName}.`;
  }

  if (alertLevel === 'CRITICAL') {
    title = `🚨 CRITICAL ALERT: ${typeLabels[fireType]} at ${locationName}`;
  } else if (alertLevel === 'HIGH') {
    title = `⚠️ HIGH RISK: ${typeLabels[fireType]} in ${locationName}`;
  }

  return { title, message };
}
