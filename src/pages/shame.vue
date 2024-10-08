<script setup>
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import shameGif from '../components/images/shame-game-of-thrones.gif'
dayjs.extend(advancedFormat)
dayjs.extend(weekOfYear)

const { cache } = inject('$getters')
const dataStore = inject('$dataStore')
const thisWeek = dayjs().subtract(1,'week').format('YYYYww')
cache(`errors-${thisWeek}`)
const theD = computed( ()=> dataStore?.[`errors-${thisWeek}`] )
</script>

<template>
  <section>
    <img :src="shameGif" class="rounded-xl" />
    <ul v-for="u,ux of theD" :key="ux" :class="{ ban: u.errors > 2 }">
      <template v-for="v,k of u" :key="k">
        <li v-if="v && k!='week'" :class="k=='who'?'who':k=='errors'?'err':'other'">
          <label v-text="k.replace('timestamp_','')"/>
          <pre v-if="k.includes('timestamp_')" v-text="v.split(',')?.map(vv=>dayjs.unix(vv).format('- ddd Do HH:mm:ss')).join('\n')" />
          <b v-else v-text="v" />
        </li>
      </template>
    </ul>
  </section>
</template>

<style scoped>
  section { @apply flex flex-row flex-wrap gap-2 p-2 }
  ul { @apply flex flex-col items-center border-yellow-400 rounded-xl border py-1 shadow-md shadow-orange-600 }
  li { @apply flex flex-row items-center gap-1 px-2 }
  label { @apply self-start }
  .who { @apply text-base border-b border-yellow-400 }
  .err { @apply text-red-500 text-sm }
  .other { @apply text-xs }
  .shame { @apply border-none shadow-none w-full items-start bg-yellow-900 text-yellow-500 px-4 }
  .ban { @apply bg-yellow-950 text-red-600 }
</style>