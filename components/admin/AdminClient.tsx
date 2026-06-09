'use client'

import { useState } from 'react'
import { ResultadoForm } from './ResultadoForm'

const ADMIN_ITEMS = [
  { icon: '👤', title: 'Gerenciar Usuários',    sub: 'Cadastrar, editar, suspender contas',  key: 'users'    },
  { icon: '⚽', title: 'Editar Partidas',        sub: 'Atualizar datas, horários e sedes',    key: 'matches'  },
  { icon: '📊', title: 'Registrar Resultado',    sub: 'Inserir placar e calcular pontos',     key: 'result'   },
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
  users:    'Gerenciamento de usuários — em breve',
  matches:  'Editor de partidas — em breve',
  lock:     'Fechar palpites — em breve',
  adjust:   'Ajuste de pontuação — em breve',
  csv:      'Exportar CSV — em breve',
  excel:    'Exportar Excel — em breve',
  sync:     'Sincronizar resultados — em breve',
  reports:  'Relatórios — em breve',
  notify:   'Notificações — em breve',
  validate: 'Validar palpites — em breve',
  config:   'Configurações — em breve',
}

export function AdminClient() {
  const [toast, setToast] = useState('')
  const [hovered, setHovered] = useState('')
  const [activeModal, setActiveModal] = useState('')

  function act(key: string) {
    if (key === 'result') {
      setActiveModal('result')
      return
    }
    setToast('⚙️ ' + MSGS[key])
    setTimeout(() => setToast(''), 2800)
  }

  return (
    <>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 999,
          background: 'var(--surface-3)', border: '1px solid var(--gold)',
          borderRadius: 10, padding: '10px 18px',
          fontSize: 13, fontWeight: 600, color: 'var(--text-100)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
        }}>{toast}</div>
      )}

      {/* Modal Registrar Resultado */}
      {activeModal === 'result' && (
        <div
          onClick={() => setActiveModal('')}
          style={{
            position: 'fixed', inset: 0, zIndex: 500,
            background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 20,
          }}
        >
          <div onClick={e => e.stopPropagation()}>
            <ResultadoForm onClose={() => setActiveModal('')} />
          </div>
        </div>
      )}

      {/* Grid de botões */}
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
              background: item.key === 'result' ? 'rgba(201,168,76,0.08)' : 'var(--surface-1)',
              border: `1px solid ${hovered === item.key || item.key === 'result' ? 'rgba(201,168,76,0.35)' : 'var(--border)'}`,
              borderRadius: 16, padding: '18px 16px', textAlign: 'left',
              cursor: 'pointer',
              transform: hovered === item.key ? 'translateY(-2px)' : 'none',
              transition: 'all 0.2s',
              display: 'flex', flexDirection: 'column', gap: 6,
            }}
          >
            <div style={{ fontSize: 22 }}>{item.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 13, letterSpacing: 0.3, color: 'var(--text-100)' }}>
              {item.title}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-400)', lineHeight: 1.4 }}>
              {item.sub}
            </div>
            {item.key === 'result' && (
              <div style={{ fontSize: 10, color: 'var(--gold)', fontWeight: 700, letterSpacing: 0.5 }}>
                ✓ DISPONÍVEL
              </div>
            )}
          </button>
        ))}
      </div>
    </>
  )
}
