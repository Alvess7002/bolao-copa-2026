'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

type UserStats = {
  name: string
  totalPoints: number
  correctPredictions: number
  totalPredictions: number
  groupPoints: number
  knockoutPoints: number
  bonusPoints: number
  accuracy: number
  position: number
}

export function StatsReal() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!session) { setLoading(false); return }
    fetch('/api/me')
      .then(r => r.json())
      .then(data => { setStats(data); setLoading(false) })
  }, [session])

  if (!session) {
    return (
      <div style={{
        background: 'var(--surface-1)', border: '1px solid var(--border)',
        borderRadius: 16, padding: 24, marginBottom: 24, textAlign: 'center',
      }}>
        <div style={{ fontSize: 13, color: 'var(--text-300)', marginBottom: 12 }}>
          Faça login para ver sua pontuação e posição no ranking
        </div>
        <Link href="/login" style={{
          background: 'linear-gradient(135deg, #8B6F20, #C9A84C)',
          color: '#000', fontWeight: 700, fontSize: 13,
          padding: '10px 20px', borderRadius: 8, textDecoration: 'none',
        }}>
          🔑 Entrar
        </Link>
      </div>
    )
  }

  if (loading) {
    return (
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: 10, marginBottom: 24,
      }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{
            background: 'var(--surface-1)', border: '1px solid var(--border)',
            borderRadius: 10, padding: '16px 14px', opacity: 0.5,
          }}>
            <div style={{ height: 10, background: 'rgba(255,255,255,0.05)', borderRadius: 4, marginBottom: 8 }} />
            <div style={{ height: 32, background: 'rgba(255,255,255,0.05)', borderRadius: 4 }} />
          </div>
        ))}
      </div>
    )
  }

  const cards = [
    {
      label: 'Posição',
      value: stats?.position ? `${stats.position}°` : '—',
      sub: 'no ranking geral',
      w: 0,
    },
    {
      label: 'Pontuação',
      value: stats?.totalPoints ?? 0,
      sub: 'pts acumulados',
      w: ((stats?.totalPoints ?? 0) / 431) * 100,
    },
    {
      label: 'Acertos',
      value: stats?.correctPredictions ?? 0,
      sub: `de ${stats?.totalPredictions ?? 0} palpites`,
      w: stats?.totalPredictions ? (stats.correctPredictions / stats.totalPredictions) * 100 : 0,
    },
    {
      label: 'Aproveitamento',
      value: `${(stats?.accuracy ?? 0).toFixed(0)}%`,
      sub: 'de acerto',
      w: stats?.accuracy ?? 0,
    },
  ]

  return (
    <>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: 10, marginBottom: 16,
      }}>
        {cards.map(s => (
          <div key={s.label} style={{
            background: 'var(--surface-1)', border: '1px solid var(--border)',
            borderRadius: 10, padding: '16px 14px',
          }}>
            <div style={{ fontSize: 10, color: 'var(--text-400)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6 }}>
              {s.label}
            </div>
            <div style={{ fontWeight: 900, fontSize: 34, color: 'var(--gold)', lineHeight: 1 }}>
              {s.value}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-300)', marginTop: 2 }}>{s.sub}</div>
            <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, marginTop: 10, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 2,
                background: 'linear-gradient(90deg, #8B6F20, #F4D878)',
                width: `${Math.min(100, s.w)}%`,
                transition: 'width 1s ease',
              }} />
            </div>
          </div>
        ))}
      </div>

      {stats && stats.totalPoints > 0 && (
        <div style={{
          background: 'var(--surface-1)', border: '1px solid var(--border)',
          borderRadius: 12, padding: '14px 16px', marginBottom: 16,
          display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center',
        }}>
          <div style={{ fontSize: 11, color: 'var(--text-400)', letterSpacing: 1, textTransform: 'uppercase', width: '100%', marginBottom: 4 }}>
            Detalhes da pontuação
          </div>
          {[
            { label: 'Grupos',    value: stats.groupPoints    },
            { label: 'Mata-mata', value: stats.knockoutPoints },
            { label: 'Bônus',     value: stats.bonusPoints    },
          ].map(d => (
            <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontWeight: 900, fontSize: 18, color: 'var(--gold)' }}>{d.value}</span>
              <span style={{ fontSize: 11, color: 'var(--text-300)' }}>pts {d.label}</span>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
