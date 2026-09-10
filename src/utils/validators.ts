// src/utils/validators.ts
export const CODIGO_UNI_REGEX = /^20\d{6}[A-Za-z]$/
export const NOMBRE_SEGMENTO_REGEX = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+(\s[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)?$/

export function validarCodigo(codigo: string): string | null {
  if (!codigo.trim()) return 'El código UNI es obligatorio.'
  if (!CODIGO_UNI_REGEX.test(codigo.trim().toUpperCase())) {
    return 'Formato inválido. Debe ser 20XXXXXXY (ej. 20241234A).'
  }
  return null
}

export function validarNombreSegmento(valor: string, etiqueta: string): string | null {
  const limpio = valor.trim().replace(/\s+/g, ' ')
  if (!limpio) return `${etiqueta} es obligatorio.`
  if (!NOMBRE_SEGMENTO_REGEX.test(limpio)) {
    return `${etiqueta} solo debe tener letras, con una o dos palabras.`
  }
  return null
}