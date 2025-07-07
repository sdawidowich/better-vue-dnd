<script setup lang="ts">
    import type { DOMElement, DraggableItem } from '../../types/types';
    import { computed, inject, provide, useTemplateRef, type Ref, type StyleValue } from 'vue';
    import DraggableOverlay from '../DraggableOverlay/DraggableOverlay.vue';
    import { useDraggable, type UseDraggableOptions } from '../../composables/useDraggable';

    const props = withDefaults(
        defineProps<{
            item: DraggableItem;
            options?: UseDraggableOptions;
            asHandle?: boolean;
        }>(),
        {
            options: () => ({}),
            asHandle: true
        },
    );

    const el = useTemplateRef<DOMElement>("draggableEl");
    const overlayComponent = useTemplateRef<InstanceType<typeof DraggableOverlay>>('overlayComponent');
    const overlayEl = computed<DOMElement>(() => overlayComponent.value ? overlayComponent.value.el : null);
    const containerId = inject<Ref<string | undefined> | undefined>('containerId');
    const activeStyles = inject<Ref<Record<string, StyleValue>> | undefined>('activeStyles');

    const { rect, isDragging, overlayStyle, registerHandle } = useDraggable(
        el,
        overlayEl,
        props.item,
        containerId,
        props.options,
    );

    provide('registerHandle', registerHandle);
</script>

<template>
    <div
        ref="draggableEl"
        class="touch-none select-none cursor-pointer z-30"
        v-bind="$attrs"
        :style="activeStyles ? activeStyles[item.id] : undefined"
    >
        <slot />
    </div>
    <Teleport to="body">
        <DraggableOverlay
            ref="overlayComponent"
            :visible="isDragging"
            :elBounds="rect"
            :overlayStyle="overlayStyle"
        >
            <slot name="overlay">
                <div v-bind="$attrs">
                    <slot />
                </div>
            </slot>
        </DraggableOverlay>
    </Teleport>
</template>
