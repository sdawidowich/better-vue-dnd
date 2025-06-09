<script setup lang="ts">
import Draggable from '@/components/dnd/Draggable/Draggable.vue';
import Dropzone from '@/components/dnd/Dropzone/Dropzone.vue';

</script>

<template>
    <main>
        <h1>Examples</h1>

        <Dropzone class="p-4 bg-neutral-800 border-2 border-neutral-600">
            <Draggable class="p-2 border border-neutral-600" >
                <p>I am a draggable</p>
            </Draggable>
            <Draggable class="p-2 border border-neutral-600" >
                <p>I am another draggable</p>
            </Draggable>
        </Dropzone>

        <Dropzone class="p-4 bg-neutral-800 border-2 border-neutral-600">
            <p>Dropzone</p>
        </Dropzone>
    </main>
</template>
