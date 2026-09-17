<!-- src/components/OvalOverlay.vue -->
<template>
  <svg class="oval-overlay" viewBox="0 0 400 500" preserveAspectRatio="none">
    <defs>
      <mask id="oval-mask">
        <rect x="0" y="0" width="400" height="500" fill="white" />
        <ellipse cx="200" cy="230" rx="110" ry="150" fill="black" />
      </mask>
    </defs>
    <rect
      x="0" y="0" width="400" height="500"
      fill="rgba(0,0,0,0.5)"
      mask="url(#oval-mask)"
    />
    <ellipse
      cx="200" cy="230" rx="110" ry="150"
      fill="none"
      stroke="#ffffff"
      stroke-width="4"
    />
  </svg>
</template>

<script setup lang="ts">
</script>

<style scoped>
.oval-overlay {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>