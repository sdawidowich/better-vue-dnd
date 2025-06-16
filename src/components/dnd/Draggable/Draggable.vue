<script setup lang="ts">
    import type { Axis, DOMElement, Position } from '@/types/types'
    import { ref } from 'vue'
    import DraggableOverlay from '../DraggableOverlay/DraggableOverlay.vue';
    import { useDraggable } from '@/composables/useDraggable';

    const props = withDefaults(
        defineProps<{
            disabled?: boolean,
            stopPropagation?: boolean,
            asHandle?: boolean,
            overlay?: boolean,
            snapToCursor?: boolean,
            axis?: Axis,
            onStart?: (position: Position, event: PointerEvent) => void | false,
            onMove?: (position: Position, event: PointerEvent) => void,
            onEnd?: (position: Position, event: PointerEvent) => void
        }>(),
        {
            disabled: false,
            stopPropagation: true,
            asHandle: true,
            asOverlay: true,
            snapToCursor: false,
            axis: 'both',
            onStart: undefined,
            onMove: undefined,
            onEnd: undefined
        },
    );

    const el = ref<DOMElement>(null);

    const { rect, isDragging, transform } = useDraggable(el, {
        disabled: () => props.disabled, 
        stopPropagation: props.stopPropagation, 
        onStart: props.onStart,
        onMove: props.onMove,
        onEnd: props.onEnd,
        axis: props.axis,
        snapToCursor: props.snapToCursor
    });
</script>

<template>
    <div
        ref="el"
        class="touch-none select-none cursor-pointer z-30"
    >
        <slot />
        <Teleport to="body">
            <DraggableOverlay v-bind=$attrs :visible="isDragging" :el-bounds="rect" :transform="transform">
                <slot />
            </DraggableOverlay>
        </Teleport>
    </div>
</template>
