<template>
  <div class="flex h-screen p-6 gap-4 bg-gray-100">
    <div class="flex-1 flex flex-col border rounded shadow bg-white p-4">
      <div class="flex justify-between items-center mb-4">
        <ToolbarPlus @add-task="addTask" />
        <button
          @click="saveWorkflow"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Save Workflow
        </button>
      </div>

      <draggable
        v-model="workflowTasks"
        item-key="taskReferenceName"
        class="flex-1 grid grid-cols-3 gap-4 overflow-auto p-2"
      >
        <template #item="{ element }">
          <TaskBlock
            :task="element"
            :selected="selectedTask === element"
            @select-task="selectTask(element)"
          />
        </template>
      </draggable>
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
import { ref, onMounted } from "vue"
import draggable from "vuedraggable"
import ToolbarPlus from "@/components/ToolbarPlus.vue"
import TaskBlock from "@/components/TaskBlock.vue"
import TaskProperties from "@/components/TaskProperties.vue"
import CodeJsonPanel from "@/components/CodeJsonPanel.vue"
import { getWorkflows, updateWorkflow } from "@/services/api.js"

const workflowTasks = ref([])
const selectedTask = ref(null)
const workflowName = ref("example_workflow") // default workflow name
const addTask = (type) => {
  const newTask = {
    name: `${type.toLowerCase()}_${workflowTasks.value.length}`,
    taskReferenceName: `${type.toLowerCase()}_${workflowTasks.value.length}`,
    type,
    inputParameters: type === "HTTP"
      ? { http_request: { method: "GET", uri: "" } }
      : {},
  }
  workflowTasks.value.push(newTask)
  selectedTask.value = newTask
}

const selectTask = (task) => {
  selectedTask.value = task
}

const updateTask = (updatedTask) => {
  const index = workflowTasks.value.findIndex(
    (t) => t.taskReferenceName === updatedTask.taskReferenceName
  )
  if (index !== -1) workflowTasks.value[index] = updatedTask
}

const saveWorkflow = async () => {
  try {
    const payload = {
      name: workflowName.value,
      description: "Workflow edited from UI",
      version: 1,
      schemaVersion: 2,
      ownerEmail: "test@example.com",
      tasks: workflowTasks.value,
      inputParameters: [],
      outputParameters: {},
      timeoutPolicy: "ALERT_ONLY",
      accessPolicy: { OWNER: ["admin@example.com"] },
    }

    await updateWorkflow(payload)
    alert("Workflow saved successfully!")
  } catch (err) {
    console.error("Save failed:", err)
    alert("Failed to save workflow")
  }
}
onMounted(async () => {
  try {
    const response = await getWorkflows()
    workflowTasks.value = response.data[0]?.tasks || []
    workflowName.value = response.data[0]?.name || "example_workflow"
  } catch (err) {
    console.error("Load failed:", err)
  }
})
</script>
