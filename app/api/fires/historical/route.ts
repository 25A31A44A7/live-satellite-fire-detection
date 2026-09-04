import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { HISTORICAL_FIRE_ARCHIVE } from '@/lib/sampleSatelliteData';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const timeRange = searchParams.get('timeRange') || '30d';
    const fireType = searchParams.get('fireType');
    const severity = searchParams.get('severity');
    const minFRP = searchParams.get('minFRP');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '300');

    // Auto seed historical events if empty
    const histCount = await prisma.historicalFireEvent.count();
    if (histCount === 0) {
      for (const item of HISTORICAL_FIRE_ARCHIVE) {
        await prisma.historicalFireEvent.create({
          data: {
            latitude: item.latitude,
            longitude: item.longitude,
            detectionTime: new Date(item.detectionTime),
            satellite: item.satellite,
            instrument: item.instrument,
            confidence: item.confidence,
            brightnessTemp: item.brightnessTemp,
            frp: item.frp,
            fireType: item.fireType,
            severity: item.severity,
            alertLevel: item.alertLevel,
            locationName: item.locationName,
            country: item.country,
            state: item.state,
            district: item.district,
            industrialArea: item.industrialArea,
            industrialFacilityName: item.industrialFacilityName,
            durationHours: item.durationHours,
            notes: item.notes,
          },
        });
      }
    }

    const where: any = {};

    // Compute date cutoff
    const now = new Date('2026-09-04T18:45:00Z');
    if (timeRange === '24h') {
      where.detectionTime = { gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) };
    } else if (timeRange === '7d') {
      where.detectionTime = { gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) };
    } else if (timeRange === '30d') {
      where.detectionTime = { gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) };
    } else if (timeRange === '6mo') {
      where.detectionTime = { gte: new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000) };
    } else if (timeRange === '1y') {
      where.detectionTime = { gte: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000) };
    }

    if (fireType && fireType !== 'ALL') {
      where.fireType = fireType;
    }
    if (severity && severity !== 'ALL') {
      where.severity = severity;
    }
    if (minFRP) {
      where.frp = { gte: parseFloat(minFRP) };
    }
    if (search) {
      where.OR = [
        { locationName: { contains: search } },
        { state: { contains: search } },
        { district: { contains: search } },
        { industrialFacilityName: { contains: search } },
      ];
    }

    const events = await prisma.historicalFireEvent.findMany({
      where,
      orderBy: { detectionTime: 'desc' },
      take: limit,
    });

    return NextResponse.json({
      success: true,
      total: events.length,
      events,
    });
  } catch (error: any) {
    console.error('Error fetching historical fires:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve historical fire records.' },
      { status: 500 }
    );
  }
}
