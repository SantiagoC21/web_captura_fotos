<!-- src/views/MainView.vue -->
<template>
  <div class="phone-frame">
    <span class="step-indicator">1 de 4</span>

    <div class="heading-block">
      <h1>Registro</h1>
      <p class="subtitle">Ingresa tus datos para crear tu dataset facial</p>
    </div>

    <div v-if="!aula" class="aula-error">
      <p>Este link no tiene un aula asignada.</p>
      <p>Pide el link o QR correcto a tu docente.</p>
    </div>

    <form v-else class="form-block" @submit.prevent="continuar" novalidate>
      <div class="aula-badge">Aula: <strong>{{ aula }}</strong></div>

      <div class="field">
        <label for="codigo">Código UNI</label>
        <Input
          id="codigo"
          v-model="codigo"
          type="text"
          placeholder="20241234A"
          class="field-input mono"
          :class="{ 'field-invalid': tocado.codigo && errorCodigo }"
          maxlength="9"
          @blur="tocado.codigo = true"
        />
        <span v-if="tocado.codigo && errorCodigo" class="field-error">{{ errorCodigo }}</span>
      </div>

      <div class="field">
        <label for="apellidos">Apellidos</label>
        <Input
          id="apellidos"
          v-model="apellidos"
          type="text"
          placeholder="García López"
          class="field-input"
          :class="{ 'field-invalid': tocado.apellidos && errorApellidos }"
          @blur="tocado.apellidos = true"
        />
        <span v-if="tocado.apellidos && errorApellidos" class="field-error">{{ errorApellidos }}</span>
      </div>

      <div class="field">
        <label for="nombres">Nombres</label>
        <Input
          id="nombres"
          v-model="nombres"
          type="text"
          placeholder="Santiago"
          class="field-input"
          :class="{ 'field-invalid': tocado.nombres && errorNombres }"
          @blur="tocado.nombres = true"
        />
        <span v-if="tocado.nombres && errorNombres" class="field-error">{{ errorNombres }}</span>
      </div>

      <button type="submit" :disabled="!formValido || cargando" class="btn-continuar">
        {{ cargando ? 'Verificando…' : 'Continuar' }}
      </button>

      <p v-if="error" class="error-msg">{{ error }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Input } from '@/components/ui/input'
import { verificarPersona, crearPersona } from '../api/service'
import { useCameraStore } from '../stores/camera'
import { validarCodigo, validarNombreSegmento } from '../utils/validators'

const route = useRoute()
const router = useRouter()
const cameraStore = useCameraStore()

const aula = computed(() => (route.query.aula as string) || '')

const codigo = ref('')
const apellidos = ref('')
const nombres = ref('')
const cargando = ref(false)
const error = ref<string | null>(null)

const tocado = reactive({ codigo: false, apellidos: false, nombres: false })

const errorCodigo = computed(() => validarCodigo(codigo.value))
const errorApellidos = computed(() => validarNombreSegmento(apellidos.value, 'Apellidos'))
const errorNombres = computed(() => validarNombreSegmento(nombres.value, 'Nombres'))

const formValido = computed(
  () => !!aula.value && !errorCodigo.value && !errorApellidos.value && !errorNombres.value
)

async function continuar() {
  tocado.codigo = true
  tocado.apellidos = true
  tocado.nombres = true

  if (!formValido.value) return

  error.value = null
  cargando.value = true

  const codigoNormalizado = codigo.value.trim().toUpperCase()

  try {
    const verificacion = await verificarPersona(codigoNormalizado)
    
    if (verificacion.existe && verificacion.persona_id) {
      cameraStore.setPersona(verificacion.persona_id, codigoNormalizado, `${apellidos.value} ${nombres.value}`, aula.value)
    } else {
      const nuevaPersona = await crearPersona(codigoNormalizado, apellidos.value.trim(), nombres.value.trim(), aula.value)
      cameraStore.setPersona(nuevaPersona.id, nuevaPersona.codigo, nuevaPersona.nombre, nuevaPersona.aula)
    }

    router.push('/permisos')
  } catch (err) {
    error.value = 'No se pudo conectar con el servidor. Intenta de nuevo.'
    console.error(err)
  } finally {
    cargando.value = false
  }
}
</script>

<style scoped>
.phone-frame {
  padding: 28px 24px;
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
.aula-error {
  padding: 16px;
  border-radius: 6px;
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--danger);
  font-size: 14px;
  line-height: 145%;
}
.aula-badge {
  font-family: var(--mono);
  font-size: 13px;
  color: var(--text-h);
  padding: 8px 12px;
  background: var(--surface);
  border-radius: var(--radius-sm);
  width: fit-content;
}
.form-block {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  text-align: left;
}
.field label {
  font-size: 13px;
  color: var(--text-h);
  font-weight: 500;
}
.field-input {
  width: 100%;
  border-radius: 6px;
}
.field-input.mono {
  font-family: var(--mono);
}
.field-invalid {
  border-color: var(--danger) !important;
}
.field-error {
  font-size: 12px;
  color: var(--danger);
}
.btn-continuar {
  width: 100%;
  padding: 13px;
  border-radius: 6px;
  border: none;
  background: var(--text-h);
  color: var(--bg);
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 8px;
}
.btn-continuar:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.error-msg {
  color: var(--danger);
  font-size: 13px;
}
</style>