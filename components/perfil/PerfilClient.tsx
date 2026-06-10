'use client'

import { useState } from 'react'
import { signOut } from 'next-auth/react'

type Stats = {
  name: string
  email: string
  image: string | null
  totalPoints: number
  correctPredictions: number
  totalPredictions: number
  groupPoints: number
  knockoutPoints: number
  bonusPoints: number
  accuracy: number
  position: number
  totalUsers: number
}

type Team = { id: string; name: string; flagEmoji: string }
type Match = {
  id: string
  matchDate: string
  homeTeam: Team
  awayTeam: Team
  result: string | null
  homeScore: number | null
  awayScore: number | null
  group: { code: string } | null
  phase: string
}
type Prediction = {
  id: string
  pick: string
  points: number
  isCorrect: boolean | null
  match: Match
}

type Props = {
  stats: Stats
  predictions: Prediction[]
}

export function PerfilClient({ stats, predictions }: Props) {
  const [tab, setTab] = useState<'stats' | 'palpites'>('stats')

  const initials = stats.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  const scored = predictions.filter(p => p.isCorrect !== null)
  const correct = predictions.filter(p => p.isCorrect === true)
  const pending = predictions.filter(p => p.isCorrect === null)

  function formatDate(dt: string) {
    return new Date(dt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
  }

  function pickLabel(pick: string, match: Match) {
    if (pick === 'HOME') return `🏠 ${match.homeTeam.name}`
    if (pick === 'AWAY') return `✈ ${match.awayTeam.name}`
    return '⚖ Empate'
  }

  return (
    <>
      {/* HEADER DO PERFIL */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(201,168,76,0.08), rgba(10,32,20,0.6))',
        border: '1px solid var(--border)', borderRadius: 24,
        padding: '24px 28px', marginBottom: 20,
        display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap',
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'linear-gradient(135deg, #8B6F20, #C9A84C)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 900, fontSize: 26, color: '#000',
          border: '3px solid var(--gold)', flexShrink: 0,
          boxShadow: '0 0 20px rgba(201,168,76,0.3)',
        }}>
          {initials}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 900, fontSize: 22, letterSpacing: 1, marginBottom: 2 }}>{stats.name}</div>
          <div style={{ fontSize: 12, color: 'var(--text-400)', marginBottom: 8 }}>{stats.email}</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <span style={{
              background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)',
              color: 'var(--gold)', fontSize: 11, fontWeight: 700,
              padding: '3px 10px', borderRadius: 20, letterSpacing: 0.5,
            }}>
              🏆 {stats.position}° lugar de {stats.totalUsers}
            </span>
            <span style={{
              background: 'rgba(76,200,122,0.1)', border: '1px solid rgba(76,200,122,0.3)',
              color: '#4CC87A', fontSize: 11, fontWeight: 700,
              padding: '3px 10px', borderRadius: 20,
            }}>
              ✓ {stats.accuracy.toFixed(0)}% aproveitamento
            </span>
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 900, fontSize: 48, color: 'var(--gold)', lineHeight: 1 }}>
            {stats.totalPoints}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-400)', letterSpacing: 1, textTransform: 'uppercase' }}>
            pontos
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{
        display: 'flex', gap: 4,
        background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)',
        padding: 4, borderRadius: 10, marginBottom: 20,
        width: 'fit-content',
      }}>
        {[
          { key: 'stats',    label: '📊 Estatísticas' },
          { key: 'palpites', label: '⚽ Meus Palpites' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as any)}
            style={{
              padding: '8px 16px', borderRadius: 7, border: 'none',
              background: tab === t.key ? 'linear-gradient(135deg, #8B6F20, #C9A84C)' : 'transparent',
              color: tab === t.key ? '#000' : 'var(--text-300)',
              fontWeight: tab === t.key ? 700 : 500,
              fontSize: 13, cursor: 'pointer', letterSpacing: 0.3,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB STATS */}
      {tab === 'stats' && (
        <>
          {/* Cards de pontuação */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10, marginBottom: 20 }}>
            {[
              { label: 'Total de pontos',  value: stats.totalPoints,        sub: 'pts acumulados',     w: (stats.totalPoints / 431) * 100 },
              { label: 'Acertos',          value: stats.correctPredictions,  sub: `de ${scored.length} apurados`, w: scored.length ? (correct.length / scored.length) * 100 : 0 },
              { label: 'Palpites feitos',  value: stats.totalPredictions,    sub: 'de 72 jogos',        w: (stats.totalPredictions / 72) * 100 },
              { label: 'Aguardando',       value: pending.length,            sub: 'sem resultado ainda', w: 0 },
            ].map(s => (
              <div key={s.label} style={{
                background: 'var(--surface-1)', border: '1px solid var(--border)',
                borderRadius: 10, padding: '14px',
              }}>
                <div style={{ fontSize: 10, color: 'var(--text-400)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6 }}>{s.label}</div>
                <div style={{ fontWeight: 900, fontSize: 30, color: 'var(--gold)', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 11, color: 'var(--text-300)', marginTop: 2 }}>{s.sub}</div>
                <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, marginTop: 8, overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: 2, background: 'linear-gradient(90deg, #8B6F20, #F4D878)', width: `${Math.min(100, s.w)}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Breakdown de pontos */}
          <div style={{
            background: 'var(--surface-1)', border: '1px solid var(--border)',
            borderRadius: 16, padding: '20px', marginBottom: 20,
          }}>
            <div style={{ fontWeight: 900, fontSize: 14, letterSpacing: 1, marginBottom: 16 }}>DETALHES DA PONTUAÇÃO</div>
            {[
              { label: 'Fase de grupos',  value: stats.groupPoints,    max: 216, color: '#3A7BD5' },
              { label: 'Mata-mata',       value: stats.knockoutPoints,  max: 160, color: '#E88'    },
              { label: 'Bônus especiais', value: stats.bonusPoints,     max: 55,  color: 'var(--gold)' },
            ].map(d => (
              <div key={d.label} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-200)', marginBottom: 5 }}>
                  <span>{d.label}</span>
                  <span style={{ color: d.color, fontWeight: 700 }}>{d.value} / {d.max} pts</span>
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: 3, background: d.color, width: `${Math.min(100, (d.value / d.max) * 100)}%`, transition: 'width 1s ease' }} />
                </div>
              </div>
            ))}
          </div>

          {/* Botão sair */}
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            style={{
              background: 'rgba(209,64,64,0.1)', border: '1px solid rgba(209,64,64,0.3)',
              borderRadius: 10, padding: '10px 20px',
              color: '#E88', fontWeight: 600, fontSize: 13,
              cursor: 'pointer', letterSpacing: 0.5,
            }}
          >
            🚪 Sair da conta
          </button>
        </>
      )}

      {/* TAB PALPITES */}
      {tab === 'palpites' && (
        <div>
          <div style={{ fontSize: 12, color: 'var(--text-400)', marginBottom: 16 }}>
            {predictions.length} palpites registrados · {correct.length} acertos · {pending.length} aguardando resultado
          </div>

          {predictions.length === 0 ? (
            <div style={{
              background: 'var(--surface-1)', border: '1px solid var(--border)',
              borderRadius: 12, padding: '40px 24px', textAlign: 'center',
              color: 'var(--text-400)', fontSize: 13,
            }}>
              Você ainda não fez nenhum palpite.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {predictions.map(p => {
                const scored = p.isCorrect !== null
                const correct = p.isCorrect === true

                return (
                  <div key={p.id} style={{
                    background: 'var(--surface-1)',
                    border: `1px solid ${!scored ? 'var(--border)' : correct ? 'rgba(76,200,122,0.3)' : 'rgba(209,64,64,0.3)'}`,
                    borderRadius: 12, padding: '12px 14px',
                    display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
                  }}>
                    {/* Data e grupo */}
                    <div style={{ minWidth: 70 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-100)' }}>
                        {formatDate(p.match.matchDate)}
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--text-400)' }}>
                        {p.match.group ? `Grupo ${p.match.group.code}` : p.match.phase}
                      </div>
                    </div>

                    {/* Times */}
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 16 }}>{p.match.homeTeam.flagEmoji}</span>
                      <span style={{ fontSize: 12, color: 'var(--text-200)' }}>{p.match.homeTeam.name}</span>
                      <span style={{ fontSize: 11, color: 'var(--text-400)', margin: '0 4px' }}>
                        {p.match.homeScore !== null ? `${p.match.homeScore}×${p.match.awayScore}` : 'vs'}
                      </span>
                      <span style={{ fontSize: 12, color: 'var(--text-200)' }}>{p.match.awayTeam.name}</span>
                      <span style={{ fontSize: 16 }}>{p.match.awayTeam.flagEmoji}</span>
                    </div>

                    {/* Palpite */}
                    <div style={{
                      fontSize: 11, fontWeight: 700,
                      color: 'var(--text-200)',
                      background: 'rgba(255,255,255,0.05)',
                      padding: '3px 8px', borderRadius: 6,
                    }}>
                      {pickLabel(p.pick, p.match)}
                    </div>

                    {/* Resultado */}
                    <div style={{
                      fontSize: 12, fontWeight: 700,
                      padding: '4px 10px', borderRadius: 10,
                      background: !scored ? 'rgba(255,255,255,0.05)' : correct ? 'rgba(76,200,122,0.15)' : 'rgba(209,64,64,0.15)',
                      color: !scored ? 'var(--text-400)' : correct ? '#4CC87A' : '#E88',
                      border: `1px solid ${!scored ? 'rgba(255,255,255,0.08)' : correct ? 'rgba(76,200,122,0.3)' : 'rgba(209,64,64,0.3)'}`,
                      whiteSpace: 'nowrap',
                    }}>
                      {!scored ? '⏳ Aguardando' : correct ? `+${p.points} pts ✓` : '✗ 0 pts'}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </>
  )
}
