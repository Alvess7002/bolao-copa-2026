'use client'

import { useState } from 'react'

const TEAMS = ['África do Sul','Alemanha','Arábia Saudita','Argentina','Áustria','Austrália','Argélia','Bélgica','Bósnia e Herz.','Brasil','Cabo Verde','Canadá','Catar','Colômbia','Coreia do Sul','Costa do Marfim','Croácia','Curaçao','Egito','Equador','Escócia','Espanha','Estados Unidos','França','Gana','Holanda','Inglaterra','Irã','Iraque','Japão','Jordânia','Marrocos','México','Nova Zelândia','Noruega','Panamá','Paraguai','Portugal','RD Congo','Rep. Tcheca','Senegal','Suécia','Suíça','Tunísia','Turquia','Uruguai','Uzbequistão']

const PLAYERS = ['Vinicius Jr. 🇧🇷','Kylian Mbappé 🇫🇷','Lionel Messi 🇦🇷','Jude Bellingham 🏴󠁧󠁢󠁥󠁮󠁧󠁿','Lamine Yamal 🇪🇸','Pedri 🇪🇸','Bruno Fernandes 🇵🇹','Erling Haaland 🇳🇴','Julián Álvarez 🇦🇷','Son Heung-min 🇰🇷','Bukayo Saka 🏴󠁧󠁢󠁥󠁮󠁧󠁿','Florian Wirtz 🇩🇪','Rodri 🇪🇸','Memphis Depay 🇳🇱','Romelu Lukaku 🇧🇪','Mo Salah 🇪🇬','Richarlison 🇧🇷','Thomas Müller 🇩🇪']

const ITEMS = [
  { k: 'champion',   icon: '🏆', title: 'Campeão do Mundo',    pts: 20, type: 'team',   desc: 'Qual seleção ergue a taça em 19/Jul no MetLife Stadium?' },
  { k: 'runner_up',  icon: '🥈', title: 'Vice-campeão',         pts: 10, type: 'team',   desc: 'Quem vai perder a grande final?' },
  { k: 'third',      icon: '🥉', title: 'Terceiro lugar',       pts: 5,  type: 'team',   desc: 'Vencedor da disputa pelo 3° em Miami em 18/Jul' },
  { k: 'top_scorer', icon: '⚽', title: 'Artilheiro da Copa',   pts: 10, type: 'player', desc: 'Quem faz mais gols? (Chuteira de Ouro)' },
  { k: 'best_player',icon: '⭐', title: 'Melhor jogador',       pts: 10, type: 'player', desc: 'Quem leva a Bola de Ouro da Copa 2026?' },
]

export default function BonusPage() {
  const [picks, setPicks] = useState<Record<string, string>>({})
  const [toast, setToast] = useState('')

  function save(k: string, v: string) {
    if (!v) return
    setPicks(p => ({ ...p, [k]: v }))
    setToast('⭐ Salvo: ' + v)
    setTimeout(() => setToast(''), 2800)
  }

  const total = Object.keys(picks).length

  return (
    <div style={{ paddingTop: 24 }}>
      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 999, background: 'var(--surface-3)', border: '1px solid var(--gold)', borderRadius: 10, padding: '10px 18px', fontSize: 13, fontWeight: 600, color: 'var(--text-100)' }}>{toast}</div>
      )}

      <div style={{ fontWeight: 900, fontSize: 20, letterSpacing: 3, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
        ⭐ PALPITES ESPECIAIS — BÔNUS
        <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      </div>
      <p style={{ color: 'var(--text-300)', fontSize: 13, marginBottom: 8, lineHeight: 1.6 }}>
        Registre antes do início da Copa — <strong style={{ color: 'var(--gold)' }}>11/Jun às 15h55 (Brasília)</strong>.
      </p>
      <div style={{ fontSize: 12, color: total === 5 ? '#4CC87A' : 'var(--gold)', marginBottom: 24, fontWeight: 600 }}>
        {total}/5 palpites bônus preenchidos {total === 5 ? '✓' : ''}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
        {ITEMS.map(b => {
          const selected = picks[b.k]
          const opts = b.type === 'team' ? TEAMS : PLAYERS
          return (
            <div key={b.k} style={{
              background: 'var(--surface-1)',
              border: `1px solid ${selected ? 'rgba(201,168,76,0.4)' : 'var(--border)'}`,
              borderRadius: 16, padding: 20,
              transition: 'all 0.2s',
            }}>
              <div style={{ fontSize: 30, marginBottom: 10 }}>{b.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 15, letterSpacing: 0.5, marginBottom: 2 }}>{b.title}</div>
              <div style={{ fontWeight: 900, fontSize: 30, color: 'var(--gold)', marginBottom: 8, lineHeight: 1 }}>
                {b.pts} <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--text-400)' }}>pontos</span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-300)', marginBottom: 14, lineHeight: 1.5 }}>{b.desc}</p>
              <select
                value={selected ?? ''}
                onChange={e => save(b.k, e.target.value)}
                style={{
                  width: '100%', padding: '9px 12px',
                  background: 'var(--surface-3)',
                  border: `1px solid ${selected ? 'var(--gold)' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: 8, color: 'var(--text-100)',
                  fontSize: 12, cursor: 'pointer', outline: 'none',
                }}
              >
                <option value="">— Escolha sua aposta —</option>
                {opts.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
              {selected && (
                <div style={{ marginTop: 8, fontSize: 11, fontWeight: 700, color: '#4CC87A' }}>✓ Apostado: {selected}</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
