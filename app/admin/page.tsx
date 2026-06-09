import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { AdminClient } from '@/components/admin/AdminClient'

export default async function AdminPage() {
  const session = await getServerSession()

  if (!session?.user?.email) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user || user.role !== 'ADMIN') {
    redirect('/')
  }

  const [userCount, matchCount, predictionCount, resultCount] = await Promise.all([
    prisma.user.count(),
    prisma.match.count(),
    prisma.prediction.count(),
    prisma.match.count({ where: { result: { not: null } } }),
  ])

  return (
    <div style={{ paddingTop: 24 }}>
      <div style={{
        fontWeight: 900, fontSize: 20, letterSpacing: 3, marginBottom: 8,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        ⚙️ PAINEL ADMINISTRATIVO
        <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      </div>

      <div style={{
        background: 'rgba(209,64,64,0.08)', border: '1px solid rgba(209,64,64,0.25)',
        borderRadius: 10, padding: '10px 14px', marginBottom: 20,
        fontSize: 12, color: '#E88', display: 'flex', alignItems: 'center', gap: 8,
      }}>
        🔒 Área restrita — logado como <strong style={{ color: '#fff' }}>{user.name ?? user.email}</strong> (Admin)
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: 10, marginBottom: 24,
      }}>
        {[
          { label: 'Participantes', value: userCount,       sub: 'cadastrados'    },
          { label: 'Palpites',      value: predictionCount, sub: 'registrados'    },
          { label: 'Jogos',         value: matchCount,      sub: 'fase de grupos' },
          { label: 'Resultados',    value: resultCount,     sub: 'apurados'       },
        ].map(s => (
          <div key={s.label} style={{
            background: 'var(--surface-1)', border: '1px solid var(--border)',
            borderRadius: 10, padding: 14,
          }}>
            <div style={{ fontSize: 10, color: 'var(--text-400)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontWeight: 900, fontSize: 30, color: 'var(--gold)', lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: 'var(--text-300)', marginTop: 2 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <AdminClient />
    </div>
  )
}
