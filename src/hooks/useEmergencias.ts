import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Emergencia } from '../types/database'

export function useEmergencias() {
  const [emergencias, setEmergencias] = useState<Emergencia[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('emergencias')
        .select('*')
        .eq('activo', true)
        .order('orden', { ascending: true })

      setEmergencias(data || [])
      setLoading(false)
    }
    fetch()
  }, [])

  return { emergencias, loading }
}
