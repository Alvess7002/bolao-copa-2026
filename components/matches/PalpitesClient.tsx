'use client'

import { useState } from 'react'

type Team = { id: string; name: string; flagEmoji: string; code: string }
type Group = { id: string; code: string; name: string }
type Match = {
  id: string; matchDate: string; city: string | null
  homeTeam: Team; awayTeam: Team; group: Group | null
  result: string | null; isLocked: boolean
}

export function PalpitesClient({ matches }: { matches: Match[] }) {
  const [picks, setPicks] = useState<Record<string, string>>({})
  const [filter, setFilter] = useState('ALL')
  const [toast, setToast] = useState('')

  const groups = [...new Set(matches.map(m => m.group?.code ?? '?'))].sort()
  const filtered = filter === 'ALL' ? matches : matches.filter(m => m.group?.code === filter)

  const byGroup: Record<string, Match[]> = {}
  filtered.forEach(m => {
    const g = m.group?.code ?? '?'
    if (!byGroup[g]) byGroup[g] = []
    byGroup[g].push(m)
  })

  function doPick(matchId: string, choice: string, homeName: string, awayName: string) {
    setPicks(p => ({ ...p, [matchId]: choice }))
    const lbl = choice === 'HOME' ? `🏠 ${homeName}` : choice === 'DRAW' ? '⚖ Empate' : `✈ ${awayName}`
    setToast('✅ Salvo: ' + lbl)
    setTimeout(() => setToast(''), 2800)
  }

  function formatDate(dt: string) {
    const d = new Date(dt)
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) +
      ' às ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' }) + 'h'
  }

  return (
    <>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 999,
          background: 'var(--surface-3)', border: '1px solid var(--gold)',
          borderRadius: 10, padding: '10px 18px',
          fontSize: 13, fontWeight: 600, color: 'var(--text-100)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
        }}>{toast}</div>
      )}

      {/* Filter */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
        {['ALL', ...groups].map(g => (
          <button key={g} onClick={() => setFilter(g)} style={{
            padding: '5px 13px', borderRadius: 20,
            border: `1px solid ${filter === g ? 'var(--gold)' : 'rgba(255,255,255,0.08)'}`,
            background: filter === g ? 'rgba(201,168,76,0.15)' : 'transparent',
            color: filter === g ? 'var(--gold)' : 'var(--text-300)',
            fontSize: 12, fontWeight: 600, cursor: 'pointer',
          }}>
            {g === 'ALL' ? 'Todos' : `Grupo ${g}`}
            {g !== 'ALL' && matches.filter(m => m.group?.code === g && picks[m.id]).length === 6 ? ' ✓' : ''}
          </button>
        ))}
      </div>

      {/* Matches by group */}
      {Object.entries(byGroup).map(([g, ms]) => (
        <div key={g} style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{
              fontWeight: 900, fontSize: 12, letterSpacing: 2,
              color: 'var(--gold)', background: 'rgba(201,168,76,0.1)',
              border: '1px solid rgba(201,168,76,0.2)',
              padding: '3px 12px', borderRadius: 20,
            }}>GRUPO {g}</div>
            <span style={{ fontSize: 11, color: 'var(--text-400)' }}>
              {ms.filter(m => picks[m.id]).length}/{ms.length} palpites
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 10 }}>
            {ms.map(m => {
              const pick = picks[m.id]
              return (
                <div key={m.id} style={{
                  background: 'var(--surface-1)',
                  border: `1px solid ${pick ? 'rgba(201,168,76,0.3)' : 'var(--border)'}`,
                  borderRadius: 16, overflow: 'hidden',
                  transition: 'all 0.2s',
                }}>
                  {/* Header */}
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '7px 14px',
                    background: 'rgba(0,0,0,0.2)',
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                    fontSize: 11, color: 'var(--text-300)',
                  }}>
                    <span>📅 {formatDate(m.matchDate)}</span>
                    <span>📍 {m.city}</span>
                  </div>

                  {/* Teams */}
                  <div style={{ padding: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                      <div style={{ flex: 1, textAlign: 'center' }}>
                        <div style={{ fontSize: 30 }}>{m.homeTeam.flagEmoji}</div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-200)', marginTop: 4 }}>{m.homeTeam.name}</div>
                      </div>
                      <div style={{ fontWeight: 900, fontSize: 18, color: 'var(--text-400)' }}>VS</div>
                      <div style={{ flex: 1, textAlign: 'center' }}>
                        <div style={{ fontSize: 30 }}>{m.awayTeam.flagEmoji}</div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-200)', marginTop: 4 }}>{m.awayTeam.name}</div>
                      </div>
                    </div>

                    {/* Pick buttons */}
                    <div style={{ display: 'flex', gap: 5 }}>
                      {[
                        { val: 'HOME', label: `🏠 ${m.homeTeam.name.split(' ')[0]}`, sel: 'rgba(58,123,213,0.2)', selBorder: '#5A9BE8', selColor: '#A8CAFF' },
                        { val: 'DRAW', label: '= Empate', sel: 'rgba(201,168,76,0.2)', selBorder: 'var(--gold)', selColor: '#F4D878' },
                        { val: 'AWAY', label: `✈ ${m.awayTeam.name.split(' ')[0]}`, sel: 'rgba(209,64,64,0.2)', selBorder: '#E06060', selColor: '#FFAAAA' },
                      ].map(btn => (
                        <button key={btn.val} onClick={() => doPick(m.id, btn.val, m.homeTeam.name, m.awayTeam.name)} style={{
                          flex: 1, padding: '9px 4px', borderRadius: 8, cursor: 'pointer',
                          border: `1px solid ${pick === btn.val ? btn.selBorder : 'rgba(255,255,255,0.08)'}`,
                          background: pick === btn.val ? btn.sel : 'rgba(255,255,255,0.03)',
                          color: pick === btn.val ? btn.selColor : 'var(--text-300)',
                          fontSize: 10, fontWeight: 700, letterSpacing: 0.5,
                          textTransform: 'uppercase', textAlign: 'center',
                          transform: pick === btn.val ? 'scale(1.03)' : 'none',
                          transition: 'all 0.18s',
                        }}>{btn.label}</button>
                      ))}
                    </div>

                    <div style={{ marginTop: 6, textAlign: 'right', fontSize: 10, color: pick ? '#4CC87A' : 'var(--text-400)' }}>
                      {pick ? `✓ ${pick === 'HOME' ? m.homeTeam.name : pick === 'DRAW' ? 'Empate' : m.awayTeam.name}` : 'Sem palpite'}
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
