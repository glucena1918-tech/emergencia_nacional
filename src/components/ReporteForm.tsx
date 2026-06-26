import { useState, useRef, useEffect, type FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Loader2, CheckCircle, Camera } from 'lucide-react'
import { ESTADOS_VENEZUELA } from '../data/venezuela-geo'
import type { ReporteInsert } from '../types/database'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSubmit: (reporte: ReporteInsert) => Promise<unknown>
  onUploadPhoto: (file: File) => Promise<string | null>
}

export default function ReporteForm({ isOpen, onClose, onSubmit, onUploadPhoto }: Props) {
  const [nombre, setNombre] = useState('')
  const [edad, setEdad] = useState('')
  const [ultimoLugar, setUltimoLugar] = useState('')
  const [desdeCuando, setDesdeCuando] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [contacto, setContacto] = useState('')
  const [estadoVenezuela, setEstadoVenezuela] = useState('')
  const [municipio, setMunicipio] = useState('')
  const [foto, setFoto] = useState<File | null>(null)
  const [fotoPreview, setFotoPreview] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const estadoSeleccionado = ESTADOS_VENEZUELA.find(e => e.nombre === estadoVenezuela)
  const municipios = estadoSeleccionado?.municipios || []

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

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setFoto(file)
    const reader = new FileReader()
    reader.onload = () => setFotoPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  function removeFoto() {
    setFoto(null)
    setFotoPreview(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSending(true)

    let foto_url: string | null = null
    if (foto) {
      foto_url = await onUploadPhoto(foto)
    }

    // Get coordinates from the selected state
    const coords = estadoSeleccionado
      ? { latitud: estadoSeleccionado.lat, longitud: estadoSeleccionado.lng }
      : {}

    const reporte: ReporteInsert = {
      nombre: nombre || null,
      edad: edad ? parseInt(edad) : null,
      ultimo_lugar: ultimoLugar || null,
      estado_actual: 'sin_contacto',
      foto_url,
      descripcion_fisica: descripcion || null,
      desde_cuando: desdeCuando || null,
      contacto_reportante: contacto || null,
      estado_venezuela: estadoVenezuela || null,
      municipio: municipio || null,
      ...coords,
    }

    await onSubmit(reporte)
    setSending(false)
    setSent(true)

    // Reset
    setTimeout(() => {
      setNombre('')
      setEdad('')
      setUltimoLugar('')
      setDesdeCuando('')
      setDescripcion('')
      setContacto('')
      setEstadoVenezuela('')
      setMunicipio('')
      removeFoto()
      setSent(false)
      onClose()
    }, 2500)
  }

  if (!isOpen) return null

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
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-1 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-xl font-bold text-slate-800">
              Reportar a una persona
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Comparte lo que sepas. Todos los campos son opcionales.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div
              key="success"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="flex flex-col items-center py-12 text-center"
            >
              <CheckCircle className="w-16 h-16 text-safe mb-4" />
              <h4 className="text-xl font-bold text-slate-800 mb-2">
                ¡Reporte publicado!
              </h4>
              <p className="text-slate-500 text-sm">
                Tu reporte ya es visible en la lista y en el mapa. Gracias por ayudar.
              </p>
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-5 mt-4"
            >
              {/* Foto */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wider">
                  Foto de la persona
                </label>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleFileChange}
                />
                {fotoPreview ? (
                  <div className="relative w-full h-48 rounded-xl overflow-hidden shadow-sm border border-slate-200">
                    <img
                      src={fotoPreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeFoto}
                      className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full hover:bg-black/80 transition-colors"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="upload-zone w-full py-8 flex flex-col items-center gap-2 text-slate-500 hover:text-accent bg-slate-50/50"
                  >
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                      <Camera className="w-5 h-5 text-accent" />
                    </div>
                    <span className="text-sm font-medium">Cargar una foto</span>
                    <span className="text-xs text-slate-400">JPG o PNG · opcional pero muy útil</span>
                  </button>
                )}
              </div>

              {/* Nombre + Edad */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Nombre y apellido
                  </label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={e => setNombre(e.target.value)}
                    placeholder="Ej. María Fernanda Rangel"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Edad
                  </label>
                  <input
                    type="number"
                    value={edad}
                    onChange={e => setEdad(e.target.value)}
                    placeholder="Años"
                    min={0}
                    max={150}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all text-sm font-medium"
                  />
                </div>
              </div>

              {/* Estado + Municipio */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Estado
                  </label>
                  <select
                    value={estadoVenezuela}
                    onChange={e => { setEstadoVenezuela(e.target.value); setMunicipio('') }}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all text-sm font-medium appearance-none"
                  >
                    <option value="" className="bg-white text-slate-800">Seleccionar...</option>
                    {ESTADOS_VENEZUELA.map(e => (
                      <option key={e.nombre} value={e.nombre} className="bg-white text-slate-800">
                        {e.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Municipio
                  </label>
                  <select
                    value={municipio}
                    onChange={e => setMunicipio(e.target.value)}
                    disabled={!estadoVenezuela}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all text-sm font-medium disabled:opacity-40 appearance-none"
                  >
                    <option value="" className="bg-white text-slate-800">Seleccionar...</option>
                    {municipios.map(m => (
                      <option key={m} value={m} className="bg-white text-slate-800">{m}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Última ubicación + Desde cuándo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Última ubicación vista
                  </label>
                  <input
                    type="text"
                    value={ultimoLugar}
                    onChange={e => setUltimoLugar(e.target.value)}
                    placeholder="Ej. Catia La Mar, La Guaira"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Desde cuándo sin contacto
                  </label>
                  <input
                    type="datetime-local"
                    value={desdeCuando}
                    onChange={e => setDesdeCuando(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all text-sm font-medium"
                  />
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Descripción y señas particulares
                </label>
                <textarea
                  value={descripcion}
                  onChange={e => setDescripcion(e.target.value)}
                  placeholder="Estatura, contextura, ropa que vestía, cicatrices, lentes, condición médica..."
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all text-sm resize-y font-medium"
                />
              </div>

              {/* Contacto del reportante */}
              <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                  ¿Cómo te contactan si alguien la reconoce?
                </label>
                <input
                  type="text"
                  value={contacto}
                  onChange={e => setContacto(e.target.value)}
                  placeholder="Tu nombre y un teléfono o correo"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all text-sm font-medium"
                />
              </div>

              {/* Botones */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setNombre(''); setEdad(''); setUltimoLugar('')
                    setDesdeCuando(''); setDescripcion(''); setContacto('')
                    setEstadoVenezuela(''); setMunicipio(''); removeFoto()
                    onClose()
                  }}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium transition-all text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={sending}
                  className="flex-1 py-2.5 rounded-xl bg-accent hover:bg-blue-600 text-white font-semibold transition-all hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2 text-sm shadow-md shadow-blue-500/10"
                >
                  {sending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : null}
                  {sending ? 'Publicando...' : 'Publicar reporte →'}
                </button>
              </div>
            </form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
