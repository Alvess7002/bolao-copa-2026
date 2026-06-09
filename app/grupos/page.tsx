import { prisma } from '@/lib/prisma'

type Team = {
  id: string
  name: string
  flagEmoji: string
  code: string
}

type MatchInGroup = {
  id: string
  matchDate: Date
  city: string | null
  homeScore: number | null
  awayScore: number | null
  homeTeam: { id: string; name: string; flagEmoji: string }
  awayTeam: { id: string; name: string; flagEmoji: string }
}

type GroupWithData = {
  id: string
  code: string
  name: string
  teams: Team[]
  matches: MatchInGroup[]
}

export default async function GruposPage() {
  const groups = await prisma.group.findMany({
    include: {
      teams: true,
      matches: {
        include: { homeTeam: true, awayTeam: true },
        orderBy: { matchDate: 'asc' },
      },
    },
    orderBy: { code: 'asc' },
  }) as GroupWithData[]

  function formatDate(dt: Date) {
    return new Date(dt).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
    })
  }

  function formatTime(dt: Date) {
    return new Date(dt).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Sao_Paulo',
    }) + 'h'
  }

  const colStyle = {
    fontSize: 12,
    color: 'var(--text-200)',
    textAlign: 'center' as const,
    fontWeight: 600,
  }

  return (
    <div style={{ paddingTop: 24 }}>
      <div style={{
        fontWeight: 900, fontSize: 20, letterSpacing: 3, marginBottom: 6,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        📊 GRUPOS — FIFA 2026™
        <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      </div>

      <p style={{ color: 'var(--text-300)', fontSize: 12, marginBottom: 24, lineHeight: 1.6 }}>
        Classificação em tempo real ·{' '}
        <span style={{ color: '#4CC87A' }}>■</span> Classificado &nbsp;
        <span style={{ color: 'var(--gold)' }}>■</span> Repescagem (3ºs) &nbsp;
        <span style={{ color: 'var(--text-400)' }}>■</span> Eliminado
      </p>

      {groups.map(g => (
        <div key={g.id} style={{ marginBottom: 32 }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gold)' }} />
            <span style={{ fontWeight: 900, fontSize: 14, letterSpacing: 2, color: 'var(--gold)' }}>
              GRUPO {g.code}
            </span>
          </div>

          <div style={{
            background: 'var(--surface-1)', border: '1px solid var(--border)',
            borderRadius: 16, overflow: 'hidden', marginBottom: 12,
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '28px 1fr 32px 32px 32px 32px 36px 36px 36px 44px',
              gap: 4, padding: '8px 14px',
              background: 'rgba(0,0,0,0.3)',
              borderBottom: '1px solid var(--border)',
              fontSize: 10, color: 'var(--text-400)',
              letterSpacing: 1, textTransform: 'uppercase',
            }}>
              <div>#</div>
              <div>Seleção</div>
              <div style={{ textAlign: 'center' }}>J</div>
              <div style={{ textAlign: 'center' }}>V</div>
              <div style={{ textAlign: 'center' }}>E</div>
              <div style={{ textAlign: 'center' }}>D</div>
              <div style={{ textAlign: 'center' }}>GP</div>
              <div style={{ textAlign: 'center' }}>GC</div>
              <div style={{ textAlign: 'center' }}>SG</div>
              <div style={{ textAlign: 'center' }}>PTS</div>
            </div>

            {g.teams.map((t, i) => {
              const borderColor =
                i === 0 || i === 1 ? '#4CC87A'
                : i === 2 ? 'var(--gold)'
                : 'rgba(255,255,255,0.06)'
              return (
                <div key={t.id} style={{
                  display: 'grid',
                  gridTemplateColumns: '28px 1fr 32px 32px 32px 32px 36px 36px 36px 44px',
                  gap: 4, padding: '9px 14px',
                  borderBottom: '1px solid rgba(255,255,255,0.03)',
                  borderLeft: `3px solid ${borderColor}`,
                }}>
                  <div style={{ fontWeight: 900, fontSize: 16, color: 'var(--text-300)', textAlign: 'center' }}>
                    {i + 1}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 500, color: 'var(--text-200)' }}>
                    <span style={{ fontSize: 15 }}>{t.flagEmoji}</span>
                    {t.name}
                    {(i === 0 || i === 1) && (
                      <span style={{ fontSize: 9, fontWeight: 700, background: 'rgba(76,200,122,0.2)', color: '#4CC87A', border: '1px solid rgba(76,200,122,0.3)', padding: '1px 5px', borderRadius: 4 }}>✓</span>
                    )}
                    {i === 2 && (
                      <span style={{ fontSize: 9, fontWeight: 700, background: 'rgba(201,168,76,0.2)', color: 'var(--gold)', border: '1px solid rgba(201,168,76,0.3)', padding: '1px 5px', borderRadius: 4 }}>Rep.</span>
                    )}
                  </div>
                  {[0, 0, 0, 0, 0, 0, 0, 0].map((_, ci) => (
                    <div key={ci} style={colStyle}>0</div>
                  ))}
                </div>
              )
            })}

            <div style={{ padding: '6px 14px 8px', fontSize: 10, color: 'var(--text-400)' }}>
              ↗ Resultados atualizados após cada jogo · Fonte:{' '}
              <a
                href="https://www.fifa.com/pt/tournaments/mens/worldcup/canadamexicousa2026/standings"
                target="_blank" rel="noreferrer"
                style={{ color: 'var(--gold)', textDecoration: 'none' }}
              >
                fifa.com
              </a>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 8,
          }}>
            {g.matches.map(m => (
              <div key={m.id} style={{
                background: 'var(--surface-2)', border: '1px solid var(--border)',
                borderRadius: 10, padding: '10px 12px',
              }}>
                <div style={{ fontSize: 10, color: 'var(--text-400)', marginBottom: 8 }}>
                  📅 {formatDate(m.matchDate)} às {formatTime(m.matchDate)} · 📍 {m.city}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, flex: 1 }}>
                    <span style={{ fontSize: 16 }}>{m.homeTeam.flagEmoji}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-200)', fontWeight: 500 }}>{m.homeTeam.name}</span>
                  </div>
                  <div style={{
                    fontWeight: 900, fontSize: 13, color: 'var(--text-400)',
                    padding: '2px 8px', background: 'rgba(0,0,0,0.3)', borderRadius: 6,
                  }}>
                    {m.homeScore !== null ? `${m.homeScore} × ${m.awayScore}` : 'vs'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, flex: 1, justifyContent: 'flex-end' }}>
                    <span style={{ fontSize: 12, color: 'var(--text-200)', fontWeight: 500 }}>{m.awayTeam.name}</span>
                    <span style={{ fontSize: 16 }}>{m.awayTeam.flagEmoji}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      ))}
    </div>
  )
}
