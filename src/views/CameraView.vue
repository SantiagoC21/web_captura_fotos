<!-- src/views/CameraView.vue -->
<template>
  <div class="phone-frame camera-container">
    <span class="step-indicator">3 de 4</span>

    <div class="heading-block">
      <h1>Captura de rostro</h1>
      <p class="subtitle">Ubica tu rostro dentro del óvalo</p>
    </div>

    <div class="video-wrapper">
      <video ref="videoEl" autoplay playsinline muted class="video-feed"></video>
      <OvalOverlay :rostro-valido="rostroValido" />
    </div>

    <canvas ref="canvasEl" style="display: none"></canvas>

    <div class="progreso">
      <div class="progreso-header">
        <span>{{ cameraStore.totalFotos }} / 10 fotos</span>
      </div>
      <div class="barra">
        <div class="barra-fill" :style="{ width: `${cameraStore.totalFotos * 10}%` }"></div>
      </div>
    </div>

    <p v-if="!rostroValido" class="hint">Ubica tu rostro dentro del óvalo</p>
    <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import OvalOverlay from '../components/OvalOverlay.vue'
import { useCameraCapture } from '../composables/useCameraCapture'
import { useCameraStore } from '../stores/camera'

const router = useRouter()
const cameraStore = useCameraStore()
const { rostroValido, errorMessage, startCamera, stopCamera } =
  useCameraCapture()

watch(
  () => cameraStore.totalFotos,
  (total) => {
    if (total >= 10) {
      stopCamera()
      router.push('/preview')
    }
  }
)

onMounted(startCamera)
</script>

<style scoped>
.camera-container {
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
.video-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 5;
  border-radius: var(--radius);
  overflow: hidden;
  background: var(--surface);
}
.video-feed {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scaleX(-1);
}
.progreso {
  width: 100%;
}
.progreso-header {
  font-size: 13px;
  color: var(--text);
  margin-bottom: 6px;
}
.barra {
  height: 8px;
  border-radius: 4px;
  background: var(--surface);
  overflow: hidden;
}
.barra-fill {
  height: 100%;
  background: var(--accent);
  transition: width 0.3s ease;
}
.hint {
  font-size: 14px;
  color: var(--text);
  text-align: center;
}
.error-msg {
  color: var(--danger);
  font-size: 13px;
}
</style>