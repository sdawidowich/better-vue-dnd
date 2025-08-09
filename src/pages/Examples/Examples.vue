<script setup lang="ts">
    import { ref, useId } from 'vue';
    import { SortableContainer, Draggable, DraggableHandle } from 'better-vue-dnd'

    // Base utility classes for styling
    const containerBase = 'rounded-xl border border-neutral-700/70 bg-neutral-800/60 backdrop-blur-sm shadow-sm p-4 transition-colors';
    const verticalContainer = `${containerBase} flex flex-col gap-2`;
    const horizontalContainer = `${containerBase} flex gap-2 items-stretch`;
    const gridContainer = `${containerBase} grid grid-cols-3 gap-2`;

    const itemBase = 'p-2 rounded-md bg-neutral-900/70 border border-neutral-700 text-neutral-200 hover:border-neutral-500 active:border-neutral-400 transition-colors cursor-grab active:cursor-grabbing select-none flex items-center gap-2';

    const items0 = ref(CreateItems());
    const items1 = ref(CreateItems());
    const items2 = ref(CreateItems());
    const items3 = ref(CreateItems());
    const items4 = ref(CreateItems());
    const items5 = ref(CreateItems());
    const items6 = ref(GridItems());

    function CreateItems() {
        return [
            { id: useId(), text: 'I am a draggable' },
            { id: useId(), text: 'I am another draggable' },
            { id: useId(), text: 'Yeah dog we got water, yeah dog we got flow' }
        ];
    }

    function GridItems() {
        return [
            { id: useId(), text: '1' },
            { id: useId(), text: '2' },
            { id: useId(), text: '3' },
            { id: useId(), text: '4' },
            { id: useId(), text: '5' },
            { id: useId(), text: '6' },
            { id: useId(), text: '7' },
            { id: useId(), text: '8' },
            { id: useId(), text: '9' }
        ];
    }

</script>

<template>
    <main class="flex flex-col gap-8 text-neutral-100">
        <header>
            <h1 class="text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-transparent">Examples</h1>
            <p class="text-sm text-neutral-400">Interactive demo of the <code class="text-emerald-400">better-vue-dnd</code> components.</p>
        </header>

        <!-- Sortable Container Basic -->
        <section class="flex flex-col gap-2">
            <h2 class="text-xl font-semibold flex items-center gap-2">
                <span class="h-2 w-2 rounded-full bg-emerald-400" /> Basic Sortable Container
            </h2>
            <p class="text-xs text-neutral-400">Drag items freely on the vertical axis with default behavior.</p>
            <SortableContainer v-model:items="items0" :class="verticalContainer">
                <template #item="{ item }">
                    <Draggable :key="item?.id" :item="item" :class="itemBase">
                        {{ item?.text }}
                    </Draggable>
                </template>
            </SortableContainer>
        </section>

        <!-- Snap to Cursor -->
        <section class="flex flex-col gap-2">
            <h2 class="text-xl font-semibold flex items-center gap-2">
                <span class="h-2 w-2 rounded-full bg-sky-400" /> Snap To Cursor
            </h2>
            <p class="text-xs text-neutral-400">Element jumps under the pointer while dragging.</p>
            <SortableContainer v-model:items="items1" :class="verticalContainer">
                <template #item="{ item }">
                    <Draggable :key="item?.id" :item="item" :class="itemBase" :options="{ snapToCursor: true }">
                        {{ item?.text }}
                    </Draggable>
                </template>
            </SortableContainer>
        </section>

        <!-- Horizontal Axis -->
        <section class="flex flex-col gap-2">
            <h2 class="text-xl font-semibold flex items-center gap-2">
                <span class="h-2 w-2 rounded-full bg-fuchsia-400" /> Horizontal Axis Sorting
            </h2>
            <p class="text-xs text-neutral-400">Restrict movement to the X axis.</p>
            <SortableContainer v-model:items="items2" :class="horizontalContainer">
                <template #item="{ item }">
                    <Draggable :key="item?.id" :item="item" :class="itemBase + ' flex-1 justify-center text-center'" :options="{ axis: 'x' }">
                        {{ item?.text }}
                    </Draggable>
                </template>
            </SortableContainer>
        </section>

        <!-- Vertical Axis -->
        <section class="flex flex-col gap-2">
            <h2 class="text-xl font-semibold flex items-center gap-2">
                <span class="h-2 w-2 rounded-full bg-orange-400" /> Vertical Axis Sorting
            </h2>
            <p class="text-xs text-neutral-400">Restrict movement to the Y axis.</p>
            <SortableContainer v-model:items="items3" :class="verticalContainer">
                <template #item="{ item }">
                    <Draggable :key="item?.id" :item="item" :class="itemBase" :options="{ axis: 'y' }">
                        {{ item?.text }}
                    </Draggable>
                </template>
            </SortableContainer>
        </section>

        <!-- Handle -->
        <section class="flex flex-col gap-2">
            <h2 class="text-xl font-semibold flex items-center gap-2">
                <span class="h-2 w-2 rounded-full bg-amber-400" /> Sorting With Handle
            </h2>
            <p class="text-xs text-neutral-400">Only the handle region initiates drag operations.</p>
            <SortableContainer v-model:items="items4" :class="verticalContainer">
                <template #item="{ item }">
                    <Draggable :key="item?.id" :item="item" :class="itemBase" :options="{ axis: 'y' }">
                        <DraggableHandle class="shrink-0 w-7 h-7 flex items-center justify-center rounded-md bg-neutral-700/70 hover:bg-neutral-600/70 text-neutral-300 border border-neutral-600 active:border-neutral-500" />
                        <span class="flex-1">{{ item?.text }}</span>
                    </Draggable>
                </template>
            </SortableContainer>
        </section>

        <!-- Custom Overlay -->
        <section class="flex flex-col gap-2">
            <h2 class="text-xl font-semibold flex items-center gap-2">
                <span class="h-2 w-2 rounded-full bg-rose-400" /> Custom Overlay
            </h2>
            <p class="text-xs text-neutral-400">Demonstrates a translucent overlay while dragging.</p>
            <SortableContainer v-model:items="items5" :class="verticalContainer">
                <template #item="{ item }">
                    <Draggable :key="item?.id" :item="item" :class="itemBase" :options="{ axis: 'y' }">
                        <span class="flex-1">{{ item?.text }}</span>
                        <template #overlay>
                            <div class="p-2 rounded-md bg-emerald-400/20 border border-emerald-400/40 ring-2 ring-emerald-300/30 h-full w-full"></div>
                        </template>
                    </Draggable>
                </template>
            </SortableContainer>
        </section>

        <!-- Grid Layout -->
        <section class="flex flex-col gap-2">
            <h2 class="text-xl font-semibold flex items-center gap-2">
                <span class="h-2 w-2 rounded-full bg-teal-400" /> Grid Layout
            </h2>
            <p class="text-xs text-neutral-400">Items arranged in a responsive grid; drag to reorder.</p>
            <SortableContainer v-model:items="items6" :class="gridContainer">
                <template #item="{ item }">
                    <Draggable :key="item?.id" :item="item" :class="itemBase + ' justify-center text-lg font-medium'">
                        {{ item?.text }}
                        <template #overlay>
                            <div class="p-2 rounded-md bg-sky-400/20 border border-sky-400/40 ring-2 ring-sky-300/30 h-full w-full"></div>
                        </template>
                    </Draggable>
                </template>
            </SortableContainer>
        </section>
    </main>
</template>
