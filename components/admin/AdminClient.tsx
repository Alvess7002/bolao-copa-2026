'use client'

import { useState } from 'react'

const ADMIN_ITEMS = [
  { icon: '👤', title: 'Gerenciar Usuários',    sub: 'Cadastrar, editar, suspender contas',  key: 'users'    },
  { icon: '⚽', title: 'Editar Partidas',        sub: 'Atualizar datas, horários e sedes',    key: 'matches'  },
  { icon: '📊', title: 'Registrar Resultado',    sub: 'Inserir placar e classificado',        key: 'result'   },
  { icon: '🔒', title: 'Fechar Palpites',        sub: 'Bloquear uma rodada manualmente',      key: 'lock'     },
  { icon: '🏆', title: 'Ajustar Pontuação',      sub: 'Correção manual de pontos',            key: 'adjust'   },
  { icon: '📥', title: 'Exportar CSV',           sub: 'Ranking e palpites em CSV',            key: 'csv'      },
  { icon: '📊', title: 'Exportar Excel',         sub: 'Relatório completo XLSX',              key: 'excel'    },
  { icon: '🔄', title: 'Sincronizar Resultados', sub: 'Atualizar via API Football',           key: 'sync'     },
  { icon: '📈', title: 'Relatórios',             sub: 'Estatísticas e análises detalhadas',   key: 'reports'  },
  { icon: '🔔', title: 'Enviar Notificação',     sub: 'Push para todos os participantes',     key: 'notify'   },
  { icon: '🎯', title: 'Validar Palpites',       sub: 'Auditar palpites suspeitos',           key: 'validate' },
  { icon: '⚙️', title: 'Configurações',          sub: 'Regras, pontuação e parâmetros',       key: 'config'   },
]

const MSGS: Record<string, string> = {
  users:    'Gerenciamento de usuários aberto',
  matches:  'Editor de partidas carregado',
  result:   'Formulário de resultado pronto',
  lock:     'Rodada bloqueada com sucesso!',
  adjust:   'Editor de pontuação disponível',
  csv:      'Gerando CSV... Download em instantes',
  excel:    'Gerando Excel XLSX...',
  sync:     'Sincronizando com API Football...',
  reports:  'Relatório gerado com sucesso',
  notify:   'Notificação enviada para todos!',
  validate: 'Auditoria de palpites iniciada',
  config:   'Configurações do bolão abertas',
}

export function AdminClient() {
  const [toast, setToast] = useState('')
  const [hovered, setHovered] = useState('')

  function act(key: string) {
    setToast('⚙️ ' + MSGS[key])
    setTimeout(() => setToast(''), 2800)
  }

  return (
    <>
      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 999,
          background: 'var(--surface-3)', border: '1px solid var(--gold)',
          borderRadius: 10, padding: '10px 18px',
          fontSize: 13, fontWeight: 600, color: 'var(--text-100)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
        }}>{toast}</div>
      )}

      <div style={{
        fontWeight: 900, fontSize: 14, letterSpacing: 2,
        color: 'var(--text-300)', marginBottom: 12, textTransform: 'uppercase',
      }}>
        Ações
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
        gap: 10,
      }}>
        {ADMIN_ITEMS.map(item => (
          <button
            key={item.key}
            onClick={() => act(item.key)}
            onMouseEnter={() => setHovered(item.key)}
            onMouseLeave={() => setHovered('')}
            style={{
              background: 'var(--surface-1)',
              border: `1px solid ${hovered === item.key ? 'var(--border-hover)' : 'var(--border)'}`,
              borderRadius: 16, padding: '18px 16px', textAlign: 'left',
              cursor: 'pointer',
              transform: hovered === item.key ? 'translateY(-2px)' : 'none',
              transition: 'all 0.2s',
              display: 'flex', flexDirection: 'column', gap: 6,
            }}
          >
            <div style={{ fontSize: 22 }}>{item.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 13, letterSpacing: 0.3, color: 'var(--text-100)' }}>{item.title}</div>
            <div style={{ fontSize: 11, color: 'var(--text-400)', lineHeight: 1.4 }}>{item.sub}</div>
          </button>
        ))}
      </div>
    </>
  )
}
