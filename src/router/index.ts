// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import MainView from '../views/MainView.vue'
import PermissionView from '../views/PermissionView.vue'
import CameraView from '../views/CameraView.vue'
import EnvioView from '../views/EnvioView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: MainView },
    { path: '/permisos', component: PermissionView },
    { path: '/camara', component: CameraView },
    { path: '/enviando', component: EnvioView },
  ],
})

export default router