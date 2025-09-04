<template>
  <div 
    @click="$emit('select-task')"
    :class="[
      'p-4 rounded shadow cursor-pointer transition-transform transform hover:scale-105',
      selected ? 'border-2 border-blue-500 bg-blue-50' : 'border border-gray-200 bg-white'
    ]"
  >
    <h3 class="font-semibold">{{ task.name }}</h3>
    <p class="text-sm text-gray-500">{{ task.type }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  task: Object,
  selected: Boolean
})
</script>
