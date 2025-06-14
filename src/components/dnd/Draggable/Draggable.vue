<script setup lang="ts">
    import { useEventBus } from '@/composables/useEventBus'
    import type { DOMElement, DOMElementBounds } from '@/types/types'
    import { useDraggable, useElementBounding, useMouse, useParentElement } from '@vueuse/core'
    import { computed, ref, watch } from 'vue'
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
    const { x: elX, y: elY, top: elTop, left: elLeft, width: elWidth, height: elHeight, update: updateElBounding } = useElementBounding(el);
    const elRect = computed<DOMElementBounds>(() => ({ x: elX.value, y: elY.value, width: elWidth.value, height: elHeight.value, top: elTop.value, left: elLeft.value }));
    const eventBus = useEventBus();
    const dragEnded = ref<boolean>(false);

    const { x: mouseX, y: mouseY } = useMouse();
    const { x: overlayX, y: overlayY, style, isDragging, } = useDraggable(el, { 
        initialValue: { x: 0, y: 0 }, 
        disabled: () => props.disabled, 
        stopPropagation: true, 
        onStart: OnDragStart,
        onMove: OnMove,
        onEnd: OnDragEnd,
        axis: props.axis
    });
    const overlayTransform = computed<string>(() => `translate(${overlayX.value - elX.value}px, ${overlayY.value - elY.value}px)`);

    function OnDragStart() {
        eventBus.emit('draggable:startdrag', { from: useParentElement(el).value, item: el });
    }

    function OnMove() {
        eventBus.emit('draggable:move', { from: useParentElement(el).value, item: el });
    }
    
    function OnDragEnd() {
        eventBus.emit('draggable:enddrag', { from: useParentElement(el).value, item: el });
        ResetPos();

        dragEnded.value = true;
        setTimeout(() => {
            dragEnded.value = false;
        }, 150); // Must match your CSS transition duration
    }

    function ResetPos() {
        updateElBounding();
        if (props.snapToCursor) {
            overlayX.value = mouseX.value - (elWidth.value / 2);
            overlayY.value = mouseY.value - (elHeight.value / 2);
        }
        else {
            overlayX.value = elX.value;
            overlayY.value = elY.value;
        }
    }

    watch([elX, elY], () => {
        ResetPos();
    });

</script>

<template>
    <div
        ref="el"
        class="touch-none select-none cursor-pointer z-30"
        :style="isDragging ? style : ''"
    >
        <slot />
        <Teleport to="body">
            <DraggableOverlay v-bind=$attrs :visible="isDragging || dragEnded" :class="dragEnded ? 'transition-transform' : ''" :el-bounds="elRect" :transform="overlayTransform">
                <slot />
            </DraggableOverlay>
        </Teleport>
    </div>
</template>
