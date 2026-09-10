// src/api/models/CapturaResponse.ts
export interface CapturaResponse {
  mensaje: string
  foto_id: number
  ruta_archivo: string
  total_capturas: number
  limite_alcanzado: boolean
}