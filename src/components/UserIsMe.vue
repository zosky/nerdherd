<script setup>
const dataStore = inject('$dataStore')
const { elementsUser, saveValue, getValue } = inject('$getters')


const editMode = ref(false)
const user = ref('')
const mySe = computed(()=>dataStore?.seUsers?.[user.value]??{})
getValue('me').then(r => doUser(r)) // restore persistance

const doUser = async u => { 
  const r = u ? await elementsUser(u) : null
  const isFound = r?.points ? true : false
  const isNew = !dataStore?.userSearch?.includes(u)
  user.value = isFound ? u : null
  editMode.value = isFound ? false : true
  if (isFound) saveValue('me',u) // browser-based-persist
  if (isFound && isNew) { dataStore.userSearch.unshift(u) }
}
</script>

<template>
  <div class="flex flex-row gap-2">
    <button v-if="!editMode" class="font-bold" title="click to edit" @click="editMode=true">{{ user }}</button>
    <input
      v-else v-model.lazy="user" 
      :placeholder="`whoAmI?`" 
      :title="`look at any1 really ;P\nthis is not a login`" 
      @change="doUser(user)" />
    <div v-if="mySe?.rank" class="flex flex-row gap-2 ">
      <label :title="`bubs:${mySe?.points}`" v-text="`${ Math.round(mySe?.points/10)/100}🫐`" />
      <WatchTime :watchtime="mySe?.watchtime" title="watchTime" />
      <label title="elements Rank" v-text="`${ mySe?.rank }#`" />
    </div>
  </div>
</template>

<style scoped>
input { @apply bg-transparent text-right }
</style>