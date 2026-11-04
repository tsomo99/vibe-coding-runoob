import { reactive, watch } from 'vue'
import type { Task } from '../types/task'
import { hasSavedTasks, loadTasks, saveTasks } from '../utils/storage'

function createSampleTasks(): Task[] {
  return [
    {
      id: 'sample-task-1',
      title: '完成任务管理页面',
      description: '搭建任务列表并完成基础布局。',
      status: 'in-progress',
      priority: 'high',
      dueDate: '2026-11-06',
      createdAt: '2026-11-03T09:00:00.000Z',
    },
    {
      id: 'sample-task-2',
      title: '整理下一阶段需求',
      description: '列出需要补充的交互和数据持久化功能。',
      status: 'todo',
      priority: 'medium',
      dueDate: '2026-11-10',
      createdAt: '2026-11-02T09:00:00.000Z',
    },
    {
      id: 'sample-task-3',
      title: '检查移动端页面布局',
      description: '确认任务卡片和筛选按钮在窄屏下正常显示。',
      status: 'done',
      priority: 'low',
      dueDate: null,
      createdAt: '2026-11-01T09:00:00.000Z',
    },
  ]
}

const initialTasks = hasSavedTasks() ? loadTasks() : createSampleTasks()

if (!hasSavedTasks()) saveTasks(initialTasks)

export const taskStore = reactive({
  tasks: initialTasks,
})

watch(
  () => taskStore.tasks,
  (tasks) => saveTasks(tasks),
  { deep: true },
)

export function addTask(task: Task) {
  taskStore.tasks.unshift(task)
}

export function updateTask(taskId: string, updates: Partial<Task>) {
  const task = taskStore.tasks.find((item) => item.id === taskId)
  if (task) Object.assign(task, updates)
}

export function deleteTask(taskId: string) {
  const taskIndex = taskStore.tasks.findIndex((task) => task.id === taskId)
  if (taskIndex !== -1) taskStore.tasks.splice(taskIndex, 1)
}