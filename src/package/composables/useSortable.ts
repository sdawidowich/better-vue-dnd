import type {
    DOMElementBounds,
    DndDragEvent,
    DOMElement,
    DraggableItem,
    DroppableOptions,
} from '@/package/types/types';
import {
    computed,
    onMounted,
    onUnmounted,
    ref,
    type ModelRef,
    type Ref,
    type StyleValue,
} from 'vue';
import { useDndContext } from './useDndContext';
import { useEventBus } from './useEventBus';
import { reorderItems } from '@/package/utils/utils';

export type UseSortableReturn = ReturnType<typeof useSortable>;

export function useSortable(
    sortableEl: Ref<DOMElement>,
    items: ModelRef<DraggableItem[]>,
    options: DroppableOptions,
) {
    const dndContext = useDndContext();
    const eventBus = useEventBus();
    const containerId = ref<string | undefined>(undefined);

    // Temp items
    const tmpItems = ref<DraggableItem[]>([]);

    const activeStyles = computed<Record<string, StyleValue>>(() => {
        if (dndContext.isDragging) {
            const styles: Record<string, StyleValue> = {};

            for (let i = 0; i < tmpItems.value.length; i++) {
                const originalItem = items.value[i];
                const originalItemRect = dndContext.draggableBoundingRects[originalItem.id];
                const newItem = tmpItems.value[i];
                const newItemRect = dndContext.draggableBoundingRects[newItem.id];

                styles[newItem.id] = {
                    transform: `translate(${(originalItemRect?.left ?? 0) - (newItemRect?.left ?? 0)}px, ${(originalItemRect?.top ?? 0) - (newItemRect?.top ?? 0)}px)`,
                    transition: 'transform 0.15s linear',
                };
            }

            return styles;
        }

        return {};
    });

    function HandleDragEvent(event: DndDragEvent) {
        if (
            event.activeContainerId === containerId.value &&
            event.draggableOver &&
            event.activeId !== event.draggableOver
        ) {
            reorderItems(tmpItems, event.activeId, event.draggableOver);

            const newBoundingRects: Record<string, DOMElementBounds> = {};
            for (let i = 0; i < tmpItems.value.length; i++) {
                const originalItem = items.value[i];
                const newItem = tmpItems.value[i];

                newBoundingRects[newItem.id] = dndContext.draggableBoundingRects[originalItem.id];
            }

            dndContext.updateOverlayBoundingRects(newBoundingRects);
        }
    }

    function OnDragStart() {
        tmpItems.value = [...items.value];
    }

    function OnMove(event: DndDragEvent) {
        HandleDragEvent(event);
    }

    function OnDragEnd(event: DndDragEvent) {
        HandleDragEvent(event);

        items.value = [...tmpItems.value];
        tmpItems.value = [];
    }

    onMounted(() => {
        eventBus.listen('draggable:startdrag', OnDragStart);
        eventBus.listen('draggable:enddrag', OnDragEnd);
        eventBus.listen('draggable:move', OnMove);
        if (sortableEl.value) {
            containerId.value = dndContext.registerContainer(sortableEl, options);
        }
    });

    onUnmounted(() => {
        eventBus.unlisten('draggable:startdrag', OnDragStart);
        eventBus.unlisten('draggable:enddrag', OnDragEnd);
        eventBus.unlisten('draggable:move', OnMove);
        if (containerId.value) {
            dndContext.unregisterContainer(containerId.value);
        }
    });

    return {
        dndContext,
        containerId,
        activeStyles,
    };
}
