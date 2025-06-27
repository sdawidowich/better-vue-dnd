<script setup lang="ts">
    import { useSortable } from '@/composables/useSortable';
    import type { DraggableItem, DroppableOptions } from '@/types/types'
    import { provide, ref, type ComponentPublicInstance, type Ref } from 'vue';

    const props = defineProps<DroppableOptions>();
    const itemsModel = defineModel<DraggableItem[]>('items', {
        default: () => [],
    });

    const containerEl = ref<ComponentPublicInstance>();
    const { containerId } = useSortable(containerEl, itemsModel, props);

    provide<Ref<string | undefined>>('containerId', containerId);
</script>

<template>
    <div ref="containerEl">
        <slot name="items" :items="itemsModel" />
    </div>
</template>
