import { prisma } from '@/lib/prisma'
import { CountdownClient } from '@/components/layout/CountdownClient'
import Link from 'next/link'

type Team = {
  id: string
  name: string
  flagEmoji: string
  code: string
}

type GroupWithTeams = {
  id: string
  code: string
  name: string
  teams: Team[]
}

export default async function HomePage() {
  const matchCount = await prisma.match.count()
  const teamCount  = await prisma.team.count()
  const groupCount = await prisma.group.count()

  const groups = await prisma.group.findMany({
    include: { teams: true },
    orderBy: { code: 'asc' },
  }) as GroupWithTeams[]

  return (
    <div style={{ paddingTop: 24 }}>
      {/* HERO */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(201,168,76,0.08), rgba(10,32,20,0.6))',
        border: '1px solid var(--border)',
        borderRadius: 24, padding: '28px 32px', marginBottom: 24,
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', flexWrap: 'wrap', gap: 20,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', right: -10, top: -20, fontWeight: 900, fontSize: 140, color: 'rgba(201,168,76,0.04)', pointerEvents: 'none', lineHeight: 1, letterSpacing: -5 }}>2026</div>
        <div>
          <div style={{ fontSize: 11, letterSpacing: 3, color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 20, height: 1, background: 'var(--gold)', display: 'inline-block' }} />
            Copa do Mundo da FIFA
          </div>
          <div style={{ fontWeight: 900, fontSize: 42, letterSpacing: 3, lineHeight: 0.95, marginBottom: 12 }}>
            FIFA WORLD CUP<br />
            <span style={{ background: 'linear-gradient(135deg, #F4D878, #C9A84C)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>2026™</span>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['🇺🇸 Estados Unidos', '🇨🇦 Canadá', '🇲🇽 México', '11 Jun – 19 Jul 2026'].map(h => (
              <span key={h} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: 20, fontSize: 12, color: 'var(--text-200)' }}>{h}</span>
            ))}
          </div>
        </div>
        <CountdownClient targetDate="2026-06-11T19:00:00Z" />
      </div>

      {/* STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10, marginBottom: 24 }}>
        {[
          { label: 'Jogos',         value: matchCount, sub: 'fase de grupos'       },
          { label: 'Seleções',      value: teamCount,  sub: '48 países'            },
          { label: 'Grupos',        value: groupCount, sub: 'A até L'              },
          { label: 'Meus Palpites', value: 0,          sub: `de ${matchCount} jogos` },
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
        <Link href="/grupos" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-200)', fontWeight: 600, fontSize: 14, padding: '12px 24px', borderRadius: 10, textDecoration: 'none' }}>
          📊 Ver Grupos
        </Link>
      </div>

      {/* GRUPOS OVERVIEW */}
      <div style={{ fontWeight: 900, fontSize: 18, letterSpacing: 3, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
        <span>🌍</span> GRUPOS DA COPA 2026
        <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10 }}>
        {groups.map(g => (
          <Link key={g.id} href="/grupos" style={{ textDecoration: 'none' }}>
            <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: 16, padding: '14px 16px', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontWeight: 900, fontSize: 12, letterSpacing: 2, color: 'var(--gold)', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', padding: '2px 10px', borderRadius: 20 }}>
                  GRUPO {g.code}
                </span>
                <span style={{ fontSize: 10, color: 'var(--text-400)' }}>4 seleções</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {g.teams.map((t: Team) => (
                  <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-200)' }}>
                    <span style={{ fontSize: 14 }}>{t.flagEmoji}</span>
                    {t.name}
                  </div>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
