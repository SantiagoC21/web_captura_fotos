// generar-qrs.js (archivo suelto, no forma parte de tu app Vue)
import QRCode from 'qrcode'
import fs from 'fs'

const BASE_URL = 'https://faceuni.up.railway.app'
const AULAS = ['PRUEBA1', 'PRUEBA2', 'PRUEBA3'] // ← ajusta a tu lista real

const outDir = './qrs'
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir)

for (const aula of AULAS) {
  const url = `${BASE_URL}/?aula=${aula}`
  const filePath = `${outDir}/qr_${aula}.png`
  await QRCode.toFile(filePath, url, { width: 500, margin: 2 })
  console.log(`✅ Generado: ${filePath} → ${url}`)
} 