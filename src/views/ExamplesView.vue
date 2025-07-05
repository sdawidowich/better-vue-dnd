<script setup lang="ts">
    import { ref, useId } from 'vue';
    import { SortableContainer, Draggable, DraggableHandle } from 'better-vue-dnd'

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
    <main>
        <h1>Examples</h1>

        <h2>Sortable Container</h2>
        <SortableContainer v-model:items="items0" class="flex flex-col gap-2 p-4 bg-neutral-800 border-2 border-neutral-600">
            <template #item="slotProps">
                <Draggable :key="slotProps.item?.text" :item="slotProps.item" class="p-2 bg-neutral-800 border border-neutral-600">
                    {{ slotProps.item?.text }}
                </Draggable>
            </template>
        </SortableContainer>
        
        <h2>Snap to Cursor</h2>
        <SortableContainer v-model:items="items1" class="flex flex-col gap-2 p-4 bg-neutral-800 border-2 border-neutral-600">
            <template #item="slotProps">
                <Draggable :key="slotProps.item?.text" :item="slotProps.item" class="p-2 bg-neutral-800 border border-neutral-600" :options="{ snapToCursor: true }">
                    {{ slotProps.item?.text }}
                </Draggable>
            </template>
        </SortableContainer>
        
        <h2>Horizontal Axis Sorting</h2>
        <SortableContainer v-model:items="items2" class="flex gap-2 p-4 bg-neutral-800 border-2 border-neutral-600">
            <template #item="slotProps">
                <Draggable :key="slotProps.item?.text" :item="slotProps.item" class="flex-1 p-2 bg-neutral-800 border border-neutral-600" :options="{ axis: 'x' }">
                    {{ slotProps.item?.text }}
                </Draggable>
            </template>
        </SortableContainer>
        
        <h2>Vertical Axis Sorting</h2>
        <SortableContainer v-model:items="items3" class="flex flex-col gap-2 p-4 bg-neutral-800 border-2 border-neutral-600">
            <template #item="slotProps">
                <Draggable :key="slotProps.item?.text" :item="slotProps.item" class="p-2 bg-neutral-800 border border-neutral-600" :options="{ axis: 'y' }">
                    {{ slotProps.item?.text }}
                </Draggable>
            </template>
        </SortableContainer>
        
        <h2>Sorting with a handle</h2>
        <SortableContainer v-model:items="items4" class="flex flex-col gap-2 p-4 bg-neutral-800 border-2 border-neutral-600">
            <template #item="slotProps">
                <Draggable :key="slotProps.item?.text" :item="slotProps.item" class="flex gap-2 p-2 bg-neutral-800 border border-neutral-600" :options="{ axis: 'y' }">
                    <DraggableHandle />
                    {{ slotProps.item?.text }}
                </Draggable>
            </template>
        </SortableContainer>
        
        <h2>Custom overlay</h2>
        <SortableContainer v-model:items="items5" class="flex flex-col gap-2 p-4 bg-neutral-800 border-2 border-neutral-600">
            <template #item="slotProps">
                <Draggable :key="slotProps.item?.text" :item="slotProps.item" class="flex gap-2 p-2 bg-neutral-800 border border-neutral-600" :options="{ axis: 'y' }">
                    {{ slotProps.item?.text }}
                    <template #overlay>
                        <div class="p-2 bg-neutral-400 border-neutral-400 opacity-30 h-full">
                            
                        </div>
                    </template>
                </Draggable>
            </template>
        </SortableContainer>
        
        <h2>Custom overlay</h2>
        <SortableContainer v-model:items="items6" class="grid grid-cols-3 gap-2 p-4 bg-neutral-800 border-2 border-neutral-600">
            <template #item="slotProps">
                <Draggable :key="slotProps.item?.text" :item="slotProps.item" class="flex gap-2 p-2 bg-neutral-800 border border-neutral-600">
                    {{ slotProps.item?.text }}
                    <template #overlay>
                        <div class="p-2 bg-neutral-400 border-neutral-400 opacity-30 h-full">
                            
                        </div>
                    </template>
                </Draggable>
            </template>
        </SortableContainer>
    </main>
</template>
