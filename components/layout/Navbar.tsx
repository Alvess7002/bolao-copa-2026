'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'

const tabs = [
  { href: '/',            label: 'Início',      icon: '🏠' },
  { href: '/palpites',    label: 'Palpites',    icon: '⚽' },
  { href: '/grupos',      label: 'Grupos',      icon: '📊' },
  { href: '/ranking',     label: 'Ranking',     icon: '🏆' },
  { href: '/chaveamento', label: 'Chaveamento', icon: '🎯' },
  { href: '/bonus',       label: 'Bônus',       icon: '⭐' },
  { href: '/regras',      label: 'Regras',      icon: '📋' },
  { href: '/admin',       label: 'Admin',       icon: '⚙️' },
]

export function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(3,14,7,0.95)',
      borderBottom: '1px solid var(--border)',
      backdropFilter: 'blur(20px)',
    }}>
      <div style={{
        maxWidth: '1280px', margin: '0 auto',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px', gap: '12px', flexWrap: 'wrap',
      }}>

        {/* Logo */}
        <Link href="/" style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '12px 0', textDecoration: 'none',
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: 'linear-gradient(135deg, #8B6F20, #C9A84C)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18,
          }}>⚽</div>
          <div>
            <div style={{
              fontWeight: 800, fontSize: 16, letterSpacing: 2,
              background: 'linear-gradient(135deg, #F4D878, #C9A84C)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>BOLÃO FIFA 2026</div>
            <div style={{ fontSize: 10, color: 'var(--text-400)', letterSpacing: 2 }}>COPA DO MUNDO</div>
          </div>
        </Link>

        {/* Tabs */}
        <div style={{
          display: 'flex', gap: 2,
          background: 'rgba(0,0,0,0.4)',
          border: '1px solid var(--border)',
          padding: 3, borderRadius: 10,
          flexWrap: 'wrap',
        }}>
          {tabs.map(tab => {
            const active = pathname === tab.href
            return (
              <Link key={tab.href} href={tab.href} style={{
                padding: '7px 12px', borderRadius: 7,
                background: active
                  ? 'linear-gradient(135deg, #8B6F20, #C9A84C)'
                  : 'transparent',
                color: active ? '#000' : 'var(--text-300)',
                fontWeight: active ? 700 : 500,
                fontSize: 12, textDecoration: 'none',
                display: 'flex', alignItems: 'center', gap: 4,
                letterSpacing: 0.5, whiteSpace: 'nowrap',
                transition: 'all 0.2s',
              }}>
                <span>{tab.icon}</span>
                {tab.label}
              </Link>
            )
          })}
        </div>

        {/* Auth */}
        {session ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-100)' }}>
                {session.user?.name?.split(' ')[0]}
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-400)' }}>0 pts</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div
                style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #8B6F20, #C9A84C)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: 13, color: '#000',
                  border: '2px solid var(--gold)', cursor: 'pointer',
                }}
                title={session.user?.name ?? ''}
              >
                {session.user?.name?.charAt(0).toUpperCase()}
              </div>
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                style={{
                  background: 'transparent', border: 'none',
                  fontSize: 10, color: 'var(--text-400)',
                  cursor: 'pointer', letterSpacing: 0.5,
                  padding: 0,
                }}
              >
                sair
              </button>
            </div>
          </div>
        ) : (
          <Link href="/login" style={{
            background: 'linear-gradient(135deg, #8B6F20, #C9A84C)',
            color: '#000', fontWeight: 700, fontSize: 12,
            padding: '8px 16px', borderRadius: 8,
            textDecoration: 'none', letterSpacing: 0.5,
            whiteSpace: 'nowrap',
          }}>
            🔑 Entrar
          </Link>
        )}

      </div>
    </nav>
  )
}
