import { motion } from 'framer-motion'
import { MapPin, Clock, User, Pencil, Eye, Users, CreditCard } from 'lucide-react'
import type { Reporte } from '../types/database'

interface Props {
  reporte: Reporte
  index: number
  onMarcarLocalizado?: (id: string) => void
  onEdit?: (reporte: Reporte) => void
  onClick?: (reporte: Reporte) => void
}

export default function ReporteCard({ reporte, index, onMarcarLocalizado, onEdit, onClick }: Props) {
  const esLocalizado = reporte.estado_actual === 'localizado'
  const esFallecido = reporte.estado_actual === 'fallecido'
  const timeAgo = getTimeAgo(reporte.created_at)

  // Status Badge styles
  let badgeStyles = 'bg-red-50 text-red-600 border-red-200/50'
  let statusText = 'Desaparecido'
  if (esLocalizado) {
    badgeStyles = 'bg-green-50 text-green-700 border-green-200/50'
    statusText = '✓ Localizado'
  } else if (esFallecido) {
    badgeStyles = 'bg-slate-100 text-slate-700 border-slate-300'
    statusText = '⚫ Fallecido'
  }

  // Combined metadata line
  const metaParts: string[] = []
  if (reporte.cedula) metaParts.push(reporte.cedula)
  if (reporte.edad) metaParts.push(`${reporte.edad} años`)
  if (reporte.genero) metaParts.push(reporte.genero)
  const metaLine = metaParts.join(' · ')

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      onClick={() => onClick?.(reporte)}
      className={`bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden transition-all duration-300 hover:border-slate-200 hover:shadow-md flex flex-col h-full cursor-pointer relative group ${
        esLocalizado ? 'border-safe/30 bg-green-50/5' : esFallecido ? 'border-slate-200 bg-slate-50/5' : ''
      }`}
    >
      {/* Quick edit button */}
      {onEdit && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onEdit(reporte)
          }}
          className="absolute top-3 right-3 z-10 p-2 bg-white/95 hover:bg-white text-slate-500 hover:text-blue-600 border border-slate-200 rounded-xl transition-all shadow-sm cursor-pointer"
          title="Editar reporte"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Photo */}
      <div className="relative h-52 bg-slate-100 w-full overflow-hidden shrink-0 flex items-center justify-center border-b border-slate-50">
        {reporte.foto_url ? (
          <img
            src={reporte.foto_url}
            alt={reporte.nombre || 'Persona reportada'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <User className="w-12 h-12 text-slate-400" />
        )}

        {/* Disappearance Type Overlay */}
        {reporte.desaparicion_tipo && (
          <span className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-black/60 text-white backdrop-blur-xs flex items-center gap-1 shadow-xs">
            {reporte.desaparicion_tipo === 'Con Familiar' ? (
              <>
                <Users className="w-3 h-3" />
                Con Familiar
              </>
            ) : (
              <>
                <User className="w-3 h-3" />
                Solo
              </>
            )}
          </span>
        )}
      </div>

      {/* Card Body */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          {/* Status Badge */}
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${badgeStyles}`}>
              {statusText}
            </span>
          </div>

          {/* Name */}
          <h4 className="font-extrabold text-slate-800 text-base mb-1.5 line-clamp-1 leading-snug">
            {reporte.nombre || 'Nombre no disponible'}
          </h4>

          {/* Cédula · Edad · Género */}
          {metaLine && (
            <p className="text-xs text-slate-500 font-bold mb-2 flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{metaLine}</span>
            </p>
          )}

          {/* Last seen */}
          {reporte.ultimo_lugar && (
            <div className="flex items-start gap-1.5 text-xs text-slate-600 font-medium mb-3">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span className="line-clamp-2">
                {reporte.ultimo_lugar}
                {reporte.estado_venezuela && (
                  <span className="text-slate-400 font-semibold"> · {reporte.estado_venezuela}</span>
                )}
              </span>
            </div>
          )}
        </div>

        {/* Card Footer */}
        <div className="pt-3 border-t border-slate-50 flex items-center justify-between mt-auto gap-2">
          {/* Date */}
          <div className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold shrink-0">
            <Clock className="w-3 h-3 text-slate-300" />
            {timeAgo}
          </div>

          {/* Action Button */}
          <div className="flex items-center gap-1.5 shrink-0">
            {!esLocalizado && !esFallecido && onMarcarLocalizado && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onMarcarLocalizado(reporte.id)
                }}
                className="flex items-center gap-1 px-2 py-1 text-[9px] font-extrabold bg-green-50 text-green-700 border border-green-200/40 rounded-lg hover:bg-green-100 transition-colors cursor-pointer"
                title="Marcar como localizado"
              >
                <Eye className="w-3 h-3" />
                Localizado
              </button>
            )}
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
