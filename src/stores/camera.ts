// src/stores/camera.ts
import { defineStore } from 'pinia'

interface CameraUiState {
  fotos: Blob[]
  isLoading: boolean
  errorMessage: string | null
  uploadSuccess: boolean
  personaId: number
  personaCodigo: string
  personaNombre: string
  personaAula: string
}

export const useCameraStore = defineStore('camera', {
  state: (): CameraUiState => ({
    fotos: [],
    isLoading: false,
    errorMessage: null,
    uploadSuccess: false,
    personaId: -1,
    personaCodigo: '',
    personaNombre: '',
    personaAula: '',
  }),
  getters: {
    totalFotos: (state) => state.fotos.length,
    limiteAlcanzado: (state) => state.fotos.length >= 10,
  },
  actions: {
    setPersona(id: number, codigo: string, nombre: string, aula: string) {
      this.personaId = id
      this.personaCodigo = codigo
      this.personaNombre = nombre
      this.personaAula = aula
    },
    addFoto(blob: Blob) {
      if (this.fotos.length < 10) this.fotos.push(blob)
    },
    removeFoto(index: number) {
      this.fotos.splice(index, 1)
    },
    resetFotos() {
      this.fotos = []
      this.uploadSuccess = false
      this.errorMessage = null
    },
    resetTodo() {
      this.resetFotos()
      this.personaId = -1
      this.personaCodigo = ''
      this.personaNombre = ''
      this.personaAula = ''
    },
  },
})