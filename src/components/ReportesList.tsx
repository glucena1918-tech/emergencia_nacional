import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, Users, AlertCircle, CheckCircle2 } from 'lucide-react'
import ReporteCard from './ReporteCard'
import ExportPDF from './ExportPDF'
import type { Reporte } from '../types/database'

type Filtro = 'todos' | 'sin_contacto' | 'localizado'

interface Props {
  reportes: Reporte[]
  loading: boolean
  onMarcarLocalizado: (id: string) => void
}

export default function ReportesList({ reportes, loading, onMarcarLocalizado }: Props) {
  const [filtro, setFiltro] = useState<Filtro>('todos')
  const [busqueda, setBusqueda] = useState('')

  const filtrados = useMemo(() => {
    let result = reportes

    if (filtro !== 'todos') {
      result = result.filter(r => r.estado_actual === filtro)
    }

    if (busqueda.trim()) {
      const q = busqueda.toLowerCase()
      result = result.filter(r =>
        (r.nombre?.toLowerCase().includes(q)) ||
        (r.ultimo_lugar?.toLowerCase().includes(q)) ||
        (r.estado_venezuela?.toLowerCase().includes(q)) ||
        (r.municipio?.toLowerCase().includes(q)) ||
        (r.descripcion_fisica?.toLowerCase().includes(q))
      )
    }

    return result
  }, [reportes, filtro, busqueda])

  const conteos = useMemo(() => ({
    todos: reportes.length,
    sin_contacto: reportes.filter(r => r.estado_actual === 'sin_contacto').length,
    localizado: reportes.filter(r => r.estado_actual === 'localizado').length,
  }), [reportes])

  const tabs: { key: Filtro; label: string; icon: React.ReactNode; count: number }[] = [
    { key: 'todos', label: 'Todos', icon: <Users className="w-4 h-4" />, count: conteos.todos },
    { key: 'sin_contacto', label: 'Sin contacto', icon: <AlertCircle className="w-4 h-4" />, count: conteos.sin_contacto },
    { key: 'localizado', label: 'Localizados', icon: <CheckCircle2 className="w-4 h-4" />, count: conteos.localizado },
  ]

  return (
    <section id="buscar" className="px-6 pt-4 pb-24">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
        >
          {/* Header area with PDF button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">
              Personas reportadas
            </h3>
            <ExportPDF reportes={reportes} />
          </div>

          {/* Toolbar: Filters and Search */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 bg-white border border-slate-200/50 rounded-2xl p-3 shadow-xs">
            {/* Filter Tabs / Chips */}
            <div className="flex gap-1 bg-slate-100 border border-slate-200/30 rounded-xl p-1 shrink-0 overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setFiltro(tab.key)}
                  className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 cursor-pointer whitespace-nowrap ${
                    filtro === tab.key
                      ? 'bg-accent text-white shadow-sm shadow-blue-500/10'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/40'
                  }`}
                >
                  {tab.icon}
                  <span className="inline">{tab.label}</span>
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    filtro === tab.key ? 'bg-white/25 text-white' : 'bg-slate-200/80 text-slate-500'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative flex-1 md:max-w-xs">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                placeholder="Buscar por nombre o lugar..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-accent/30 text-sm font-medium transition-all"
              />
            </div>
          </div>

          {/* List (Spaced out desahogado) */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white border border-slate-100 rounded-xl h-32 animate-pulse shadow-sm" />
              ))}
            </div>
          ) : filtrados.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium">
                {busqueda ? 'No se encontraron resultados' : 'Aún no hay reportes registrados'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtrados.map((reporte, i) => (
                <ReporteCard
                  key={reporte.id}
                  reporte={reporte}
                  index={i}
                  onMarcarLocalizado={onMarcarLocalizado}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
