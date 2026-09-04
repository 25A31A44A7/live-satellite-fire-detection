import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { computePersistentClusters } from '@/lib/persistenceDetector';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const minPersistence = parseFloat(searchParams.get('minPersistence') || '0');
    const search = searchParams.get('search');

    let clusters = await prisma.persistentThermalSource.findMany({
      where: {
        persistenceScore: { gte: minPersistence },
        ...(search ? {
          OR: [
            { locationName: { contains: search } },
            { facilityName: { contains: search } },
            { state: { contains: search } },
            { facilityType: { contains: search } },
          ]
        } : {})
      },
      orderBy: { persistenceScore: 'desc' },
    });

    if (clusters.length === 0) {
      // Recompute clusters from current fire records
      const allFires = await prisma.fireEvent.findMany();
      if (allFires.length > 0) {
        const rawDetections = allFires.map((f) => ({
          latitude: f.latitude,
          longitude: f.longitude,
          detectionTime: f.detectionTime,
          frp: f.frp,
          brightnessTemp: f.brightnessTemp,
          locationName: f.locationName,
        }));

        const computed = computePersistentClusters(rawDetections, 2.0, 1);
        for (const cluster of computed) {
          await prisma.persistentThermalSource.upsert({
            where: { clusterId: cluster.clusterId },
            update: {
              detectionCount: cluster.detectionCount,
              avgFRP: cluster.avgFRP,
              maxFRP: cluster.maxFRP,
              persistenceScore: cluster.persistenceScore,
              lastSeen: cluster.lastSeen,
            },
            create: {
              clusterId: cluster.clusterId,
              centroidLat: cluster.centroidLat,
              centroidLng: cluster.centroidLng,
              locationName: cluster.locationName,
              country: cluster.country,
              state: "Active Industrial Hub",
              detectionCount: cluster.detectionCount,
              firstSeen: cluster.firstSeen,
              lastSeen: cluster.lastSeen,
              avgFRP: cluster.avgFRP,
              maxFRP: cluster.maxFRP,
              avgBrightnessTemp: cluster.avgBrightnessTemp,
              persistenceScore: cluster.persistenceScore,
              facilityType: "Industrial Hub",
              facilityName: cluster.locationName,
            },
          });
        }

        clusters = await prisma.persistentThermalSource.findMany({
          orderBy: { persistenceScore: 'desc' },
        });
      }
    }

    return NextResponse.json({
      success: true,
      total: clusters.length,
      clusters,
    });
  } catch (error: any) {
    console.error('Error fetching persistent thermal sources:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve persistent thermal sources.' },
      { status: 500 }
    );
  }
}
