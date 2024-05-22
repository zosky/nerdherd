<script setup>
import { StarFace } from 'mdue'
const props = defineProps({what:{type:String,default:'bloop'}})
const dataStore = inject('$dataStore')
const liveLog = inject('$liveLog')
const sliceMax = ref(5)
const entries = computed(()=> 
  Object.entries(liveLog?.[props.what])
    .map(u=>u={
      user:u[0],
      entries: (props.what=='bubs' ? Object.keys(u[1]): u[1]).length,
      total: props.what=='bubs' ? Object.values(u[1]).reduce((a,c)=>a+=c,0) : 0
    })
    .sort((a,b)=> props.what=='bubs' 
      ? (a.total<b.total?1:-1)
      : (a.entries<b.entries?1:-1) )
)
const isIncluded = u => dataStore?.userSearch?.includes(u)
const doUser = u => {
  const s = dataStore.userSearch
  const isIn = s.includes(u)
  if (isIn) dataStore.userSearch = s.filter(uu=>uu!=u)
  else dataStore.userSearch.push(u)
}
</script>

<template>
  <ul>
    <li id="topRow">
      <div class="n" v-text="what=='bubs'?'haul':what" />
      <div v-if="what!='bubs'" class="n" v-text="'#'" />
      <div v-else class="flex flex-row">
        <b v-text="'bubs'" />
        <div class="text-xs" v-text="'wins'" />
      </div>
    </li>
    <li
      v-for="u of entries?.slice(0,sliceMax)" :key="u.user"
      @click="doUser(u.user)">
      <div class="u">
        <StarFace v-if="isIncluded(u.user)" />
        {{u.user}}
      </div>
      <div v-if="what!='bubs'" class="n" v-text="u.entries" />
      <div v-else class="flex flex-row">
        <b v-text="u.total" />
        <div class="font-light text-xs" v-text="`${u.entries}`" />
      </div>
    </li>
    <li v-if="entries.length==0" class="none opacity-70 p-2 text-xs" v-text="'noneYet'" />
    <li
      v-if="entries.length>sliceMax" role="button"
      class="text-xs  py-1" 
      @click="sliceMax+=10"
      v-text="`show ${entries.length-sliceMax} more`" />
    <li
      v-if="sliceMax-10>0" role="button"
      class="text-xs  py-1" 
      @click="sliceMax-=10"
      v-text="`show 10 less`" />
  </ul>
</template>

<style scoped>
  ul { @apply flex flex-col }
  li { @apply flex flex-row justify-between even:bg-green-900 odd:bg-green-800 px-2 items-baseline gap-2 }
  #topRow { @apply px-2 pt-2 bg-green-900 rounded-t-xl }
  ul > li:not(.none):nth-child(2) { @apply font-bold border-sky-400 border text-lg bg-teal-800 }
  .u { @apply font-light }
  .n { @apply font-mono }
  li:last-child { @apply shadow-md }
</style>