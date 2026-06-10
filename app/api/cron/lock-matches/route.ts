import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  // Verifica o secret para segurança
  const { searchParams } = new URL(req.url)
  const secret = searchParams.get('secret')

  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const now = new Date()
  const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000)

  // Busca jogos que começam nos próximos 5 minutos e ainda não estão bloqueados
  const matchesToLock = await prisma.match.findMany({
    where: {
      isLocked: false,
      status: 'SCHEDULED',
      matchDate: {
        lte: fiveMinutesFromNow,
      },
    },
  })

  if (matchesToLock.length === 0) {
    return NextResponse.json({ message: 'Nenhum jogo para bloquear', locked: 0 })
  }

  // Bloqueia todos
  await prisma.match.updateMany({
    where: {
      id: { in: matchesToLock.map(m => m.id) },
    },
    data: { isLocked: true },
  })

  console.log(`🔒 ${matchesToLock.length} jogos bloqueados automaticamente`)

  return NextResponse.json({
    message: `${matchesToLock.length} jogos bloqueados`,
    locked: matchesToLock.length,
    matches: matchesToLock.map(m => m.id),
  })
}