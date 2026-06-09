'use client'

import { signIn } from 'next-auth/react'

export default function LoginPage() {
  return (
    <div style={{
      minHeight: '80vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: 'var(--surface-1)', border: '1px solid var(--border)',
        borderRadius: 24, padding: '40px 36px', width: '100%', maxWidth: 400,
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>⚽</div>
        <div style={{ fontWeight: 900, fontSize: 24, letterSpacing: 3, marginBottom: 4 }}>
          BOLÃO FIFA 2026
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-300)', marginBottom: 32 }}>
          Entre para fazer seus palpites
        </div>

        <button
          onClick={() => signIn('google', { callbackUrl: '/' })}
          style={{
            width: '100%', padding: '14px',
            background: '#fff', color: '#000',
            border: 'none', borderRadius: 10,
            fontWeight: 700, fontSize: 14, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            marginBottom: 10,
          }}
        >
          <span style={{ fontSize: 18 }}>🔵</span>
          Entrar com Google
        </button>

        <button
          onClick={() => signIn('discord', { callbackUrl: '/' })}
          style={{
            width: '100%', padding: '14px',
            background: '#5865F2', color: '#fff',
            border: 'none', borderRadius: 10,
            fontWeight: 700, fontSize: 14, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          }}
        >
          <span style={{ fontSize: 18 }}>💬</span>
          Entrar com Discord
        </button>

        <p style={{ fontSize: 11, color: 'var(--text-400)', marginTop: 24, lineHeight: 1.6 }}>
          Ao entrar você concorda com as regras do bolão.
          <br />Seus dados são usados apenas para identificação.
        </p>
      </div>
    </div>
  )
}