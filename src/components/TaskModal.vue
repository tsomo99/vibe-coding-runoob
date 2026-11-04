<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import type { Task, TaskPriority } from '../types/task'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [isOpen: boolean]
  create: [task: Task]
}>()

const titleError = ref('')
const form = reactive<{
  title: string
  description: string
  priority: TaskPriority
}>({
  title: '',
  description: '',
  priority: 'medium',
})

function closeModal() {
  emit('update:modelValue', false)
  titleError.value = ''
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.modelValue) closeModal()
}

function submitTask() {
  const title = form.title.trim()
  if (!title) {
    titleError.value = '标题不能为空'
    return
  }

  emit('create', {
    id: crypto.randomUUID(),
    title,
    description: form.description.trim(),
    status: 'todo',
    priority: form.priority,
    dueDate: null,
    createdAt: new Date().toISOString(),
  })

  form.title = ''
  form.description = ''
  form.priority = 'medium'
  closeModal()
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', handleKeydown))
</script>

<template>
  <button
    class="inline-flex min-h-11 items-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      type="button"
      @click="emit('update:modelValue', true)"
    >
      <span aria-hidden="true" class="text-lg leading-none">+</span>
      新建任务
    </button>

    <Teleport to="body">
      <div
        v-if="props.modelValue"
        class="fixed inset-0 z-50 grid items-end overflow-y-auto bg-slate-950/50 p-0 sm:place-items-center sm:p-4"
        @click.self="closeModal"
      >
        <section
          aria-labelledby="task-modal-title"
          aria-modal="true"
          class="animate-[mobile-sheet-in_220ms_ease-out] max-h-[90dvh] w-full overflow-y-auto rounded-t-xl bg-white p-5 shadow-xl dark:bg-slate-900 sm:max-w-lg sm:animate-none sm:rounded-xl sm:p-6"
          role="dialog"
        >
          <div class="mb-6">
            <h2 id="task-modal-title" class="text-lg font-semibold text-slate-900 dark:text-slate-100">新建任务</h2>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">填写任务信息，稍后也可以继续编辑。</p>
          </div>

          <form class="space-y-5" @submit.prevent="submitTask">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300" for="task-title">标题</label>
              <input
                id="task-title"
                v-model="form.title"
                :aria-invalid="Boolean(titleError)"
                :aria-describedby="titleError ? 'task-title-error' : undefined"
                autofocus
                class="min-h-11 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-base text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-indigo-900"
                placeholder="输入任务标题"
                type="text"
                @input="titleError = ''"
              />
              <p v-if="titleError" id="task-title-error" class="mt-1.5 text-sm text-red-600 dark:text-red-400" role="alert">
                {{ titleError }}
              </p>
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300" for="task-description">描述</label>
              <textarea
                id="task-description"
                v-model="form.description"
                class="min-h-24 w-full resize-y rounded-md border border-slate-300 bg-white px-3 py-2 text-base text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-indigo-900"
                placeholder="补充任务细节（选填）"
                rows="3"
              ></textarea>
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300" for="task-priority">优先级</label>
              <select
                id="task-priority"
                v-model="form.priority"
                class="min-h-11 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-base text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-indigo-900"
              >
                <option value="low">低</option>
                <option value="medium">中</option>
                <option value="high">高</option>
              </select>
            </div>

            <div class="flex justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
              <button
                class="min-h-11 rounded-md px-4 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 dark:text-slate-300 dark:hover:bg-slate-800"
                type="button"
                @click="closeModal"
              >
                取消
              </button>
              <button
                class="min-h-11 rounded-md bg-indigo-600 px-4 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                type="submit"
              >
                创建任务
              </button>
            </div>
          </form>
        </section>
      </div>
    </Teleport>
</template>