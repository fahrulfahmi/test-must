<template>
  <div class="flex gap-2 mb-4">
    <button
      v-for="type in taskTypes"
      :key="type"
      @click="$emit('add-task', type)"
      :class="[
        'px-3 py-1 rounded font-semibold transition-colors',
        type === 'HTTP' ? 'bg-blue-500 text-white hover:bg-blue-600' : 
        type === 'INLINE' ? 'bg-green-500 text-white hover:bg-green-600' : 
        'bg-yellow-500 text-white hover:bg-yellow-600'
      ]"
    >
      + {{ type }}
    </button>
  </div>
</template>

<script setup>
const taskTypes = ['INLINE', 'HTTP', 'SIMPLE']
</script>
