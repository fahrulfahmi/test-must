<template>
  <div class="flex flex-col h-full">
    <label class="font-medium mb-1">Workflow JSON</label>
    <textarea
      v-model="workflowJson"
      class="w-full flex-1 min-h-[300px] border rounded p-2 font-mono text-sm bg-gray-50 resize-none"
    ></textarea>
  </div>
</template>

<script setup>
import { ref, watch } from "vue"
import { createWorkflow, updateWorkflow } from "@/services/api.js"

const props = defineProps({
  workflowTasks: {
    type: Array,
    default: () => [],
  },
})

const workflowJson = ref("")

watch(
  () => props.workflowTasks,
  (tasks) => {
    workflowJson.value = JSON.stringify(
      {
        name: "workflow_demo",
        description: "Workflow created in editor",
        version: 1,
        schemaVersion: 2,
        tasks,
        ownerApp: "vue-editor",
        accessPolicy: { OWNER: ["READ", "UPDATE"] },
      },
      null,
      2
    )
  },
  { immediate: true, deep: true }
)

const saveWorkflow = async (method) => {
  try {
    const payload = JSON.parse(workflowJson.value)

    payload.name = payload.name || "workflow_demo"
    payload.schemaVersion = payload.schemaVersion || 2
    payload.version = payload.version || 1
    payload.accessPolicy = payload.accessPolicy || { OWNER: ["READ", "UPDATE"] }

    if (method === "POST") {
      await createWorkflow(payload)
    } else {
      await updateWorkflow(payload)
    }

    alert(`Workflow ${method} saved successfully!`)
  } catch (err) {
    console.error(err)
    alert("Failed to save workflow: " + err.message)
  }
}
</script>
