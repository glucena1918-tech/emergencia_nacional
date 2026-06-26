import { useState } from 'react'
import Header from './components/Header'
import HeroBanner from './components/HeroBanner'
import ReporteForm from './components/ReporteForm'
import RecursoForm from './components/RecursoForm'
import ReportesList from './components/ReportesList'
import MapaInteractivo from './components/MapaInteractivo'
import EmergencyDirectory from './components/EmergencyDirectory'
import Footer from './components/Footer'
import { useReportes } from './hooks/useReportes'
import { useRecursos } from './hooks/useRecursos'
import { Heart } from 'lucide-react'
import { AnimatePresence } from 'framer-motion'
import type { Reporte } from './types/database'

export default function App() {
  const {
    reportes,
    loading: loadingReportes,
    crearReporte,
    actualizarEstado,
    actualizarReporte,
    subirFoto,
  } = useReportes()

  const {
    recursos,
    crearRecurso,
  } = useRecursos()

  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [isRecursoModalOpen, setIsRecursoModalOpen] = useState(false)
  const [reporteAEditar, setReporteAEditar] = useState<Reporte | null>(null)

  const handleCloseReportModal = () => {
    setIsReportModalOpen(false)
    setReporteAEditar(null)
  }

  const handleReportSubmit = async (data: any) => {
    if (reporteAEditar) {
      await actualizarReporte(reporteAEditar.id, data)
    } else {
      await crearReporte(data)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-orange-100 selection:text-orange-900">
      <Header onOpenReportModal={() => setIsReportModalOpen(true)} />

      <main className="pb-32">
        <HeroBanner
          onOpenReportModal={() => setIsReportModalOpen(true)}
          onOpenRecursoModal={() => setIsRecursoModalOpen(true)}
          totalCount={reportes.length}
          sinContactoCount={reportes.filter(r => r.estado_actual === 'sin_contacto').length}
          localizadosCount={reportes.filter(r => r.estado_actual === 'localizado').length}
        />

        <AnimatePresence>
          {isReportModalOpen && (
            <ReporteForm
              isOpen={isReportModalOpen}
              onClose={handleCloseReportModal}
              onSubmit={handleReportSubmit}
              onUploadPhoto={subirFoto}
              reporteAEditar={reporteAEditar}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isRecursoModalOpen && (
            <RecursoForm
              isOpen={isRecursoModalOpen}
              onClose={() => setIsRecursoModalOpen(false)}
              onSubmit={crearRecurso}
            />
          )}
        </AnimatePresence>

        <ReportesList
          reportes={reportes}
          recursos={recursos}
          loading={loadingReportes}
          onMarcarLocalizado={(id) => actualizarEstado(id, 'localizado')}
          onEditPersona={(rep) => {
            setReporteAEditar(rep)
            setIsReportModalOpen(true)
          }}
        />

        <MapaInteractivo reportes={reportes} recursos={recursos} />


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

