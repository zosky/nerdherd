<script setup>
import { Lock, MicrosoftXbox, Steam } from 'mdue'
const { steamSearch, steamImg, steamLinkId } = inject('$getters')
const props = defineProps({
  game:{type:Object,default:()=>{return{}}},
  mybubs: {type:Number,default:42},
})
</script>
<template>
  <article :class={xbox:game.xbox,steam:game.steam}>
    <div class=pix>
      <img v-if="game?.steamID" :src="steamImg(game.steamID)" />
      <img v-else :src="game.img" class="max-h-32 mx-auto rounded-t-xl" />
      <ul>
        <li>
          <Lock v-if="game.sub" /> 
          <MicrosoftXbox v-if="game.xbox" /> 
          <a v-if="game.steam" :href="game.steamID ? steamLinkId(game.steamID) : steamSearch(game.name)" target="steam">
            <Steam  class="h-4 self-center"/> 
          </a>
          <div class=name v-text="game.name"/>
        </li>
        <li :title="`(i has) ${Math.round(mybubs/game.cost*100)}% of ${game.cost/1000}k`">
          <div class="cost" v-text="game.cost/1000"/>
          <div class=qty v-text="game.qty"/>
          <SvgPie v-if="mybubs && mybubs < game.cost" :n="mybubs" :d="game.cost" />
        </li>
      </ul>
    </div>
    <div v-if="!game.steam && !game.xbox" class="text-sm p-2 bg-gray-900 rounded-b-xl" v-text="game.description" />
  </article>
</template>

<style scoped>
article {@apply ring-1 flex flex-col justify-between h-max rounded-xl shadow-md }
article.steam { @apply ring-blue-900 }
article.xbox { @apply ring-green-800 }
a { @apply h-4 flex flex-row}
ul { @apply flex flex-row justify-between  w-full px-2 items-center font-bold  rounded-b-xl }
.steam ul { @apply bg-blue-900 text-blue-300 }
.xbox ul { @apply bg-green-900 text-green-200 }
li { @apply flex flex-row items-center }
.cost:after { content:'k' ;@apply font-light }
.qty:after { content:']' ;@apply font-light }
.qty:before { content:'[' ;@apply font-light }
.name { @apply leading-none h-4 overflow-hidden }
</style>