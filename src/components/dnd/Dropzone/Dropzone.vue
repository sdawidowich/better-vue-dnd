<script setup lang="ts">
    import { useDndContext } from '@/composables/useDndContext';
import { useDroppable } from '@/composables/useDroppable';
    import type { DOMElement, DndDragEvent } from '@/types/types'
    import { ref } from 'vue';

    const props = defineProps<{
        onHover?: (event: DndDragEvent) => boolean,
        onDrop?: (event: DndDragEvent) => boolean
    }>();

    const itemModel = defineModel<Record<any, any> | undefined>('item');
    const dropzoneEl = ref<DOMElement>(null);

    const dndContext = useDndContext();
    useDroppable(dropzoneEl, itemModel, {
        onHover: props.onHover,
        onDrop: props.onDrop
    });
</script>

<template>
    <div ref="dropzoneEl">
        <slot name="draggable" :item="itemModel" />
    </div>
</template>
