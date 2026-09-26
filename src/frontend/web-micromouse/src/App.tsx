import { useState, type ReactNode } from 'react'
import { Console } from './components/Console'
import { Percurso } from './components/Percurso'
import { SeletorLabirinto } from './components/SeletorLabirinto'
import { CELULA_CM, LABIRINTOS, type Log, type Ponto, type Posicao, type Telemetria, type TipoLabirinto } from './types'

const COR_STATUS: Record<Telemetria['status'], string> = {
  'Em execução': 'bg-trajeto',
  'Concluído': 'bg-green-500',
  'Interrompido': 'bg-topo',
}

const mmss = (ms: number) => new Date(ms).toISOString().slice(14, 19)
const celula = (p: Ponto) => String.fromCharCode(65 + p.x) + (p.y + 1)

function App() {
  const [tipo, setTipo] = useState<TipoLabirinto>('4x4')
  const { linhas, colunas } = LABIRINTOS[tipo]

  //alterar pelos valores do banco de dados
  const [telemetria] = useState<Telemetria | null>(null)
  const [trajetoria] = useState<Posicao[]>([])
  const [logs] = useState<Log[]>([])

  const velocidadeMedia =
    telemetria && telemetria.tempoMS > 0
      ? (telemetria.celulasPercorridas * CELULA_CM) / (telemetria.tempoMS / 1000)
      : null

  return (
    <main className="min-h-screen p-4 text-parede md:p-8">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-semibold">Labirinto</h1>
          <SeletorLabirinto valor={tipo} onChange={setTipo} />
        </div>
        <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-white/15 bg-piso px-3 py-1 text-xs">
          <span className={`size-2 rounded-full ${telemetria ? COR_STATUS[telemetria.status] : 'bg-apagado'}`} />
          {telemetria?.status ?? 'Sem conexão'}
        </span>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card titulo="Percurso">
          <Percurso key={tipo} linhas={linhas} colunas={colunas} trajetoria={trajetoria} />
        </Card>

        <div className="flex flex-col gap-6">
          <Card titulo="Detalhes da Execução">
            <Campo nome="Tipo" valor={tipo} />
            <Campo nome="Tempo" valor={telemetria && mmss(telemetria.tempoMS)} />
            <Campo nome="Células visitadas" valor={telemetria?.celulasPercorridas} />
            <Campo nome="Posição" valor={telemetria && celula(telemetria.posicao)} />
          </Card>

          <Card titulo="Métricas da Corrida">
            <div className="grid grid-cols-2 gap-4">
              <Metrica nome="Velocidade média" valor={velocidadeMedia?.toFixed(1)} unidade="cm/s" />
              <Metrica nome="Velocidade" valor={telemetria?.velocidade} unidade="cm/s" />
              <Metrica nome="RPM" valor={telemetria?.rpm} unidade="rpm" />
              <Metrica
                nome="Bateria"
                valor={telemetria?.bateria}
                unidade="%"
                icone={<Bateria nivel={telemetria?.bateria ?? 0} />}
              />
            </div>
          </Card>

          <Card titulo="Console">
            <Console logs={logs} />
          </Card>
        </div>
      </div>
    </main>
  )
}

function Card({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section className="rounded-b-sm border-t-[5px] border-topo bg-parede p-5 text-tinta">
      <h2 className="mb-4 text-lg font-semibold">{titulo}</h2>
      {children}
    </section>
  )
}

type Valor = string | number | null | undefined

function Campo({ nome, valor }: { nome: string; valor: Valor }) {
  return (
    <div className="flex justify-between border-b border-linha py-2.5 text-sm last:border-0">
      <span className="text-apagado">{nome}</span>
      <span className="font-medium tabular-nums">{valor ?? '-'}</span>
    </div>
  )
}

function Metrica({ nome, valor, unidade, icone }: { nome: string; valor: Valor; unidade: string; icone?: ReactNode }) {
  return (
    <div>
      <div className="text-xs text-apagado">{nome}</div>
      <div className="mt-1 flex items-center gap-2">
        {icone}
        <span className="text-2xl font-semibold tabular-nums">
          {valor ?? '-'} <span className="text-xs font-normal text-apagado">{unidade}</span>
        </span>
      </div>
    </div>
  )
}

function Bateria({ nivel }: { nivel: number }) {
  const topo = 1340
  const fundo = 3940
  const altura = ((fundo - topo) * Math.min(Math.max(nivel, 0), 100)) / 100

  return (
    <svg viewBox="1481 940 2038 3186" className="h-10 w-7">
      <image href="/imgs/bateria_base.png" width={5000} height={5000} />
      <rect x={1665} y={fundo - altura} width={1670} height={altura} rx={60} className="fill-green-500" />
    </svg>
  )
}

export default App
