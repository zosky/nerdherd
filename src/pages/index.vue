<route lang="json">
{
  "meta": {
    "title": "Home"
  }
}
</route>

<script setup>
useHead({ title: 'Home' })
const dataStore = inject('$dataStore')
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-2 p-2">
    <EntryCount what="bloop" />
    <EntryCount what="bleep" />
    <EntryCount what="bub" />
    <FishingLeader class="col-span-1 md:col-span-2 xl:cols-span-2" />
    <EntryCount what="bubs" />
  </div>
  <div class="flex flex-row flex-wrap gap-2 p-2">
    <UserSearch />
    <UserStats 
      v-for="u of dataStore?.userSearch" :key="u" 
      :user="u" class="max-w-md" />
  </div>
  <StoreLists />
  <ChatLog />
</template>
