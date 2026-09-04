import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const session = await getSessionUser();
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized. Admin privileges required.' }, { status: 403 });
  }

  const logs = await prisma.systemLog.findMany({
    take: 100,
    orderBy: { timestamp: 'desc' },
  });

  return NextResponse.json({ success: true, logs });
}
