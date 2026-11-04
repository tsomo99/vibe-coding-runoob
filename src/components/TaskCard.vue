<script setup lang="ts">
import type { Task } from '../types/task'

defineProps<{
  task: Task
}>()

const emit = defineEmits<{
  toggle: [task: Task]
  delete: [task: Task]
}>()

function formatDate(date: string | null) {
  if (!date) return '未设置截止日期'

  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(`${date}T00:00:00`))
}
</script>

<template>
  <article
    class="flex items-start gap-4 rounded-lg border border-slate-200 border-l-4 bg-white p-4 shadow-sm transition-transform duration-200 hover:scale-[1.02] dark:border-slate-700 dark:bg-slate-900"
    :class="{
      'border-l-red-500': task.priority === 'high',
      'border-l-yellow-400': task.priority === 'medium',
      'border-l-green-500': task.priority === 'low',
    }"
  >
    <label class="-ml-2 -mt-2 grid size-11 shrink-0 cursor-pointer place-items-center">
      <input
        :checked="task.status === 'done'"
        :aria-label="`标记「${task.title}」为${task.status === 'done' ? '未完成' : '完成'}`"
        class="size-4 cursor-pointer accent-indigo-600"
        type="checkbox"
        @change="emit('toggle', task)"
      />
    </label>

    <div class="min-w-0 flex-1">
      <div class="flex items-start justify-between gap-3">
        <h3
          class="break-words text-sm font-semibold text-slate-900 dark:text-slate-100"
          :class="{ 'text-slate-400 line-through dark:text-slate-500': task.status === 'done' }"
        >
          {{ task.title }}
        </h3>
        <button
          class="-mr-2 -mt-2 grid size-11 shrink-0 place-items-center rounded-md text-xl leading-none text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          type="button"
          :aria-label="`删除「${task.title}」`"
          @click="emit('delete', task)"
        >
          ×
        </button>
      </div>

      <p
        v-if="task.description"
        class="mt-1 whitespace-pre-line break-words text-sm text-slate-600 dark:text-slate-300"
        :class="{ 'text-slate-400 dark:text-slate-500': task.status === 'done' }"
      >
        {{ task.description }}
      </p>

      <div class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        <span class="text-xs font-medium text-slate-500 dark:text-slate-400">
          {{ task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低' }}优先级
        </span>
        <time v-if="task.dueDate" class="text-xs text-slate-500 dark:text-slate-400" :datetime="task.dueDate">
          截止 {{ formatDate(task.dueDate) }}
        </time>
        <span v-else class="text-xs text-slate-400 dark:text-slate-500">{{ formatDate(task.dueDate) }}</span>
      </div>
    </div>
  </article>
</template>