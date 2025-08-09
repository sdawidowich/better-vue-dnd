# better-vue-dnd

A modern, flexible, and easy-to-use drag-and-drop library for Vue 3, designed for performance and developer experience. Build sortable lists, kanban boards, and custom drag-and-drop UIs with minimal effort.

---

## ✨ Features

- 🪄 **Simple API** — Intuitive, composable, and type-safe
- ⚡ **High Performance** — Optimized for smooth drag-and-drop
- 🧩 **Composable** — Use as components or composables
- 🎨 **Customizable** — Style overlays, handles, and dropzones
- 🛡️ **TypeScript Support** — Full typings for safety and autocompletion
- 🧪 **Tested** — Reliable and robust

---

## 🚀 Installation

```bash
pnpm add better-vue-dnd
# or
yarn add better-vue-dnd
# or
npm install better-vue-dnd
```

---

## 🛠️ Setup

Register [Pinia](https://pinia.vuejs.org/) in your root app (required for state management):

```js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.mount('#app')
```

---

## 📦 Usage

Import and use the components or composables in your Vue 3 app:

```vue
<script setup lang="ts">
import { Draggable, Dropzone, SortableContainer } from 'better-vue-dnd'
const items = ref(['A', 'B', 'C'])
</script>

<template>
  <SortableContainer v-model="items">
    <Draggable v-for="item in items" :key="item" :id="item">
      <div class="draggable-item">{{ item }}</div>
    </Draggable>
  </SortableContainer>
</template>
```

---

## 🧩 Components

- `<Draggable />` — Make any element draggable
- `<Dropzone />` — Define drop targets
- `<SortableContainer />` — Create sortable lists
- `<DraggableHandle />` — Add drag handles
- `<DraggableOverlay />` — Custom drag overlays

---

## 🪝 Composables

- `useDraggable()` — Add drag logic to any element
- `useDropzone()` — Make elements droppable
- `useSortable()` — Manage sortable lists
- `useDndContext()` — Access DnD context
- `useCollisionDetection()` — Custom collision logic
- `useEventBus()` — Listen to DnD events

---

## 📚 API Reference

See the [full documentation](https://github.com/sdawidowich/better-vue-dnd#readme) for detailed API and advanced usage.

---

## 🖼️ Example

```vue
<template>
  <SortableContainer v-model="tasks">
    <Draggable v-for="task in tasks" :key="task.id" :id="task.id">
      <div class="task">{{ task.title }}</div>
    </Draggable>
  </SortableContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { SortableContainer, Draggable } from 'better-vue-dnd'
const tasks = ref([
  { id: 1, title: 'Task 1' },
  { id: 2, title: 'Task 2' },
  { id: 3, title: 'Task 3' },
])
</script>
```

---

## 📝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to [open an issue](https://github.com/sdawidowich/better-vue-dnd/issues) or submit a pull request.

---

## 📄 License

[MIT](./LICENSE)
