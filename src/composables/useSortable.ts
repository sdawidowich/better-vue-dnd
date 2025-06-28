import type { DndDragEvent, DOMElement, DOMElementBounds, DraggableItem, DroppableOptions } from '@/types/types';
import { computed, onMounted, onUnmounted, ref, type ModelRef, type Ref, type StyleValue } from 'vue';
import { useDndContext } from './useDndContext';
import { useEventBus } from './useEventBus';
import { reorderItems } from '@/utils/utils';
import { useElementBounding } from '@vueuse/core';

export type UseSortableReturn = ReturnType<typeof useSortable>;

export function useSortable(sortableEl: Ref<DOMElement>, items: ModelRef<DraggableItem[]>, options: DroppableOptions) {
    const dndContext = useDndContext();
    const eventBus = useEventBus();
    const containerId = ref<string | undefined>(undefined);

    // Temp items
    const tmpItems = ref<DraggableItem[]>([]);
    const tmpItemBounds = ref<Record<string, DOMElementBounds>>({});

    const activeStyles = computed<Record<string, StyleValue>>(() => {
        if (dndContext.isDragging) {
            const styles: Record<string, StyleValue> = {};

            for (let i = 0; i < tmpItems.value.length; i++) {
                const originalItem = items.value[i];
                const originalItemRect = tmpItemBounds.value[originalItem.id];
                const newItem = tmpItems.value[i];
                const newItemRect = tmpItemBounds.value[newItem.id];

                styles[newItem.id] = {
                    transform: `translate(${(originalItemRect?.left ?? 0) - (newItemRect?.left ?? 0)}px, ${(originalItemRect?.top ?? 0) - (newItemRect?.top ?? 0)}px)`,
                    transition: 'transform 0.1s linear'
                };
            }

            return styles;
        }

        return {};
    });

    function OnDragStart() {
        tmpItems.value = [ ...items.value ];

        const itemEls = dndContext.getItemEls(tmpItems);
        tmpItemBounds.value = {};
        Object.entries(itemEls).forEach(([key, value]) => {
            const { x: targetX, y: targetY, top: targetTop, left: targetLeft, width: targetWidth, height: targetHeight } = useElementBounding(value);
            tmpItemBounds.value[key] = { x: targetX.value, y: targetY.value, width: targetWidth.value, height: targetHeight.value, top: targetTop.value, left: targetLeft.value };
        });
    }

    function OnMove(event: DndDragEvent) {
        if (event.activeContainerId === containerId.value && event.draggableOver && event.activeId !== event.draggableOver) {
            reorderItems(tmpItems, event.activeId, event.draggableOver);
        }
    }

    function OnDragEnd(event: DndDragEvent) {
        if (event.activeContainerId === containerId.value && event.draggableOver && event.activeId !== event.draggableOver) {
            reorderItems(tmpItems, event.activeId, event.draggableOver);
        }

        items.value = [ ...tmpItems.value ];
        tmpItems.value = [];
        tmpItemBounds.value = {};
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
        activeStyles
    };
}
