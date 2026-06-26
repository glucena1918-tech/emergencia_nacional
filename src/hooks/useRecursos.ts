import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { RecursoEmergencia, RecursoEmergenciaInsert } from '../types/database'

export function useRecursos() {
  const [recursos, setRecursos] = useState<RecursoEmergencia[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRecursos = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error: fetchError } = await supabase
        .from('recursos_emergencia')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError
      setRecursos(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar recursos de emergencia')
    } finally {
      setLoading(false)
    }
  }, [])

  const crearRecurso = async (recurso: RecursoEmergenciaInsert): Promise<RecursoEmergencia | null> => {
    try {
      const { data, error: insertError } = await (supabase.from('recursos_emergencia') as any)
        .insert(recurso)
        .select()
        .single()

      if (insertError) throw insertError
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrar recurso de emergencia')
      return null
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchRecursos()
  }, [fetchRecursos])

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('recursos-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'recursos_emergencia' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setRecursos(prev => [payload.new as RecursoEmergencia, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            setRecursos(prev =>
              prev.map(r => r.id === (payload.new as RecursoEmergencia).id ? payload.new as RecursoEmergencia : r)
            )
          } else if (payload.eventType === 'DELETE') {
            setRecursos(prev =>
              prev.filter(r => r.id !== (payload.old as RecursoEmergencia).id)
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
    recursos,
    loading,
    error,
    crearRecurso,
    refetch: fetchRecursos,
  }
}
