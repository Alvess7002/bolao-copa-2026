// app/chaveamento/page.tsx
export default function ChaveamentoPage() {
  const rounds = [
    { name: 'Rodada de 32', count: 16 },
    { name: 'Oitavas', count: 8 },
    { name: 'Quartas', count: 4 },
    { name: 'Semifinais', count: 2 },
    { name: '3° Lugar', count: 1 },
    { name: 'FINAL 🏆', count: 1 },
  ]

  return (
    <div style={{ paddingTop: 24 }}>
      <div style={{ fontWeight: 900, fontSize: 20, letterSpacing: 3, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
        🎯 CHAVEAMENTO MATA-MATA
        <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      </div>
      <div style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px', marginBottom: 24, fontSize: 13, color: 'var(--text-200)', lineHeight: 1.6 }}>
        <strong style={{ color: 'var(--gold)' }}>Formato inédito Copa 2026:</strong> 48 seleções → 12 grupos → 32 classificados.<br />
        Avançam: 1º e 2º de cada grupo (24) + 8 melhores 3ºs colocados = 32 equipes.<br />
        <strong>Final:</strong> 19 de julho · MetLife Stadium · Nova York/NJ
      </div>

      <div style={{ overflowX: 'auto', paddingBottom: 16 }}>
        <div style={{ display: 'flex', gap: 0, minWidth: 900 }}>
          {rounds.map(r => (
            <div key={r.name} style={{ minWidth: 155, display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontWeight: 700, fontSize: 11, letterSpacing: 1.5, color: 'var(--gold)', textAlign: 'center', padding: '10px 4px 14px', borderBottom: '1px solid var(--border)', marginBottom: 12, textTransform: 'uppercase' }}>
                {r.name}
              </div>
              {Array(r.count).fill(null).map((_, i) => (
                <div key={i} style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, margin: '4px 6px', padding: '10px', opacity: 0.5 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '3px 0' }}>
                    <span style={{ fontSize: 14 }}>❓</span>
                    <span style={{ fontSize: 11, color: 'var(--text-300)', flex: 1 }}>A definir</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '3px 0' }}>
                    <span style={{ fontSize: 14 }}>❓</span>
                    <span style={{ fontSize: 11, color: 'var(--text-300)', flex: 1 }}>A definir</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <p style={{ textAlign: 'center', color: 'var(--text-400)', fontSize: 11, letterSpacing: 0.5 }}>← Arraste para ver todas as fases →</p>
    </div>
  )
}
