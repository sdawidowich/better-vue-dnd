<script setup lang="ts">
    import { useEventBus } from '@/composables/useEventBus'
    import type { DOMElement, DOMElementBounds } from '@/types/types'
    import { useDraggable, useElementBounding, useMouse, useParentElement } from '@vueuse/core'
    import { computed, onMounted, ref } from 'vue'
    import DraggableOverlay from '../DraggableOverlay/DraggableOverlay.vue';

    const props = withDefaults(
        defineProps<{
            disabled?: boolean,
            asHandle?: boolean,
            overlay?: boolean,
            snapToCursor?: boolean,
            axis?: 'x' | 'y' | 'both'
        }>(),
        {
            disabled: false,
            asHandle: true,
            asOverlay: true,
            snapToCursor: false,
            axis: 'both'
        },
    );

    const el = ref<DOMElement>(null);
    const parentBounds = ref<DOMRect | undefined>(el.value?.parentElement?.getBoundingClientRect());
    const { x: elX, y: elY, top: elTop, left: elLeft, width: elWidth, height: elHeight } = useElementBounding(el);
    const elRect = computed<DOMElementBounds>(() => ({ x: elX.value, y: elY.value, width: elWidth.value, height: elHeight.value, top: elTop.value, left: elLeft.value }));
    const eventBus = useEventBus();

    const { x: mouseX, y: mouseY } = useMouse();
    const { x: overlayX, y: overlayY, style, isDragging, } = useDraggable(el, { 
        initialValue: { x: 0, y: 0 }, 
        disabled: () => props.disabled, 
        stopPropagation: true, 
        onStart: OnDragStart, 
        onEnd: OnDragEnd,
        axis: props.axis
    });

    function ResetPos() {
        console.log(mouseX.value, mouseY.value);
        console.log(elRect);
        console.log(style);
        if (props.snapToCursor) {
            overlayX.value = mouseX.value - (elWidth.value / 2);
            overlayY.value = mouseY.value - (elHeight.value / 2);
        }
        else {
            overlayX.value = elX.value;
            overlayY.value = elY.value;
        }

        console.log(overlayX.value, overlayY.value);
    }

    function OnDragStart() {
        eventBus.emit('draggable:startdrag', { from: useParentElement(el).value, item: el });
        ResetPos();
    }

    function OnDragEnd() {
        eventBus.emit('draggable:enddrag', { from: useParentElement(el).value, item: el });
        parentBounds.value = el.value?.parentElement?.getBoundingClientRect();
        ResetPos();
    }

    onMounted(() => {
        ResetPos();
        parentBounds.value = el.value?.parentElement?.getBoundingClientRect();
    });

</script>

<template>
    <div
        ref="el"
        class="touch-none select-none cursor-pointer z-30"
        :class="isDragging ? '' : ''"
        :style="isDragging ? style : ''"
    >
        <slot />
    </div>
    <Teleport to="body">
        <DraggableOverlay :visible="isDragging" :el-bounds="elRect" :transform-x="overlayX - elX" :transform-y="overlayY - elY">
            <slot />
        </DraggableOverlay>
    </Teleport>
</template>
