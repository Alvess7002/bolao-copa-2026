'use client'

import { useState, useEffect } from 'react'

type Team = { id: string; name: string; flagEmoji: string }
type Match = {
  id: string
  matchDate: string
  city: string | null
  homeTeam: Team
  awayTeam: Team
  group: { code: string } | null
  result: string | null
  homeScore: number | null
  awayScore: number | null
  status: string
}

export function ResultadoForm() {
  const [matches, setMatches] = useState<Match[]>([])
  const [selected, setSelected] = useState('')
  const [homeScore, setHomeScore] = useState('')
  const [awayScore, setAwayScore] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    fetch('/api/matches')
      .then(r => r.json())
      .then(data => setMatches(data))
  }, [])

  const match = matches.find(m => m.id === selected)

  async function submit() {
    if (!selected || homeScore === '' || awayScore === '') {
      setMsg('❌ Preencha todos os campos')
      return
    }

    setLoading(true)
    setMsg('')

    const res = await fetch('/api/admin/resultado', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        matchId: selected,
        homeScore: parseInt(homeScore),
        awayScore: parseInt(awayScore),
      }),
    })

    const data = await res.json()
    setLoading(false)

    if (data.success) {
      setMsg(`✅ Resultado salvo! Resultado: ${data.result} — ${data.pointsAwarded} pts distribuídos`)
      setSelected('')
      setHomeScore('')
      setAwayScore('')
    } else {
      setMsg('❌ Erro: ' + data.error)
    }
  }

  function formatDate(dt: string) {
    return new Date(dt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
  }

  return (
    <div style={{
      background: 'var(--surface-1)', border: '1px solid var(--border)',
      borderRadius: 16, padding: 24, maxWidth: 500,
    }}>
      <div style={{ fontWeight: 900, fontSize: 16, letterSpacing: 1, marginBottom: 20 }}>
        📊 Registrar Resultado
      </div>

      {/* Seleciona o jogo */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: 'var(--text-400)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>
          Selecione o jogo
        </div>
        <select
          value={selected}
          onChange={e => setSelected(e.target.value)}
          style={{
            width: '100%', padding: '10px 12px',
            background: 'var(--surface-3)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8, color: 'var(--text-100)',
            fontSize: 13, cursor: 'pointer', outline: 'none',
          }}
        >
          <option value="">— Escolha uma partida —</option>
          {matches
            .filter(m => m.status !== 'FINISHED')
            .map(m => (
              <option key={m.id} value={m.id}>
                {formatDate(m.matchDate)} · Grupo {m.group?.code} · {m.homeTeam.name} vs {m.awayTeam.name}
              </option>
            ))}
        </select>
      </div>

      {/* Preview do jogo */}
      {match && (
        <div style={{
          background: 'var(--surface-2)', border: '1px solid var(--border)',
          borderRadius: 10, padding: '12px 16px', marginBottom: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 20 }}>{match.homeTeam.flagEmoji}</span>
            <span style={{ fontSize: 13, fontWeight: 600 }}>{match.homeTeam.name}</span>
          </div>
          <span style={{ fontSize: 12, color: 'var(--text-400)' }}>vs</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>{match.awayTeam.name}</span>
            <span style={{ fontSize: 20 }}>{match.awayTeam.flagEmoji}</span>
          </div>
        </div>
      )}

      {/* Placar */}
      {match && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 40px 1fr', gap: 10, marginBottom: 20, alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-400)', marginBottom: 6, textAlign: 'center' }}>
              {match.homeTeam.name}
            </div>
            <input
              type="number"
              min="0"
              max="20"
              value={homeScore}
              onChange={e => setHomeScore(e.target.value)}
              placeholder="0"
              style={{
                width: '100%', padding: '12px', textAlign: 'center',
                background: 'var(--surface-3)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8, color: 'var(--text-100)',
                fontSize: 24, fontWeight: 900, outline: 'none',
              }}
            />
          </div>
          <div style={{ textAlign: 'center', fontWeight: 900, fontSize: 18, color: 'var(--text-400)', paddingTop: 20 }}>×</div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-400)', marginBottom: 6, textAlign: 'center' }}>
              {match.awayTeam.name}
            </div>
            <input
              type="number"
              min="0"
              max="20"
              value={awayScore}
              onChange={e => setAwayScore(e.target.value)}
              placeholder="0"
              style={{
                width: '100%', padding: '12px', textAlign: 'center',
                background: 'var(--surface-3)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8, color: 'var(--text-100)',
                fontSize: 24, fontWeight: 900, outline: 'none',
              }}
            />
          </div>
        </div>
      )}

      <button
        onClick={submit}
        disabled={loading || !selected}
        style={{
          width: '100%', padding: '12px',
          background: selected ? 'linear-gradient(135deg, #8B6F20, #C9A84C)' : 'rgba(255,255,255,0.05)',
          border: 'none', borderRadius: 10,
          color: selected ? '#000' : 'var(--text-400)',
          fontWeight: 700, fontSize: 14, cursor: selected ? 'pointer' : 'not-allowed',
          letterSpacing: 0.5,
        }}
      >
        {loading ? 'Salvando...' : '✅ Confirmar Resultado'}
      </button>

      {msg && (
        <div style={{
          marginTop: 12, padding: '10px 14px', borderRadius: 8, fontSize: 13,
          background: msg.startsWith('✅') ? 'rgba(76,200,122,0.1)' : 'rgba(209,64,64,0.1)',
          border: `1px solid ${msg.startsWith('✅') ? 'rgba(76,200,122,0.3)' : 'rgba(209,64,64,0.3)'}`,
          color: msg.startsWith('✅') ? '#4CC87A' : '#E88',
        }}>
          {msg}
        </div>
      )}
    </div>
  )
}