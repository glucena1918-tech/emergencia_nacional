import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, MapPin, Phone, User, Users, CreditCard, MessageSquare, Plus, Loader2 } from 'lucide-react'
import type { Reporte, ComentarioReporte } from '../types/database'

interface Props {
  reporte: Reporte | null
  isOpen: boolean
  onClose: () => void
  onCargarComentarios: (reporteId: string) => Promise<ComentarioReporte[]>
  onAgregarComentario: (reporteId: string, autor: string, contenido: string) => Promise<boolean>
  onActualizarEstado: (id: string, estado: 'sin_contacto' | 'localizado' | 'fallecido') => Promise<void>
}

export default function ReporteDetailModal({
  reporte,
  isOpen,
  onClose,
  onCargarComentarios,
  onAgregarComentario,
  onActualizarEstado,
}: Props) {
  const [comentarios, setComentarios] = useState<ComentarioReporte[]>([])
  const [loadingComentarios, setLoadingComentarios] = useState(false)
  const [showAddComment, setShowAddComment] = useState(false)
  const [autor, setAutor] = useState('')
  const [contenido, setContenido] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)
  const [updatingEstado, setUpdatingEstado] = useState(false)

  useEffect(() => {
    if (isOpen && reporte) {
      setLoadingComentarios(true)
      onCargarComentarios(reporte.id)
        .then((data) => setComentarios(data))
        .finally(() => setLoadingComentarios(false))
      
      // Reset comments form
      setShowAddComment(false)
      setAutor('')
      setContenido('')
    }
  }, [isOpen, reporte, onCargarComentarios])

  // Scroll lock when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // ESC key to close
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen || !reporte) return null

  const esLocalizado = reporte.estado_actual === 'localizado'
  const esFallecido = reporte.estado_actual === 'fallecido'

  let badgeStyles = 'bg-red-50 text-red-600 border-red-200'
  let statusLabel = 'Desaparecido'
  if (esLocalizado) {
    badgeStyles = 'bg-green-50 text-green-700 border-green-200'
    statusLabel = '✓ Localizado'
  } else if (esFallecido) {
    badgeStyles = 'bg-slate-100 text-slate-700 border-slate-300'
    statusLabel = '⚫ Fallecido'
  }

  async function handleAddComment(e: React.FormEvent) {
    e.preventDefault()
    if (!contenido.trim()) return
    setSubmittingComment(true)
    const success = await onAgregarComentario(reporte!.id, autor.trim() || 'Anónimo', contenido.trim())
    if (success) {
      const updated = await onCargarComentarios(reporte!.id)
      setComentarios(updated)
      setContenido('')
      setAutor('')
      setShowAddComment(false)
    }
    setSubmittingComment(false)
  }

  async function handleStatusChange(nuevoEstado: 'sin_contacto' | 'localizado' | 'fallecido') {
    setUpdatingEstado(true)
    await onActualizarEstado(reporte!.id, nuevoEstado)
    reporte!.estado_actual = nuevoEstado // Local state sync
    setUpdatingEstado(false)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors z-20 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Column 1: Image and Status */}
          <div className="flex flex-col gap-4">
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-slate-150 border border-slate-200 flex items-center justify-center">
              {reporte.foto_url ? (
                <img
                  src={reporte.foto_url}
                  alt={reporte.nombre || 'Persona reportada'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-24 h-24 text-slate-400" />
              )}
            </div>

            <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Estatus actual</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wider ${badgeStyles}`}>
                  {statusLabel}
                </span>
              </div>

              {/* Status Action Buttons */}
              <div className="flex flex-col gap-2 pt-2 border-t border-slate-200/50">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cambiar estatus de manera manual:</span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleStatusChange('sin_contacto')}
                    disabled={updatingEstado || reporte.estado_actual === 'sin_contacto'}
                    className={`py-2 px-1 border rounded-lg text-[10px] font-bold transition-all text-center cursor-pointer disabled:opacity-40 ${
                      reporte.estado_actual === 'sin_contacto'
                        ? 'border-red-500 text-red-700 bg-red-50'
                        : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50'
                    }`}
                  >
                    🔴 Desaparecido
                  </button>
                  <button
                    onClick={() => handleStatusChange('localizado')}
                    disabled={updatingEstado || reporte.estado_actual === 'localizado'}
                    className={`py-2 px-1 border rounded-lg text-[10px] font-bold transition-all text-center cursor-pointer disabled:opacity-40 ${
                      reporte.estado_actual === 'localizado'
                        ? 'border-green-500 text-green-700 bg-green-50'
                        : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50'
                    }`}
                  >
                    🟢 Localizado
                  </button>
                  <button
                    onClick={() => handleStatusChange('fallecido')}
                    disabled={updatingEstado || reporte.estado_actual === 'fallecido'}
                    className={`py-2 px-1 border rounded-lg text-[10px] font-bold transition-all text-center cursor-pointer disabled:opacity-40 ${
                      reporte.estado_actual === 'fallecido'
                        ? 'border-slate-500 text-slate-800 bg-slate-200'
                        : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50'
                    }`}
                  >
                    ⚫ Fallecido
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Data Details and Comments */}
          <div className="flex flex-col gap-6">
            {/* Header info */}
            <div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight leading-tight">
                {reporte.nombre || 'Nombre no disponible'}
              </h3>
              
              {/* Combine Details Tagline */}
              <div className="flex flex-wrap items-center gap-2 mt-2">
                {reporte.cedula && (
                  <span className="flex items-center gap-1 text-xs text-slate-600 font-bold bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-lg">
                    <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                    Cédula: {reporte.cedula}
                  </span>
                )}
                {reporte.edad && (
                  <span className="text-xs text-slate-600 font-bold bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-lg">
                    {reporte.edad} años
                  </span>
                )}
                {reporte.genero && (
                  <span className="text-xs text-slate-600 font-bold bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-lg">
                    {reporte.genero}
                  </span>
                )}
                {reporte.desaparicion_tipo && (
                  <span className="text-xs text-indigo-700 font-bold bg-indigo-50 border border-indigo-150 px-2 py-0.5 rounded-lg flex items-center gap-1">
                    {reporte.desaparicion_tipo === 'Con Familiar' ? <Users className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                    {reporte.desaparicion_tipo === 'Con Familiar' ? 'Desaparecido con Familiar' : 'Desaparecido Solo'}
                  </span>
                )}
              </div>
            </div>

            {/* Geographical details */}
            <div className="space-y-2.5">
              {reporte.ultimo_lugar && (
                <div className="flex items-start gap-2 text-sm text-slate-700">
                  <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-extrabold text-slate-800">Última ubicación: </span>
                    {reporte.ultimo_lugar}
                    {reporte.estado_venezuela && (
                      <span className="text-slate-500 font-semibold"> · {reporte.estado_venezuela} (Mpio. {reporte.municipio})</span>
                    )}
                  </div>
                </div>
              )}

              {reporte.desde_cuando && (
                <div className="flex items-start gap-2 text-sm text-slate-700">
                  <Calendar className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-extrabold text-slate-800">Fecha y Hora de Desaparición: </span>
                    {new Date(reporte.desde_cuando).toLocaleString('es-VE', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </div>
                </div>
              )}

              {reporte.contacto_reportante && (
                <div className="flex items-start gap-2 text-sm text-slate-700">
                  <Phone className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-extrabold text-slate-800">Contacto reportante: </span>
                    {reporte.contacto_reportante}
                  </div>
                </div>
              )}
            </div>

            {/* Physical description */}
            {reporte.descripcion_fisica && (
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Descripción y Señas Particulares</span>
                <p className="text-sm text-slate-600 font-medium leading-relaxed italic">
                  "{reporte.descripcion_fisica}"
                </p>
              </div>
            )}

            {/* Community comments section */}
            <div className="border-t border-slate-100 pt-5 flex flex-col flex-1">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-slate-500" />
                  Información de la comunidad
                </h4>
                
                {!showAddComment && (
                  <button
                    onClick={() => setShowAddComment(true)}
                    className="text-[10px] font-extrabold bg-blue-50 text-blue-600 border border-blue-200/50 hover:bg-blue-100 rounded-lg px-2 py-1 transition-all flex items-center gap-0.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Tengo información
                  </button>
                )}
              </div>

              {/* Add comment Form */}
              <AnimatePresence>
                {showAddComment && (
                  <motion.form
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    onSubmit={handleAddComment}
                    className="mb-4 bg-slate-50 border border-slate-200/70 p-3 rounded-xl flex flex-col gap-2 overflow-hidden"
                  >
                    <input
                      type="text"
                      placeholder="Tu nombre / alias (opcional)"
                      value={autor}
                      onChange={(e) => setAutor(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-accent/40"
                    />
                    <textarea
                      placeholder="Escribe la información que tengas sobre esta persona..."
                      required
                      rows={2}
                      value={contenido}
                      onChange={(e) => setContenido(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-medium placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-accent/40 resize-none"
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => setShowAddComment(false)}
                        className="px-2 py-1 rounded-lg border border-slate-200 text-[10px] font-bold text-slate-500 hover:bg-white cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={submittingComment}
                        className="px-3 py-1 rounded-lg bg-accent hover:bg-blue-600 text-white text-[10px] font-bold shadow-xs flex items-center gap-1 cursor-pointer"
                      >
                        {submittingComment && <Loader2 className="w-3 h-3 animate-spin" />}
                        Compartir
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Comments List */}
              <div className="flex-1 max-h-48 overflow-y-auto pr-1">
                {loadingComentarios ? (
                  <div className="flex items-center justify-center py-6 text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin text-slate-300" />
                  </div>
                ) : comentarios.length === 0 ? (
                  <p className="text-xs text-slate-400 font-medium italic text-center py-6 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                    Nadie ha compartido información todavía.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {comentarios.map((c) => (
                      <div key={c.id} className="bg-slate-50/80 border border-slate-100 p-3 rounded-xl text-xs">
                        <div className="flex justify-between items-center mb-1 text-[10px] text-slate-400 font-bold">
                          <span>{c.autor}</span>
                          <span>{new Date(c.created_at).toLocaleDateString('es-VE')}</span>
                        </div>
                        <p className="text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">
                          {c.contenido}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
