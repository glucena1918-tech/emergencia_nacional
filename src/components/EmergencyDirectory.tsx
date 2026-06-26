import { motion } from 'framer-motion'
import { Phone, Ambulance, Siren, Loader2 } from 'lucide-react'
import { useEmergencias } from '../hooks/useEmergencias'

const iconMap: Record<string, React.ReactNode> = {
  general: <Siren className="w-5 h-5 text-emergency" />,
  ambulancia: <Ambulance className="w-5 h-5 text-danger" />,
  policia: <Siren className="w-5 h-5 text-accent" />,
  bomberos: <Siren className="w-5 h-5 text-yellow-500" />,
}

export default function EmergencyDirectory() {
  const { emergencias, loading } = useEmergencias()

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-slate-500" />
      </div>
    )
  }

  // Group by state
  const grouped = emergencias.reduce((acc, em) => {
    if (!acc[em.estado]) acc[em.estado] = []
    acc[em.estado].push(em)
    return acc
  }, {} as Record<string, typeof emergencias>)

  return (
    <section id="emergencias" className="px-4 pt-8 pb-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Phone className="w-5 h-5 text-emergency" />
            <h3 className="text-xl font-bold text-slate-800">
              Directorio de Emergencias
            </h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {Object.entries(grouped).map(([estado, items]) => (
              <div key={estado} className="bg-white border border-slate-100 shadow-sm p-5 rounded-2xl">
                <h4 className="text-xs font-bold text-emergency uppercase tracking-wider mb-3">
                  {estado}
                </h4>
                <div className="space-y-4">
                  {items.map(em => (
                    <div key={em.id} className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {iconMap[em.categoria] || iconMap.general}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800 leading-tight">
                          {em.nombre}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-1.5">
                          {em.telefonos.map(tel => (
                            <a
                              key={tel}
                              href={`tel:${tel.replace(/[.\-\s]/g, '')}`}
                              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-600 text-xs font-bold font-mono hover:bg-blue-100 transition-colors border border-blue-100/50"
                            >
                              <Phone className="w-2.5 h-2.5" />
                              {tel}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
