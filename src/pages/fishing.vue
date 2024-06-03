<route lang="json">
{ "meta": { "title": "fishing" } }
</route>
  
<script setup>
import dayjs from 'dayjs'
const liveLog = inject('$liveLog')
const liveFishing = computed(()=>{
  const usersArr = Object.entries(liveLog.fishing??{})
  const casts = usersArr?.reduce((a,u)=>{
    const fisher = u[0]
    for (const t of Object.entries(u[1])){
      const time = t[0]
      a.push({fisher,time,...t[1],live:true})
    }
    return a
  },[])
  return casts ?? []
})

const sliceMax = ref(420)
const dataKeys = ref(null)
const isNumbers = [ 'time','worth','total' ]
const isFloat = [ 'weight' ]

const data = ref([])
const thisValues = ref({fisher:'0',type:'0',thing:'0'})
const filterData = computed(()=> [ ...data.value, ...liveFishing.value ]
  ?.filter(f=> thisValues.value.fisher && thisValues.value.fisher != '0' ? thisValues.value.fisher == f.fisher : true )
  ?.filter(f=> thisValues.value.type && thisValues.value.type != '0' ? thisValues.value.type == f.type : true )
  ?.filter(f=> thisValues.value.thing && thisValues.value.thing != '0' ? thisValues.value.thing == f.thing : true )
  ?.sort((a,b)=>a.time>b.time?-1:1)
)
const uniqueValues = computed(()=>{
  const newD = {}
  const theD = [ ...data.value, ...liveFishing.value ]
  newD.fisher = Array.from(new Set(theD?.map(f=>f=f.fisher)??[]))?.sort((a,b)=>a>b?1:-1)
  newD.type = Array.from(new Set(theD?.map(f=>f=f.type)??[]))?.sort((a,b)=>a>b?1:-1)
  newD.thing = Array.from(new Set(theD?.map(f=>f=f.thing)??[]))?.sort((a,b)=>a>b?1:-1)
  return newD
})

const csvUrl = (import.meta.env.PROD ? '/nerdherd':'') + '/logs/fishing.csv' // prodShim hack
fetch(csvUrl).then(r=>r.text())
  .then(r=> { // parse txt data
    r = r.split('\n').filter(n=>n.length).map(r=>r.split(','))
    const [keys,theD] = [ r[0], r.slice(1) ]
    const objs = theD.map(d=>d=d.reduce((a,c,cx)=>{
      const k = keys[cx]
      const v = isNumbers.includes(k) ? parseInt(c,10) 
        : isFloat.includes(k) ? parseFloat(c) 
          : c
      a[k]=v
      return a
    },{}))
      .map(d=>{
        d.day = dayjs.unix(d.time/1000).format('YYMMDD')
        return d
      })
      .sort((a,b)=>a.time>b.time?-1:1)
    dataKeys.value = keys
    data.value = objs
    return objs
  })
</script>

<template>
  <!-- <pre>{{liveFishing}}</pre> -->
  <!-- <details v-for="fishers, day of perDayPerson" :key="day">
    <summary>
      {{ day }}
    </summary>
    <div class="px-3">
      <details v-for="theD, fisher of fishers" :key="fisher">
        <summary v-text="fisher" />
        <div>
          <div v-for="fish of theD" :key="fish.time">{{fish}}</div>
        </div>
      </details>
    </div>
  </details> -->
  <table>
    <!-- {{ liveFishing }} -->
    <!-- <div class="bg-green-950 col-span-full">fishers:{{ thisValues }}</div> -->
    <tr>
      <td v-for="k of dataKeys" :key="k" class="px-2 bg-green-900 text-green-950 font-bold border-b border-green-700">
        <select v-if="uniqueValues?.[k]" v-model="thisValues[k]">
          <option value="0" v-text="`all ${uniqueValues?.[k].length} ${k}s`" />
          <option
            v-for="v of uniqueValues?.[k]" :key="v"
            :value="v" v-text="v" />
        </select>
        <div v-else class="w-full h-full items-center flex flex-row">
          <div v-text="k + (['weight','worth'].includes(k) ? ('[' + Math.round(filterData.reduce((a,c)=>a+=c[k],0)) + ']') : '')" />
        </div>
      </td>
    </tr>
    <tr
      v-for="fish of filterData?.slice(0,sliceMax)" :key="fish.time"
      :class="{ newGame: fish.worth == fish.total }">
      <td
        v-for="k of dataKeys" :key="k"
        class="px-2" :class="{ 
          num: ['weight','worth','total','time'].includes(k),
          live: fish?.live && k == 'time',
        }"
        v-text="k=='time' ? dayjs.unix(fish[k]/1000).format('MMM DD HH:mm:ss') : fish[k]"/>
    </tr>
    <tr v-if="sliceMax > 420" @click="sliceMax-=420"><td colspan="7" class="px-2" role="button">420 less</td></tr>
    <tr v-if="filterData?.length > sliceMax" @click="sliceMax+=420"><td colspan="7" class="px-2" role="button">420 more</td></tr>
  </table>
</template>

<style scoped>
  select { @apply bg-transparent border-0 w-full px-2 }
  /* table { @apply  } */
  tr { @apply even:bg-green-950 }
  tr.newGame { @apply border-green-800 border-b mb-2 }
  td.num { @apply font-mono text-right }
  td.live:before { content:'📺'; @apply opacity-50 }
</style>