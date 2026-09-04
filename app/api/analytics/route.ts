import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { syncSatelliteData } from '@/lib/nasaFirms';

export async function GET() {
  try {
    const totalCount = await prisma.fireEvent.count();
    if (totalCount === 0) {
      await syncSatelliteData();
    }

    const fires = await prisma.fireEvent.findMany();

    // 1. Classification Breakdown
    const classificationCounts: Record<string, number> = {
      INDUSTRIAL_FIRE: 0,
      FOREST_FIRE: 0,
      AGRICULTURAL_BURNING: 0,
      PERSISTENT_THERMAL_SOURCE: 0,
      GAS_FLARE_HOTSPOT: 0,
      UNKNOWN_ANOMALY: 0,
    };

    // 2. Alert Level Breakdown
    const alertLevelCounts: Record<string, number> = {
      CRITICAL: 0,
      HIGH: 0,
      MODERATE: 0,
      LOW: 0,
    };

    // 3. Regional Breakdown
    const stateCounts: Record<string, number> = {};

    // 4. Satellite Breakdown
    const satelliteCounts: Record<string, number> = {};

    let totalFRP = 0;
    let maxFRP = 0;
    let industrialCount = 0;

    // Daily distribution (last 7 days bucket)
    const dailyMap: Record<string, { date: string; industrial: number; wildland: number; agricultural: number; total: number }> = {};

    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().slice(5, 10); // MM-DD
      dailyMap[key] = { date: key, industrial: 0, wildland: 0, agricultural: 0, total: 0 };
    }

    for (const fire of fires) {
      // Classification
      if (classificationCounts[fire.fireType] !== undefined) {
        classificationCounts[fire.fireType]++;
      } else {
        classificationCounts.UNKNOWN_ANOMALY++;
      }

      // Alert Level
      if (alertLevelCounts[fire.alertLevel] !== undefined) {
        alertLevelCounts[fire.alertLevel]++;
      }

      // State
      const stateName = fire.state || "Other Regions";
      stateCounts[stateName] = (stateCounts[stateName] || 0) + 1;

      // Satellite
      const sat = fire.satellite || "VIIRS";
      satelliteCounts[sat] = (satelliteCounts[sat] || 0) + 1;

      // FRP Metrics
      totalFRP += fire.frp;
      if (fire.frp > maxFRP) maxFRP = fire.frp;
      if (fire.industrialArea) industrialCount++;

      // Daily bucket
      const dayKey = fire.detectionTime.toISOString().slice(5, 10);
      if (dailyMap[dayKey]) {
        dailyMap[dayKey].total++;
        if (fire.fireType === 'INDUSTRIAL_FIRE' || fire.fireType === 'GAS_FLARE_HOTSPOT') {
          dailyMap[dayKey].industrial++;
        } else if (fire.fireType === 'FOREST_FIRE') {
          dailyMap[dayKey].wildland++;
        } else {
          dailyMap[dayKey].agricultural++;
        }
      }
    }

    const regionalRankings = Object.entries(stateCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    const classificationData = [
      { name: 'Industrial Fire', count: classificationCounts.INDUSTRIAL_FIRE, color: '#a855f7' },
      { name: 'Forest/Wildland', count: classificationCounts.FOREST_FIRE, color: '#ef4444' },
      { name: 'Agricultural', count: classificationCounts.AGRICULTURAL_BURNING, color: '#f59e0b' },
      { name: 'Gas/Oil Flare', count: classificationCounts.GAS_FLARE_HOTSPOT, color: '#06b6d4' },
      { name: 'Persistent Source', count: classificationCounts.PERSISTENT_THERMAL_SOURCE, color: '#3b82f6' },
      { name: 'Unknown Anomaly', count: classificationCounts.UNKNOWN_ANOMALY, color: '#64748b' },
    ];

    const alertLevelData = [
      { name: 'Critical', count: alertLevelCounts.CRITICAL, color: '#ef4444' },
      { name: 'High', count: alertLevelCounts.HIGH, color: '#f97316' },
      { name: 'Moderate', count: alertLevelCounts.MODERATE, color: '#eab308' },
      { name: 'Low', count: alertLevelCounts.LOW, color: '#10b981' },
    ];

    const stats = {
      activeFires: fires.length,
      criticalFires: alertLevelCounts.CRITICAL,
      highAlertFires: alertLevelCounts.HIGH,
      thermalSources: await prisma.persistentThermalSource.count(),
      todayDetections: fires.length,
      industrialHotspots: industrialCount,
      avgFRP: fires.length > 0 ? parseFloat((totalFRP / fires.length).toFixed(1)) : 0,
      maxFRP: parseFloat(maxFRP.toFixed(1)),
      totalRadiativeEnergyMW: parseFloat(totalFRP.toFixed(1)),
    };

    return NextResponse.json({
      success: true,
      stats,
      dailyTrend: Object.values(dailyMap),
      classificationData,
      alertLevelData,
      regionalRankings,
      satelliteDistribution: Object.entries(satelliteCounts).map(([name, count]) => ({ name, count })),
    });
  } catch (error: any) {
    console.error('Analytics computation error:', error);
    return NextResponse.json(
      { error: 'Failed to compute satellite fire analytics.' },
      { status: 500 }
    );
  }
}
