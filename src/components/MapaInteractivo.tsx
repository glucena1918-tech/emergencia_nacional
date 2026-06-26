import { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMap } from 'react-leaflet'
import L from 'leaflet'
import { motion } from 'framer-motion'
import { Map as MapIcon, ChevronDown, X, Layers, Filter } from 'lucide-react'
import { VENEZUELA_CENTER, VENEZUELA_ZOOM, ESTADOS_VENEZUELA } from '../data/venezuela-geo'
import type { Reporte, RecursoEmergencia } from '../types/database'
import 'leaflet/dist/leaflet.css'

// ── Marker icons ──────────────────────────────────────────────────────
const iconSinContacto = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const iconLocalizado = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const iconHospital = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const iconAcopio = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const iconAmbulatorio = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

// ── Color palette for states ──────────────────────────────────────────
const STATE_COLORS = [
  '#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6',
  '#06b6d4', '#ec4899', '#14b8a6', '#f97316', '#6366f1',
  '#84cc16', '#e11d48', '#0ea5e9', '#a855f7', '#10b981',
  '#f43f5e', '#0891b2', '#d946ef', '#eab308', '#7c3aed',
  '#059669', '#dc2626', '#2563eb', '#c026d3', '#ca8a04',
]

// ── Types for GeoJSON data ────────────────────────────────────────────
type GeoJSONData = GeoJSON.FeatureCollection

// ── Helper: Map controller for programmatic view changes ──────────────
function MapController({
  selectedEstado,
  adm1Data,
}: {
  selectedEstado: string | null
  adm1Data: GeoJSONData | null
}) {
  const map = useMap()

  useEffect(() => {
    if (!selectedEstado || !adm1Data) {
      map.setView(VENEZUELA_CENTER, VENEZUELA_ZOOM, { animate: true })
      return
    }

    const feature = adm1Data.features.find(
      (f) => f.properties?.shapeName === selectedEstado
    )
    if (feature) {
      const layer = L.geoJSON(feature as GeoJSON.Feature)
      const bounds = layer.getBounds()
      map.fitBounds(bounds, { padding: [40, 40], animate: true, maxZoom: 10 })
    }
  }, [selectedEstado, adm1Data, map])

  return null
}

// ── Main component ────────────────────────────────────────────────────
interface Props {
  reportes: Reporte[]
  recursos?: RecursoEmergencia[]
}

