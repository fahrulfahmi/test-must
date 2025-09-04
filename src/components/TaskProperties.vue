<template>
  <div class="flex flex-col gap-3">
    <div>
      <label class="block font-medium text-sm">Task Name</label>
      <input v-model="localTask.name" @input="emitUpdate" class="w-full border rounded p-1" />
    </div>

    <div>
      <label class="block font-medium text-sm">Type</label>
      <select v-model="localTask.type" @change="emitUpdate" class="w-full border rounded p-1">
        <option>INLINE</option>
        <option>HTTP</option>
        <option>SIMPLE</option>
        <option>FORK_JOIN</option>
        <option>JOIN</option>
      </select>
    </div>

    <div v-if="localTask.type === 'HTTP'" class="flex flex-col gap-2">
      <label class="block font-medium text-sm">HTTP Method</label>
      <input v-model="localTask.inputParameters.http_request.method" @input="emitUpdate" class="w-full border rounded p-1" />
      <label class="block font-medium text-sm">URI</label>
      <input v-model="localTask.inputParameters.http_request.uri" @input="emitUpdate" class="w-full border rounded p-1" />
    </div>

    <button @click="saveTask" class="mt-4 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">
      Save Task
    </button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { updateWorkflow } from '@/services/api.js'

const props = defineProps({ task: Object })
const emit = defineEmits(['update-task'])
const localTask = ref(JSON.parse(JSON.stringify(props.task)))

watch(() => props.task, (newTask) => {
  localTask.value = JSON.parse(JSON.stringify(newTask))
})

const emitUpdate = () => emit('update-task', localTask.value)

const saveTask = async () => {
  try {
    await updateWorkflow({ tasks: [localTask.value] })
    alert('Task saved!')
  } catch (err) {
    console.error(err)
    alert('Failed to save task')
  }
}
</script>
