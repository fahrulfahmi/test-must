  <template>
    <div class="border rounded p-4 bg-white min-h-[200px]">
      <h3 class="font-bold mb-2">Workflow Diagram (Preview)</h3>
      <div class="flex flex-wrap gap-4">
        <div
          v-for="task in tasks"
          :key="task.taskReferenceName"
          class="p-3 border rounded bg-gray-100"
        >
          {{ task.taskReferenceName }} ({{ task.type }})
        </div>
      </div>
    </div>
  </template>

  <script setup>
  const props = defineProps({ tasks: Array })
  </script>
