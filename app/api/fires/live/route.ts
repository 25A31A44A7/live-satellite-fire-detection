import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { syncSatelliteData } from '@/lib/nasaFirms';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const severity = searchParams.get('severity');
    const alertLevel = searchParams.get('alertLevel');
    const fireType = searchParams.get('fireType');
    const satellite = searchParams.get('satellite');
    const minFRP = searchParams.get('minFRP');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '200');

    // Auto-sync or seed if table is currently empty
    const count = await prisma.fireEvent.count();
    if (count === 0) {
      await syncSatelliteData();
    }

    const where: any = {};

    if (severity && severity !== 'ALL') {
      where.severity = severity;
    }
    if (alertLevel && alertLevel !== 'ALL') {
      where.alertLevel = alertLevel;
    }
    if (fireType && fireType !== 'ALL') {
      where.fireType = fireType;
    }
    if (satellite && satellite !== 'ALL') {
      where.satellite = { contains: satellite };
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

    const fires = await prisma.fireEvent.findMany({
      where,
      orderBy: { detectionTime: 'desc' },
      take: limit,
      include: {
        alerts: {
          select: {
            id: true,
            alertLevel: true,
            title: true,
            message: true,
            acknowledged: true,
          },
        },
      },
    });

    const totalCount = await prisma.fireEvent.count();

    return NextResponse.json({
      success: true,
      total: totalCount,
      count: fires.length,
      fires,
    });
  } catch (error: any) {
    console.error('Error fetching live fires:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve live satellite fire detections.' },
      { status: 500 }
    );
  }
}
