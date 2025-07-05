<script setup lang="ts">
    import { useDropzone } from '../../composables/useDropzone';
    import type { DOMElement, DraggableItem, DroppableOptions } from '../../types/types';
    import { provide, ref, useTemplateRef, type Ref } from 'vue';

    const props = defineProps<DroppableOptions>();

    const containerEl = useTemplateRef<DOMElement>('containerEl');
    const { containerId } = useDropzone(containerEl, props);
    const item = ref<DraggableItem | undefined>(undefined);

    provide<Ref<string | undefined>>('containerId', containerId);
</script>

<template>
    <div ref="containerEl">
        <slot name="item" :item="item" />
    </div>
</template>
