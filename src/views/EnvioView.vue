<!-- src/views/EnvioView.vue -->
<template>
  <div class="phone-frame envio-container">
    <template v-if="estado === 'enviando'">
      <div class="spinner"></div>
      <p class="mensaje">Enviando a la base de datos...</p>
    </template>

    <template v-else-if="estado === 'exito'">
      <p class="mensaje exito">
        Muchas gracias {{ cameraStore.personaNombre }} por tu participación
      </p>
    </template>

    <template v-else>
      <p class="mensaje error">Error en el envío, vuelva a intentarlo</p>
      <button class="btn-primario" @click="volverAlInicio">Volver al inicio</button>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCameraStore } from '../stores/camera'
import { enviarFoto } from '../api/service'

const router = useRouter()
const cameraStore = useCameraStore()

const estado = ref<'enviando' | 'exito' | 'error'>('enviando')

function volverAlInicio() {
  cameraStore.resetTodo()
  router.replace('/')
}

function handlePopState() {
  router.replace('/')
}

onMounted(async () => {
  window.history.pushState(null, '', window.location.href)
  window.addEventListener('popstate', handlePopState)

  if (cameraStore.personaId === -1 || cameraStore.totalFotos === 0) {
    router.replace('/')
    return
  }

  try {
    await Promise.all(
      cameraStore.fotos.map((foto) => enviarFoto(cameraStore.personaId, foto))
    )
    estado.value = 'exito'
    setTimeout(() => {
      cameraStore.resetTodo()
      router.replace('/')
    }, 2500)
  } catch (err) {
    console.error(err)
    estado.value = 'error'
  }
})

onUnmounted(() => {
  window.removeEventListener('popstate', handlePopState)
})
</script>

<style scoped>
.envio-container {
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  min-height: 100%;
  text-align: center;
}
.mensaje {
  font-size: 16px;
  color: var(--text-h);
}
.mensaje.exito {
  color: var(--success);
  font-weight: 500;
}
.mensaje.error {
  color: var(--danger);
  font-weight: 500;
}
.btn-primario {
  padding: 12px 24px;
  border-radius: var(--radius-sm);
  background: var(--text-h);
  color: var(--bg);
  font-size: 14px;
  font-weight: 500;
}
.spinner {
  width: 36px;
  height: 36px;
  border: 3px solid var(--surface);
  border-top-color: var(--text-h);
  border-radius: 50%;
  animation: girar 0.8s linear infinite;
}
@keyframes girar {
  to {
    transform: rotate(360deg);
  }
}
</style>