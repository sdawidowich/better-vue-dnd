<script setup lang="ts">
    import { useEventBus } from '@/composables/useEventBus'
    import type { DOMElement, DndDragEvent } from '@/types/types'
    import { useMouseInElement } from '@vueuse/core'
    import { onMounted, onUnmounted, ref, type Ref } from 'vue'

    const props = defineProps<{
        onDrop?: (event: DndDragEvent) => boolean
    }>();

    const dropzoneEl: Ref<DOMElement> = ref(null);
    const { isOutside } = useMouseInElement(dropzoneEl);
    const eventBus = useEventBus();

    function OnMove(event: DndDragEvent) {
        if (isOutside.value) {
            return;
        }

        if (event.from !== dropzoneEl.value && event.item?.value && event.from) {
            if (props.onDrop && !props.onDrop(event)) {
                return;
            }

            event.from?.removeChild(event.item?.value);
            dropzoneEl.value?.appendChild(event.item?.value);
        }
    }

    function OnDragEnd(event: DndDragEvent) {
        if (isOutside.value) {
            return;
        }

        if (event.from !== dropzoneEl.value && event.item?.value && event.from) {
            if (props.onDrop && !props.onDrop(event)) {
                return;
            }

            event.from?.removeChild(event.item?.value);
            dropzoneEl.value?.appendChild(event.item?.value);
        }
    }

    onMounted(() => {
        eventBus.listen('draggable:enddrag', OnDragEnd);
        eventBus.listen('draggable:move', OnMove);
    });

    onUnmounted(() => {
        eventBus.unlisten('draggable:enddrag', OnDragEnd);
        eventBus.unlisten('draggable:move', OnMove);
    });
</script>

<template>
    <div ref="dropzoneEl">
        <slot />
    </div>
</template>
