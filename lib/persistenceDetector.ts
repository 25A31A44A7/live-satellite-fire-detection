// Persistent Thermal Source Detector & Spatial Clustering Engine
// Groups repeated detections within spatial epsilon (e.g. 1.0 km) across temporal windows

import { calculateHaversineDistance } from './osmOverpass';

export interface RawThermalDetection {
  latitude: number;
  longitude: number;
  detectionTime: Date;
  frp: number;
  brightnessTemp: number;
  locationName: string;
}

export interface PersistentCluster {
  clusterId: string;
  centroidLat: number;
  centroidLng: number;
  locationName: string;
  state?: string;
  country: string;
  detectionCount: number;
  firstSeen: Date;
  lastSeen: Date;
  avgFRP: number;
  maxFRP: number;
  avgBrightnessTemp: number;
  persistenceScore: number; // 0 - 100 %
  facilityType?: string;
  facilityName?: string;
}

/**
 * Clusters thermal detections within radius (default 1.2km) and computes persistence telemetry
 */
export function computePersistentClusters(
  detections: RawThermalDetection[],
  epsilonKm: number = 1.2,
  minDetections: number = 3
): PersistentCluster[] {
  const clusters: {
    points: RawThermalDetection[];
    centroidLat: number;
    centroidLng: number;
  }[] = [];

  for (const point of detections) {
    let matchedCluster = null;
    for (const cluster of clusters) {
      const dist = calculateHaversineDistance(
        point.latitude,
        point.longitude,
        cluster.centroidLat,
        cluster.centroidLng
      );
      if (dist <= epsilonKm) {
        matchedCluster = cluster;
        break;
      }
    }

    if (matchedCluster) {
      matchedCluster.points.push(point);
      // Update running centroid
      const count = matchedCluster.points.length;
      matchedCluster.centroidLat =
        (matchedCluster.centroidLat * (count - 1) + point.latitude) / count;
      matchedCluster.centroidLng =
        (matchedCluster.centroidLng * (count - 1) + point.longitude) / count;
    } else {
      clusters.push({
        points: [point],
        centroidLat: point.latitude,
        centroidLng: point.longitude,
      });
    }
  }

  // Filter clusters with repeated detections and calculate persistence metrics
  return clusters
    .filter((c) => c.points.length >= minDetections)
    .map((c, index) => {
      const pts = c.points;
      const sortedByTime = [...pts].sort(
        (a, b) => a.detectionTime.getTime() - b.detectionTime.getTime()
      );
      const firstSeen = sortedByTime[0].detectionTime;
      const lastSeen = sortedByTime[sortedByTime.length - 1].detectionTime;

      const totalFrp = pts.reduce((sum, p) => sum + p.frp, 0);
      const maxFrp = Math.max(...pts.map((p) => p.frp));
      const totalBrightness = pts.reduce((sum, p) => sum + p.brightnessTemp, 0);

      const daysSpan = Math.max(
        1,
        (lastSeen.getTime() - firstSeen.getTime()) / (1000 * 60 * 60 * 24)
      );
      const detectionFrequency = pts.length / daysSpan;

      // Persistence score formula: combinations of count, time span, and frequency
      const countScore = Math.min(50, pts.length * 3);
      const spanScore = Math.min(30, daysSpan * 1.5);
      const freqScore = Math.min(20, detectionFrequency * 20);
      const persistenceScore = Math.min(99, Math.max(30, countScore + spanScore + freqScore));

      return {
        clusterId: `PTS-${c.centroidLat.toFixed(3)}-${c.centroidLng.toFixed(3)}`,
        centroidLat: parseFloat(c.centroidLat.toFixed(4)),
        centroidLng: parseFloat(c.centroidLng.toFixed(4)),
        locationName: pts[0].locationName || `Cluster Near ${c.centroidLat.toFixed(2)}, ${c.centroidLng.toFixed(2)}`,
        country: "India",
        detectionCount: pts.length,
        firstSeen,
        lastSeen,
        avgFRP: parseFloat((totalFrp / pts.length).toFixed(1)),
        maxFRP: parseFloat(maxFrp.toFixed(1)),
        avgBrightnessTemp: parseFloat((totalBrightness / pts.length).toFixed(1)),
        persistenceScore: parseFloat(persistenceScore.toFixed(1)),
      };
    });
}
