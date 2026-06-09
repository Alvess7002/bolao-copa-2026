import { prisma } from '@/lib/prisma'
import { PalpitesClient } from '@/components/matches/PalpitesClient'

export default async function PalpitesPage() {
  const matches = await prisma.match.findMany({
    where: { phase: 'GROUPS' },
    include: {
      homeTeam: true,
      awayTeam: true,
      group: true,
    },
    orderBy: { matchDate: 'asc' },
  })

  return (
    <div style={{ paddingTop: 24 }}>
      <div style={{ fontWeight: 900, fontSize: 20, letterSpacing: 3, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
        ⚽ PALPITES — FASE DE GRUPOS
        <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      </div>
      <p style={{ color: 'var(--text-300)', fontSize: 13, marginBottom: 20, lineHeight: 1.6 }}>
        Acertar o resultado vale <strong style={{ color: 'var(--gold)' }}>3 pontos</strong>. Palpites fecham 5 minutos antes de cada jogo.
      </p>
      <PalpitesClient matches={JSON.parse(JSON.stringify(matches))} />
    </div>
  )
}
