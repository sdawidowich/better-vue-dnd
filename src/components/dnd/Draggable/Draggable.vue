<script setup lang="ts">
    import type { DOMElement, DraggableItem } from '@/types/types'
    import { computed, inject, ref, type Ref } from 'vue'
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

    const draggableEl = ref<DOMElement>();
    const overlayComponent = ref<InstanceType<typeof DraggableOverlay>>();
    const overlayEl = computed<DOMElement>(() => overlayComponent.value ? overlayComponent.value.el : null);
    const containerId = inject<Ref<string | undefined> | undefined>('containerId');

    const { rect, isDragging, transform } = useDraggable(draggableEl, overlayEl, props.value, containerId, props.options);
</script>

<template>
    <div
        ref="draggableEl"
        class="touch-none select-none cursor-pointer z-30"
    >
        <slot />
        <Teleport to="body">
            <DraggableOverlay ref="overlayComponent" v-bind=$attrs :visible="isDragging" :el-bounds="rect" :transform="transform">
                <slot />
            </DraggableOverlay>
        </Teleport>
    </div>
</template>
