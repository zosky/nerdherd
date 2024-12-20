<script setup>
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
dayjs.extend(advancedFormat)
const { elementsUser } = inject('$getters')
const dataStore = inject('$dataStore')
const data = ref([])
const redeems = ref([])
const prodShim = x => (import.meta.env.PROD ? '/nerdherd' : '')+x
fetch(prodShim('addbubs.txt'))
  .then(response => response.text())
  .then(r => data.value = r
    .split('\n')
    .filter(x => x)
    .map( x => {
      const timeX = x.split(' ')[0]
      const time = dayjs.unix(timeX).format('YYYY-MM-DD HH:mm:ss')
      const day = dayjs.unix(timeX).format('YYYY-MM-DD')
      const user = x.split(' ').filter(xx => xx.length)?.[1]
      const bubs = parseInt(x.split(' ').filter(xx => xx.length)?.[2],10)
      return { timeX, day, time, user, bubs }
    })
  ).then(()=>{

    for (const user of uniqueUsers.value) { 
      elementsUser(user)
    }
  })

fetch(prodShim('/redeems.txt'))
  .then(response => response.text())
  .then(r => redeems.value = r
    .split('\n')
    .filter(x => x)
    .map( x => {
      const [timeX,user,game] = x.split('\t')
      const time = dayjs.unix(timeX).format('YYYY-MM-DD HH:mm:ss')
      const day = dayjs.unix(timeX).format('YYYY-MM-DD')
      return { timeX, day, time, user, game }
    })
  )
  
const uniqueDays = computed(() => [...new Set(data.value.map(item => item.day))])
const uniqueUsers = computed(() => [...new Set(data.value.map(item => item.user.toLowerCase()))].sort((a,b)=> a > b ? 1 : -1))

function getBubsForUserAndDay(user, day) {
  const entry = data.value
    .filter(item => item.user.toLowerCase() === user && (day ? item.day === day : true ) && item.bubs)
    .reduce((a,c)=>{ a+=c?.bubs ?? 0 ; return a },0)
  return entry //?? Math.round(entry/1000)+'k' : ''
}

function getGamesForUserAndDay(user, day) {
  const entry = redeems.value
    .filter(item => item.user.toLowerCase() === user && (day ? item.day === day : true ))
  return entry
}

function findUserSE(user) {
  return dataStore?.seUsers?.[user]
}

const sortKey = ref('thisWeek')
const sortAsc = ref(false)

function sortBy(key) {
  if (sortKey.value === key) {
    sortAsc.value = !sortAsc.value
  } else {
    sortKey.value = key
    sortAsc.value = true
  }
}

const sortedUsers = computed(() => {
  return [...uniqueUsers.value].sort((a, b) => {
    let result = 0
    if (sortKey.value === 'user') {
      result = a.localeCompare(b)
    } else if (sortKey.value === 'rank') {
      result = (dataStore?.seUsers?.[a]?.rank || 0) - (dataStore?.seUsers?.[b]?.rank || 0)
    } else if (sortKey.value === 'points') {
      result = (dataStore?.seUsers?.[a]?.points || 0) - (dataStore?.seUsers?.[b]?.points || 0)
    } else if (sortKey.value === 'thisWeek') {
      result = (getBubsForUserAndDay(a)||0) - (getBubsForUserAndDay(b)||0)
    } else if (sortKey.value === 'games') {
      result = getGamesForUserAndDay(a).length - getGamesForUserAndDay(b).length
    } else {
      result = getBubsForUserAndDay(a, sortKey.value) - getBubsForUserAndDay(b, sortKey.value)
    }
    return sortAsc.value ? result : -result
  })
})
</script>

<template>
  <div>
    <h2>
      in the last 
      <b>
        {{ uniqueDays.length }}
      </b>
      days
      <b>
        {{  sortedUsers.length ? `${sortedUsers.length}` : '' }} 
      </b>
      viewers redeemed 
      <b>{{ redeems?.length }}</b>
      games & got 
      <b>
        {{  Math.round(data?.map(d=>d.bubs)?.reduce((a,c)=> {return c ? a + c : a}, 0)/100000)/10 }}m
      </b>
      bubs
      <b>
        {{ data?.length }}
      </b>
      times 
      <em class="text-xs">(thanks to/manually done by stagger)</em>
    </h2>
    <table>
      <thead class="sticky top-0 z-10">
        <tr class="bg-blue-900 bg-opacity-50 shadow-sm shadow-sky-800">
          <th class="f" :class="{ filter: sortKey=='user', sorted: sortAsc }" @click="sortBy('user')">viewer 👤</th>
          <th class="f" :class="{ filter: sortKey=='games', sorted: sortAsc }" @click="sortBy('games')">games 🕹️</th>
          <th class="f" :class="{ filter: sortKey=='rank', sorted: sortAsc }" @click="sortBy('rank')">rank 🏅</th>
          <th class="f" :class="{ filter: sortKey=='points', sorted: sortAsc }" @click="sortBy('points')">bubs 🏦</th>
          <th class="f" :class="{ filter: sortKey=='thisWeek', sorted: sortAsc }" @click="sortBy('thisWeek')">week 📅</th>
          <th v-for="day in uniqueDays" :key="day" class="px-1 border-r border-green-900 font-light">{{ dayjs(day).format('Do') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr 
          v-for="user in sortedUsers" :key="user" 
          :class="{'hidden': !dataStore?.seUsers?.[user]?.rank }">
          <td class="text-right bg-blue-950 px-2">{{ user }}</td>
          <td :title="getGamesForUserAndDay(user,day)?.map(game=>`${game?.day} >> ${game?.game}`).join('\n')" class="text-purple-400 font-bold text-right bg-blue-950" v-text="getGamesForUserAndDay(user).length ? getGamesForUserAndDay(user).length + '🕹️' : ''" />
          <td class="text-right bg-blue-950 px-2 bg-opacity-90" v-text="dataStore?.seUsers?.[user]?.rank ? dataStore?.seUsers?.[user]?.rank + ' ⚔️': ''" />
          <td class="text-right bg-blue-950 px-2 bg-opacity-90" v-text="dataStore?.seUsers?.[user]?.points ? Math.round(dataStore?.seUsers?.[user]?.points/1000) + 'k🪙' : ''" />
          <td class="text-right" v-text="Math.round(getBubsForUserAndDay(user)/1000) + 'k🪙' " />
          <td v-for="day in uniqueDays" :key="day" class="text-right border-r px-2 border-r-green-900">
            <div class="flex justify-between gap-2 button select-none">
              <div :title="getGamesForUserAndDay(user,day)?.map(game=>`${game.day} >> ${game.game}`).join('\n')" class="text-purple-400 font-bold">{{ getGamesForUserAndDay(user,day).length ? getGamesForUserAndDay(user,day).length + '🕹️' : '' }}</div>
              <div>{{ getBubsForUserAndDay(user,day) ? Math.round(getBubsForUserAndDay(user,day)/1000) + 'k🪙' : '' }}</div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
 h2 { @apply text-xl font-light px-2 }
 h2 b { @apply font-bold }
 .f { @apply cursor-pointer }
 th { @apply text-right pr-2 } 
 tr { @apply 
    even:bg-white even:bg-opacity-10
    border-b border-b-blue-900 
    hover:bg-purple-900 hover:text-purple-100 
  }
 .filter { @apply text-purple-500 bg-blue-900 bg-opacity-90 px-2 }
 .filter.sorted::after {  content: '↓'; }
 .filter:not(.sorted)::after {  content: '↑'; }
 div { @apply min-w-max }
</style>