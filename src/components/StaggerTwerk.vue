<script setup>
import imageUrl from './images/Stagerilla_TWERK.gif'
</script>

<template>
  <section>
    <img :src="imageUrl" />
  </section>
</template>

<style scoped>
  section { @apply fixed bottom-1 right-1 align-bottom flex flex-col items-end bg-black mix-blend-multiply }
  section img { @apply mix-blend-normal h-64 }
</style>