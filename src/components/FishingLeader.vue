<script setup>
import { StarFace } from 'mdue'
const dataStore = inject('$dataStore')
const liveLog = inject('$liveLog')
const sliceMax = ref(5)
const catchMax = ref(5)
const isIncluded = u => dataStore?.userSearch?.includes(u.toLowerCase())
const doUser = u => {
  const isNew = !dataStore?.userSearch?.includes(u)
  if (isNew) dataStore.userSearch.push(u) 
  else dataStore.userSearch = dataStore.userSearch.filter(uu=>uu!=u)
}
const fishLeader = computed(()=>{
  const d = Object.entries(liveLog.fishing).reduce((a,u)=> { 
    a[u[0]] = Object.values(u[1]).sort((a,b)=>a.total<b.total?1:-1)?.[0]?.total
    return a 
  } ,{})
  const e = Object.entries(d)
    .map(dd=>dd={user:dd[0], score:dd[1]})
    .sort((a,b)=>a.score>b.score?-1:1)
  return e
})
const catchLeader = computed(()=>{
  const d = Object.entries(liveLog.fishing).reduce((a,u)=>{
    a[u[0]] = Object.values(u[1])?.sort((a,b)=>a?.worth<b?.worth?1:-1)?.[0]?.worth
    return a
  },{})
  const e = Object.entries(d)
    .map(dd=>dd={user:dd[0], catch:dd[1]})
    .sort((a,b)=>a.catch>b.catch?-1:1)
  return e 
})
const stats = computed(()=> 
  Object.entries(liveLog?.fish??{})?.map(u=>u={ 
    user:u[0],
    entries:u[1]?.length,
    wins: Object.keys(liveLog?.fishing[u[0]])?.length,
    score: Object.values(liveLog?.fishing[u[0]])?.at(-1).total
  })
    .sort((a,b)=>a.score>b.score?-1:1)
)
</script>

<template>
  <section class="flex flex-row gap-2 w-full">
    <ol>
      <h3>
        <div v-text="'fishing'"/>
        <div v-text="'total'"/>
      </h3>
      <li
        v-for="p of fishLeader?.slice(0,sliceMax)" :key="p.user"
        @click="doUser(p.user)">
        <div class="name">
          <StarFace v-if="isIncluded(p.user)" />
          {{p.user}}
        </div>
        <div class="num" v-text="p.score" />
      </li>
      <li
        v-if="fishLeader.length>sliceMax" role="button"
        class="text-xs  py-1" 
        @click="sliceMax+=10"
        v-text="`show ${fishLeader.length-sliceMax} more`" />
      <li
        v-if="fishLeader.length<sliceMax-10" role="button"
        class="text-xs  py-1" 
        @click="sliceMax-=10"
        v-text="`show ${fishLeader.length-sliceMax} less`" />
      <li v-if="fishLeader.length==0" class="none opacity-70 p-2 text-xs" v-text="'noneYet'" />
    </ol>
    <ol>
      <h3>
        <div v-text="'topCatch'"/>
        <div v-text="'$'"/>
      </h3>
      <li
        v-for="p of catchLeader?.slice(0,sliceMax)" :key="p.user"
        @click="doUser(p.user)">
        <div class="name">
          <StarFace v-if="isIncluded(p.user)" />
          {{p.user}}
        </div>
        <div class="num" v-text="p.catch" />
      </li>
      <li
        v-if="catchLeader.length>catchMax" role="button"
        class="text-xs  py-1" 
        @click="sliceMax+=10"
        v-text="`show ${catchLeader.length-sliceMax} more`" />
      <li
        v-if="catchLeader.length<catchMax-10" role="button"
        class="text-xs  py-1" 
        @click="sliceMax-=10"
        v-text="`show ${catchLeader.length-sliceMax} less`" />
      <li v-if="catchLeader.length==0" class="none opacity-70 p-2 text-xs" v-text="'noneYet'" />
    </ol>
  </section>
</template>

<style scoped>
ol { @apply w-full }
h3 { @apply px-2 pt-2 bg-green-900 rounded-t-xl flex flex-row justify-between }
li { @apply px-2 even:bg-green-900 odd:bg-green-800 items-center flex flex-row justify-between align-text-bottom gap-x-2 pt-0.5 }
ol>li:nth-child(2):not(.none) { @apply font-bold border-sky-400 border text-lg bg-teal-800 }
.name { @apply font-light text-base }
.num { @apply font-mono }
.grid > div { @apply px-1 }
.grid .num { @apply justify-end text-right self-center }
.same { @apply opacity-30 }
</style>