import { useState, useEffect, type FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Loader2, CheckCircle, MapPin } from 'lucide-react'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import L from 'leaflet'
import { ESTADOS_VENEZUELA } from '../data/venezuela-geo'
import type { RecursoEmergenciaInsert } from '../types/database'
import 'leaflet/dist/leaflet.css'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSubmit: (recurso: RecursoEmergenciaInsert) => Promise<unknown>
}

// Custom Leaflet icon for coordinates picker
const pickerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

// Map click & drag handler component
function MapEventsHandler({
  position,
  onChangePosition,
}: {
  position: [number, number]
  onChangePosition: (lat: number, lng: number) => void
}) {
  useMapEvents({
    click(e) {
      onChangePosition(e.latlng.lat, e.latlng.lng)
    },
  })

  return (
    <Marker
      position={position}
      icon={pickerIcon}
      draggable={true}
      eventHandlers={{
        dragend(e) {
          const marker = e.target
          if (marker) {
            const latLng = marker.getLatLng()
            onChangePosition(latLng.lat, latLng.lng)
          }
        },
      }}
    />
  )
}

// Controller to zoom/center map on selected state center
function MapViewController({ center }: { center: [number, number] }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, 9, { animate: true })
  }, [center, map])
  return null
}

export default function RecursoForm({ isOpen, onClose, onSubmit }: Props) {
  const [tipo, setTipo] = useState<'hospital' | 'acopio' | 'ambulatorio_improvisado'>('hospital')
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [contacto, setContacto] = useState('')
  const [direccion, setDireccion] = useState('')
  const [estadoVenezuela, setEstadoVenezuela] = useState('')
  const [municipio, setMunicipio] = useState('')
  
  // Geographical coordinates
  const [coords, setCoords] = useState<[number, number] | null>(null)
  
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

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

  // Reset coordinates and map view when state is changed
  useEffect(() => {
    if (estadoSeleccionado) {
      setCoords([estadoSeleccionado.lat, estadoSeleccionado.lng])
      setMunicipio('') // Reset municipio on state change
    } else {
      setCoords(null)
    }
  }, [estadoVenezuela])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!nombre || !estadoVenezuela || !municipio || !coords) return

    setSending(true)

    const recurso: RecursoEmergenciaInsert = {
      nombre,
      tipo,
      descripcion: descripcion || null,
      contacto: contacto || null,
      direccion: direccion || null,
      latitud: coords[0],
      longitud: coords[1],
      estado_venezuela: estadoVenezuela,
      municipio,
    }

    await onSubmit(recurso)
    setSending(false)
    setSent(true)

    // Reset Form
    setTimeout(() => {
      setNombre('')
      setTipo('hospital')
      setDescripcion('')
      setContacto('')
      setDireccion('')
      setEstadoVenezuela('')
      setMunicipio('')
      setCoords(null)
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
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-1 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-xl font-bold text-slate-800">
              Registrar Recurso o Punto de Ayuda
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Registra un punto de asistencia médica o acopio de ayuda.
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
                ¡Punto registrado exitosamente!
              </h4>
              <p className="text-slate-500 text-sm max-w-md">
                El recurso ya está visible en el mapa interactivo y en el directorio de ayuda.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 mt-4">
              {/* Tipo de recurso */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wider">
                  Tipo de Punto o Recurso
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'hospital', label: '🏥 Hospital', color: 'border-blue-500 text-blue-700 bg-blue-50/50' },
                    { value: 'acopio', label: '📦 C. de Acopio', color: 'border-green-500 text-green-700 bg-green-50/50' },
                    { value: 'ambulatorio_improvisado', label: '⚡ Ambulatorio', color: 'border-orange-500 text-orange-700 bg-orange-50/50' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setTipo(opt.value as any)}
                      className={`py-2 px-3 border rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
                        tipo === opt.value
                          ? `${opt.color} shadow-xs ring-2 ring-opacity-20 ring-current`
                          : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Nombre y Contacto */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Nombre del Sitio *
                  </label>
                  <input
                    type="text"
                    required
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej. Hospital Central o Escuela (Centro de Acopio)"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Teléfono de Contacto
                  </label>
                  <input
                    type="text"
                    value={contacto}
                    onChange={(e) => setContacto(e.target.value)}
                    placeholder="Ej. 0212-XXXXXXX"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm transition-all"
                  />
                </div>
              </div>

              {/* Ubicación Política (Estado y Municipio) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Estado *
                  </label>
                  <select
                    required
                    value={estadoVenezuela}
                    onChange={(e) => setEstadoVenezuela(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm transition-all bg-white"
                  >
                    <option value="">Selecciona un Estado</option>
                    {ESTADOS_VENEZUELA.map((e) => (
                      <option key={e.nombre} value={e.nombre}>
                        {e.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Municipio *
                  </label>
                  <select
                    required
                    disabled={!estadoVenezuela}
                    value={municipio}
                    onChange={(e) => setMunicipio(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm transition-all bg-white disabled:bg-slate-50 disabled:text-slate-400"
                  >
                    <option value="">Selecciona un Municipio</option>
                    {municipios.map((mun) => (
                      <option key={mun} value={mun}>
                        {mun}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dirección */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Dirección o Referencia
                </label>
                <input
                  type="text"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  placeholder="Ej. Frente a la plaza Bolívar, Av. Principal"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm transition-all"
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Descripción y Detalles del Punto
                </label>
                <textarea
                  rows={2}
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder={
                    tipo === 'acopio'
                      ? 'Ej. Se reciben cobijas, agua potable y enlatados de 8 AM a 6 PM.'
                      : tipo === 'hospital'
                      ? 'Ej. Cuenta con terapia intensiva, emergencias 24h y traumatología.'
                      : 'Ej. Primeros auxilios improvisados por médicos voluntarios locales.'
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm transition-all resize-none"
                />
              </div>

              {/* Georeferenciación con Mapa */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-500" />
                  Georreferenciación (Ubicación en el mapa) *
                </label>
                {coords ? (
                  <div className="space-y-2">
                    <p className="text-xs text-slate-500">
                      Haz clic en el mapa o arrastra el marcador azul para georreferenciar el sitio con precisión.
                    </p>
                    <div className="h-56 rounded-xl overflow-hidden border border-slate-200 shadow-sm relative z-0">
                      <MapContainer
                        center={coords}
                        zoom={9}
                        style={{ height: '100%', width: '100%' }}
                        scrollWheelZoom={false}
                      >
                        <TileLayer
                          attribution='&copy; OpenStreetMap contributors'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <MapViewController center={coords} />
                        <MapEventsHandler
                          position={coords}
                          onChangePosition={(lat, lng) => setCoords([lat, lng])}
                        />
                      </MapContainer>
                    </div>
                    <div className="flex gap-4 text-xs font-mono text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <div>Latitud: {coords[0].toFixed(6)}</div>
                      <div>Longitud: {coords[1].toFixed(6)}</div>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center border-2 border-dashed border-slate-200 bg-slate-50/50 rounded-xl text-slate-400 text-sm">
                    Selecciona un Estado primero para activar la georreferenciación en el mapa.
                  </div>
                )}
              </div>

              {/* Botón de envío */}
              <div className="pt-2 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors text-sm cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={sending || !nombre || !estadoVenezuela || !municipio || !coords}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 disabled:shadow-none transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
                >
                  {sending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Registrando...
                    </>
                  ) : (
                    'Registrar Punto de Ayuda'
                  )}
                </button>
              </div>
            </form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
