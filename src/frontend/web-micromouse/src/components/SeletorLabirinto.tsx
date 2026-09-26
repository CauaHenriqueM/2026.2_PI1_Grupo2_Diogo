import { useState } from 'react'
import { CELULA_CM, LABIRINTOS, type TipoLabirinto } from '../types'

const TIPOS = Object.keys(LABIRINTOS) as TipoLabirinto[]

type Props = { valor: TipoLabirinto; onChange: (tipo: TipoLabirinto) => void }

export function SeletorLabirinto({ valor, onChange }: Props) {
  const [aberto, setAberto] = useState(false)

  return (
    <div className="relative" onKeyDown={e => e.key === 'Escape' && setAberto(false)}>
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={aberto}
        onClick={() => setAberto(!aberto)}
        className="flex items-center gap-3 rounded-sm border border-white/20 bg-piso px-4 py-2 text-sm font-medium transition-colors hover:border-white/60"
      >
        {valor}
        <span className={`text-xs text-apagado transition-transform ${aberto ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {aberto && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setAberto(false)} />
          <ul className="absolute left-0 z-20 mt-2 w-52 overflow-hidden rounded-b-sm border-t-4 border-topo bg-parede py-1 text-tinta shadow-xl shadow-black/50">
            {TIPOS.map(tipo => (
              <li key={tipo}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(tipo)
                    setAberto(false)
                  }}
                  className={`flex w-full items-center justify-between px-4 py-2.5 text-sm transition-colors hover:bg-black/5 ${
                    tipo === valor ? 'text-topo' : ''
                  }`}
                >
                  <span className="font-medium">
                    {tipo === valor ? '✓ ' : ''}
                    {tipo}
                  </span>
                  <span className="text-xs text-apagado">
                    {LABIRINTOS[tipo].linhas * CELULA_CM}×{LABIRINTOS[tipo].colunas * CELULA_CM} cm
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
