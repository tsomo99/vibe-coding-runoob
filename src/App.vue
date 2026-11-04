<script setup lang="ts">
import { computed, ref } from 'vue'
import KanbanBoard from './components/KanbanBoard.vue'
import TaskList from './components/TaskList.vue'
import TaskModal from './components/TaskModal.vue'
import ThemeToggle from './components/ThemeToggle.vue'
import { addTask, deleteTask, taskStore, updateTask } from './stores/taskStore'
import type { Task, TaskStatus } from './types/task'

const isTaskModalOpen = ref(false)
const isMobileMenuOpen = ref(false)
const activeView = ref<'list' | 'kanban'>('list')
const completedCount = computed(() => taskStore.tasks.filter((task) => task.status === 'done').length)

function toggleTask(task: Task) {
  updateTask(task.id, { status: task.status === 'done' ? 'todo' : 'done' })
}

function moveTask(taskId: string, status: TaskStatus) {
  updateTask(taskId, { status })
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
    <header class="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <nav class="mx-auto max-w-6xl px-5 sm:px-8" aria-label="主导航">
        <div class="flex h-16 items-center justify-between">
          <a href="#" class="flex items-center gap-3 text-slate-900 no-underline dark:text-slate-100">
            <span class="grid size-9 place-items-center rounded-lg bg-indigo-600 text-sm font-bold text-white">V</span>
            <span class="text-base font-semibold tracking-tight">Vibe Coding Runoob</span>
          </a>
          <div class="flex items-center gap-2 sm:gap-5">
            <span class="hidden text-sm text-slate-500 dark:text-slate-400 sm:block">专注当下，逐个完成</span>
            <ThemeToggle />
            <button
              class="grid size-11 place-items-center rounded-md text-slate-600 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:text-slate-300 dark:hover:bg-slate-800 sm:hidden"
              type="button"
              :aria-label="isMobileMenuOpen ? '关闭导航菜单' : '打开导航菜单'"
              :aria-expanded="isMobileMenuOpen"
              aria-controls="mobile-nav-menu"
              @click="isMobileMenuOpen = !isMobileMenuOpen"
            >
              <span class="sr-only">导航菜单</span>
              <span class="flex w-5 flex-col gap-1.5" aria-hidden="true">
                <span class="h-0.5 w-full rounded bg-current"></span>
                <span class="h-0.5 w-full rounded bg-current"></span>
                <span class="h-0.5 w-full rounded bg-current"></span>
              </span>
            </button>
          </div>
        </div>
        <nav v-if="isMobileMenuOpen" id="mobile-nav-menu" class="border-t border-slate-200 py-3 dark:border-slate-800 sm:hidden" aria-label="视图导航">
          <div class="grid grid-cols-2 gap-2">
            <button
              class="min-h-11 rounded-md px-3 text-sm font-medium transition-colors"
              :class="activeView === 'list' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'"
              type="button"
              @click="activeView = 'list'; isMobileMenuOpen = false"
            >
              列表
            </button>
            <button
              class="min-h-11 rounded-md px-3 text-sm font-medium transition-colors"
              :class="activeView === 'kanban' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'"
              type="button"
              @click="activeView = 'kanban'; isMobileMenuOpen = false"
            >
              看板
            </button>
          </div>
        </nav>
      </nav>
    </header>

    <main class="mx-auto max-w-6xl px-5 pb-16 pt-10 sm:px-8 sm:pt-14">
      <section class="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p class="mb-2 text-sm font-medium text-indigo-600">我的工作区</p>
          <h1 class="text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-100">任务清单</h1>
          <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">把想法变成一步步的进展。</p>
        </div>
        <div class="flex flex-wrap items-center gap-4">
          <div class="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400" aria-live="polite">
            <span class="size-2 rounded-full bg-indigo-500"></span>
            已完成 {{ completedCount }} / {{ taskStore.tasks.length }} 项
          </div>
          <TaskModal v-model="isTaskModalOpen" @create="addTask" />
        </div>
      </section>

      <div class="mb-5 flex gap-1 border-b border-slate-200 dark:border-slate-800" role="tablist" aria-label="任务视图">
        <button
          class="min-h-11 border-b-2 px-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          :class="activeView === 'list' ? 'border-indigo-600 text-indigo-700 dark:border-indigo-400 dark:text-indigo-300' : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100'"
          type="button"
          role="tab"
          :aria-selected="activeView === 'list'"
          @click="activeView = 'list'"
        >
          列表
        </button>
        <button
          class="min-h-11 border-b-2 px-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          :class="activeView === 'kanban' ? 'border-indigo-600 text-indigo-700 dark:border-indigo-400 dark:text-indigo-300' : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100'"
          type="button"
          role="tab"
          :aria-selected="activeView === 'kanban'"
          @click="activeView = 'kanban'"
        >
          看板
        </button>
      </div>

      <TaskList
        v-if="activeView === 'list'"
        :tasks="taskStore.tasks"
        @toggle="toggleTask"
        @delete="deleteTask($event.id)"
      />
      <KanbanBoard
        v-else
        :tasks="taskStore.tasks"
        @toggle="toggleTask"
        @delete="deleteTask($event.id)"
        @update-status="moveTask"
      />

      <p class="mt-4 text-xs text-slate-400 dark:text-slate-500">任务数据为演示内容</p>
    </main>
  </div>
</template>
