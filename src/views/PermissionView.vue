<!-- src/views/PermissionView.vue -->
<template>
  <div class="phone-frame permission-container">
    <span class="step-indicator">2 de 4</span>

    <div class="heading-block">
      <h1>Permiso de cámara</h1>
      <p class="subtitle">Necesitamos acceso a tu cámara frontal para continuar</p>
    </div>

    <div class="estado-block">
      <div v-if="estado === 'solicitando'" class="estado solicitando">
        <p>Solicitando acceso a la cámara…</p>
        <p class="estado-detalle">Acepta el permiso en el diálogo del navegador.</p>
      </div>

      <div v-else-if="estado === 'denegado'" class="estado denegado">
        <p>Permiso de cámara denegado</p>
        <p class="estado-detalle">
          Habilita el permiso manualmente en la configuración de tu navegador
          y vuelve a intentar.
        </p>
        <button @click="solicitarPermiso" class="btn-reintentar">Reintentar</button>
      </div>

      <div v-else-if="estado === 'no-soportado'" class="estado no-soportado">
        <p>Cámara no disponible</p>
        <p class="estado-detalle">
          Tu navegador no soporta acceso a la cámara, o no estás en una conexión segura (HTTPS).
        </p>
      </div>

      <div v-else-if="estado === 'concedido'" class="estado concedido">
        <p>Permiso concedido</p>
        <p class="estado-detalle">Redirigiendo a la cámara…</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

type EstadoPermiso = 'solicitando' | 'concedido' | 'denegado' | 'no-soportado'

const estado = ref<EstadoPermiso>('solicitando')
const router = useRouter()

async function solicitarPermiso() {
  estado.value = 'solicitando'

  if (!navigator.mediaDevices?.getUserMedia) {
    estado.value = 'no-soportado'
    return
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user' },
    })
    stream.getTracks().forEach((track) => track.stop())

    estado.value = 'concedido'
    setTimeout(() => router.push('/camara'), 600)
  } catch (err) {
    console.error('Permiso de cámara denegado:', err)
    estado.value = 'denegado'
  }
}

onMounted(solicitarPermiso)
</script>

<style scoped>
.permission-container {
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
}
.step-indicator {
  font-family: var(--mono);
  font-size: 13px;
  color: var(--text);
}
.heading-block {
  margin: 24px 0 32px;
}
.heading-block h1 {
  font-size: 32px;
  letter-spacing: -0.6px;
  margin: 0 0 8px;
}
.subtitle {
  font-size: 15px;
  color: var(--text);
  line-height: 145%;
  max-width: 34ch;
}
.estado-block {
  flex-grow: 1;
  display: flex;
  align-items: center;
}
.estado {
  width: 100%;
  padding: 20px;
  border-radius: var(--radius);
  background: var(--surface);
  border: 1px solid var(--border);
}
.estado p:first-child {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-h);
  margin-bottom: 6px;
}
.estado-detalle {
  font-size: 14px;
  color: var(--text);
  line-height: 145%;
}
.estado.denegado {
  border-color: var(--danger);
}
.estado.denegado p:first-child {
  color: var(--danger);
}
.btn-reintentar {
  margin-top: 14px;
  padding: 10px 20px;
  border-radius: var(--radius-sm);
  background: var(--text-h);
  color: var(--bg);
  font-size: 14px;
  font-weight: 500;
}
</style>