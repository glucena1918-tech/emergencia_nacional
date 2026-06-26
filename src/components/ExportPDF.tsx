import { useState } from 'react'
import { FileDown, Loader2 } from 'lucide-react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { Reporte } from '../types/database'

interface Props {
  reportes: Reporte[]
}

export default function ExportPDF({ reportes }: Props) {
  const [exporting, setExporting] = useState(false)

  async function handleExport() {
    if (reportes.length === 0) return
    setExporting(true)

    try {
      const doc = new jsPDF({ orientation: 'landscape' })

      // Header
      doc.setFontSize(18)
      doc.setTextColor(249, 115, 22)
      doc.text('Venezuela Vive — Reporte de Personas', 14, 20)

      doc.setFontSize(10)
      doc.setTextColor(100)
      doc.text(`Generado: ${new Date().toLocaleString('es-VE')}`, 14, 28)
      doc.text(`Total: ${reportes.length} reportes`, 14, 34)

      const sinContacto = reportes.filter(r => r.estado_actual === 'sin_contacto').length
      const localizados = reportes.filter(r => r.estado_actual === 'localizado').length
      doc.text(`Sin contacto: ${sinContacto} | Localizados: ${localizados}`, 14, 40)

      // Table
      autoTable(doc, {
        startY: 48,
        head: [[
          'Nombre',
          'Edad',
          'Último lugar',
          'Estado',
          'Municipio',
          'Estado actual',
          'Descripción',
          'Contacto',
          'Fecha reporte',
        ]],
        body: reportes.map(r => [
          r.nombre || '-',
          r.edad?.toString() || '-',
          r.ultimo_lugar || '-',
          r.estado_venezuela || '-',
          r.municipio || '-',
          r.estado_actual === 'localizado' ? 'LOCALIZADO' : 'SIN CONTACTO',
          r.descripcion_fisica || '-',
          r.contacto_reportante || '-',
          new Date(r.created_at).toLocaleDateString('es-VE'),
        ]),
        styles: { fontSize: 7, cellPadding: 2 },
        headStyles: { fillColor: [249, 115, 22], textColor: 255, fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [245, 245, 245] },
      })

      // Footer on every page
      const pageCount = doc.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(8)
        doc.setTextColor(150)
        doc.text(
          'Venezuela Vive — Plataforma de Emergencia Nacional | Iniciativa voluntaria — No solicita dinero',
          14,
          doc.internal.pageSize.getHeight() - 10,
        )
        doc.text(
          `Página ${i} de ${pageCount}`,
          doc.internal.pageSize.getWidth() - 40,
          doc.internal.pageSize.getHeight() - 10,
        )
      }

      doc.save(`venezuela-vive-reportes-${new Date().toISOString().slice(0, 10)}.pdf`)
    } finally {
      setExporting(false)
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={exporting || reportes.length === 0}
      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-all text-sm font-semibold disabled:opacity-40 cursor-pointer shadow-sm"
    >
      {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
      {exporting ? 'Exportando...' : 'Exportar PDF'}
    </button>

  )
}
