<script setup lang="ts">
    import Draggable from '@/components/dnd/Draggable/Draggable.vue';
    import Dropzone from '@/components/dnd/Dropzone/Dropzone.vue';
    import { ref } from 'vue';

    const items = ref([
        {
            text: 'I am a draggable',
        },
        {
            text: 'I am another draggable',
        },
        {
            text: 'Yeah dog we got water, yeah dog we got flow',
        }
    ]);
</script>

<template>
    <main>
        <h1>Examples</h1>

        <h2>Drag-n-Drop to Dropzone</h2>
        <div>
            <h2>Items</h2>
            <Draggable v-for="(item, index) in items" :key="index" class="p-2 bg-neutral-800 border border-neutral-600">
                {{ item.text }}
            </Draggable>
        </div>
        <Dropzone class="p-4 bg-neutral-800 border-2 border-neutral-600">
            <template #draggable="slotProps">
                <Draggable :key="slotProps.item?.text" class="p-2 bg-neutral-800 border border-neutral-600">
                    {{ slotProps.item?.text }}
                </Draggable>
            </template>
        </Dropzone>

        <Dropzone class="p-4 bg-neutral-800 border-2 border-neutral-600">
            <p>Dropzone</p>
        </Dropzone>

        <h2>Snap to Cursor</h2>
        <Dropzone class="p-4 bg-neutral-800 border-2 border-neutral-600">
        </Dropzone>

        <Dropzone class="p-4 bg-neutral-800 border-2 border-neutral-600">
            <p>Dropzone</p>
        </Dropzone>
        
        <h2>Hortizontal Drag-n-Drop</h2>
        <Dropzone class="p-4 bg-neutral-800 border-2 border-neutral-600">
            <Draggable class="p-2 bg-neutral-800 border border-neutral-600" :options="{axis: 'x'}">
                <p>I am a draggable</p>
            </Draggable>
            <Draggable class="p-2 bg-neutral-800 border border-neutral-600" :options="{axis: 'x'}">
                <p>I am another draggable</p>
            </Draggable>
            <Draggable class="p-2 bg-neutral-800 border border-neutral-600" :options="{axis: 'x'}">
                <p>Yeah dog we got water, yeah dog we got flow</p>
            </Draggable>
        </Dropzone>

        <Dropzone class="p-4 bg-neutral-800 border-2 border-neutral-600">
            <p>Dropzone</p>
        </Dropzone>

        <h2>Vertical Drag-n-Drop</h2>
        <Dropzone class="p-4 bg-neutral-800 border-2 border-neutral-600">
            <Draggable class="p-2 bg-neutral-800 border border-neutral-600" :options="{axis: 'y'}">
                <p>I am a draggable</p>
            </Draggable>
            <Draggable class="p-2 bg-neutral-800 border border-neutral-600" :options="{axis: 'y'}">
                <p>I am another draggable</p>
            </Draggable>
            <Draggable class="p-2 bg-neutral-800 border border-neutral-600" :options="{axis: 'y'}">
                <p>Yeah dog we got water, yeah dog we got flow</p>
            </Draggable>
        </Dropzone>

        <Dropzone class="p-4 bg-neutral-800 border-2 border-neutral-600">
            <p>Dropzone</p>
        </Dropzone>
    </main>
</template>
