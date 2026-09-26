import { useLayoutEffect, useRef } from 'react'
import type { Log } from '../types'

const COR: Record<Log['nivel'], string> = {
  info: 'text-white/45',
  aviso: 'text-trajeto',
  erro: 'text-topo',
}

export function Console({ logs }: { logs: Log[] }) {
  const caixa = useRef<HTMLDivElement>(null)
  const noFim = useRef(true)

  useLayoutEffect(() => {
    const el = caixa.current
    if (el && noFim.current) el.scrollTop = el.scrollHeight
  }, [logs])

  return (
    <div
      ref={caixa}
      onScroll={e => {
        const el = e.currentTarget
        noFim.current = el.scrollHeight - el.scrollTop - el.clientHeight < 24
      }}
      className="h-56 overflow-y-auto rounded-sm bg-piso p-3 font-mono text-xs leading-relaxed text-parede"
    >
      {logs.length === 0 ? (
        <p className="text-white/40">Aguardando mensagens do backend…</p>
      ) : (
        <ol>
          {logs.map((log, i) => (
            <li key={i} className="flex gap-3">
              <span className="shrink-0 text-white/40">{new Date(log.hora).toLocaleTimeString('pt-BR')}</span>
              <span className={`w-10 shrink-0 ${COR[log.nivel]}`}>{log.nivel}</span>
              <span className="min-w-0 [overflow-wrap:anywhere]">{log.mensagem}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
