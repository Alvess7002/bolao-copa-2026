export default function RegrasPage() {
  const cards = [
    {
      icon: '⚽', title: 'FASE DE GRUPOS — 3 PTS',
      items: ['Escolha: Vitória Time A, Empate ou Vitória Time B','Acertou o resultado → +3 pontos','Errou → 0 pontos','Placar exato não importa, apenas o resultado'],
      pts: '3 pts por acerto',
    },
    {
      icon: '🎯', title: 'MATA-MATA — 5 PTS',
      items: ['Escolha quem vai se classificar','Acertou o classificado → +5 pontos','Não importa se foi nos 90min, prorrogação ou pênaltis','Apenas quem avançou conta · Empate não existe no mata-mata'],
      pts: '5 pts por acerto',
    },
    {
      icon: '🏆', title: 'BÔNUS ESPECIAIS',
      items: ['Campeão do Mundo → +20 pontos','Vice-campeão → +10 pontos','Terceiro lugar → +5 pontos','Artilheiro da Copa → +10 pontos','Melhor jogador (Bola de Ouro) → +10 pontos'],
      pts: '55 pts máximo',
    },
    {
      icon: '📊', title: 'PONTUAÇÃO MÁXIMA',
      items: ['72 jogos × 3 pts = 216 pts (grupos)','Rodada 32: 16 × 5 = 80 pts','Oitavas: 8 × 5 = 40 pts','Quartas: 4 × 5 = 20 pts','Semis + 3°lugar + Final = 20 pts','Bônus especiais = 55 pts'],
      pts: '431 pts total',
    },
    {
      icon: '⏰', title: 'PRAZOS',
      items: ['Grupos: palpites fecham 5min antes de cada jogo','Mata-mata: fecham ao início de cada partida','Bônus: prazo final 11/Jun às 15h55 (Brasília)','Sem edições após o prazo — sem exceções'],
      pts: null,
    },
    {
      icon: '🔒', title: 'CRITÉRIO DE DESEMPATE',
      items: ['1° — Maior número de pontos','2° — Maior número de acertos','3° — Maior aproveitamento % por fase','4° — Data de cadastro (mais antigo ganha)'],
      pts: null,
    },
  ]

  return (
    <div style={{ paddingTop: 24 }}>
      <div style={{ fontWeight: 900, fontSize: 20, letterSpacing: 3, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
        📋 REGRAS DO BOLÃO
        <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
        {cards.map(c => (
          <div key={c.title} style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: 16, padding: 20 }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>{c.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 14, letterSpacing: 0.5, color: 'var(--gold)', marginBottom: 12 }}>{c.title}</div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 7 }}>
              {c.items.map(item => (
                <li key={item} style={{ fontSize: 13, color: 'var(--text-200)', paddingLeft: 14, position: 'relative', lineHeight: 1.5 }}>
                  <span style={{ position: 'absolute', left: 0, color: 'var(--gold)', fontSize: 11, top: 2 }}>→</span>
                  {item}
                </li>
              ))}
            </ul>
            {c.pts && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(201,168,76,0.06)', borderRadius: 8, marginTop: 12 }}>
                <span style={{ fontSize: 12, color: 'var(--text-200)' }}>Pontuação</span>
                <span style={{ fontWeight: 900, fontSize: 20, color: 'var(--gold)' }}>{c.pts}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
