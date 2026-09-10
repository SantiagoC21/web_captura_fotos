<!-- src/views/PreviewView.vue -->
<template>
  <div class="phone-frame preview-container">
    <span class="step-indicator">4 de 4</span>

    <div class="heading-block">
      <h1>Revisa tus fotos</h1>
      <p class="subtitle">Confirma tus datos y revisa las capturas antes de enviar</p>
    </div>

    <div class="resumen-persona">
      <div class="resumen-item">
        <span class="resumen-label">Código</span>
        <span class="resumen-valor mono">{{ cameraStore.personaCodigo }}</span>
      </div>
      <div class="resumen-item">
        <span class="resumen-label">Nombre</span>
        <span class="resumen-valor">{{ cameraStore.personaNombre }}</span>
      </div>
      <div class="resumen-item">
        <span class="resumen-label">Aula</span>
        <span class="resumen-valor mono">{{ cameraStore.personaAula }}</span>
      </div>
    </div>

    <p class="contador-fotos">{{ cameraStore.totalFotos }} / 10 fotos capturadas</p>

    <div class="grid-fotos">
      <div v-for="(foto, index) in fotosUrls" :key="index" class="foto-item">
        <img :src="foto" alt="Captura" class="foto-preview" />
        <button class="btn-eliminar" @click="eliminarFoto(index)" :disabled="subiendo">
          ✕
        </button>
      </div>
    </div>

    <div class="acciones">
      <button class="btn-secundario" @click="recapturar" :disabled="subiendo">
        Recapturar todo
      </button>
      <button
        class="btn-primario"
        @click="confirmarSubida"
        :disabled="cameraStore.totalFotos === 0 || subiendo"
      >
        {{ subiendo ? `Subiendo... (${subidas}/${cameraStore.totalFotos})` : 'Confirmar y subir' }}
      </button>
    </div>

    <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>
    <p v-if="exito" class="success-msg">¡Fotos subidas correctamente!</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCameraStore } from '../stores/camera'
import { enviarFoto } from '../api/service'

const router = useRouter()
const cameraStore = useCameraStore()

const subiendo = ref(false)
const subidas = ref(0)
const errorMessage = ref<string | null>(null)
const exito = ref(false)

const fotosUrls = computed(() => cameraStore.fotos.map((blob) => URL.createObjectURL(blob)))

onUnmounted(() => {
  fotosUrls.value.forEach((url) => URL.revokeObjectURL(url))
})

function eliminarFoto(index: number) {
  cameraStore.removeFoto(index)
}

function recapturar() {
  cameraStore.resetFotos()
  router.push('/camara')
}

async function confirmarSubida() {
  if (cameraStore.personaId === -1) {
    errorMessage.value = 'No se encontró la persona. Vuelve a intentar desde el inicio.'
    return
  }

  subiendo.value = true
  subidas.value = 0
  errorMessage.value = null
  exito.value = false

  try {
    for (const foto of cameraStore.fotos) {
      await enviarFoto(cameraStore.personaId, foto)
      subidas.value++
    }
    exito.value = true
    setTimeout(() => {
      cameraStore.resetTodo()
      router.push('/')
    }, 1500)
  } catch (err) {
    errorMessage.value = 'Error al subir las fotos. Intenta de nuevo.'
    console.error(err)
  } finally {
    subiendo.value = false
  }
}
</script>

<style scoped>
.preview-container {
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.step-indicator {
  font-family: var(--mono);
  font-size: 13px;
  color: var(--text);
}
.heading-block {
  margin: 8px 0 4px;
}
.heading-block h1 {
  font-size: 28px;
  letter-spacing: -0.5px;
  margin: 0 0 6px;
}
.subtitle {
  font-size: 14px;
  color: var(--text);
  line-height: 145%;
}
.resumen-persona {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 14px 16px;
  background: var(--surface);
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
}
.resumen-item {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}
.resumen-label {
  color: var(--text);
}
.resumen-valor {
  color: var(--text-h);
  font-weight: 500;
}
.resumen-valor.mono {
  font-family: var(--mono);
}
.contador-fotos {
  font-size: 14px;
  color: var(--text);
}
.grid-fotos {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}
.foto-item {
  position: relative;
  aspect-ratio: 1;
}
.foto-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: var(--radius-sm);
}
.btn-eliminar {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  font-size: 12px;
}
.acciones {
  display: flex;
  gap: 12px;
}
.btn-primario,
.btn-secundario {
  flex: 1;
  padding: 12px;
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 500;
}
.btn-primario {
  background: var(--text-h);
  color: var(--bg);
}
.btn-primario:disabled,
.btn-secundario:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.btn-secundario {
  background: var(--surface);
  color: var(--text-h);
  border: 1px solid var(--border);
}
.error-msg {
  color: var(--danger);
  font-size: 13px;
}
.success-msg {
  color: var(--success);
  font-size: 13px;
}
</style>