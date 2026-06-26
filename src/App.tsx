import { useState } from 'react'
import Header from './components/Header'
import HeroBanner from './components/HeroBanner'
import ReporteForm from './components/ReporteForm'
import ReportesList from './components/ReportesList'
import MapaInteractivo from './components/MapaInteractivo'
import EmergencyDirectory from './components/EmergencyDirectory'
import Footer from './components/Footer'
import { useReportes } from './hooks/useReportes'
import { Heart } from 'lucide-react'
import { AnimatePresence } from 'framer-motion'

export default function App() {
  const {
    reportes,
    loading,
    crearReporte,
    actualizarEstado,
    subirFoto,
  } = useReportes()

  const [isReportModalOpen, setIsReportModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-orange-100 selection:text-orange-900">
      <Header onOpenReportModal={() => setIsReportModalOpen(true)} />

      <main className="pb-32">
        <HeroBanner
          onOpenReportModal={() => setIsReportModalOpen(true)}
          totalCount={reportes.length}
          sinContactoCount={reportes.filter(r => r.estado_actual === 'sin_contacto').length}
          localizadosCount={reportes.filter(r => r.estado_actual === 'localizado').length}
        />

        <AnimatePresence>
          {isReportModalOpen && (
            <ReporteForm
              isOpen={isReportModalOpen}
              onClose={() => setIsReportModalOpen(false)}
              onSubmit={crearReporte}
              onUploadPhoto={subirFoto}
            />
          )}
        </AnimatePresence>

        <ReportesList
          reportes={reportes}
          loading={loading}
          onMarcarLocalizado={(id) => actualizarEstado(id, 'localizado')}
        />

        <MapaInteractivo reportes={reportes} />

        <EmergencyDirectory />
      </main>


      <Footer />

      {/* Floating Action Button (FAB) - Heart of the application */}
      {!isReportModalOpen && (
        <button
          onClick={() => setIsReportModalOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-emergency to-rose-500 hover:from-emergency-dark hover:to-rose-600 text-white p-4 rounded-full shadow-2xl flex items-center gap-2.5 font-bold transition-all duration-300 hover:scale-110 active:scale-95 group pulse-action-btn"
          title="Reportar persona desaparecida"
        >
          <Heart className="w-6 h-6 animate-pulse group-hover:scale-110 transition-transform" fill="white" />
          <span className="hidden md:inline pr-1 text-sm tracking-wide">Reportar Persona</span>
        </button>
      )}
    </div>
  )
}

