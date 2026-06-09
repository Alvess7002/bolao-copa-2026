import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })
  }

  const { matchId, homeScore, awayScore } = await req.json()

  if (!matchId || homeScore === undefined || awayScore === undefined) {
    return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
  }

  // Define resultado
  const result = homeScore > awayScore ? 'HOME' : awayScore > homeScore ? 'AWAY' : 'DRAW'

  // Atualiza a partida
  await prisma.match.update({
    where: { id: matchId },
    data: {
      homeScore,
      awayScore,
      result,
      status: 'FINISHED',
      isLocked: true,
    },
  })

  // Busca todos os palpites dessa partida
  const predictions = await prisma.prediction.findMany({
    where: { matchId },
  })

  // Calcula pontos para cada palpite
  const match = await prisma.match.findUnique({ where: { id: matchId } })
  const isKnockout = match?.phase !== 'GROUPS'
  const points = isKnockout ? 5 : 3

  for (const pred of predictions) {
    const isCorrect = pred.pick === result
    const earnedPoints = isCorrect ? points : 0

    // Atualiza o palpite
    await prisma.prediction.update({
      where: { id: pred.id },
      data: { isCorrect, points: earnedPoints },
    })

    // Atualiza o ranking do usuário
    const ranking = await prisma.rankingEntry.findUnique({
      where: { userId: pred.userId },
    })

    if (ranking) {
      await prisma.rankingEntry.update({
        where: { userId: pred.userId },
        data: {
          totalPoints: { increment: earnedPoints },
          totalPredictions: { increment: 1 },
          correctPredictions: isCorrect ? { increment: 1 } : undefined,
          groupPoints: !isKnockout ? { increment: earnedPoints } : undefined,
          knockoutPoints: isKnockout ? { increment: earnedPoints } : undefined,
        },
      })
    } else {
      await prisma.rankingEntry.create({
        data: {
          userId: pred.userId,
          totalPoints: earnedPoints,
          totalPredictions: 1,
          correctPredictions: isCorrect ? 1 : 0,
          groupPoints: !isKnockout ? earnedPoints : 0,
          knockoutPoints: isKnockout ? earnedPoints : 0,
          accuracy: isCorrect ? 100 : 0,
        },
      })
    }
  }

  // Recalcula accuracy de todos
  const allRankings = await prisma.rankingEntry.findMany()
  for (const r of allRankings) {
    if (r.totalPredictions > 0) {
      await prisma.rankingEntry.update({
        where: { id: r.id },
        data: {
          accuracy: (r.correctPredictions / r.totalPredictions) * 100,
        },
      })
    }
  }

  return NextResponse.json({ success: true, result, pointsAwarded: points })
}