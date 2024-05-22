<script setup>
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
dayjs.extend(duration)
const dataStore = inject('$dataStore')
const { elementsUser } = inject('$getters')
const liveLog = inject('$liveLog')
const props = defineProps({user:{type:String,default:'zoskyb'}})
const thisUser = computed(()=>Object.entries(liveLog).reduce((a,c)=>{ 
  if(c[1][props.user]?.length) a[c[0]] = c[1][props.user] 
  return a
},{}))
const thisFishing = computed(()=>{ 
  const d = Object.entries(liveLog?.fishing)?.find(u=>u[0].toLowerCase()==props.user)?.[1]
  const f = Object.entries(d??{})?.map(e=>e={time:parseInt(e[0],10),...e[1]})
  return f 
})
const doUser = u => { dataStore.userSearch = dataStore?.userSearch?.filter(uu=>uu!=u) }
const userSE = computed(()=>dataStore?.seUsers?.[props.user])
elementsUser(props.user)
</script>

<template>
  <section>
    <div class="uName">{{ user }}
      <button class="opacity-10 hover:opacity-100 hover:animate-spin" title="remove" @click="doUser(user)">X</button>
    </div>
    <div class="uData" >
      <ul>
        <li><ElementsSvg class="h-6 w-6 p-0.5"/></li>
        <li><WatchTime :watchtime="userSE?.watchtime" title="watchTime" :mini="true" /></li>
        <li title="elements Rank" v-text="`${ userSE?.rank }#`" />
        <li class="font-bold" :title="userSE?.points + ' bubs'" v-text="`${ Math.round(userSE?.points/10)/100}k🫐`" />
      </ul>
      <ul v-for="d,k of thisUser" :key="k">
        <li class="label">{{ k }}</li>
        <li class="data">
          <div
            v-for="(i,ix) of d" :key="i"
            :class="dayjs.unix(d[ix+1]/1000).diff( dayjs.unix(i/1000), 'seconds') < 20 ? 'hot' : 
              dayjs.unix(d[ix+1]/1000).diff( dayjs.unix(i/1000), 'seconds') < 120 ? 'mid' : ''
            ">{{ 
            ix == d.length-1 || !ix 
              ? dayjs.unix(i/1000).format('hh:mm:ssa').replace(/^([0:]*)/,'')
              : dayjs.duration(dayjs.unix(d[ix+1]/1000)
                .diff( dayjs.unix(i/1000), 'seconds'),'seconds')
                .format('HH:mm:ss').replace(/^([0:]*)/,'+')
          }}</div>
        </li>
      </ul>
      <ul v-if="Object.keys(thisFishing).length" >
        <li class="label">🪙</li>
        <li class="fish">
          <label
            v-for="(f,date) of thisFishing" :key="date"
            :title="`${f.weight}kg ${ f.thing } [${ f.type=='uncommon'?'ss':f.type=='common'?'s':f.type }]= +${ f.worth }`">
            +{{ f.worth }}🎣
          </label>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
section { @apply w-max }
.uName { @apply bg-green-900 rounded-t-xl w-max px-3 pt-1 }
.uData { @apply ring-1 ring-green-900 shadow-md shadow-green-300 p-1 rounded-r-xl rounded-bl-xl }
ul {@apply flex flex-row gap-2 py-0.5 border-b }
li.label { @apply w-12 text-right text-xs opacity-75 }
li.data { @apply flex flex-row flex-wrap gap-2 w-full justify-end }
.fish { @apply flex flex-row flex-wrap gap-2 text-xs justify-end w-full px-2 }
.data > div { @apply border-r pr-1 rounded-r-full text-xs self-center }
.data > div:first-child:before { content: '1st@ '; @apply font-light opacity-50 text-xs }
.data > div:last-child:after { content: ' =last'; @apply font-light opacity-50 text-xs }
.hot { @apply text-red-500 }
.mid { @apply text-blue-500 }
</style>