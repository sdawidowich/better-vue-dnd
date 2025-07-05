<script setup lang="ts">
    import type { DOMElement, DraggableItem } from '../../types/types';
    import { computed, inject, onMounted, provide, useTemplateRef, type Ref, type StyleValue } from 'vue';
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

    const draggableEl = useTemplateRef<DOMElement>("draggableEl");
    const overlayComponent = useTemplateRef<InstanceType<typeof DraggableOverlay>>('overlayComponent');
    const overlayEl = computed<DOMElement>(() => {
        console.log("Update overlay el", overlayComponent.value);
        return overlayComponent.value ? overlayComponent.value.el : null
    });
    const containerId = inject<Ref<string | undefined> | undefined>('containerId');
    const activeStyles = inject<Ref<Record<string, StyleValue>> | undefined>('activeStyles');

    const { rect, isDragging, overlayStyle, registerHandle } = useDraggable(
        draggableEl,
        overlayEl,
        props.item,
        containerId,
        props.options,
    );

    provide('registerHandle', registerHandle);

    onMounted(() => {
        console.log("Mounted draggable")
    })
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
