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
}>()

type StatusFilter = TaskStatus | 'all'

const filters: { label: string; value: StatusFilter }[] = [
  { label: '全部', value: 'all' },
  { label: '待办', value: 'todo' },
  { label: '进行中', value: 'in-progress' },
  { label: '完成', value: 'done' },
]

const selectedFilter = ref<StatusFilter>('all')

const visibleTasks = computed(() => {
  return props.tasks
    .filter((task) => selectedFilter.value === 'all' || task.status === selectedFilter.value)
    .sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt))
})
</script>

<template>
  <section aria-label="任务列表">
    <div class="mb-5 flex flex-wrap gap-2" role="group" aria-label="按状态筛选任务">
      <button
        v-for="filter in filters"
        :key="filter.value"
        class="min-h-11 rounded-md px-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        :class="selectedFilter === filter.value
          ? 'bg-indigo-600 text-white'
          : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'"
        type="button"
        :aria-pressed="selectedFilter === filter.value"
        @click="selectedFilter = filter.value"
      >
        {{ filter.label }}
      </button>
    </div>

    <p v-if="tasks.length === 0" class="rounded-lg border border-dashed border-slate-300 px-5 py-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
      还没有任务，点击下方按钮创建第一个吧
    </p>
    <p v-else-if="visibleTasks.length === 0" class="rounded-lg border border-dashed border-slate-300 px-5 py-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
      当前筛选下没有任务
    </p>
    <ul v-else class="space-y-3">
      <li v-for="task in visibleTasks" :key="task.id">
        <TaskCard
          :task="task"
          @toggle="emit('toggle', $event)"
          @delete="emit('delete', $event)"
        />
      </li>
    </ul>
  </section>
</template>