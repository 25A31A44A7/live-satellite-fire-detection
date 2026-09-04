// AI-Based Multi-Factor Thermal Anomaly Classifier
// Combines NASA FIRMS sensor telemetry, spatial proximity to OSM infrastructure, and temporal persistence

import { FireType, Severity, AlertLevel } from '@/types';
import { matchIndustrialInfrastructure, IndustrialMatchResult } from './osmOverpass';

export interface ClassificationInput {
  latitude: number;
  longitude: number;
  frp: number; // Fire Radiative Power in MW
  confidence: number; // 0 - 100
  brightnessTemp: number; // Kelvin (e.g. 330 - 450 K)
  dayNight?: string; // 'D' or 'N'
  satellite?: string; // 'VIIRS' or 'MODIS'
  persistenceScore?: number; // 0 - 100
  detectionCount?: number;
}

export interface ClassificationResult {
  fireType: FireType;
  severity: Severity;
  alertLevel: AlertLevel;
  confidenceScore: number; // 0 - 100 %
  industrialArea: boolean;
  industrialFacilityName: string | null;
  facilityType: string | null;
  distanceToIndustrialKm: number | null;
  explainability: string[];
  riskFactors: {
    frpRisk: 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME';
    thermalIntensity: 'NORMAL' | 'ELEVATED' | 'SEVERE';
    infrastructureVulnerability: 'NONE' | 'PROXIMATE' | 'CRITICAL';
  };
}

