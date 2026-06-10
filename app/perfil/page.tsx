import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { PerfilClient } from '@/components/perfil/PerfilClient'

export default async function PerfilPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { rankingEntry: true },
  })

  if (!user) redirect('/login')

  const predictions = await prisma.prediction.findMany({
    where: { userId: user.id },
    include: {
      match: {
        include: { homeTeam: true, awayTeam: true, group: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const totalUsers = await prisma.rankingEntry.count()

  const position = await prisma.rankingEntry.count({
    where: {
      totalPoints: { gt: user.rankingEntry?.totalPoints ?? 0 },
    },
  })

  const stats = {
    name: user.name ?? 'Usuário',
    email: user.email ?? '',
    image: user.image,
    totalPoints: user.rankingEntry?.totalPoints ?? 0,
    correctPredictions: user.rankingEntry?.correctPredictions ?? 0,
    totalPredictions: predictions.length,
    groupPoints: user.rankingEntry?.groupPoints ?? 0,
    knockoutPoints: user.rankingEntry?.knockoutPoints ?? 0,
    bonusPoints: user.rankingEntry?.bonusPoints ?? 0,
    accuracy: user.rankingEntry?.accuracy ?? 0,
    position: position + 1,
    totalUsers,
  }

  return (
    <div style={{ paddingTop: 24 }}>
      <div style={{
        fontWeight: 900, fontSize: 20, letterSpacing: 3, marginBottom: 20,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        👤 MEU PERFIL
        <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      </div>

      <PerfilClient
        stats={JSON.parse(JSON.stringify(stats))}
        predictions={JSON.parse(JSON.stringify(predictions))}
      />
    </div>
  )
}
