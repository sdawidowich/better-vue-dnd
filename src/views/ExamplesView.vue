<script setup lang="ts">
    import Draggable from '@/components/dnd/Draggable/Draggable.vue';
    import SortableContainer from '@/components/dnd/SortableContainer/SortableContainer.vue';
    import { ref, useId } from 'vue';

    function CreateItems() {
        return ref([
            {
                id: useId(),
                text: 'I am a draggable',
            },
            {
                id: useId(),
                text: 'I am another draggable',
            },
            {
                id: useId(),
                text: 'Yeah dog we got water, yeah dog we got flow',
            }
        ]);
    }
    
</script>

<template>
    <main>
        <h1>Examples</h1>

        <h2>Sortable Container</h2>
        <SortableContainer v-model:items="CreateItems().value" class="p-4 bg-neutral-800 border-2 border-neutral-600">
            <template #items="slotProps">
                <Draggable v-for="item in slotProps.items" :key="item?.text" :value="item" class="p-2 bg-neutral-800 border border-neutral-600">
                    {{ item?.text }}
                </Draggable>
            </template>
        </SortableContainer>
        
        <h2>Snap to Cursor</h2>
        <SortableContainer v-model:items="CreateItems().value" class="p-4 bg-neutral-800 border-2 border-neutral-600">
            <template #items="slotProps">
                <Draggable v-for="item in slotProps.items" :key="item?.text" :value="item" class="p-2 bg-neutral-800 border border-neutral-600" :options="{ snapToCursor: true }">
                    {{ item?.text }}
                </Draggable>
            </template>
        </SortableContainer>
        
        <h2>Horizontal Axis Sorting</h2>
        <SortableContainer v-model:items="CreateItems().value" class="flex p-4 bg-neutral-800 border-2 border-neutral-600">
            <template #items="slotProps">
                <Draggable v-for="item in slotProps.items" :key="item?.text" :value="item" class="flex-1/2 p-2 bg-neutral-800 border border-neutral-600" :options="{ axis: 'x' }">
                    {{ item?.text }}
                </Draggable>
            </template>
        </SortableContainer>
        
        <h2>Vertical Axis Sorting</h2>
        <SortableContainer v-model:items="CreateItems().value" class="p-4 bg-neutral-800 border-2 border-neutral-600">
            <template #items="slotProps">
                <Draggable v-for="item in slotProps.items" :key="item?.text" :value="item" class="p-2 bg-neutral-800 border border-neutral-600" :options="{ axis: 'y' }">
                    {{ item?.text }}
                </Draggable>
            </template>
        </SortableContainer>
    </main>
</template>
