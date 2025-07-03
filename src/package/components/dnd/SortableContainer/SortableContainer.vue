<script setup lang="ts">
import { useSortable } from '@/package/composables/useSortable';
import type { DOMElement, DraggableItem, DroppableOptions } from '@/package/types/types';
import { provide, useTemplateRef, type Ref, type StyleValue } from 'vue';

const props = defineProps<DroppableOptions>();
const itemsModel = defineModel<DraggableItem[]>('items', {
    default: () => [],
});

const containerEl = useTemplateRef<DOMElement>('containerEl');
const { containerId, activeStyles } = useSortable(containerEl, itemsModel, props);

provide<Ref<string | undefined>>('containerId', containerId);
provide<Ref<Record<string, StyleValue>>>('activeStyles', activeStyles);
</script>

<template>
    <div ref="containerEl">
        <slot v-for="item in itemsModel" :key="item.id" name="item" :item="item" />
    </div>
</template>
