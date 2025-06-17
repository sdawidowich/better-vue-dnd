<script setup lang="ts">
    import { useDroppable } from '@/composables/useDroppable';
    import type { DOMElement, DndDragEvent } from '@/types/types'
    import { ref } from 'vue';

    const props = defineProps<{
        onHover?: (event: DndDragEvent) => boolean,
        onDrop?: (event: DndDragEvent) => boolean
    }>();

    const itemModel = defineModel<Record<any, any> | undefined>('item');
    const dropzoneEl = ref<DOMElement>(null);

    useDroppable(dropzoneEl, itemModel, {
        onHover: props.onHover,
        onDrop: props.onDrop
    });
</script>

<template>
    <div ref="dropzoneEl">
        <slot />
    </div>
</template>
