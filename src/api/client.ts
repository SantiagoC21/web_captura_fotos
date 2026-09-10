// src/api/client.ts
import axios from 'axios'

const BASE_URL = 'http://192.168.56.1:8000' // ajusta a tu backend

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
})