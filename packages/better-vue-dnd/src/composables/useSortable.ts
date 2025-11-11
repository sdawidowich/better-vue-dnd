import type { DOMElementBounds, DndDragEvent, DOMElement, DraggableItem, DndContainerOptions } from '../types/types';
import { computed, onMounted, onUnmounted, ref, type ModelRef, type Ref, type StyleValue } from 'vue';
import { useDndContext } from './useDndContext';
import { useEventBus } from './useEventBus';
import { reorderItems } from '../utils/utils';

export type UseSortableReturn = ReturnType<typeof useSortable>;

export function useSortable(sortableEl: Ref<DOMElement>, items: ModelRef<DraggableItem[]>, options: DndContainerOptions) {
    const dndContext = useDndContext();
    const eventBus = useEventBus();
    const containerId = ref<string | undefined>(undefined);

    // Temp items
    const tmpItems = ref<DraggableItem[]>([]);

    const activeStyles = computed<Record<string, StyleValue>>(() => {
        if (dndContext.isDragging) {
            const styles: Record<string, StyleValue> = {};

            for (let i = 0; i < tmpItems.value.length; i++) {
                const newItem = tmpItems.value[i];
                const originalItemRect = dndContext.draggableBoundingRects[newItem.id];
                const newItemRect = dndContext.overylayBoundingRects[newItem.id];

                styles[newItem.id] = {
                    transform: `translate(${(newItemRect?.left ?? 0) - (originalItemRect?.left ?? 0)}px, ${(newItemRect?.top ?? 0) - (originalItemRect?.top ?? 0)}px)`,
                    transition: 'transform 0.15s ease-in-out',
                }
            }

            return styles;
        }

        return {};
    });

    function HandleDragEvent(event: DndDragEvent) {
        // Reorder items if over this container and active draggable is not over itself
        if (event.activeContainerId === containerId.value && event.draggableOver && event.activeId !== event.draggableOver) {
            reorderItems(tmpItems, event.activeId, event.draggableOver);

            // Store offsets for different sized items
            let xOffset = 0;
            let yOffset = 0;
            const newBoundingRects: Record<string, DOMElementBounds> = {};
            for (let i = 0; i < tmpItems.value.length; i++) {
                const originalItem = items.value[i];
                const newItem = tmpItems.value[i];

                const originalItemRect = dndContext.draggableBoundingRects[originalItem.id];
                const newItemRect = { ...dndContext.draggableBoundingRects[newItem.id] };

                // Update new item rect position based on original item and offsets
                newItemRect.left = originalItemRect.left + xOffset;
                newItemRect.top = originalItemRect.top + yOffset;
                newItemRect.x = originalItemRect.x + xOffset;
                newItemRect.y = originalItemRect.y + yOffset;

                // Set bounding rect for new item
                newBoundingRects[newItem.id] = newItemRect;

                // Update offsets for next item
                xOffset += newItemRect.width - originalItemRect.width;
                yOffset += newItemRect.height - originalItemRect.height;
            }

            dndContext.updateOverlayBoundingRects(newBoundingRects);
        }
        else if (event.activeContainerId !== containerId.value) {

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
        // Listen to drag events
        eventBus.listen('draggable:startdrag', OnDragStart);
        eventBus.listen('draggable:enddrag', OnDragEnd);
        eventBus.listen('draggable:move', OnMove);

        // Register the container with dnd context
        if (sortableEl.value) {
            containerId.value = dndContext.registerContainer(sortableEl, items, options);
        }
    });

    onUnmounted(() => {
        // Unlisten drag events
        eventBus.unlisten('draggable:startdrag', OnDragStart);
        eventBus.unlisten('draggable:enddrag', OnDragEnd);
        eventBus.unlisten('draggable:move', OnMove);

        // Unregister the container with dnd context
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
