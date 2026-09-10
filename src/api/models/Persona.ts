// src/api/models/Persona.ts
export interface Persona {
  id: number
  codigo: string
  nombre: string
  aula: string
  creado_en: string
  total_fotos: number
}

export interface VerificarPersonaResponse {
  existe: boolean
  persona_id: number | null
  total_fotos: number
}