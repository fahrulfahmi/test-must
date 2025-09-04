<template>
  <div class="flex flex-col gap-3">
    <div>
      <label class="block font-medium text-sm">Task Name</label>
      <input
        v-model="localTask.name"
        @input="emitUpdate"
        class="w-full border rounded p-1"
      />
    </div>

    <div>
      <label class="block font-medium text-sm">Type</label>
      <select
        v-model="localTask.type"
        @change="onTypeChange"
        class="w-full border rounded p-1"
      >
        <option>INLINE</option>
        <option>HTTP</option>
        <option>SIMPLE</option>
        <option>FORK_JOIN</option>
        <option>JOIN</option>
      </select>
    </div>

    <div v-if="localTask.type === 'HTTP'" class="flex flex-col gap-2">
      <label class="block font-medium text-sm">HTTP Method</label>
      <input
        v-model="localTask.inputParameters.http_request.method"
        @input="emitUpdate"
        class="w-full border rounded p-1"
      />
      <label class="block font-medium text-sm">URI</label>
      <input
        v-model="localTask.inputParameters.http_request.uri"
        @input="emitUpdate"
        class="w-full border rounded p-1"
      />
    </div>

    <div class="flex justify-end gap-2 mt-4">
      <button
        @click="saveTask('POST')"
        class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
      >
        POST
      </button>
      <button
        @click="saveTask('PUT')"
        class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        PUT
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue"
import { createWorkflow, updateWorkflow } from "@/services/api.js"

const props = defineProps({ task: Object })
const emit = defineEmits(["update-task"])
const localTask = ref(JSON.parse(JSON.stringify(props.task)))

watch(
  () => props.task,
  (newTask) => {
    localTask.value = JSON.parse(JSON.stringify(newTask))
  }
)

const emitUpdate = () => {
  emit("update-task", { ...localTask.value })
}

const onTypeChange = () => {
  if (localTask.value.type === "HTTP") {
    localTask.value.inputParameters = {
      http_request: { method: "GET", uri: "" },
    }
  } else {
    localTask.value.inputParameters = {}
  }
  emitUpdate()
}

const saveTask = async (method) => {
  try {
    const payload = {
      name: "workflow_demo",
      version: 1,
      schemaVersion: 2,
      tasks: [
        {
          ...localTask.value,
          inputParameters: localTask.value.inputParameters || {},
        },
      ],
      ownerApp: "vue-editor",
      accessPolicy: { OWNER: "READ,UPDATE" }, // harus string, bukan array
    }

    if (method === "POST") {
      await createWorkflow(payload)
      alert("Task POST saved successfully!")
    } else {
      const response = await updateWorkflow(payload)
      const success = response.data.bulkSuccessfulResults || []
      const failed = response.data.bulkErrorResults || {}
      alert(
        `Task PUT completed.\nSuccess: ${success.join(
          ", "
        )}\nFailed: ${Object.keys(failed).join(", ")}`
      )
    }
  } catch (err) {
    console.error(err)
    alert("Failed to save task: " + err.message)
  }
}
</script>
