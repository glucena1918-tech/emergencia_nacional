import { motion } from 'framer-motion'
import { AlertTriangle, Phone, ShieldCheck, Heart, MapPin } from 'lucide-react'

interface Props {
  onOpenReportModal: () => void
  onOpenRecursoModal: () => void
  totalCount: number
  sinContactoCount: number
  localizadosCount: number
}

export default function HeroBanner({
  onOpenReportModal,
  onOpenRecursoModal,
  totalCount,
  sinContactoCount,
  localizadosCount,
}: Props) {
  return (
    <section className="relative overflow-hidden pt-20 pb-4 sm:pt-28 sm:pb-6 px-6">
      {/* Light Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-emergency/5 via-slate-50 to-slate-50" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emergency/5 rounded-full blur-3xl" />

      <div className="relative max-w-4xl mx-auto text-center">
        {/* Logo Ministerio — centered */}
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-8"
        >
          <img
            src="/logo-ministerio.png"
            alt="Ministerio del Poder Popular para la Alimentación — CUSPAL"
            className="h-14 sm:h-18 md:h-20 w-auto object-contain drop-shadow-sm"
          />
        </motion.div>

        {/* Eyebrow alert tag */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emergency/10 border border-emergency/20 text-emergency-dark text-xs sm:text-sm font-semibold mb-8 shadow-2xs"
        >
          <AlertTriangle className="w-4 h-4 emergency-pulse" />
          Emergencia Nacional — Sismo en Venezuela
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-6xl font-black text-slate-900 mb-8 leading-tight tracking-tight px-2"
        >
          Encuentra a tus seres queridos
        </motion.h2>

        {/* Lead/Description */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-slate-600 text-base sm:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-medium px-4"
        >
          Reporta o busca personas desaparecidas tras el sismo. Cada dato ayuda
          a que alguien reencuentre a su familia.
        </motion.p>

        {/* Primary Action Button (The heart of report actions) */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 px-4"
        >
          <button
            onClick={onOpenReportModal}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emergency to-rose-500 hover:from-emergency-dark hover:to-rose-600 text-white font-extrabold text-base rounded-2xl transition-all duration-300 hover:scale-105 cursor-pointer shadow-md hover:shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2.5 active:scale-98 pulse-action-btn"
          >
            <Heart className="w-4 h-4 text-white animate-pulse" fill="white" />
            Reportar a una persona
          </button>
          
          <button
            onClick={onOpenRecursoModal}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-700 hover:to-green-600 text-white font-extrabold text-base rounded-2xl transition-all duration-300 hover:scale-105 cursor-pointer shadow-md hover:shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2.5 active:scale-98"
          >
            <MapPin className="w-4 h-4 text-white" />
            Registrar Punto de Ayuda
          </button>

          <a
            href="#buscar"
            className="w-full sm:w-auto px-8 py-4 bg-slate-200/50 hover:bg-slate-200/80 text-slate-700 font-bold text-base rounded-2xl border border-slate-200/60 transition-all duration-200 text-center"
          >
            Buscar personas
          </a>
        </motion.div>


        {/* Prominent Statistics block (desahogado) */}
        <motion.div
          initial={{ y: 25, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto mb-16 px-4"
        >
          {/* Total card */}
          <div className="bg-white border border-slate-200/60 rounded-2xl p-6 text-center shadow-2xs hover:shadow-xs transition-shadow">
            <span className="text-4xl font-extrabold text-slate-800 block leading-none">
              {totalCount}
            </span>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-2 block">
              Personas reportadas
            </span>
          </div>

          {/* Sin contacto card */}
          <div className="bg-red-50/50 border border-red-100 rounded-2xl p-6 text-center shadow-2xs hover:shadow-xs transition-shadow">
            <span className="text-4xl font-extrabold text-red-600 block leading-none">
              {sinContactoCount}
            </span>
            <span className="text-[11px] font-bold text-red-500 uppercase tracking-widest mt-2 block">
              Aún sin contacto
            </span>
          </div>

          {/* Localizados card */}
          <div className="bg-green-50/50 border border-green-100 rounded-2xl p-6 text-center shadow-2xs hover:shadow-xs transition-shadow">
            <span className="text-4xl font-extrabold text-green-600 block leading-none">
              {localizadosCount}
            </span>
            <span className="text-[11px] font-bold text-green-500 uppercase tracking-widest mt-2 block">
              Localizados
            </span>
          </div>
        </motion.div>

        {/* Quick Emergency Shortcuts pastillas */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white/70 border border-slate-200/50 p-6 rounded-2xl max-w-2xl mx-auto shadow-2xs mb-16 px-4"
        >
          <span className="text-xs sm:text-sm font-bold text-slate-700 flex items-center justify-center gap-2 mb-4 uppercase tracking-wider">
            <Phone className="w-4 h-4 text-emergency" />
            Teléfonos de emergencia rápidos · Nacional
          </span>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="tel:171"
              className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-all flex items-center gap-2 shadow-3xs"
            >
              <span className="text-emergency font-black text-base">171</span>
              <span className="text-slate-500 font-semibold text-xs border-l border-slate-200 pl-2">CANTV</span>
            </a>
            <a
              href="tel:*1"
              className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-all flex items-center gap-2 shadow-3xs"
            >
              <span className="text-emergency font-black text-base">*1</span>
              <span className="text-slate-500 font-semibold text-xs border-l border-slate-200 pl-2">Movilnet</span>
            </a>
            <a
              href="tel:112"
              className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-all flex items-center gap-2 shadow-3xs"
            >
              <span className="text-emergency font-black text-base">112</span>
              <span className="text-slate-500 font-semibold text-xs border-l border-slate-200 pl-2">Digitel</span>
            </a>
            <a
              href="tel:911"
              className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-all flex items-center gap-2 shadow-3xs"
            >
              <span className="text-emergency font-black text-base">911</span>
              <span className="text-slate-500 font-semibold text-xs border-l border-slate-200 pl-2">Movistar</span>
            </a>
          </div>
        </motion.div>

        {/* Institutional notice */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="glass-card p-5 max-w-2xl mx-auto border-slate-200/50 bg-white/90 shadow-sm"
        >
          <div className="flex items-start gap-3.5 text-left text-xs sm:text-sm text-slate-600">
            <ShieldCheck className="w-5 h-5 text-accent shrink-0 mt-0.5" />
            <div>
              <p className="text-slate-800 font-bold mb-1">
                Iniciativa del Ministerio del Poder Popular para la Alimentación
              </p>
              <p className="text-slate-500 leading-relaxed font-medium">
                Esta plataforma es una iniciativa voluntaria. No solicita, gestiona
                ni recibe dinero ni donaciones de ningún tipo.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Emergency warning */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-500 font-medium px-4"
        >
          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>
            Ante una emergencia médica, llama a los organismos de rescate.
            Verifica siempre la información antes de difundirla.
          </span>
        </motion.div>
      </div>
    </section>
  )
}
