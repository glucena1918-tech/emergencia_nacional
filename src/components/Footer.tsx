import { Mail, AlertTriangle, Shield } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-100 px-4 py-12 mt-12">
      <div className="max-w-4xl mx-auto">
        {/* Warning */}
        <div className="bg-orange-50 border border-orange-100 p-5 rounded-2xl mb-8 shadow-xs">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-emergency shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-orange-950 font-bold mb-1">Aviso Importante</p>
              <p className="text-orange-900/80 text-xs font-medium leading-relaxed">
                Ante una emergencia médica, llama a los organismos de rescate.
                Verifica siempre la información antes de difundirla. Esta plataforma
                no sustituye a los servicios de emergencia oficiales.
              </p>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-8 text-sm">
          {/* Brand */}
          <div>
            <h4 className="font-bold text-slate-800 mb-3">Venezuela Vive</h4>
            <p className="text-slate-600 text-xs leading-relaxed font-medium">
              Iniciativa del Ministerio del Poder Popular para la Alimentación.
              Plataforma voluntaria. No solicita, gestiona ni recibe dinero ni
              donaciones de ningún tipo.
            </p>
          </div>

          {/* Security */}
          <div>
            <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-accent" />
              Seguridad
            </h4>
            <p className="text-slate-600 text-xs leading-relaxed font-medium">
              Arquitectura preparada para integración con Cloudflare (anti-DDoS,
              verificación anti-bots). Los reportes marcados como "Localizado"
              requieren verificación por moderadores.
            </p>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold text-slate-800 mb-3">Soporte</h4>
            <p className="text-slate-600 text-xs mb-3 font-medium">
              ¿Problemas con el sitio? Contáctanos:
            </p>
            <a
              href="mailto:despachodelapresidenciacuspal@gmail.com?subject=Reporte de problema - Venezuela Vive"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 text-blue-600 text-xs font-bold hover:bg-blue-100 border border-blue-100/50 transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              Reportar un problema
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200 text-center text-xs text-slate-500 font-medium">
          © {new Date().getFullYear()} Venezuela Vive — Plataforma de Emergencia Nacional
        </div>
      </div>
    </footer>

  )
}
