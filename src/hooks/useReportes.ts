import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Reporte, ReporteInsert } from '../types/database'

export function useReportes() {
  const [reportes, setReportes] = useState<Reporte[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReportes = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error: fetchError } = await supabase
        .from('reportes')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError
      setReportes(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar reportes')
    } finally {
      setLoading(false)
    }
  }, [])

  const crearReporte = async (reporte: ReporteInsert): Promise<Reporte | null> => {
    try {
      const { data, error: insertError } = await (supabase.from('reportes') as any)
        .insert(reporte)
        .select()
        .single()

      if (insertError) throw insertError
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear reporte')
      return null
    }
  }

  const actualizarEstado = async (id: string, estado: 'sin_contacto' | 'localizado') => {
    try {
      const { error: updateError } = await (supabase.from('reportes') as any)
        .update({ estado_actual: estado })
        .eq('id', id)

      if (updateError) throw updateError
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar')
    }
  }

  const subirFoto = async (file: File): Promise<string | null> => {
    try {
      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`
      const { error: uploadError } = await supabase.storage
        .from('reportes-fotos')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage
        .from('reportes-fotos')
        .getPublicUrl(fileName)

      return urlData.publicUrl
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir foto')
      return null
    }
  }

  // Fetch inicial
  useEffect(() => {
    fetchReportes()
  }, [fetchReportes])

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('reportes-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reportes' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setReportes(prev => [payload.new as Reporte, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            setReportes(prev =>
              prev.map(r => r.id === (payload.new as Reporte).id ? payload.new as Reporte : r)
            )
          } else if (payload.eventType === 'DELETE') {
            setReportes(prev =>
              prev.filter(r => r.id !== (payload.old as Reporte).id)
            )
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return {
    reportes,
    loading,
    error,
    crearReporte,
    actualizarEstado,
    subirFoto,
    refetch: fetchReportes,
  }
}
