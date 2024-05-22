<script setup>
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
dayjs.extend(advancedFormat)
const showSlice = ref(60)
const showCmds = ref(true)
const liveLog = inject('$liveLog')
const chat = computed(()=> liveLog?.raw?.sort((a,b)=> a.time > b.time ? -1 : 1))
</script>

<template>
  <details>
    <summary>
      liveStream chatLog <b v-text="`[${ chat.filter(m=>!m.parsed)?.length }]`" />
      <label role="button" class="bg-gray-800">
        {{ !showCmds ? 'hide' : 'show' }} cmds <b v-text="`[${ chat.filter(m=>m.parsed)?.length }]`" />
        <input v-model="showCmds" type="checkbox" class="hidden" />
      </label>
    </summary>
    <ul>
      <li v-if="showCmds && chat.filter(m=>!m.parsed)?.length==0" class="p-3 opacity-50">noChatYet</li>
      <li 
        v-for="(msg,mx) of chat?.slice(0,showSlice)" :key="mx" 
        :class="showCmds ? (msg.parsed ? 'hidden':'msg' ) 
          : msg?.parsed?'msg cmd':'msg chat' ">
        <div class="user" v-text="msg.user" />
        <div class="date" v-text="dayjs.unix(msg.time/1000).format('HH:mm:ss')" />
        <div class="words" v-text="msg.msg" />
      </li>
      <li v-if="chat?.length > showSlice" role="button" @click="showSlice+=20" v-text="`show 20 more`" />
    </ul>
  </details>
</template>

<style scoped>
  /* details { @apply } */
  summary { @apply p-2 bg-green-950 }
  .msg { @apply flex flex-row gap-3 border-b even:border-teal-950 odd:border-teal-800 }
  li.cmd { @apply even:bg-teal-700 odd:bg-teal-600 text-xs border-green-800 text-green-100 }
  li.chat { @apply even:bg-green-900 odd:bg-green-800 text-base border-green-900 }
  .date { @apply text-right font-mono w-1/12}
  .user { @apply text-right font-mono w-1/6}
  .words { @apply font-light w-full }
  label { @apply border rounded-xl px-2 py-1 shadow-md border-green-900 mx-2 }
</style>