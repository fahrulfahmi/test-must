<template>
  <div class="flex flex-col h-full">
    <label class="font-medium mb-1">Workflow JSON</label>
    <textarea
      v-model="workflowJson"
      class="w-full h-full border rounded p-2 font-mono text-sm bg-gray-50"
    ></textarea>

    <div class="flex justify-end mt-2 gap-2">
      <button @click="saveWorkflow('POST')" class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">POST</button>
      <button @click="saveWorkflow('PUT')" class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">PUT</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { createWorkflow, updateWorkflow } from '@/services/api.js'

const props = defineProps({ workflowTasks: Array })
const workflowJson = ref('')

watch(() => props.workflowTasks, (tasks) => {
  workflowJson.value = JSON.stringify({ tasks }, null, 2)
}, { deep: true })

const saveWorkflow = async (method) => {
  try {
    const payload = JSON.parse(workflowJson.value)
    payload.accessPolicy = { OWNER: ['READ', 'UPDATE'] }
    payload.name = payload.name || 'workflow_demo'
    payload.schemaVersion = 2

    if(method === 'POST') await createWorkflow(payload)
    else await updateWorkflow(payload)
    alert('Workflow saved successfully!')
  } catch (err) {
    console.error(err)
    alert('Failed to save workflow: ' + err.message)
  }
}
</script>
