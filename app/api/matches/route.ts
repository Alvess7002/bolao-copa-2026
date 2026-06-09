import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const matches = await prisma.match.findMany({
    include: {
      homeTeam: true,
      awayTeam: true,
      group: true,
    },
    orderBy: { matchDate: 'asc' },
  })
  return NextResponse.json(matches)
}