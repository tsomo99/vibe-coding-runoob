<script setup lang="ts">
import { onMounted, ref } from 'vue'

const STORAGE_KEY = 'vibe-coding-runoob-theme'
const isDark = ref(false)

function applyTheme(dark: boolean) {
  document.documentElement.classList.toggle('dark', dark)
}

function toggleTheme() {
  isDark.value = !isDark.value
  applyTheme(isDark.value)

  try {
    localStorage.setItem(STORAGE_KEY, isDark.value ? 'dark' : 'light')
  } catch {
    // Keep the theme usable when browser storage is unavailable.
  }
}

onMounted(() => {
  let savedTheme: string | null = null

  try {
    savedTheme = localStorage.getItem(STORAGE_KEY)
  } catch {
    // Fall back to the system preference when browser storage is unavailable.
  }

  isDark.value = savedTheme === 'dark'
    || (savedTheme !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  applyTheme(isDark.value)
})
</script>

<template>
  <button
    class="grid size-11 place-items-center rounded-md border border-slate-200 text-lg text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
    type="button"
    :aria-label="isDark ? '切换到亮色模式' : '切换到深色模式'"
    :title="isDark ? '切换到亮色模式' : '切换到深色模式'"
    @click="toggleTheme"
  >
    <span aria-hidden="true">{{ isDark ? '☀' : '☾' }}</span>
  </button>
</template>