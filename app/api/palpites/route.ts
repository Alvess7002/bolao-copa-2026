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

  if (!user) {
    return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
  }

  const { matchId, pick } = await req.json()

  if (!matchId || !pick) {
    return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
  }

  // Verifica se o jogo está bloqueado
  const match = await prisma.match.findUnique({
    where: { id: matchId },
  })

  if (!match) {
    return NextResponse.json({ error: 'Jogo não encontrado' }, { status: 404 })
  }

  if (match.isLocked || match.status === 'FINISHED') {
    return NextResponse.json({ error: 'Palpites encerrados para esse jogo' }, { status: 400 })
  }

  // Cria ou atualiza o palpite
  const prediction = await prisma.prediction.upsert({
    where: {
      userId_matchId: {
        userId: user.id,
        matchId,
      },
    },
    update: { pick },
    create: {
      userId: user.id,
      matchId,
      pick,
    },
  })

  return NextResponse.json({ success: true, prediction })
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    return NextResponse.json([])
  }

  const predictions = await prisma.prediction.findMany({
    where: { userId: user.id },
  })

  return NextResponse.json(predictions)
}