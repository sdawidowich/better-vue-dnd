<script setup lang="ts">
    import type { DOMElement } from '@/types/types'
    import { computed, ref } from 'vue'
    import DraggableOverlay from '../DraggableOverlay/DraggableOverlay.vue';
    import { useDraggable, type UseDraggableOptions } from '@/composables/useDraggable';

    const props = withDefaults(
        defineProps<{
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

    const valueModel = defineModel<Record<any, any> | undefined>('item');

    const targetEl = ref<DOMElement>(null);
    const overlayComponent = ref<InstanceType<typeof DraggableOverlay>>();
    const overlayEl = computed<DOMElement>(() => overlayComponent.value ? overlayComponent.value.el : null);

    const { rect, isDragging, transform } = useDraggable(targetEl, overlayEl, valueModel, props.options);
</script>

<template>
    <div
        ref="targetEl"
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
