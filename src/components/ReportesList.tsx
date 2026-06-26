import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, Users, AlertCircle, CheckCircle2, Phone, MapPin, Building, Package, ShieldAlert, Navigation, Skull } from 'lucide-react'
import ReporteCard from './ReporteCard'
import ExportPDF from './ExportPDF'
import type { Reporte, RecursoEmergencia } from '../types/database'

type FiltroPersona = 'todos' | 'sin_contacto' | 'localizado' | 'fallecido'
type FiltroRecurso = 'todos' | 'hospital' | 'acopio' | 'ambulatorio_improvisado'

interface Props {
  reportes: Reporte[]
  recursos?: RecursoEmergencia[]
  loading: boolean
  onMarcarLocalizado: (id: string) => void
  onEditPersona?: (reporte: Reporte) => void
  onSelectPersona?: (reporte: Reporte) => void
}

export default function ReportesList({ reportes, recursos = [], loading, onMarcarLocalizado, onEditPersona, onSelectPersona }: Props) {
  const [activeMainTab, setActiveMainTab] = useState<'personas' | 'recursos'>('personas')
  
  // Personas States
  const [filtroPersona, setFiltroPersona] = useState<FiltroPersona>('todos')
  const [busquedaPersona, setBusquedaPersona] = useState('')

  // Recursos States
  const [filtroRecurso, setFiltroRecurso] = useState<FiltroRecurso>('todos')
  const [busquedaRecurso, setBusquedaRecurso] = useState('')

  // Filter Personas
  const personasFiltradas = useMemo(() => {
    let result = reportes

    if (filtroPersona !== 'todos') {
      result = result.filter(r => r.estado_actual === filtroPersona)
    }

    if (busquedaPersona.trim()) {
      const q = busquedaPersona.toLowerCase()
      result = result.filter(r =>
        (r.nombre?.toLowerCase().includes(q)) ||
        (r.ultimo_lugar?.toLowerCase().includes(q)) ||
        (r.estado_venezuela?.toLowerCase().includes(q)) ||
        (r.municipio?.toLowerCase().includes(q)) ||
        (r.descripcion_fisica?.toLowerCase().includes(q))
      )
    }

    return result
  }, [reportes, filtroPersona, busquedaPersona])

  // Filter Recursos
  const recursosFiltrados = useMemo(() => {
    let result = recursos

    if (filtroRecurso !== 'todos') {
      result = result.filter(r => r.tipo === filtroRecurso)
    }

    if (busquedaRecurso.trim()) {
      const q = busquedaRecurso.toLowerCase()
      result = result.filter(r =>
        r.nombre.toLowerCase().includes(q) ||
        r.direccion?.toLowerCase().includes(q) ||
        r.descripcion?.toLowerCase().includes(q) ||
        r.estado_venezuela.toLowerCase().includes(q) ||
        r.municipio.toLowerCase().includes(q)
      )
    }

    return result
  }, [recursos, filtroRecurso, busquedaRecurso])

  const conteosPersonas = useMemo(() => ({
    todos: reportes.length,
    sin_contacto: reportes.filter(r => r.estado_actual === 'sin_contacto').length,
    localizado: reportes.filter(r => r.estado_actual === 'localizado').length,
    fallecido: reportes.filter(r => r.estado_actual === 'fallecido').length,
  }), [reportes])

  const conteosRecursos = useMemo(() => ({
    todos: recursos.length,
    hospital: recursos.filter(r => r.tipo === 'hospital').length,
    acopio: recursos.filter(r => r.tipo === 'acopio').length,
    ambulatorio_improvisado: recursos.filter(r => r.tipo === 'ambulatorio_improvisado').length,
  }), [recursos])

  const tabsPersonas: { key: FiltroPersona; label: string; icon: React.ReactNode; count: number }[] = [
    { key: 'todos', label: 'Todos', icon: <Users className="w-4 h-4" />, count: conteosPersonas.todos },
    { key: 'sin_contacto', label: 'Desaparecidos', icon: <AlertCircle className="w-4 h-4" />, count: conteosPersonas.sin_contacto },
    { key: 'localizado', label: 'Localizados', icon: <CheckCircle2 className="w-4 h-4" />, count: conteosPersonas.localizado },
    { key: 'fallecido', label: 'Fallecidos', icon: <Skull className="w-4 h-4 text-slate-500" />, count: conteosPersonas.fallecido },
  ]

  const tabsRecursos: { key: FiltroRecurso; label: string; icon: React.ReactNode; count: number }[] = [
    { key: 'todos', label: 'Todos', icon: <Building className="w-4 h-4" />, count: conteosRecursos.todos },
    { key: 'hospital', label: 'Hospitales', icon: <Building className="w-4 h-4 text-blue-500" />, count: conteosRecursos.hospital },
    { key: 'acopio', label: 'C. de Acopio', icon: <Package className="w-4 h-4 text-green-500" />, count: conteosRecursos.acopio },
    { key: 'ambulatorio_improvisado', label: 'Ambulatorios', icon: <ShieldAlert className="w-4 h-4 text-orange-500" />, count: conteosRecursos.ambulatorio_improvisado },
  ]

  return (
    <section id="buscar" className="px-6 pt-4 pb-24">
      <div className="max-w-4xl mx-auto">
        {/* Main tabs segment control */}
        <div className="flex border-b border-slate-200 mb-8 justify-center sm:justify-start gap-6">
          <button
            onClick={() => setActiveMainTab('personas')}
            className={`pb-4 px-2 text-base font-extrabold transition-all relative cursor-pointer ${
              activeMainTab === 'personas'
                ? 'text-emergency border-b-2 border-emergency'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            📢 Personas Reportadas
            {conteosPersonas.todos > 0 && (
              <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-600 font-bold border border-slate-200/50">
                {conteosPersonas.todos}
              </span>
            )}
          </button>
          
          <button
            onClick={() => setActiveMainTab('recursos')}
            className={`pb-4 px-2 text-base font-extrabold transition-all relative cursor-pointer ${
              activeMainTab === 'recursos'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            🏥 Puntos de Asistencia y Ayuda
            {conteosRecursos.todos > 0 && (
              <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-600 font-bold border border-slate-200/50">
                {conteosRecursos.todos}
              </span>
            )}
          </button>
        </div>

        {activeMainTab === 'personas' ? (
          <motion.div
            key="personas-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header area with PDF button */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                Directorio de Desaparecidos
              </h3>
              <ExportPDF reportes={reportes} />
            </div>

            {/* Toolbar: Filters and Search */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 bg-white border border-slate-200/50 rounded-2xl p-3 shadow-xs">
              {/* Filter Tabs / Chips */}
              <div className="flex gap-1 bg-slate-100 border border-slate-200/30 rounded-xl p-1 shrink-0 overflow-x-auto">
                {tabsPersonas.map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setFiltroPersona(tab.key)}
                    className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 cursor-pointer whitespace-nowrap ${
                      filtroPersona === tab.key
                        ? tab.key === 'fallecido'
                          ? 'bg-slate-700 text-white shadow-sm shadow-slate-500/10'
                          : 'bg-accent text-white shadow-sm shadow-blue-500/10'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/40'
                    }`}
                  >
                    {tab.icon}
                    <span className="inline">{tab.label}</span>
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      filtroPersona === tab.key ? 'bg-white/25 text-white' : 'bg-slate-200/80 text-slate-500'
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
                  value={busquedaPersona}
                  onChange={e => setBusquedaPersona(e.target.value)}
                  placeholder="Buscar por nombre o lugar..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-accent/30 text-sm font-medium transition-all"
                />
              </div>
            </div>

            {/* List */}
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white border border-slate-100 rounded-xl h-32 animate-pulse shadow-sm" />
                ))}
              </div>
            ) : personasFiltradas.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm font-medium">
                  {busquedaPersona ? 'No se encontraron resultados' : 'Aún no hay reportes registrados'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {personasFiltradas.map((reporte, i) => (
                  <ReporteCard
                    key={reporte.id}
                    reporte={reporte}
                    index={i}
                    onMarcarLocalizado={onMarcarLocalizado}
                    onEdit={onEditPersona}
                    onClick={onSelectPersona}
                  />
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="recursos-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                Directorio de Puntos de Ayuda
              </h3>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 bg-white border border-slate-200/50 rounded-2xl p-3 shadow-xs">
              {/* Filter Tabs */}
              <div className="flex gap-1 bg-slate-100 border border-slate-200/30 rounded-xl p-1 shrink-0 overflow-x-auto">
                {tabsRecursos.map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setFiltroRecurso(tab.key)}
                    className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 cursor-pointer whitespace-nowrap ${
                      filtroRecurso === tab.key
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/10'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/40'
                    }`}
                  >
                    {tab.icon}
                    <span className="inline">{tab.label}</span>
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      filtroRecurso === tab.key ? 'bg-white/25 text-white' : 'bg-slate-200/80 text-slate-500'
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative flex-1 md:max-w-xs">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={busquedaRecurso}
                  onChange={e => setBusquedaRecurso(e.target.value)}
                  placeholder="Buscar por nombre, estado, detalles..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-sm font-medium transition-all"
                />
              </div>
            </div>

            {/* List */}
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white border border-slate-100 rounded-xl h-32 animate-pulse shadow-sm" />
                ))}
              </div>
            ) : recursosFiltrados.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <Building className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm font-medium">
                  {busquedaRecurso ? 'No se encontraron resultados' : 'Aún no hay puntos de ayuda registrados'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recursosFiltrados.map((rec) => {
                  const badgeColor =
                    rec.tipo === 'hospital'
                      ? 'bg-blue-50 text-blue-700 border-blue-200/50'
                      : rec.tipo === 'acopio'
                      ? 'bg-green-50 text-green-700 border-green-200/50'
                      : 'bg-orange-50 text-orange-700 border-orange-200/50'

                  const typeLabel =
                    rec.tipo === 'hospital'
                      ? '🏥 Hospital'
                      : rec.tipo === 'acopio'
                      ? '📦 Centro de Acopio'
                      : '⚡ Ambulatorio Improvisado'

                  return (
                    <motion.div
                      key={rec.id}
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${badgeColor}`}>
                            {typeLabel}
                          </span>
                          {rec.verificado ? (
                            <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                              ✓ Verificado
                            </span>
                          ) : (
                            <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
                              Pendiente
                            </span>
                          )}
                        </div>

                        <h4 className="text-lg font-bold text-slate-800 mb-2 leading-snug">
                          {rec.nombre}
                        </h4>

                        {rec.contacto && (
                          <a
                            href={`tel:${rec.contacto}`}
                            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 font-bold mb-3 transition-colors"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            {rec.contacto}
                          </a>
                        )}

                        {rec.direccion && (
                          <p className="text-slate-600 text-xs font-semibold flex items-start gap-1.5 mb-3 leading-relaxed">
                            <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                            <span>
                              <span className="font-extrabold text-slate-800">Dirección: </span>
                              {rec.direccion}
                            </span>
                          </p>
                        )}

                        {rec.descripcion && (
                          <div className="bg-slate-50/80 border border-slate-100 p-3 rounded-xl text-xs text-slate-500 italic mb-4 leading-relaxed">
                            {rec.descripcion}
                          </div>
                        )}
                      </div>

                      <div className="border-t border-slate-100 pt-3 flex items-center justify-between mt-auto">
                        <span className="text-xs text-slate-400 font-bold">
                          📍 {rec.estado_venezuela} · {rec.municipio}
                        </span>
                        
                        <a
                          href="#mapa"
                          className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 rounded-xl transition-all flex items-center gap-1 text-[11px] font-bold cursor-pointer"
                          title="Ubicar en el mapa"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          <span>Ubicar</span>
                        </a>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </section>
  )
}
