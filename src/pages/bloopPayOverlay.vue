<route lang="json">
  { "meta": { "title": "fishing" } }
</route>
    
<script setup>
import { toPng } from 'html-to-image'
const placeEnabled = ref([true,true,true,true,false,false,false,true,false,false])
const bubs = ref(['10k','7k','5k','2k',2,2,2,'1k',1,1,1])
const thisColor = ref('#70d0f0')
const makeImg = () => {
  const node = document.getElementById('svgRender')
  toPng(node).then(function (dataUrl) {
    var img = new Image()
    img.src = dataUrl
    var res = document.getElementById('resultPNG')
    res.innerHTML = ''
    res.appendChild(img)
  })
    .catch(error => console.error('oops, something went wrong!', error))
}
</script>

<template>
  <section class="m-3">
    <div class="flex flex-row gap-4 ">
      <div class="flex flex-col h-full justify-between gap-1 mt-6 bg-green-950 p-3 rounded-xl shadow-md shadow-yellow-200">
        <div class="flex flex-row items-center">
          <label v-text="'✏️'" />
          <input v-model="thisColor" type="color" />
        </div>
        <div v-for="(place,x) of placeEnabled" :key="x">
          <input
            :checked="place" type="checkbox"
            @click="placeEnabled[x]=!placeEnabled[x]" />
          <input v-model="bubs[x]" :disabled="!place" class="w-20" />
        </div>
        <button @click="makeImg()" v-text="`goTime.png`" />
      </div>
      <div class="w-[500px] flex flex-col ring-green-950 ring-1 px-1 rounded-xl" :style="`color:${thisColor};`">
        <label v-text="'svg'"/>
        <BleepScoreBoardOverlayTemplateSvg id="svgRender" :enabled="placeEnabled" :bubs="bubs" class="w-full"  />
      </div>
      <div id="image" class="max-w-xl flex flex-col ring-green-950 px-1 rounded-xl">
        <label v-text="'png'"/>
        <div id="resultPNG" />
        <div id="save">👆 save me 👆</div>
      </div>
    </div>
  </section>
</template>

<style scoped>
  input { @apply bg-transparent font-mono m-0 px-2 py-0 border-0 }
  input:disabled { @apply opacity-25 }
  #image:has(img) #save {@apply animate-bounce }
  #image:has(img) { @apply ring-1 }
  #image:not(:has(img)) label {@apply hidden }
  #image:not(:has(img)) #save {@apply hidden }

  label { @apply opacity-50  }
  button { @apply ring-1 -mx-3 px-3 -mb-2.5 py-1 rounded-xl shadow-sm shadow-yellow-300 bg-black bg-opacity-25 mt-2 }
</style>