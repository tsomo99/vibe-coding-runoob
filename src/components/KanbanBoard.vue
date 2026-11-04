<script setup lang="ts">
import { computed, ref } from 'vue'
import TaskCard from './TaskCard.vue'
import type { Task, TaskStatus } from '../types/task'

const props = defineProps<{
  tasks: Task[]
}>()

const emit = defineEmits<{
  toggle: [task: Task]
  delete: [task: Task]
  'update-status': [taskId: string, status: TaskStatus]
}>()

const columns: { status: TaskStatus; title: string }[] = [
  { status: 'todo', title: '待办' },
  { status: 'in-progress', title: '进行中' },
  { status: 'done', title: '已完成' },
]

const draggingOver = ref<TaskStatus | null>(null)

const tasksByStatus = computed(() => ({
  todo: props.tasks.filter((task) => task.status === 'todo'),
  'in-progress': props.tasks.filter((task) => task.status === 'in-progress'),
  done: props.tasks.filter((task) => task.status === 'done'),
}))

function startDrag(event: DragEvent, task: Task) {
  if (!event.dataTransfer) return
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/plain', task.id)
}

function allowDrop(event: DragEvent, status: TaskStatus) {
  event.preventDefault()
  draggingOver.value = status
  if (event.dataTransfer) event.dataTransfer.dropEffect = 'move'
}

function dropTask(event: DragEvent, status: TaskStatus) {
  event.preventDefault()
  const taskId = event.dataTransfer?.getData('text/plain')
  const task = props.tasks.find((item) => item.id === taskId)

  if (task && task.status !== status) emit('update-status', task.id, status)
  draggingOver.value = null
}
</script>

<template>
  <section class="grid grid-cols-1 gap-4 md:grid-cols-3" aria-label="看板视图">
    <section
      v-for="column in columns"
      :key="column.status"
      :data-status="column.status"
      class="min-h-64 rounded-lg border p-3 transition-colors"
      :class="draggingOver === column.status ? 'border-indigo-300 bg-indigo-50 dark:border-indigo-700 dark:bg-indigo-950/50' : 'border-slate-200 bg-slate-100/70 dark:border-slate-800 dark:bg-slate-900/70'"
      :aria-label="`${column.title}任务`"
      @dragover="allowDrop($event, column.status)"
      @dragleave="draggingOver = null"
      @drop="dropTask($event, column.status)"
    >
      <header class="mb-3 flex items-center justify-between px-1 py-1">
        <h2 class="text-sm font-semibold text-slate-700 dark:text-slate-200">{{ column.title }}</h2>
        <span class="rounded-md bg-white px-2 py-0.5 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          {{ tasksByStatus[column.status].length }}
        </span>
      </header>

      <ul class="space-y-3">
        <li v-for="task in tasksByStatus[column.status]" :key="task.id">
          <div
            class="cursor-grab active:cursor-grabbing"
            draggable="true"
            @dragstart="startDrag($event, task)"
            @dragend="draggingOver = null"
          >
            <TaskCard
              :task="task"
              @toggle="emit('toggle', $event)"
              @delete="emit('delete', $event)"
            />
          </div>
        </li>
      </ul>

      <p v-if="tasksByStatus[column.status].length === 0" class="px-1 py-6 text-center text-xs text-slate-400 dark:text-slate-500">
        拖动任务到此处
      </p>
    </section>
  </section>
</template>