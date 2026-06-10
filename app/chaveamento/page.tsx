import { KnockoutClient } from '@/components/matches/KnockoutClient'

export default function ChaveamentoPage() {
  return (
    <div style={{ paddingTop: 24 }}>
      <div style={{
        fontWeight: 900, fontSize: 20, letterSpacing: 3, marginBottom: 8,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        🎯 CHAVEAMENTO — MATA-MATA
        <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      </div>

      <div style={{
        background: 'rgba(201,168,76,0.06)', border: '1px solid var(--border)',
        borderRadius: 10, padding: '14px 16px', marginBottom: 24,
        fontSize: 13, color: 'var(--text-200)', lineHeight: 1.6,
      }}>
        <strong style={{ color: 'var(--gold)' }}>Regra do mata-mata:</strong> Escolha quem vai se classificar.
        Não importa se foi nos 90min, prorrogação ou pênaltis — apenas quem avançou conta.{' '}
        <strong style={{ color: 'var(--gold)' }}>+5 pontos</strong> por acerto.
        <br />
        <span style={{ color: 'var(--text-400)', fontSize: 11 }}>
          Os jogos do mata-mata são liberados após o término da fase de grupos (28/Jun).
        </span>
      </div>

      <KnockoutClient />
    </div>
  )
}
