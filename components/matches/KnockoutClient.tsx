'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

type Team = { id: string; name: string; flagEmoji: string }
type Match = {
  id: string
  phase: string
  matchDate: string
  city: string | null
  homeTeam: Team
  awayTeam: Team
  result: string | null
  isLocked: boolean
  homeScore: number | null
  awayScore: number | null
}

const PHASE_LABELS: Record<string, string> = {
  ROUND_OF_32: 'Rodada de 32',
  R32:         'Rodada de 32',
  ROUND_OF_16: 'Oitavas de Final',
  R16:         'Oitavas de Final',
  QUARTER_FINAL: 'Quartas de Final',
  SEMI_FINAL:    'Semifinais',
  THIRD_PLACE:   '3° Lugar',
  FINAL:         'Final 🏆',
}

const PHASE_ORDER = ['R32','ROUND_OF_32','R16','ROUND_OF_16','QUARTER_FINAL','SEMI_FINAL','THIRD_PLACE','FINAL']

export function KnockoutClient() {
  const { data: session } = useSession()
  const [matches, setMatches] = useState<Match[]>([])
  const [picks, setPicks] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState<Record<string, boolean>>({})
  const [toast, setToast] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/knockout')
      .then(r => r.json())
      .then(data => { setMatches(Array.isArray(data) ? data : []); setLoading(false) })
  }, [])

  useEffect(() => {
    if (!session) return
    fetch('/api/palpites')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          const map: Record<string, string> = {}
          data.forEach((p: any) => { map[p.matchId] = p.pick })
          setPicks(map)
        }
      })
  }, [session])

  async function doPick(matchId: string, choice: string, homeName: string, awayName: string) {
    if (!session) {
      setToast('⚠️ Faça login para salvar seus palpites')
      setTimeout(() => setToast(''), 3000)
      return
    }

    setPicks(p => ({ ...p, [matchId]: choice }))
    setSaving(s => ({ ...s, [matchId]: true }))

    const res = await fetch('/api/palpites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ matchId, pick: choice }),
    })

    const data = await res.json()
    setSaving(s => ({ ...s, [matchId]: false }))

    if (data.success) {
      const lbl = choice === 'HOME' ? `🏠 ${homeName}` : `✈ ${awayName}`
      setToast('✅ Palpite salvo — ' + lbl)
    } else {
      setToast('❌ ' + data.error)
      setPicks(p => ({ ...p, [matchId]: '' }))
    }
    setTimeout(() => setToast(''), 3000)
  }

  function formatDate(dt: string) {
    const d = new Date(dt)
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) +
      ' às ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' }) + 'h'
  }

  if (loading) {
    return <div style={{ color: 'var(--text-400)', fontSize: 13, padding: 20 }}>Carregando jogos...</div>
  }

  if (matches.length === 0) {
    return (
      <div style={{
        background: 'var(--surface-1)', border: '1px solid var(--border)',
        borderRadius: 16, padding: '40px 24px', textAlign: 'center',
      }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>
          Mata-mata ainda não definido
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-300)' }}>
          Os jogos do mata-mata serão liberados após o término da fase de grupos.
        </div>
      </div>
    )
  }

  // Agrupa por fase
  const byPhase: Record<string, Match[]> = {}
  matches.forEach(m => {
    if (!byPhase[m.phase]) byPhase[m.phase] = []
    byPhase[m.phase].push(m)
  })

  const sortedPhases = PHASE_ORDER.filter(p => byPhase[p])

  return (
    <>
      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 999,
          background: 'var(--surface-3)', border: '1px solid var(--gold)',
          borderRadius: 10, padding: '10px 18px',
          fontSize: 13, fontWeight: 600, color: 'var(--text-100)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
        }}>{toast}</div>
      )}

      {!session && (
        <div style={{
          background: 'rgba(201,168,76,0.06)', border: '1px solid var(--border)',
          borderRadius: 10, padding: '12px 16px', marginBottom: 20,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10,
        }}>
          <span style={{ fontSize: 13, color: 'var(--text-300)' }}>Faça login para salvar seus palpites</span>
          <Link href="/login" style={{ background: 'linear-gradient(135deg, #8B6F20, #C9A84C)', color: '#000', fontWeight: 700, fontSize: 12, padding: '8px 16px', borderRadius: 8, textDecoration: 'none' }}>
            🔑 Entrar
          </Link>
        </div>
      )}

      {sortedPhases.map(phase => (
        <div key={phase} style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{
              fontWeight: 900, fontSize: 13, letterSpacing: 2,
              color: '#E88', background: 'rgba(209,64,64,0.1)',
              border: '1px solid rgba(209,64,64,0.3)',
              padding: '3px 12px', borderRadius: 20,
            }}>
              {PHASE_LABELS[phase] ?? phase}
            </div>
            <div style={{ fontSize: 11, color: 'var(--gold)', fontWeight: 700 }}>
              +5 pts por acerto
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 10 }}>
            {byPhase[phase].map(m => {
              const pick = picks[m.id]
              const isSaving = saving[m.id]
              const locked = m.isLocked || !!m.result
              const tbd = !m.homeTeam || !m.awayTeam

              return (
                <div key={m.id} style={{
                  background: 'var(--surface-1)',
                  border: `1px solid ${pick ? 'rgba(209,64,64,0.4)' : 'var(--border)'}`,
                  borderRadius: 16, overflow: 'hidden',
                  opacity: locked ? 0.75 : 1,
                }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '7px 14px', background: 'rgba(0,0,0,0.2)',
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                    fontSize: 11, color: 'var(--text-300)',
                  }}>
                    <span>📅 {formatDate(m.matchDate)}</span>
                    <span>📍 {m.city ?? '—'}</span>
                    {locked && <span style={{ color: '#E88', fontWeight: 700 }}>🔒</span>}
                  </div>

                  <div style={{ padding: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                      <div style={{ flex: 1, textAlign: 'center' }}>
                        <div style={{ fontSize: 28 }}>{m.homeTeam?.flagEmoji ?? '❓'}</div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-200)', marginTop: 4 }}>
                          {m.homeTeam?.name ?? 'A definir'}
                        </div>
                      </div>
                      <div style={{ fontWeight: 900, fontSize: 18, color: 'var(--text-400)' }}>VS</div>
                      <div style={{ flex: 1, textAlign: 'center' }}>
                        <div style={{ fontSize: 28 }}>{m.awayTeam?.flagEmoji ?? '❓'}</div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-200)', marginTop: 4 }}>
                          {m.awayTeam?.name ?? 'A definir'}
                        </div>
                      </div>
                    </div>

                    {/* Resultado real se já jogou */}
                    {m.result && (
                      <div style={{
                        textAlign: 'center', marginBottom: 10,
                        fontWeight: 900, fontSize: 18, color: 'var(--text-100)',
                        background: 'rgba(0,0,0,0.2)', padding: '6px', borderRadius: 8,
                      }}>
                        {m.homeScore} × {m.awayScore}
                      </div>
                    )}

                    {/* Botões — sem empate no mata-mata */}
                    {!tbd && (
                      <div style={{ display: 'flex', gap: 8 }}>
                        {[
                          { val: 'HOME', label: `🏠 ${m.homeTeam.name.split(' ')[0]}`, sel: 'rgba(58,123,213,0.2)', selBorder: '#5A9BE8', selColor: '#A8CAFF' },
                          { val: 'AWAY', label: `✈ ${m.awayTeam.name.split(' ')[0]}`, sel: 'rgba(209,64,64,0.2)', selBorder: '#E06060', selColor: '#FFAAAA' },
                        ].map(btn => (
                          <button
                            key={btn.val}
                            disabled={locked || isSaving}
                            onClick={() => doPick(m.id, btn.val, m.homeTeam.name, m.awayTeam.name)}
                            style={{
                              flex: 1, padding: '10px 4px', borderRadius: 8,
                              cursor: locked ? 'not-allowed' : 'pointer',
                              border: `1px solid ${pick === btn.val ? btn.selBorder : 'rgba(255,255,255,0.08)'}`,
                              background: pick === btn.val ? btn.sel : 'rgba(255,255,255,0.03)',
                              color: pick === btn.val ? btn.selColor : 'var(--text-300)',
                              fontSize: 11, fontWeight: 700, letterSpacing: 0.5,
                              textTransform: 'uppercase', textAlign: 'center',
                              transform: pick === btn.val ? 'scale(1.03)' : 'none',
                              transition: 'all 0.18s',
                            }}
                          >
                            {btn.label}
                          </button>
                        ))}
                      </div>
                    )}

                    <div style={{ marginTop: 8, textAlign: 'right', fontSize: 10, color: isSaving ? 'var(--gold)' : pick ? '#4CC87A' : 'var(--text-400)' }}>
                      {isSaving ? '💾 Salvando...' : pick ? `✓ ${pick === 'HOME' ? m.homeTeam?.name : m.awayTeam?.name}` : 'Sem palpite'}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </>
  )
}