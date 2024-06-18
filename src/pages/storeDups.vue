<route lang="json">
  { "meta": { "title": "fishing" } }
</route>
  
<script setup>
const { elementsLS, getValue, saveValue } = inject('$getters')
const dataStore = inject('$dataStore')
const dups = ref({})
elementsLS().then(r => { 
  dataStore.games = r 
  const gObj = r.reduce((a,c)=>{ 
    if (!a?.[c.name] ) a[c.name] = [c]
    else a[c.name].push(c)
    return a
  },{})
  dups.value = Object.entries(gObj)
    .filter(g=>g[1].length>1)
    .map(g=>g={ game:g[0],entries:g[1] })
})
</script>

<template>
  <section class="flex flex-col gap-2">
    <details v-for="game of dups" :key="game.game">
      <summary class="bg-orange-900 p-2 text-yellow-300" v-text="`[${game.entries.length}#] ${game.game}`" />
      <div class="flex flex-row p-2 gap-2">
        <GameCard v-for="g of game.entries" :key="g.id" :game="g" />
      </div>
    </details>
  </section>
</template>