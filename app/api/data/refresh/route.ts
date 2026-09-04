import { NextRequest, NextResponse } from 'next/server';
import { syncSatelliteData } from '@/lib/nasaFirms';

export async function POST(req: NextRequest) {
  try {
    const result = await syncSatelliteData(true);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Data refresh error:', error);
    return NextResponse.json(
      { error: 'Failed to refresh satellite data.' },
      { status: 500 }
    );
  }
}
