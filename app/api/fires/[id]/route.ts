import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { matchIndustrialInfrastructure } from '@/lib/osmOverpass';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const fire = await prisma.fireEvent.findUnique({
      where: { id },
      include: {
        alerts: true,
      },
    });

    if (!fire) {
      return NextResponse.json({ error: 'Fire event not found' }, { status: 404 });
    }

    // Retrieve nearby industrial facilities via OSM spatial engine
    const osmData = await matchIndustrialInfrastructure(fire.latitude, fire.longitude, 10.0);

    // Retrieve proximate historical detections within ~25km
    const latDelta = 0.25;
    const lngDelta = 0.25;
    const nearbyDetections = await prisma.fireEvent.findMany({
      where: {
        id: { not: fire.id },
        latitude: { gte: fire.latitude - latDelta, lte: fire.latitude + latDelta },
        longitude: { gte: fire.longitude - lngDelta, lte: fire.longitude + lngDelta },
      },
      take: 10,
      orderBy: { detectionTime: 'desc' },
    });

    return NextResponse.json({
      success: true,
      fire,
      osmFacility: osmData.facility,
      osmDistanceKm: osmData.distanceKm,
      nearbyDetections,
    });
  } catch (error: any) {
    console.error('Error fetching fire event details:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve fire event profile.' },
      { status: 500 }
    );
  }
}
