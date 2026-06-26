export interface Reporte {
  id: string
  nombre: string | null
  edad: number | null
  ultimo_lugar: string | null
  estado_actual: 'sin_contacto' | 'localizado' | 'fallecido'
  foto_url: string | null
  descripcion_fisica: string | null
  desde_cuando: string | null
  contacto_reportante: string | null
  latitud: number | null
  longitud: number | null
  estado_venezuela: string | null
  municipio: string | null
  verificado: boolean
  verificado_por: string | null
  verificado_en: string | null
  created_at: string
  updated_at: string
  genero: string | null
  cedula: string | null
  desaparicion_tipo: string | null
}

export interface ReporteInsert {
  nombre?: string | null
  edad?: number | null
  ultimo_lugar?: string | null
  estado_actual?: 'sin_contacto' | 'localizado' | 'fallecido'
  foto_url?: string | null
  descripcion_fisica?: string | null
  desde_cuando?: string | null
  contacto_reportante?: string | null
  latitud?: number | null
  longitud?: number | null
  estado_venezuela?: string | null
  municipio?: string | null
  genero?: string | null
  cedula?: string | null
  desaparicion_tipo?: string | null
}

export interface ComentarioReporte {
  id: string
  reporte_id: string
  autor: string
  contenido: string
  created_at: string
}

export interface ComentarioReporteInsert {
  reporte_id: string
  autor?: string
  contenido: string
}

export interface Emergencia {
  id: string
  categoria: string
  nombre: string
  telefonos: string[]
  estado: string
  activo: boolean
  orden: number
  created_at: string
}

export interface RecursoEmergencia {
  id: string
  nombre: string
  tipo: 'hospital' | 'acopio' | 'ambulatorio_improvisado'
  descripcion: string | null
  contacto: string | null
  direccion: string | null
  latitud: number
  longitud: number
  estado_venezuela: string
  municipio: string
  verificado: boolean
  created_at: string
  updated_at: string
}

export interface RecursoEmergenciaInsert {
  nombre: string
  tipo: 'hospital' | 'acopio' | 'ambulatorio_improvisado'
  descripcion?: string | null
  contacto?: string | null
  direccion?: string | null
  latitud: number
  longitud: number
  estado_venezuela: string
  municipio: string
  verificado?: boolean
}

export interface Database {
  public: {
    Tables: {
      reportes: {
        Row: Reporte
        Insert: ReporteInsert
        Update: Partial<ReporteInsert>
        Relationships: []
      }
      emergencias: {
        Row: Emergencia
        Insert: Omit<Emergencia, 'id' | 'created_at'>
        Update: Partial<Omit<Emergencia, 'id' | 'created_at'>>
        Relationships: []
      }
      recursos_emergencia: {
        Row: RecursoEmergencia
        Insert: RecursoEmergenciaInsert
        Update: Partial<RecursoEmergenciaInsert>
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}


