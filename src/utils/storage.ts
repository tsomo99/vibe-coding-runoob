import type { Task } from '../types/task'

const STORAGE_KEY = 'vibe-coding-runoob-tasks'

export function saveTasks(tasks: Task[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  } catch {
    // Storage may be unavailable or full; keep the in-memory task state usable.
  }
}

export function loadTasks(): Task[] {
  try {
    const storedTasks = localStorage.getItem(STORAGE_KEY)
    if (!storedTasks) return []

    const parsedTasks: unknown = JSON.parse(storedTasks)
    return Array.isArray(parsedTasks) ? parsedTasks as Task[] : []
  } catch {
    return []
  }
}

export function hasSavedTasks() {
  try {
    return localStorage.getItem(STORAGE_KEY) !== null
  } catch {
    return false
  }
}