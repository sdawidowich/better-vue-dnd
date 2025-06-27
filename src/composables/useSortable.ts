import type { DndDragEvent, DOMElement, DraggableItem, DroppableOptions } from '@/types/types';
import { onMounted, onUnmounted, ref, type ModelRef, type Ref } from 'vue';
import { useDndContext } from './useDndContext';
import { useEventBus } from './useEventBus';
import { swap } from '@/utils/utils';

export type UseSortableReturn = ReturnType<typeof useSortable>;

export function useSortable(sortableEl: Ref<DOMElement>, items: ModelRef<DraggableItem[]>, options: DroppableOptions) {
    const dndContext = useDndContext();
    const eventBus = useEventBus();
    const containerId = ref<string | undefined>(undefined);

    function OnMove(event: DndDragEvent) {
        if (event.activeContainerId === containerId.value) {

        }
    }

    function OnDragEnd(event: DndDragEvent) {
        if (event.activeContainerId === containerId.value) {
            const oldIndex = items.value.findIndex((item) => item.id === event.activeId);
            const newIndex = items.value.findIndex((item) => item.id === event.draggableOver);

            swap(items, oldIndex, newIndex);
        }
    }

    onMounted(() => {
        eventBus.listen('draggable:enddrag', OnDragEnd);
        eventBus.listen('draggable:move', OnMove);
        if (sortableEl.value) {
            containerId.value = dndContext.registerContainer(sortableEl, options);
        }
    });

    onUnmounted(() => {
        eventBus.unlisten('draggable:enddrag', OnDragEnd);
        eventBus.unlisten('draggable:move', OnMove);
        if (containerId.value) {
            dndContext.unregisterContainer(containerId.value);
        }
    });

    return {
        containerId
    }
}
