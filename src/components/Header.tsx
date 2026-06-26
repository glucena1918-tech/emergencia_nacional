import { motion } from 'framer-motion'
import { Heart, Shield } from 'lucide-react'

interface Props {
  onOpenReportModal: () => void
}

export default function Header({ onOpenReportModal }: Props) {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 glass-card border-b border-slate-200/50 shadow-sm"
    >
      {/* Tricolor flag bars representing Venezuela */}
      <div className="flex flex-col w-full">
        <div className="flag-bar-yellow" />
        <div className="flag-bar-blue" />
        <div className="flag-bar-red" />
      </div>

      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emergency to-rose-500 flex items-center justify-center shadow-md shadow-orange-500/20">
            <Heart className="w-5 h-5 text-white" fill="white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800 leading-tight">
              Venezuela Vive
            </h1>
            <p className="text-[10px] text-slate-500 leading-tight font-medium">
              Plataforma de Emergencia Nacional
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-600 font-medium">
          <Shield className="w-3.5 h-3.5 text-safe" />
          <span>Iniciativa voluntaria · No solicita dinero</span>
        </div>

        <button
          onClick={onOpenReportModal}
          className="px-4 py-2 bg-emergency hover:bg-emergency-dark text-white text-sm font-semibold rounded-xl transition-all duration-200 hover:scale-105 cursor-pointer shadow-sm shadow-orange-500/10"
        >
          Reportar persona
        </button>
      </div>
    </motion.header>
  )
}