export default function MapaInteractivo({ reportes, recursos = [] }: Props) {
  const [adm1Data, setAdm1Data] = useState<GeoJSONData | null>(null)
  const [adm2Data, setAdm2Data] = useState<GeoJSONData | null>(null)
  const [selectedEstado, setSelectedEstado] = useState<string | null>(null)
  const [showMunicipios, setShowMunicipios] = useState(true)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Layer filter toggles
  const [showReportes, setShowReportes] = useState(true)
  const [showHospitales, setShowHospitales] = useState(true)
  const [showAcopios, setShowAcopios] = useState(true)
  const [showAmbulatorios, setShowAmbulatorios] = useState(true)

  // GeoJSON key to force re-render when data/selection changes
  const [geoKey, setGeoKey] = useState(0)

  // Load GeoJSON files
  useEffect(() => {
    fetch('/geo/ven-adm1.geojson')
      .then((r) => r.json())
      .then((data) => setAdm1Data(data))
      .catch(console.error)

    fetch('/geo/ven-adm2.geojson')
      .then((r) => r.json())
      .then((data) => setAdm2Data(data))
      .catch(console.error)
  }, [])

  // Force GeoJSON re-render when selection changes
  useEffect(() => {
    setGeoKey((k) => k + 1)
  }, [selectedEstado, showMunicipios])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Get sorted state names from GeoJSON
  const estadoNames = useMemo(() => {
    if (!adm1Data) return ESTADOS_VENEZUELA.map((e) => e.nombre).sort()
    return adm1Data.features
      .map((f) => f.properties?.shapeName as string)
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b, 'es'))
  }, [adm1Data])

  // Filter reportes by selected estado
  const reportesFiltrados = useMemo(() => {
    const conCoordenadas = reportes.filter((r) => r.latitud && r.longitud)
    if (!selectedEstado) return conCoordenadas
    return conCoordenadas.filter((r) => r.estado_venezuela === selectedEstado)
  }, [reportes, selectedEstado])

  // Filter recursos by selected estado
  const recursosFiltrados = useMemo(() => {
    const list = recursos.filter((r) => r.latitud && r.longitud)
    if (!selectedEstado) return list
    return list.filter((r) => r.estado_venezuela === selectedEstado)
  }, [recursos, selectedEstado])

  // Count per-state for badge
  const conteosPorEstado = useMemo(() => {
    const counts: Record<string, number> = {}
    reportes.forEach((r) => {
      if (r.estado_venezuela) {
        counts[r.estado_venezuela] = (counts[r.estado_venezuela] || 0) + 1
      }
    })
    return counts
  }, [reportes])

  // Helper to render emergency resource popup
  const renderPopupRecurso = useCallback((rec: RecursoEmergencia) => {
    const typeLabel =
      rec.tipo === 'hospital'
        ? '🏥 Hospital'
        : rec.tipo === 'acopio'
        ? '📦 Centro de Acopio'
        : '⚡ Ambulatorio Improvisado'

    const badgeColor =
      rec.tipo === 'hospital'
        ? 'bg-blue-50 text-blue-700 border-blue-200/50'
        : rec.tipo === 'acopio'
        ? 'bg-green-50 text-green-700 border-green-200/50'
        : 'bg-orange-50 text-orange-700 border-orange-200/50'

    return (
      <div className="text-sm min-w-[220px] p-0.5">
        <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider mb-2 ${badgeColor}`}>
          {typeLabel}
        </span>
        <p className="font-extrabold text-slate-800 text-sm leading-snug">
          {rec.nombre}
        </p>
        {rec.contacto && (
          <p className="text-slate-600 text-xs mt-1.5 font-semibold flex items-center gap-1">
            📞 {rec.contacto}
          </p>
        )}
        {rec.direccion && (
          <p className="text-slate-500 text-xs mt-1 font-medium leading-relaxed">
            📍 <span className="font-semibold text-slate-600">Dirección:</span> {rec.direccion}
          </p>
        )}
        {rec.descripcion && (
          <div className="mt-2 text-xs text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100 italic">
            {rec.descripcion}
          </div>
        )}
        <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-400 font-semibold border-t border-slate-100 pt-2">
          <span>{rec.estado_venezuela} · {rec.municipio}</span>
          {rec.verificado ? (
            <span className="text-emerald-600 font-bold">✓ Verificado</span>
          ) : (
            <span className="text-amber-600 font-bold">Pendiente</span>
          )}
        </div>
      </div>
    )
  }, [])

  // Filtered municipalities for selected state
  const municipiosFiltrados = useMemo(() => {
    if (!adm2Data || !selectedEstado) return null
    return {
      ...adm2Data,
      features: adm2Data.features.filter(
        (f) => f.properties?.parentState === selectedEstado
      ),
    } as GeoJSONData
  }, [adm2Data, selectedEstado])

  // ── Style functions ────────────────────────────────────────────────
  const styleEstado = useCallback(
    (feature?: GeoJSON.Feature) => {
      if (!feature) return {}
      const name = feature.properties?.shapeName
      const isSelected = name === selectedEstado
      const colorIndex = estadoNames.indexOf(name) % STATE_COLORS.length
      const baseColor = STATE_COLORS[colorIndex >= 0 ? colorIndex : 0]

      if (isSelected) {
        return {
          fillColor: baseColor,
          fillOpacity: 0.35,
          color: baseColor,
          weight: 3,
          dashArray: '',
        }
      }

      return {
        fillColor: baseColor,
        fillOpacity: 0.08,
        color: '#94a3b8',
        weight: 1,
        dashArray: '3',
      }
    },
    [selectedEstado, estadoNames]
  )

  const styleMunicipio = useCallback((_feature?: GeoJSON.Feature) => {
    return {
      fillColor: '#3b82f6',
      fillOpacity: 0.12,
      color: '#3b82f6',
      weight: 1.5,
      dashArray: '4 4',
    }
  }, [])

  // ── GeoJSON event handlers ─────────────────────────────────────────
  const onEachEstado = useCallback(
    (feature: GeoJSON.Feature, layer: L.Layer) => {
      const name = feature.properties?.shapeName || 'Desconocido'
      const count = conteosPorEstado[name] || 0

      layer.bindTooltip(
        `<div style="font-weight:700;font-size:13px;">${name}</div>
         <div style="font-size:11px;color:#64748b;">${count} reporte${count !== 1 ? 's' : ''}</div>`,
        {
          sticky: true,
          direction: 'top',
          className: 'estado-tooltip',
        }
      )

      const pathLayer = layer as L.Path
      layer.on({
        mouseover: () => {
          if (feature.properties?.shapeName !== selectedEstado) {
            pathLayer.setStyle({
              fillOpacity: 0.25,
              weight: 2,
              color: '#475569',
            })
          }
        },
        mouseout: () => {
          if (feature.properties?.shapeName !== selectedEstado) {
            pathLayer.setStyle(styleEstado(feature))
          }
        },
        click: () => {
          const clickedName = feature.properties?.shapeName
          setSelectedEstado((prev) =>
            prev === clickedName ? null : clickedName
          )
        },
      })
    },
    [conteosPorEstado, selectedEstado, styleEstado]
  )

  const onEachMunicipio = useCallback(
    (feature: GeoJSON.Feature, layer: L.Layer) => {
      const name = feature.properties?.shapeName || 'Desconocido'
      layer.bindTooltip(
        `<div style="font-weight:600;font-size:12px;">${name}</div>
         <div style="font-size:10px;color:#94a3b8;">Municipio</div>`,
        {
          sticky: true,
          direction: 'top',
          className: 'municipio-tooltip',
        }
      )
    },
    []
  )

  const handleSelectEstado = (name: string | null) => {
    setSelectedEstado(name)
    setDropdownOpen(false)
  }

  return (
    <section id="mapa" className="px-4 pt-16 pb-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
        >
          {/* ── Header ─────────────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <MapIcon className="w-5 h-5 text-emergency" />
              <h3 className="text-xl font-bold text-slate-800">
                Mapa de reportes
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-200/60 text-xs text-slate-600 font-bold">
                {reportesFiltrados.length} ubicaciones
              </span>
            </div>

            {/* Layer toggle */}
            <button
              onClick={() => setShowMunicipios((v) => !v)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                showMunicipios
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-slate-50 text-slate-500 border-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Municipios
            </button>
          </div>

          {/* ── State Filter ───────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            {/* Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer border shadow-xs min-w-[220px] justify-between ${
                  selectedEstado
                    ? 'bg-white text-slate-800 border-blue-300 ring-2 ring-blue-100'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <span>{selectedEstado || 'Filtrar por Estado'}</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    dropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute left-0 top-full mt-1 w-72 max-h-80 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-lg z-[1000] py-1">
                  {/* Clear option */}
                  <button
                    onClick={() => handleSelectEstado(null)}
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-500 hover:bg-slate-50 font-medium cursor-pointer transition-colors"
                  >
                    🗺️ Todos los estados
                  </button>
                  <div className="h-px bg-slate-100 mx-2" />

                  {estadoNames.map((name) => {
                    const count = conteosPorEstado[name] || 0
                    const isActive = name === selectedEstado
                    return (
                      <button
                        key={name}
                        onClick={() => handleSelectEstado(name)}
                        className={`w-full text-left px-4 py-2.5 text-sm font-medium cursor-pointer transition-colors flex items-center justify-between ${
                          isActive
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{name}</span>
                        {count > 0 && (
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              isActive
                                ? 'bg-blue-200/60 text-blue-800'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {count}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Active state tag */}
            {selectedEstado && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-xl text-sm"
              >
                <span className="text-blue-800 font-semibold">
                  📍 {selectedEstado}
                </span>
                <span className="text-blue-500 text-xs font-medium">
                  {conteosPorEstado[selectedEstado] || 0} reportes
                </span>
                <button
                  onClick={() => setSelectedEstado(null)}
                  className="ml-1 p-0.5 rounded-full hover:bg-blue-100 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5 text-blue-400" />
                </button>
              </motion.div>
            )}
          </div>

          {/* ── Legend & Interactive Layer Toggles ─────────────────── */}
          <div className="flex flex-wrap gap-3 mb-5 text-xs font-bold">
            {/* Personas Reportadas */}
            <button
              type="button"
              onClick={() => setShowReportes(!showReportes)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                showReportes
                  ? 'bg-red-50 text-red-700 border-red-200 shadow-2xs'
                  : 'bg-white text-slate-400 border-slate-200/60 hover:bg-slate-50'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-red-500" />
              Personas ({reportesFiltrados.length})
            </button>

            {/* Hospitales */}
            <button
              type="button"
              onClick={() => setShowHospitales(!showHospitales)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                showHospitales
                  ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-2xs'
                  : 'bg-white text-slate-400 border-slate-200/60 hover:bg-slate-50'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              Hospitales ({recursosFiltrados.filter(r => r.tipo === 'hospital').length})
            </button>

            {/* Centros de Acopio */}
            <button
              type="button"
              onClick={() => setShowAcopios(!showAcopios)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                showAcopios
                  ? 'bg-green-50 text-green-700 border-green-200 shadow-2xs'
                  : 'bg-white text-slate-400 border-slate-200/60 hover:bg-slate-50'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-green-500" />
              Centros de Acopio ({recursosFiltrados.filter(r => r.tipo === 'acopio').length})
            </button>

            {/* Ambulatorios Improvisados */}
            <button
              type="button"
              onClick={() => setShowAmbulatorios(!showAmbulatorios)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                showAmbulatorios
                  ? 'bg-orange-50 text-orange-700 border-orange-200 shadow-2xs'
                  : 'bg-white text-slate-400 border-slate-200/60 hover:bg-slate-50'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-orange-500" />
              Ambulatorios ({recursosFiltrados.filter(r => r.tipo === 'ambulatorio_improvisado').length})
            </button>

            <div className="h-5 w-px bg-slate-200 self-center hidden sm:block mx-1" />

            {/* Boundaries legend */}
            <div className="flex items-center gap-1.5 text-slate-500 px-2 self-center">
              <span className="w-3.5 h-0.5 bg-slate-400" />
              <span>Límites</span>
            </div>
            
            {selectedEstado && showMunicipios && (
              <div className="flex items-center gap-1.5 text-blue-500 px-2 self-center">
                <span className="w-3.5 h-0.5 border-t border-dashed border-blue-400" />
                <span>Municipios</span>
              </div>
            )}
          </div>

          {/* ── Map Container ──────────────────────────────────────── */}
          <div
            className="glass-card overflow-hidden"
            style={{ height: '550px' }}
          >
            <MapContainer
              center={VENEZUELA_CENTER}
              zoom={VENEZUELA_ZOOM}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> · <a href="https://www.geoboundaries.org">geoBoundaries</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Map view controller */}
              <MapController
                selectedEstado={selectedEstado}
                adm1Data={adm1Data}
              />

              {/* ADM1 - State boundaries */}
              {adm1Data && (
                <GeoJSON
                  key={`adm1-${geoKey}`}
                  data={adm1Data}
                  style={styleEstado}
                  onEachFeature={onEachEstado}
                />
              )}

              {/* ADM2 - Municipality boundaries (only when state selected) */}
              {showMunicipios &&
                selectedEstado &&
                municipiosFiltrados &&
                municipiosFiltrados.features.length > 0 && (
                  <GeoJSON
                    key={`adm2-${geoKey}`}
                    data={municipiosFiltrados}
                    style={styleMunicipio}
                    onEachFeature={onEachMunicipio}
                  />
                )}

              {/* Report markers */}
              {showReportes && reportesFiltrados.map((reporte) => (
                <Marker
                  key={reporte.id}
                  position={[reporte.latitud!, reporte.longitud!]}
                  icon={
                    reporte.estado_actual === 'localizado'
                      ? iconLocalizado
                      : iconSinContacto
                  }
                >
                  <Popup>
                    <div className="text-sm min-w-[200px] p-0.5">
                      <p className="font-bold text-slate-800">
                        {reporte.nombre || 'Sin nombre'}
                      </p>
                      {reporte.edad && (
                        <p className="text-slate-500 text-xs font-semibold">
                          {reporte.edad} años
                        </p>
                      )}
                      {reporte.ultimo_lugar && (
                        <p className="text-slate-500 text-xs mt-1 font-medium">
                          📍 {reporte.ultimo_lugar}
                        </p>
                      )}
                      {reporte.estado_venezuela && (
                        <p className="text-slate-400 text-xs font-medium">
                          {reporte.estado_venezuela}
                          {reporte.municipio
                            ? ` · ${reporte.municipio}`
                            : ''}
                        </p>
                      )}
                      <span
                        className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                          reporte.estado_actual === 'localizado'
                            ? 'bg-green-50 text-green-700 border-green-200/50'
                            : 'bg-red-50 text-red-600 border-red-200/50'
                        }`}
                      >
                        {reporte.estado_actual === 'localizado'
                          ? '✓ Localizado'
                          : 'Sin contacto'}
                      </span>
                    </div>
                  </Popup>
                </Marker>
              ))}

              {/* Hospital markers */}
              {showHospitales &&
                recursosFiltrados
                  .filter((r) => r.tipo === 'hospital')
                  .map((rec) => (
                    <Marker
                      key={rec.id}
                      position={[rec.latitud, rec.longitud]}
                      icon={iconHospital}
                    >
                      <Popup>{renderPopupRecurso(rec)}</Popup>
                    </Marker>
                  ))}

              {/* Acopio markers */}
              {showAcopios &&
                recursosFiltrados
                  .filter((r) => r.tipo === 'acopio')
                  .map((rec) => (
                    <Marker
                      key={rec.id}
                      position={[rec.latitud, rec.longitud]}
                      icon={iconAcopio}
                    >
                      <Popup>{renderPopupRecurso(rec)}</Popup>
                    </Marker>
                  ))}

              {/* Ambulatorio markers */}
              {showAmbulatorios &&
                recursosFiltrados
                  .filter((r) => r.tipo === 'ambulatorio_improvisado')
                  .map((rec) => (
                    <Marker
                      key={rec.id}
                      position={[rec.latitud, rec.longitud]}
                      icon={iconAmbulatorio}
                    >
                      <Popup>{renderPopupRecurso(rec)}</Popup>
                    </Marker>
                  ))}
            </MapContainer>
          </div>

          {/* Attribution */}
          <p className="text-[10px] text-slate-400 mt-2 text-right font-medium">
            Límites: geoBoundaries (CC BY 3.0 IGO) · Fuente: OCHA Venezuela, INE
          </p>
        </motion.div>
      </div>
    </section>
  )
}
