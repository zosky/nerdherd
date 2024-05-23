<script setup>
import { Steam, MicrosoftXbox, LockOutline } from 'mdue'
const dataStore = inject('$dataStore')
const { elementsLS, getValue, saveValue } = inject('$getters')
elementsLS().then(r => { dataStore.games = r })
const isOpen = ref({steam:false,steamSub:false,xbox:false,xboxSub:false,others:true})
const showBlade = ref({steam:true,steamSub:true,xbox:true,xboxSub:true,others:true})
// reInit enabled/disabled blades
for (const x of Object.keys(showBlade.value)) { getValue(`view${x}`).then(r=>{ showBlade.value[x] = r=='false' ? false : true }) }
const stats = computed(()=>{
  // eslint-disable-next-line vue/no-side-effects-in-computed-properties
  const g = dataStore?.games
  const xbox = g?.filter(gg=>gg.xbox && !gg.sub)
  const xboxSub = g?.filter(gg=>gg.xbox && gg.sub)
  const steam = g?.filter(gg=>gg.steam && !gg.sub)
  const steamSub = g?.filter(gg=>gg.steam && gg.sub)
  return { steam, steamSub, xbox, xboxSub }
})
const myBubs = computed(()=>dataStore?.seUsers?.[dataStore?.me??'zoskyb']?.points)
const toggleBlade = k => { 
  showBlade.value[k]=!showBlade.value?.[k] 
  saveValue(`view${k}`, showBlade.value[k])
}
</script>

<template>
  <div>
    <div class="flex flex-row items-center gap-2 px-2 bg-green-950">
      <a href="https://streamelements.com/staggerrilla/store">
        <ElementsSvg class="w-8 h-8" />
      </a>
      <h3 
        v-for="s,k of stats" :key="k"
        class="flex flex-row items-center gap-1"
        :class="[ 
          k.includes('Sub')?'text-base':'text-2xl',
          !showBlade?.[k]?'opacity-40':''
        ]"
        :title="`${k} = ${s?.length}, such as \n-${s?.slice(0,3)?.map(s=>s?.name)?.join('\n-')}`"
        @click="toggleBlade(k)">
        <LockOutline v-if="k.includes('Sub')" />
        <Steam v-else-if="k.includes('steam')" />
        <MicrosoftXbox v-else-if="k.includes('xbox')" />
        <b v-else v-text="k"/>
        {{ s?.length }}
      </h3>
    </div>
    <label class="w-full px-2 opacity-50 italic text-xs" v-text="'click ^ to hide (or show) sections of what stagger has in the store (open below)'"/>
    <label class="w-full opacity-50 italic text-xs"  v-text="`have fun redeeming bubs for cool games & remember to say TY`" />
    <section>
      <details
        v-for="s,k of stats" :key=k
        :open="isOpen[k]" 
        :class="{
          steam : k.includes('steam'),
          xbox: k.includes('xbox'),
          hidden: showBlade?.[k] == false
        }">
        <summary :title="`${s?.length} games for ${k.includes('Sub')?'subs only':k}`">
          <div class="w-32 text-right inline px-2" v-text="s?.length" />
          <Steam v-if="k.includes('steam')" />
          <MicrosoftXbox v-if="k.includes('xbox')" />        
          <LockOutline v-if="k.includes('Sub')" />
          <span class="opacity-75 exGames">
            ~: {{ s ?.slice(s.length-3,s.length)
              ?.map(g=>g=`${g.name}[${g.cost/1000}k]`)
              ?.join('  ') 
            }}
          </span>
          <!-- <ul v-if="s?.length" class="flex flex-row gap-2 flex-wrap">
            <li v-for="g of s.slice(s.length-3,s.length)" :key="g.id" v-text="`${g.name}[${g.cost/1000}k]`" />
          </ul> -->
        </summary>
        <section class="grid grid-col-2 md:grid-cols-4 lg:grid-cols-6 gap-2 m-2">
          <GameCard v-for="g of s" :key="g.id" :game="g" :mybubs="myBubs" />
        </section>
      </details>
    </section>
  </div>
</template>

<style scoped>
details.xbox summary { @apply p-2 bg-teal-900 border-b border-green-500 }
details.steam summary  { @apply p-2 bg-blue-900 border-b border-blue-500 text-sky-400 }
details[open] summary .exGames { @apply hidden }
details:not([open]) summary .exGames { @apply visible text-xs }
</style>