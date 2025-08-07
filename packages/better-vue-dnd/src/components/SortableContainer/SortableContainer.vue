<script setup lang="ts">
    import { useSortable } from '../../composables/useSortable';
    import type { DOMElement, DraggableItem, DroppableOptions } from '../../types/types';
    import { provide, useTemplateRef, type Ref, type StyleValue } from 'vue';

    const props = defineProps<DroppableOptions>();
    const itemsModel = defineModel<DraggableItem[]>('items', {
        default: () => [],
    });

    const containerRef = useTemplateRef<DOMElement>('containerEl');
    const { containerId, activeStyles } = useSortable(containerRef, itemsModel, props);

    provide<Ref<string | undefined>>('containerId', containerId);
    provide<Ref<Record<string, StyleValue>>>('activeStyles', activeStyles);
</script>

<template>
    <div ref="containerEl">
        <slot v-for="item in itemsModel" :key="item.id" name="item" :item="item" />
    </div>
</template>