export async function classifyThermalEvent(
  input: ClassificationInput
): Promise<ClassificationResult> {
  const {
    latitude,
    longitude,
    frp,
    confidence,
    brightnessTemp,
    dayNight = 'D',
    persistenceScore = 0,
    detectionCount = 1,
  } = input;

  const explainability: string[] = [];

  // 1. Evaluate Industrial Proximity via OSM / Spatial Registry
  const spatialMatch: IndustrialMatchResult = await matchIndustrialInfrastructure(
    latitude,
    longitude,
    6.0 // 6km proximity threshold
  );

  let calculatedConfidence = Math.min(99, Math.max(50, confidence));
  let fireType: FireType = 'UNKNOWN_ANOMALY';
  let severity: Severity = 'LOW';
  let alertLevel: AlertLevel = 'LOW';

  // 2. Risk Factor Metrics
  const frpRisk =
    frp > 150 ? 'EXTREME' : frp > 50 ? 'HIGH' : frp > 15 ? 'MODERATE' : 'LOW';
  const thermalIntensity =
    brightnessTemp > 380 ? 'SEVERE' : brightnessTemp > 340 ? 'ELEVATED' : 'NORMAL';
  const infrastructureVulnerability =
    spatialMatch.isIndustrial && spatialMatch.distanceKm <= 1.5
      ? 'CRITICAL'
      : spatialMatch.isIndustrial
      ? 'PROXIMATE'
      : 'NONE';

  // 3. Multi-Factor AI Classification Rules
  if (persistenceScore > 70 || detectionCount >= 10) {
    // Persistent thermal signature over time
    if (spatialMatch.isIndustrial && spatialMatch.facility?.category === 'GAS_FLARE') {
      fireType = 'GAS_FLARE_HOTSPOT';
      calculatedConfidence = 94;
      explainability.push(
        `High temporal recurrence (${detectionCount} detections) aligned with active gas flare infrastructure.`
      );
    } else if (spatialMatch.isIndustrial) {
      fireType = 'PERSISTENT_THERMAL_SOURCE';
      calculatedConfidence = 91;
      explainability.push(
        `Recurring thermal anomaly (${persistenceScore}% persistence) within ${spatialMatch.distanceKm}km of ${spatialMatch.facility?.name}.`
      );
    } else {
      fireType = 'PERSISTENT_THERMAL_SOURCE';
      calculatedConfidence = 86;
      explainability.push(
        `Long-duration stationary thermal signature detected across consecutive satellite passes.`
      );
    }
  } else if (spatialMatch.isIndustrial && spatialMatch.distanceKm <= 3.0) {
    // Industrial proximity
    if (spatialMatch.facility?.category === 'GAS_FLARE' && dayNight === 'N') {
      fireType = 'GAS_FLARE_HOTSPOT';
      calculatedConfidence = Math.min(96, calculatedConfidence + 15);
      explainability.push(
        `Nighttime thermal plume detected ${spatialMatch.distanceKm}km from ${spatialMatch.facility?.name}.`
      );
    } else {
      fireType = 'INDUSTRIAL_FIRE';
      calculatedConfidence = Math.min(98, calculatedConfidence + spatialMatch.confidenceBonus);
      explainability.push(
        `Thermal event located ${spatialMatch.distanceKm}km from high-risk industrial facility (${spatialMatch.facility?.name}).`
      );
    }
  } else if (frp > 60 && brightnessTemp > 350) {
    // Large thermal signature
    fireType = 'FOREST_FIRE';
    calculatedConfidence = Math.min(92, calculatedConfidence + 10);
    explainability.push(
      `High radiative energy (${frp.toFixed(1)} MW) and elevated brightness temperature (${brightnessTemp.toFixed(1)} K) typical of active wildland canopy combustion.`
    );
  } else if (frp < 30 && dayNight === 'D') {
    // Moderate daytime thermal hotspot
    fireType = 'AGRICULTURAL_BURNING';
    calculatedConfidence = Math.min(88, calculatedConfidence + 5);
    explainability.push(
      `Daytime low-to-moderate FRP signature (${frp.toFixed(1)} MW) indicative of localized open-field agricultural residue burning.`
    );
  } else {
    fireType = 'UNKNOWN_ANOMALY';
    calculatedConfidence = Math.max(60, confidence);
    explainability.push(
      `Thermal anomaly detected by satellite sensor requiring ground confirmation.`
    );
  }

  // 4. Alert Level & Severity Calculation
  // Composite formula: FRP (35%) + Sensor Confidence (25%) + Industrial Proximity (25%) + Persistence (15%)
  const frpNormalized = Math.min(100, (frp / 150) * 100);
  const proximityWeight = spatialMatch.isIndustrial
    ? Math.max(0, (6.0 - spatialMatch.distanceKm) / 6.0) * 100
    : 0;

  const compositeScore =
    0.35 * frpNormalized +
    0.25 * confidence +
    0.25 * proximityWeight +
    0.15 * persistenceScore;

  if (compositeScore >= 75 || (spatialMatch.isIndustrial && frp > 50)) {
    alertLevel = 'CRITICAL';
    severity = 'CRITICAL';
  } else if (compositeScore >= 50 || (spatialMatch.isIndustrial && frp > 20)) {
    alertLevel = 'HIGH';
    severity = 'HIGH';
  } else if (compositeScore >= 30 || frp > 15) {
    alertLevel = 'MODERATE';
    severity = 'MODERATE';
  } else {
    alertLevel = 'LOW';
    severity = 'LOW';
  }

  explainability.push(
    `Composite Risk Score: ${compositeScore.toFixed(1)}/100 (FRP: ${frp.toFixed(1)} MW, Confidence: ${confidence}%, Alert Level: ${alertLevel}).`
  );

  return {
    fireType,
    severity,
    alertLevel,
    confidenceScore: parseFloat(calculatedConfidence.toFixed(1)),
    industrialArea: spatialMatch.isIndustrial,
    industrialFacilityName: spatialMatch.facility?.name || null,
    facilityType: spatialMatch.facility?.type || null,
    distanceToIndustrialKm: spatialMatch.isIndustrial ? spatialMatch.distanceKm : null,
    explainability,
    riskFactors: {
      frpRisk,
      thermalIntensity,
      infrastructureVulnerability,
    },
  };
}
