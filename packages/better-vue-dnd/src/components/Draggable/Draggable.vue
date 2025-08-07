<script setup lang="ts">
    import type { DOMElement, DraggableItem } from '../../types/types';
    import { computed, inject, provide, useTemplateRef, type Ref, type StyleValue } from 'vue';
    import DraggableOverlay from '../DraggableOverlay/DraggableOverlay.vue';
    import { useDraggable, type UseDraggableOptions } from '../../composables/useDraggable';

    const props = withDefaults(
        defineProps<{
            value: DraggableItem;
            options?: UseDraggableOptions;
            asHandle?: boolean;
            overlay?: boolean;
        }>(),
        {
            options: () => ({}),
            asHandle: true,
            asOverlay: true,
        },
    );

    const draggableRef = useTemplateRef<DOMElement>('draggableEl');
    const overlayRef = useTemplateRef<InstanceType<typeof DraggableOverlay>>('overlayComponent');
    const overlayEl = computed<DOMElement>(() =>
        overlayRef.value ? overlayRef.value.el : null,
    );
    const containerId = inject<Ref<string | undefined> | undefined>('containerId');
    const activeStyles = inject<Ref<Record<string, StyleValue>> | undefined>('activeStyles');

    const { rect, isDragging, overlayStyle, registerHandle } = useDraggable(
        draggableRef,
        overlayEl,
        props.value,
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
        :style="activeStyles ? activeStyles[value.id] : undefined"
    >
        <slot />
    </div>
    <Teleport to="body">
        <DraggableOverlay
            ref="overlayComponent"
            :visible="isDragging"
            :elBounds="rect"
            :activeStyle="overlayStyle"
        >
            <slot name="overlay">
                <div v-bind="$attrs">
                    <slot />
                </div>
            </slot>
        </DraggableOverlay>
    </Teleport>
</template>
