'use client'

import { useEffect, useState } from 'react'

export function CountdownClient({ targetDate }: { targetDate: string }) {
  const [time, setTime] = useState({ d: '00', h: '00', m: '00', s: '00' })

  useEffect(() => {
    const tick = () => {
      const diff = new Date(targetDate).getTime() - Date.now()
      if (diff <= 0) {
        setTime({ d: '00', h: '00', m: '00', s: '00' })
        return
      }
      const pad = (n: number) => String(n).padStart(2, '0')
      setTime({
        d: pad(Math.floor(diff / 86400000)),
        h: pad(Math.floor(diff % 86400000 / 3600000)),
        m: pad(Math.floor(diff % 3600000 / 60000)),
        s: pad(Math.floor(diff % 60000 / 1000)),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [targetDate])

  const blocks = [
    { val: time.d, label: 'Dias' },
    { val: time.h, label: 'Horas' },
    { val: time.m, label: 'Min' },
    { val: time.s, label: 'Seg' },
  ]

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)',
      borderRadius: 16, padding: '16px 20px',
    }}>
      {blocks.map((b, i) => (
        <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ textAlign: 'center', minWidth: 48 }}>
            <div style={{
              fontWeight: 900, fontSize: 38, lineHeight: 1,
              background: 'linear-gradient(180deg, #F4D878, #C9A84C)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>{b.val}</div>
            <div style={{ fontSize: 9, color: 'var(--text-400)', letterSpacing: 1, textTransform: 'uppercase', marginTop: 2 }}>{b.label}</div>
          </div>
          {i < 3 && (
            <div style={{ fontWeight: 900, fontSize: 28, color: 'rgba(201,168,76,0.5)', marginBottom: 14 }}>:</div>
          )}
        </div>
      ))}
    </div>
  )
}
