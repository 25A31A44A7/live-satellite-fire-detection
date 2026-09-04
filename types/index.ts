export type SatelliteSource = 'VIIRS_SNPP' | 'VIIRS_NOAA20' | 'VIIRS_NOAA21' | 'MODIS_TERRA' | 'MODIS_AQUA';
export type Instrument = 'VIIRS' | 'MODIS';
export type FireType = 
  | 'INDUSTRIAL_FIRE' 
  | 'FOREST_FIRE' 
  | 'AGRICULTURAL_BURNING' 
  | 'PERSISTENT_THERMAL_SOURCE' 
  | 'GAS_FLARE_HOTSPOT' 
  | 'UNKNOWN_ANOMALY';

export type AlertLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
export type Severity = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
export type UserRole = 'USER' | 'ADMIN' | 'ANALYST';

export interface FireEventDto {
  id: string;
  latitude: number;
  longitude: number;
  detectionTime: string;
  satellite: string;
  instrument: string;
  confidence: number;
  brightnessTemp: number;
  brightnessTemp4?: number | null;
  brightnessTemp5?: number | null;
  frp: number;
  source: string;
  fireType: FireType;
  severity: Severity;
  alertLevel: AlertLevel;
  classificationConfidence: number;
  locationName: string;
  country: string;
  state?: string | null;
  district?: string | null;
  industrialArea: boolean;
  industrialFacilityName?: string | null;
  facilityType?: string | null;
  distanceToIndustrialKm?: number | null;
  persistenceScore: number;
  isPersistentSource: boolean;
  scanTrack?: string | null;
  dayNight?: string | null;
  isRealTime: boolean;
  createdAt: string;
  alerts?: AlertDto[];
}

export interface HistoricalFireEventDto {
  id: string;
  latitude: number;
  longitude: number;
  detectionTime: string;
  satellite: string;
  instrument: string;
  confidence: number;
  brightnessTemp: number;
  frp: number;
  fireType: FireType;
  severity: Severity;
  alertLevel: AlertLevel;
  locationName: string;
  country: string;
  state?: string | null;
  district?: string | null;
  industrialArea: boolean;
  industrialFacilityName?: string | null;
  durationHours?: number | null;
  notes?: string | null;
  createdAt: string;
}

export interface PersistentThermalSourceDto {
  id: string;
  clusterId: string;
  centroidLat: number;
  centroidLng: number;
  locationName: string;
  country: string;
  state?: string | null;
  district?: string | null;
  detectionCount: number;
  firstSeen: string;
  lastSeen: string;
  avgFRP: number;
  maxFRP: number;
  avgBrightnessTemp: number;
  persistenceScore: number;
  facilityType?: string | null;
  facilityName?: string | null;
  status: string;
  createdAt: string;
}

export interface AlertDto {
  id: string;
  fireEventId: string;
  alertLevel: AlertLevel;
  title: string;
  message: string;
  acknowledged: boolean;
  acknowledgedBy?: string | null;
  acknowledgedAt?: string | null;
  createdAt: string;
  fireEvent?: FireEventDto;
}

export interface DashboardStats {
  activeFires: number;
  criticalFires: number;
  highAlertFires: number;
  thermalSources: number;
  todayDetections: number;
  industrialHotspots: number;
  avgFRP: number;
  maxFRP: number;
  lastSyncTime: string;
  isLiveApiConnected: boolean;
}

export interface UserDto {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  lastLogin?: string | null;
}

export interface UserAlertPreferenceDto {
  criticalAlerts: boolean;
  highAlerts: boolean;
  moderateAlerts: boolean;
  lowAlerts: boolean;
  browserNotify: boolean;
  emailNotify: boolean;
  targetRegion: string;
  minFRP: number;
}
