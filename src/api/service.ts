// src/api/service.ts
import { apiClient } from './client'
import type { Persona, VerificarPersonaResponse } from './models/Persona'
import type { CapturaResponse } from './models/CapturaResponse'

export async function verificarPersona(codigo: string): Promise<VerificarPersonaResponse> {
  const { data } = await apiClient.get<VerificarPersonaResponse>(
    `/personas/verificar/${encodeURIComponent(codigo)}`
  )
  return data
}


export async function crearPersona(
  codigo: string,
  apellidos: string,
  nombres: string,
  aula: string
): Promise<Persona> {
  const { data } = await apiClient.post<Persona>('/personas/', {
    codigo,
    apellidos,
    nombres,
    aula,
  })
  return data
}

export async function enviarFoto(personaId: number, imagen: Blob): Promise<CapturaResponse> {
  const formData = new FormData()
  formData.append('imagen', imagen, 'foto.jpg')

  const { data } = await apiClient.post<CapturaResponse>(
    `/capturas/${personaId}`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  )
  return data
}

export async function resetearFotos(personaId: number): Promise<void> {
  await apiClient.delete(`/capturas/reset/${personaId}`)
}