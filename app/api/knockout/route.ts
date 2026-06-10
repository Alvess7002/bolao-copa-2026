import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const matches = await prisma.match.findMany({
    where: {
      phase: { not: 'GROUPS' },
    },
    include: {
      homeTeam: true,
      awayTeam: true,
    },
    orderBy: { matchDate: 'asc' },
  })

  return NextResponse.json(matches)
}