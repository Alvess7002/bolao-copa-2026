import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST() {
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

  try {
    // Busca jogos ao vivo e recentes na API Football
    const response = await fetch(
      'https://api-football-v1.p.rapidapi.com/v3/fixtures?league=1&season=2026',
      {
        headers: {
          'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
          'x-rapidapi-key': process.env.API_FOOTBALL_KEY ?? '',
        },
      }
    )

    if (!response.ok) {
      throw new Error('API Football indisponível')
    }

    const data = await response.json()
    const fixtures = data.response ?? []

    let updated = 0

    for (const fixture of fixtures) {
      const homeScore = fixture.goals?.home
      const awayScore = fixture.goals?.away
      const status = fixture.fixture?.status?.short

      // Só processa jogos finalizados
      if (!['FT', 'AET', 'PEN'].includes(status)) continue
      if (homeScore === null || awayScore === null) continue

      const externalId = String(fixture.fixture.id)

      const match = await prisma.match.findUnique({
        where: { externalId },
      })

      if (!match || match.status === 'FINISHED') continue

      const result = homeScore > awayScore ? 'HOME' : awayScore > homeScore ? 'AWAY' : 'DRAW'

      await prisma.match.update({
        where: { externalId },
        data: {
          homeScore,
          awayScore,
          result,
          status: 'FINISHED',
          isLocked: true,
        },
      })

      // Calcula pontos para os palpites
      const predictions = await prisma.prediction.findMany({
        where: { matchId: match.id },
      })

      const isKnockout = match.phase !== 'GROUPS'
      const points = isKnockout ? 5 : 3

      for (const pred of predictions) {
        const isCorrect = pred.pick === result
        const earnedPoints = isCorrect ? points : 0

        await prisma.prediction.update({
          where: { id: pred.id },
          data: { isCorrect, points: earnedPoints },
        })

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

      updated++
    }

    return NextResponse.json({ success: true, updated, message: `${updated} jogos sincronizados` })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao sincronizar: ' + String(error) }, { status: 500 })
  }
}