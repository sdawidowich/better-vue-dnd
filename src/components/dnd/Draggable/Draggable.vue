<script setup lang="ts">
    import type { DOMElement, DraggableItem } from '@/types/types'
    import { computed, inject, provide, useTemplateRef, type Ref, type StyleValue } from 'vue'
    import DraggableOverlay from '../DraggableOverlay/DraggableOverlay.vue';
    import { useDraggable, type UseDraggableOptions } from '@/composables/useDraggable';

    const props = withDefaults(
        defineProps<{
            value: DraggableItem,
            options?: UseDraggableOptions,
            asHandle?: boolean,
            overlay?: boolean,
        }>(),
        {
            options: () => ({}),
            asHandle: true,
            asOverlay: true,
        },
    );

    const draggableEl = useTemplateRef<DOMElement>("draggableEl");
    const overlayComponent = useTemplateRef<InstanceType<typeof DraggableOverlay>>("overlayComponent");
    const overlayEl = computed<DOMElement>(() => overlayComponent.value ? overlayComponent.value.el : null);
    const containerId = inject<Ref<string | undefined> | undefined>('containerId');
    const activeStyles = inject<Ref<Record<string, StyleValue>> | undefined>('activeStyles');

    const { rect, isDragging, overlayStyle, registerHandle } = useDraggable(draggableEl, overlayEl, props.value, containerId, props.options);
    
    provide('registerHandle', registerHandle);
</script>

<template>
    <div
        ref="draggableEl"
        class="touch-none select-none cursor-pointer z-30"
        v-bind=$attrs
        :style="activeStyles ? activeStyles[value.id] : undefined"
    >
        <slot />
    </div>
    <Teleport to="body">
        <DraggableOverlay ref="overlayComponent" v-bind=$attrs :visible="isDragging" :elBounds="rect" :activeStyle="overlayStyle">
            <slot />
        </DraggableOverlay>
    </Teleport>
</template>
