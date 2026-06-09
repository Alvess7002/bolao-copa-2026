import { prisma } from '@/lib/prisma'

export default async function RankingPage() {
  const rankings = await prisma.rankingEntry.findMany({
    include: { user: true },
    orderBy: { totalPoints: 'desc' },
    take: 50,
  })

  const medals: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' }
  const colors = ['#1E3A6B','#4B1E6B','#1E6B3D','#6B3E1E','#1E2E6B','#6B1E3A','#3A6B1E','#1E5A6B']

  return (
    <div style={{ paddingTop: 24 }}>
      <div style={{ fontWeight: 900, fontSize: 20, letterSpacing: 3, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
        🏆 RANKING GERAL
        <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, color: '#4CC87A', letterSpacing: 0.5 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#4CC87A', animation: 'pulse 1.5s infinite' }} />
          AO VIVO
        </div>
      </div>

      <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: 24, overflow: 'hidden' }}>
        {/* Col headers */}
        <div style={{ display: 'grid', gridTemplateColumns: '52px 1fr 80px 70px', gap: 8, padding: '8px 22px', background: 'rgba(0,0,0,0.2)', fontSize: 10, color: 'var(--text-400)', letterSpacing: 1, textTransform: 'uppercase' }}>
          <div>#</div><div>Participante</div>
          <div style={{ textAlign: 'right' }}>Pontos</div>
          <div style={{ textAlign: 'center' }}>Acertos</div>
        </div>

        {rankings.length === 0 ? (
          <div style={{ padding: '40px 22px', textAlign: 'center', color: 'var(--text-400)', fontSize: 14 }}>
            Nenhum participante ainda. O ranking será formado após os primeiros palpites e resultados.
          </div>
        ) : (
          rankings.map((r, i) => {
            const pos = i + 1
            const initials = r.user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
            return (
              <div key={r.id} style={{
                display: 'grid', gridTemplateColumns: '52px 1fr 80px 70px',
                gap: 8, padding: '11px 22px',
                borderBottom: '1px solid rgba(255,255,255,0.03)',
                background: 'transparent',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontWeight: 900, fontSize: pos <= 3 ? 20 : 16, color: pos <= 3 ? ['#FFD700','#C0C0C0','#CD7F32'][pos-1] : 'var(--text-400)' }}>
                    {medals[pos] ?? pos}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: colors[i % colors.length], display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12, color: 'var(--gold)', border: '1.5px solid rgba(255,255,255,0.1)', flexShrink: 0 }}>
                    {initials}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-100)' }}>{r.user.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-400)' }}>{r.accuracy.toFixed(0)}% aproveitamento</div>
                  </div>
                </div>
                <div style={{ fontWeight: 900, fontSize: 22, color: 'var(--gold)', textAlign: 'right' }}>{r.totalPoints}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-200)', textAlign: 'center' }}>{r.correctPredictions}</div>
              </div>
            )
          })
        )}

        <div style={{ padding: '14px 22px', fontSize: 11, color: 'var(--text-400)', textAlign: 'center', borderTop: '1px solid var(--border)' }}>
          Ranking atualizado após cada resultado · Pontuação acumulada de toda a Copa
        </div>
      </div>
    </div>
  )
}
