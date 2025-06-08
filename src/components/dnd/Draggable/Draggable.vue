<script setup lang="ts">
    import { useEventBus } from '@/composables/useEventBus'
    import type { DOMElement } from '@/types/types'
    import { useDraggable, useParentElement } from '@vueuse/core'
    import { onMounted, ref } from 'vue'

    const props = withDefaults(
        defineProps<{
            disabled?: boolean
        }>(),
        {
            disabled: false,
        },
    )

    const el = ref<DOMElement>(null);
    const parentBounds = ref<DOMRect | undefined>(el.value?.parentElement?.getBoundingClientRect());
    const eventBus = useEventBus();

    function ResetPos() {
        const boundingRect = el.value?.getBoundingClientRect();
        elX.value = boundingRect?.x ?? 0;
        elY.value = boundingRect?.y ?? 0;
    }

    function OnDragStart() {
        ResetPos();
        eventBus.emit('draggable:startdrag', { from: useParentElement(el).value, item: el });
    }

    function OnDragEnd() {
        ResetPos();
        eventBus.emit('draggable:enddrag', { from: useParentElement(el).value, item: el });
        parentBounds.value = el.value?.parentElement?.getBoundingClientRect();
    }

    const {
        x: elX,
        y: elY,
        style,
        isDragging,
    } = useDraggable(el, {
        initialValue: { x: 0, y: 0 },
        disabled: () => props.disabled,
        stopPropagation: true,
        onStart: OnDragStart,
        onEnd: OnDragEnd,
    });

    onMounted(() => {
        ResetPos()
        parentBounds.value = el.value?.parentElement?.getBoundingClientRect()
    });

</script>

<template>
    <div
        ref="el"
        style="touch-action: none"
        class="select-none cursor-pointer z-31"
        :class="isDragging ? 'fixed' : ''"
        :style="
            isDragging
                ? style +
                  'max-width:' +
                  parentBounds?.width +
                  'px;max-height:' +
                  parentBounds?.height +
                  'px;'
                : ''
        "
    >
        <slot />
    </div>
</template>
