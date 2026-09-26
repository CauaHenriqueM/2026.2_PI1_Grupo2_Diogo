import { useEffect, useState } from 'react'
import type { Ponto, Posicao } from '../types'

const C = 40
const PASSO_MS = 400
const ANGULO: Record<Posicao['direcao'], number> = { N: 0, L: 90, S: 180, O: 270 }

// soma cada giro pelo lado mais curto (O → N = +90°, não −270°), senao o kart da a volta errada.
const anguloAcumulado = (seq: Posicao[]) =>
  seq.reduce((acc, p) => acc + ((((ANGULO[p.direcao] - acc) % 360) + 540) % 360) - 180, 0)

const XADREZ = 'repeating-conic-gradient(#1c1c1e 0 25%, #fff 0 50%) 0 0 / 5px 5px'

type Props = { linhas: number; colunas: number; trajetoria: Posicao[] }

export function Percurso({ linhas, colunas, trajetoria }: Props) {
  const [passo, setPasso] = useState<number | null>(null)
  const [tocando, setTocando] = useState(false)

  const fim = trajetoria.length - 1
  const atual = passo === null ? fim : Math.min(passo, fim)
  const rodando = tocando && atual < fim
  const visivel = trajetoria.slice(0, atual + 1)
  const kart = visivel.at(-1)

  useEffect(() => {
    if (!rodando) return
    const id = setTimeout(() => setPasso(atual + 1 >= fim ? null : atual + 1), PASSO_MS)
    return () => clearTimeout(id)
  }, [rodando, atual, fim])

  const alternar = () => {
    if (rodando) return setTocando(false)
    if (atual >= fim) setPasso(0)
    setTocando(true)
  }

  const centro = (p: Ponto) => [p.x * C + C / 2, p.y * C + C / 2]
  const [ix, iy] = centro({ x: 0, y: 0 })
  const [mx, my] = centro({ x: colunas - 1, y: linhas - 1 })
  const w = colunas * C
  const h = linhas * C

  return (
    <>
      <svg viewBox={`-3 -3 ${w + 6} ${h + 6}`} className="max-h-[70vh] w-full">
        <defs>
          <pattern id="grade" width={C} height={C} patternUnits="userSpaceOnUse">
            <rect width={C} height={C} className="fill-piso" />
            <path d={`M ${C} 0 L 0 0 0 ${C}`} fill="none" stroke="#45454c" strokeWidth={1} />
          </pattern>
          <pattern id="xadrez" width={8} height={8} patternUnits="userSpaceOnUse">
            <rect width={8} height={8} fill="#fff" />
            <rect width={4} height={4} className="fill-piso" />
            <rect x={4} y={4} width={4} height={4} className="fill-piso" />
          </pattern>
        </defs>
        <rect width={w} height={h} fill="url(#grade)" />
        <rect width={w} height={h} fill="none" className="stroke-topo" strokeWidth={3} />
        <rect x={mx - 12} y={my - 12} width={24} height={24} fill="url(#xadrez)" />
        <polyline
          points={visivel.map(p => centro(p).join(',')).join(' ')}
          fill="none"
          className="stroke-trajeto"
          strokeWidth={4}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <circle cx={ix} cy={iy} r={6} className="fill-green-500" />
        {kart && (
          <g
            style={{
              transform: `translate(${centro(kart)[0]}px, ${centro(kart)[1]}px) rotate(${anguloAcumulado(visivel)}deg)`,
              transition: 'transform 0.3s',
            }}
          >
            <image href="/imgs/kart.png" x={-C / 2} y={-C / 2} width={C} height={C} />
          </g>
        )}
      </svg>

      <ul className="mt-4 flex flex-wrap gap-6 text-xs text-apagado">
        <li className="flex items-center gap-2">
          <span className="h-1 w-5 rounded-full bg-trajeto" /> Trajetória
        </li>
        <li className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-green-500" /> Início
        </li>
        <li className="flex items-center gap-2">
          <span className="size-2.5" style={{ background: XADREZ }} /> Meta
        </li>
      </ul>

      <div className="mt-4 flex items-center gap-4 border-t border-linha pt-4">
        <button
          type="button"
          onClick={alternar}
          disabled={fim < 1}
          className="w-32 shrink-0 rounded-sm bg-tinta px-3 py-2 text-xs font-medium text-parede transition-colors hover:bg-topo disabled:opacity-30 disabled:hover:bg-tinta"
        >
          {rodando ? '❚❚ Pausar' : '▶ Reproduzir'}
        </button>
        <input
          type="range"
          aria-label="Passo do replay"
          min={0}
          max={Math.max(fim, 0)}
          value={Math.max(atual, 0)}
          disabled={fim < 1}
          onChange={e => {
            const v = Number(e.target.value)
            setTocando(false)
            setPasso(v >= fim ? null : v)
          }}
          className="w-full accent-topo"
        />
        <span className="shrink-0 text-xs tabular-nums text-apagado">
          {atual + 1}/{fim + 1}
        </span>
      </div>
    </>
  )
}
