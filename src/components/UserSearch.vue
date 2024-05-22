<script setup>
const dataStore = inject('$dataStore')
if (!dataStore?.userSearch?.length) dataStore.userSearch = []
const newUser = ref(null)
watchEffect(()=>{
  const u = newUser.value
  const isNew = !dataStore?.userSearch?.includes(u)
  if (u && isNew) { 
    dataStore.userSearch.push(u) 
    newUser.value = null
  }
})
</script>

<template>
  <section class="w-full flex flex-row flex-wrap gap-2 px-2">
    <input
      v-model.lazy="newUser" :placeholder="`find a${
        dataStore?.userSearch?.length>1?'nother':''
      } player...`">
  </section>
</template>

<style scoped>
input { @apply bg-transparent px-2 }
</style>