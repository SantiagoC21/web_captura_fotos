// src/composables/useCameraCapture.ts
import { ref, type Ref } from 'vue'
import { FaceDetector, FilesetResolver } from '@mediapipe/tasks-vision'
import { useCameraStore } from '../stores/camera'

const TOTAL_FOTOS = 10
const INTERVALO_CAPTURA_MS = 800

export function useCameraCapture(
  videoEl: Readonly<Ref<HTMLVideoElement | null>>,
  canvasEl: Readonly<Ref<HTMLCanvasElement | null>>
) {
  const cameraStore = useCameraStore()

  const rostroValido = ref(false)
  const capturando = ref(false)
  const errorMessage = ref<string | null>(null)

  let stream: MediaStream | null = null
  let faceDetector: FaceDetector | null = null
  let detectionLoopId: number | null = null
  let ultimaCaptura = 0

  async function initFaceDetector() {
    const vision = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
    )
    faceDetector = await FaceDetector.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          'https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/latest/blaze_face_short_range.tflite',
        delegate: 'GPU',
      },
      runningMode: 'VIDEO',
    })
  }

  async function startCamera() {
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 800 },
        audio: false,
      })
      if (videoEl.value) {
        videoEl.value.srcObject = stream
        await videoEl.value.play()
      }
      await initFaceDetector()
      detectionLoop()
    } catch (err) {
      errorMessage.value = 'No se pudo acceder a la cámara.'
      console.error(err)
    }
  }

  function detectionLoop() {
    if (!videoEl.value || !faceDetector) return

    const now = performance.now()
    const result = faceDetector.detectForVideo(videoEl.value, now)

    rostroValido.value = result.detections.length === 1

    if (
      rostroValido.value &&
      !capturando.value &&
      cameraStore.totalFotos < TOTAL_FOTOS &&
      now - ultimaCaptura > INTERVALO_CAPTURA_MS
    ) {
      capturarFrame()
      ultimaCaptura = now
    }

    if (cameraStore.totalFotos < TOTAL_FOTOS) {
      detectionLoopId = requestAnimationFrame(detectionLoop)
    }
  }

  function capturarFrame() {
    if (!videoEl.value || !canvasEl.value) return
    capturando.value = true

    const video = videoEl.value
    const canvas = canvasEl.value
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const ctx = canvas.getContext('2d')
    ctx?.drawImage(video, 0, 0, canvas.width, canvas.height)

    canvas.toBlob(
      (blob) => {
        if (blob) cameraStore.addFoto(blob)
        capturando.value = false
      },
      'image/jpeg',
      0.92
    )
  }

  function stopCamera() {
    if (detectionLoopId) cancelAnimationFrame(detectionLoopId)
    stream?.getTracks().forEach((track) => track.stop())
    faceDetector?.close()
  }

  return {
    rostroValido,
    errorMessage,
    startCamera,
    stopCamera,
  }
}