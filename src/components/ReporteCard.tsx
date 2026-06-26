import { motion } from 'framer-motion'
import { MapPin, Clock, User, Phone, Eye, Pencil } from 'lucide-react'
import type { Reporte } from '../types/database'

interface Props {
  reporte: Reporte
  index: number
  onMarcarLocalizado?: (id: string) => void
  onEdit?: (reporte: Reporte) => void
}

export default function ReporteCard({ reporte, index, onMarcarLocalizado, onEdit }: Props) {
  const esLocalizado = reporte.estado_actual === 'localizado'
  const timeAgo = getTimeAgo(reporte.created_at)

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className={`bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden transition-all duration-300 hover:border-slate-200 hover:shadow-md ${
        esLocalizado ? 'border-safe/30 bg-green-50/10' : ''
      }`}
    >
      <div className="flex">
        {/* Foto */}
        <div className="w-24 sm:w-32 shrink-0 bg-slate-100 flex items-center justify-center border-r border-slate-50">
          {reporte.foto_url ? (
            <img
              src={reporte.foto_url}
              alt={reporte.nombre || 'Persona reportada'}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <User className="w-10 h-10 text-slate-400" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 p-4 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="min-w-0">
              <h4 className="font-bold text-slate-800 text-sm truncate">
                {reporte.nombre || 'Nombre no disponible'}
              </h4>
              {reporte.edad && (
                <span className="text-xs text-slate-500 font-semibold">{reporte.edad} años</span>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {onEdit && (
                <button
                  type="button"
                  onClick={() => onEdit(reporte)}
                  className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-50 border border-slate-150 hover:border-slate-200 rounded-xl transition-all cursor-pointer shadow-3xs"
                  title="Editar reporte"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              )}
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                  esLocalizado
                    ? 'bg-green-50 text-green-700 border-green-200/50'
                    : 'bg-red-50 text-red-600 border-red-200/50'
                }`}
              >
                {esLocalizado ? '✓ Localizado' : 'Sin contacto'}
              </span>
            </div>
          </div>

          {reporte.ultimo_lugar && (
            <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium mb-1">
              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="truncate">{reporte.ultimo_lugar}</span>
              {reporte.estado_venezuela && (
                <span className="text-slate-400">· {reporte.estado_venezuela}</span>
              )}
            </div>
          )}

          {reporte.descripcion_fisica && (
            <p className="text-xs text-slate-500 line-clamp-2 mb-2 font-normal leading-relaxed">
              {reporte.descripcion_fisica}
            </p>
          )}

          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-50">
            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold">
              <Clock className="w-3 h-3 text-slate-300" />
              {timeAgo}
            </div>

            <div className="flex items-center gap-2">
              {reporte.contacto_reportante && (
                <span className="flex items-center gap-1 text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-md">
                  <Phone className="w-2.5 h-2.5" />
                  Contacto
                </span>
              )}
              {!esLocalizado && onMarcarLocalizado && (
                <button
                  onClick={() => onMarcarLocalizado(reporte.id)}
                  className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold bg-green-50 text-green-700 border border-green-200/40 rounded-lg hover:bg-green-100 transition-colors cursor-pointer"
                >
                  <Eye className="w-3 h-3" />
                  Marcar localizado
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>

  )
}

function getTimeAgo(dateStr: string): string {
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now.getTime() - date.getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'Justo ahora'
  if (mins < 60) return `hace ${mins} min`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `hace ${hrs}h`
  const days = Math.floor(hrs / 24)
  return `hace ${days}d`
}
