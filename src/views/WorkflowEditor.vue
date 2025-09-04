<template>
  <div class="flex h-screen p-6 gap-4 bg-gray-100">
    <div class="flex-1 flex flex-col border rounded shadow bg-white p-4">
      <ToolbarPlus @add-task="addTask" class="mb-4" />

      <div class="flex-1 grid grid-cols-3 gap-4 overflow-auto p-2">
        <TaskBlock
          v-for="(task, index) in workflowTasks"
          :key="index"
          :task="task"
          :selected="selectedTask === task"
          @select-task="selectTask(task)"
        />
      </div>
    </div>

    <div class="w-80 border rounded shadow bg-white p-4 flex flex-col">
      <TaskProperties 
        v-if="selectedTask" 
        :task="selectedTask" 
        @update-task="updateTask" 
      />      
      <p v-else class="text-gray-400 mt-4">Klik task untuk lihat properti</p>
    </div>
    <div class="w-96 border rounded shadow bg-gray-50 p-4 flex flex-col">
      <CodeJsonPanel :workflowTasks="workflowTasks" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ToolbarPlus from '@/components/ToolbarPlus.vue'
import TaskBlock from '@/components/TaskBlock.vue'
import TaskProperties from '@/components/TaskProperties.vue'
import CodeJsonPanel from '@/components/CodeJsonPanel.vue'
import { getWorkflows } from '@/services/api.js'

const workflowTasks = ref([])
const selectedTask = ref(null)

const addTask = (type) => {
  const newTask = {
    name: type.toLowerCase(),
    taskReferenceName: `${type.toLowerCase()}_${workflowTasks.value.length}`,
    type,
    inputParameters: { http_request: { method: 'GET', uri: '' } },
  }
  workflowTasks.value.push(newTask)
  selectedTask.value = newTask
}

const selectTask = (task) => { selectedTask.value = task }

const updateTask = (updatedTask) => {
  const index = workflowTasks.value.findIndex(t => t.taskReferenceName === updatedTask.taskReferenceName)
  if (index !== -1) workflowTasks.value[index] = updatedTask
}

onMounted(async () => {
  try {
    const response = await getWorkflows()
    workflowTasks.value = response.data[0]?.tasks || []
  } catch (err) {
    console.error(err)
  }
})
</script>
