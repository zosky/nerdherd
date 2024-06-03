<script setup>
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import imageUrl from './components/images/nerdherdlogo.png'
dayjs.extend(duration)
let counter = ref(0)
setInterval(() => { counter.value++ }, 1000)
</script>

<template>
  <div>
    <header v-if="$route.meta.title" class="bg-teal-900 bg-opacity-25 shadow">
      <div class="flex flex-row items-center justify-between px-2 gap-3 " >
        <h1
          class="text-3xl font-bold leading-tight items-center flex flex-row gap-2"
          :title="`now running for ${counter} seconds`">
          <a href="https://www.twitch.tv/staggerrilla" target="twitch">
            <!-- <NerdHerdSvg class="inline w-12 h-12 -mb-6 -mt-4 -rotate-12 hover:animate-pulse" /> -->
            <img :src="imageUrl" class="w-16 h-16 -mb-6 -mt-2 -rotate-12 hover:animate-pulse hover:scale-150 origin-top-left transition-all" />
          </a>
          <router-link title="homePage" to="/">🏠</router-link>
          <router-link title="fishingStats" to="/fishing">🎣</router-link>
          <div class="d" v-text="`${ dayjs.duration(counter,'seconds').format('HH:mm:ss').replace(/^([0:]*)/,'')  }`" />
        </h1>
        <div>
          <UserIsMe />
        </div>
      </div>
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>

<style scoped>
  .d:before { content:'started'; @apply italic font-light text-xl }
  .d:after { content:'ago'; @apply italic font-light text-xl }
</style>