import { prisma } from '@/lib/prisma'
import { CountdownClient } from '@/components/layout/CountdownClient'
import { StatsReal } from '@/components/dashboard/StatsReal'
import Link from 'next/link'

export default async function DashboardPage() {
  const [matchCount, teamCount, rankingCount] = await Promise.all([
    prisma.match.count(),
    prisma.team.count(),
    prisma.rankingEntry.count(),
  ])

  const topRanking = await prisma.rankingEntry.findMany({
    include: { user: true },
    orderBy: { totalPoints: 'desc' },
    take: 5,
  })

  const nextMatches = await prisma.match.findMany({
    where: {
      status: 'SCHEDULED',
      matchDate: { gte: new Date() },
    },
    include: { homeTeam: true, awayTeam: true, group: true },
    orderBy: { matchDate: 'asc' },
    take: 4,
  })

  function formatDate(dt: Date) {
    return new Date(dt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
  }
  function formatTime(dt: Date) {
    return new Date(dt).toLocaleTimeString('pt-BR', {
      hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo',
    }) + 'h'
  }

  const medals: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' }
  const colors = ['#1E3A6B', '#4B1E6B', '#1E6B3D', '#6B3E1E', '#1E2E6B']

  return (
    <div style={{ paddingTop: 24 }}>

      {/* HERO */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(201,168,76,0.08), rgba(10,32,20,0.6))',
        border: '1px solid var(--border)', borderRadius: 24,
        padding: '28px 32px', marginBottom: 24,
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', flexWrap: 'wrap', gap: 20,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', right: -10, top: -20,
          fontWeight: 900, fontSize: 140,
          color: 'rgba(201,168,76,0.04)', pointerEvents: 'none', lineHeight: 1,
        }}>2026</div>
        <div>
          <div style={{ fontSize: 11, letterSpacing: 3, color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 20, height: 1, background: 'var(--gold)', display: 'inline-block' }} />
            Copa do Mundo da FIFA
          </div>
          <div style={{ fontWeight: 900, fontSize: 40, letterSpacing: 3, lineHeight: 0.95, marginBottom: 12 }}>
            FIFA WORLD CUP<br />
            <span style={{ background: 'linear-gradient(135deg, #F4D878, #C9A84C)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              2026™
            </span>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['🇺🇸 EUA', '🇨🇦 Canadá', '🇲🇽 México', '11 Jun – 19 Jul 2026'].map(h => (
              <span key={h} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: 20, fontSize: 12, color: 'var(--text-200)' }}>{h}</span>
            ))}
          </div>
        </div>
        <CountdownClient targetDate="2026-06-11T19:00:00Z" />
      </div>

      {/* STATS REAIS DO USUÁRIO */}
      <StatsReal />

      {/* STATS GERAIS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10, marginBottom: 24 }}>
        {[
          { label: 'Jogos',         value: matchCount,   sub: 'fase de grupos' },
          { label: 'Seleções',      value: teamCount,    sub: '48 países'      },
          { label: 'Participantes', value: rankingCount, sub: 'no bolão'       },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: 10, padding: '16px 14px' }}>
            <div style={{ fontSize: 10, color: 'var(--text-400)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontWeight: 900, fontSize: 34, color: 'var(--gold)', lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: 'var(--text-300)', marginTop: 2 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* CTAs */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 28, flexWrap: 'wrap' }}>
        <Link href="/palpites" style={{ background: 'linear-gradient(135deg, #8B6F20, #C9A84C)', color: '#000', fontWeight: 700, fontSize: 14, padding: '12px 24px', borderRadius: 10, textDecoration: 'none', letterSpacing: 0.5 }}>
          ⚽ Fazer Palpites
        </Link>
        <Link href="/bonus" style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid var(--border)', color: 'var(--gold)', fontWeight: 600, fontSize: 14, padding: '12px 24px', borderRadius: 10, textDecoration: 'none' }}>
          ⭐ Palpites Bônus
        </Link>
        <Link href="/ranking" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-200)', fontWeight: 600, fontSize: 14, padding: '12px 24px', borderRadius: 10, textDecoration: 'none' }}>
          🏆 Ver Ranking
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>

        {/* PRÓXIMOS JOGOS */}
        <div>
          <div style={{ fontWeight: 900, fontSize: 16, letterSpacing: 2, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            📅 PRÓXIMOS JOGOS
            <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>
          {nextMatches.length === 0 ? (
            <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, textAlign: 'center', color: 'var(--text-400)', fontSize: 13 }}>
              Nenhum jogo agendado.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {nextMatches.map(m => (
                <div key={m.id} style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 14px' }}>
                  <div style={{ fontSize: 10, color: 'var(--text-400)', marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                    <span>📅 {formatDate(m.matchDate)} às {formatTime(m.matchDate)}</span>
                    <span style={{ background: 'rgba(201,168,76,0.1)', color: 'var(--gold)', border: '1px solid rgba(201,168,76,0.2)', padding: '1px 7px', borderRadius: 10, fontSize: 9, fontWeight: 700, letterSpacing: 1 }}>
                      GRUPO {m.group?.code}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, flex: 1 }}>
                      <span style={{ fontSize: 18 }}>{m.homeTeam.flagEmoji}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-200)' }}>{m.homeTeam.name}</span>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 900, color: 'var(--text-400)', padding: '2px 8px', background: 'rgba(0,0,0,0.3)', borderRadius: 6 }}>vs</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, flex: 1, justifyContent: 'flex-end' }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-200)' }}>{m.awayTeam.name}</span>
                      <span style={{ fontSize: 18 }}>{m.awayTeam.flagEmoji}</span>
                    </div>
                  </div>
                </div>
              ))}
              <Link href="/palpites" style={{ textAlign: 'center', fontSize: 12, color: 'var(--gold)', textDecoration: 'none', padding: '8px 0', display: 'block' }}>
                Ver todos os jogos →
              </Link>
            </div>
          )}
        </div>

        {/* TOP 5 RANKING */}
        <div>
          <div style={{ fontWeight: 900, fontSize: 16, letterSpacing: 2, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            🏆 TOP 5 RANKING
            <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>
          <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
            {topRanking.length === 0 ? (
              <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-400)', fontSize: 13 }}>
                Ranking vazio. Será preenchido após os primeiros resultados.
              </div>
            ) : (
              topRanking.map((r, i) => {
                const initials = (r.user.name ?? 'U').split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
                return (
                  <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <span style={{ fontWeight: 900, fontSize: 18, minWidth: 28, textAlign: 'center', color: i < 3 ? ['#FFD700', '#C0C0C0', '#CD7F32'][i] : 'var(--text-400)' }}>
                      {medals[i + 1] ?? i + 1}
                    </span>
                    <div style={{ width: 30, height: 30, borderRadius: '50%', background: colors[i], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'var(--gold)', flexShrink: 0 }}>
                      {initials}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{r.user.name ?? 'Usuário'}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-400)' }}>{r.correctPredictions} acertos · {r.accuracy.toFixed(0)}%</div>
                    </div>
                    <div style={{ fontWeight: 900, fontSize: 20, color: 'var(--gold)' }}>{r.totalPoints}</div>
                  </div>
                )
              })
            )}
            <Link href="/ranking" style={{ display: 'block', textAlign: 'center', fontSize: 12, color: 'var(--gold)', textDecoration: 'none', padding: '10px 0', borderTop: '1px solid var(--border)' }}>
              Ver ranking completo →
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
