import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json(null)
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { rankingEntry: true },
  })

  if (!user) return NextResponse.json(null)

  const totalPredictions = await prisma.prediction.count({
    where: { userId: user.id },
  })

  const position = await prisma.rankingEntry.count({
    where: {
      totalPoints: {
        gt: user.rankingEntry?.totalPoints ?? 0,
      },
    },
  })

  return NextResponse.json({
    name: user.name,
    email: user.email,
    image: user.image,
    totalPoints: user.rankingEntry?.totalPoints ?? 0,
    correctPredictions: user.rankingEntry?.correctPredictions ?? 0,
    totalPredictions,
    groupPoints: user.rankingEntry?.groupPoints ?? 0,
    knockoutPoints: user.rankingEntry?.knockoutPoints ?? 0,
    bonusPoints: user.rankingEntry?.bonusPoints ?? 0,
    accuracy: user.rankingEntry?.accuracy ?? 0,
    position: position + 1,
  })
}