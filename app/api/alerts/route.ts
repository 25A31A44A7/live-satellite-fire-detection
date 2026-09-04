import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const alertLevel = searchParams.get('alertLevel');
    const acknowledged = searchParams.get('acknowledged');
    const limit = parseInt(searchParams.get('limit') || '100');

    const where: any = {};
    if (alertLevel && alertLevel !== 'ALL') {
      where.alertLevel = alertLevel;
    }
    if (acknowledged !== null && acknowledged !== undefined && acknowledged !== '') {
      where.acknowledged = acknowledged === 'true';
    }

    const alerts = await prisma.alert.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        fireEvent: true,
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    const counts = {
      critical: await prisma.alert.count({ where: { alertLevel: 'CRITICAL', acknowledged: false } }),
      high: await prisma.alert.count({ where: { alertLevel: 'HIGH', acknowledged: false } }),
      moderate: await prisma.alert.count({ where: { alertLevel: 'MODERATE', acknowledged: false } }),
      low: await prisma.alert.count({ where: { alertLevel: 'LOW', acknowledged: false } }),
      totalUnacknowledged: await prisma.alert.count({ where: { acknowledged: false } }),
    };

    return NextResponse.json({
      success: true,
      counts,
      total: alerts.length,
      alerts,
    });
  } catch (error: any) {
    console.error('Error fetching alerts:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve alerts.' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { alertId, acknowledged = true } = await req.json();
    const session = await getSessionUser();

    if (!alertId) {
      return NextResponse.json({ error: 'Alert ID is required.' }, { status: 400 });
    }

    const updated = await prisma.alert.update({
      where: { id: alertId },
      data: {
        acknowledged,
        acknowledgedAt: acknowledged ? new Date() : null,
        acknowledgedBy: acknowledged && session ? session.userId : null,
      },
    });

    return NextResponse.json({
      success: true,
      alert: updated,
    });
  } catch (error: any) {
    console.error('Error updating alert:', error);
    return NextResponse.json(
      { error: 'Failed to update alert state.' },
      { status: 500 }
    );
  }
}
