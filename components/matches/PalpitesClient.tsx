'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

type Team = { id: string; name: string; flagEmoji: string; code: string }
type Group = { id: string; code: string; name: string }
type Match = {
  id: string; matchDate: string; city: string | null
  homeTeam: Team; awayTeam: Team; group: Group | null
  result: string | null; isLocked: boolean
}

export function PalpitesClient({ matches }: { matches: Match[] }) {
  const { data: session } = useSession()
  const [picks, setPicks] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState<Record<string, boolean>>({})
  const [filter, setFilter] = useState('ALL')
  const [toast, setToast] = useState('')

  // Carrega palpites já salvos
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

  const groups = [...new Set(matches.map(m => m.group?.code ?? '?'))].sort()
  const filtered = filter === 'ALL' ? matches : matches.filter(m => m.group?.code === filter)
  const byGroup: Record<string, Match[]> = {}
  filtered.forEach(m => {
    const g = m.group?.code ?? '?'
    if (!byGroup[g]) byGroup[g] = []
    byGroup[g].push(m)
  })

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
      const lbl = choice === 'HOME' ? `🏠 ${homeName}` : choice === 'DRAW' ? '⚖ Empate' : `✈ ${awayName}`
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

  if (!session) {
    return (
      <div style={{
        background: 'var(--surface-1)', border: '1px solid var(--border)',
        borderRadius: 16, padding: '40px 24px', textAlign: 'center',
      }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🔒</div>
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>
          Faça login para fazer seus palpites
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-300)', marginBottom: 20 }}>
          Seus palpites ficam salvos e contam para o ranking
        </div>
        <Link href="/login" style={{
          background: 'linear-gradient(135deg, #8B6F20, #C9A84C)',
          color: '#000', fontWeight: 700, fontSize: 14,
          padding: '12px 24px', borderRadius: 10,
          textDecoration: 'none',
        }}>
          🔑 Entrar agora
        </Link>
      </div>
    )
  }

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

      {/* Contador de palpites */}
      <div style={{
        background: 'var(--surface-1)', border: '1px solid var(--border)',
        borderRadius: 10, padding: '10px 16px', marginBottom: 16,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: 13, color: 'var(--text-200)' }}>
          Seus palpites: <strong style={{ color: 'var(--gold)' }}>{Object.keys(picks).length}</strong> de {matches.length} jogos
        </span>
        <span style={{ fontSize: 12, color: 'var(--text-400)' }}>
          Salvos automaticamente ✓
        </span>
      </div>

      {/* Filtro */}
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

      {/* Jogos por grupo */}
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
              const isSaving = saving[m.id]
              const locked = m.isLocked || !!m.result

              return (
                <div key={m.id} style={{
                  background: 'var(--surface-1)',
                  border: `1px solid ${pick ? 'rgba(201,168,76,0.3)' : 'var(--border)'}`,
                  borderRadius: 16, overflow: 'hidden',
                  opacity: locked ? 0.7 : 1,
                }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '7px 14px', background: 'rgba(0,0,0,0.2)',
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                    fontSize: 11, color: 'var(--text-300)',
                  }}>
                    <span>📅 {formatDate(m.matchDate)}</span>
                    <span>📍 {m.city}</span>
                    {locked && <span style={{ color: '#E88', fontWeight: 700 }}>🔒 Fechado</span>}
                  </div>

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

                    <div style={{ display: 'flex', gap: 5 }}>
                      {[
                        { val: 'HOME', label: `🏠 ${m.homeTeam.name.split(' ')[0]}`, sel: 'rgba(58,123,213,0.2)', selBorder: '#5A9BE8', selColor: '#A8CAFF' },
                        { val: 'DRAW', label: '= Empate', sel: 'rgba(201,168,76,0.2)', selBorder: 'var(--gold)', selColor: '#F4D878' },
                        { val: 'AWAY', label: `✈ ${m.awayTeam.name.split(' ')[0]}`, sel: 'rgba(209,64,64,0.2)', selBorder: '#E06060', selColor: '#FFAAAA' },
                      ].map(btn => (
                        <button
                          key={btn.val}
                          disabled={locked || isSaving}
                          onClick={() => doPick(m.id, btn.val, m.homeTeam.name, m.awayTeam.name)}
                          style={{
                            flex: 1, padding: '9px 4px', borderRadius: 8, cursor: locked ? 'not-allowed' : 'pointer',
                            border: `1px solid ${pick === btn.val ? btn.selBorder : 'rgba(255,255,255,0.08)'}`,
                            background: pick === btn.val ? btn.sel : 'rgba(255,255,255,0.03)',
                            color: pick === btn.val ? btn.selColor : 'var(--text-300)',
                            fontSize: 10, fontWeight: 700, letterSpacing: 0.5,
                            textTransform: 'uppercase', textAlign: 'center',
                            transform: pick === btn.val ? 'scale(1.03)' : 'none',
                            transition: 'all 0.18s',
                          }}
                        >
                          {btn.label}
                        </button>
                      ))}
                    </div>

                    <div style={{ marginTop: 6, textAlign: 'right', fontSize: 10, color: isSaving ? 'var(--gold)' : pick ? '#4CC87A' : 'var(--text-400)' }}>
                      {isSaving ? '💾 Salvando...' : pick ? `✓ ${pick === 'HOME' ? m.homeTeam.name : pick === 'DRAW' ? 'Empate' : m.awayTeam.name}` : 'Sem palpite'}
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