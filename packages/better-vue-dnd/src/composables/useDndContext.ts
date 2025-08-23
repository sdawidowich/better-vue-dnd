import type { DndDragEvent, DroppableOptions, DndContainer, DndDraggable, DOMElement, DOMElementBounds } from '../types/types';
import { defineStore } from 'pinia';
import { computed, ref, useId, type DeepReadonly, type Ref } from 'vue';
import { useCollisionDetection } from './useCollisionDetection';
import { useEventBus } from './useEventBus';

export type UseDndContextReturn = ReturnType<typeof useDndContext>;

export const useDndContext = defineStore('dndContext', () => {
    const eventBus = useEventBus();
    const containers = ref<Record<string, DndContainer>>({});
    const draggables = ref<Record<string, DndDraggable>>({});
    const active = ref<string | undefined>();
    const draggableBoundingRects = ref<Record<string, DOMElementBounds>>({});
    const overylayBoundingRects = ref<Record<string, DOMElementBounds>>({});

    function registerContainer(el: Ref<DOMElement>, options: DroppableOptions) {
        const id = useId();
        containers.value[id] = {
            id: id,
            el: el.value,
            onMove: options.onMove,
            onDrop: options.onDrop,
            onHover: options.onHover,
        };

        return id;
    }

    function registerDraggable(el: Ref<DOMElement>, id: string) {
        draggables.value[id] = {
            id: id,
            el: el.value,
        };
    }

    function unregisterContainer(id: string) {
        delete containers.value[id];
    }

    function unregisterDraggable(id: string) {
        delete draggables.value[id];
    }

    function getContainerOver(overlayEl: DeepReadonly<Ref<DOMElement>>): string | undefined {
        const overlayBoundingRect = overlayEl.value?.getBoundingClientRect();
        if (!overlayBoundingRect) {
            return;
        }

        const collisionDetection = useCollisionDetection(overlayBoundingRect);
        const containerArr = Object.values(containers.value);
        const closestIndex = collisionDetection.closestElement(
            containerArr
                .map((dz) => dz.el?.getBoundingClientRect())
                .filter((rect) => rect !== undefined),
        )
        const closestContainer = closestIndex !== null ? containerArr[closestIndex] : null

        if (closestContainer?.el?.getBoundingClientRect() === undefined || !collisionDetection.collidesWith(closestContainer.el?.getBoundingClientRect())) {
            return;
        }

        return closestContainer.id
    }

    function getDraggableOver(overlayEl: DeepReadonly<Ref<DOMElement>>): string | undefined {
        const overlayBoundingRect = overlayEl.value?.getBoundingClientRect();
        if (!overlayBoundingRect) {
            return;
        }

        const collisionDetection = useCollisionDetection(overlayBoundingRect);
        const draggableArr = Object.keys(overylayBoundingRects.value).map((id) => ({
            id: id,
            rect: overylayBoundingRects.value[id],
        }))
        const closestIndex = collisionDetection.closestElement(draggableArr.map((dz) => dz.rect))
        const closestDraggable = closestIndex !== null ? draggableArr[closestIndex] : null

        if (!closestDraggable || !collisionDetection.collidesWith(closestDraggable.rect)) {
            return
        }

        return closestDraggable.id
    }

    function calculateBoundingRects(itemIds: string[]) {
        const itemEls = getItemEls(itemIds);

        const boundingRects: Record<string, DOMElementBounds> = {};
        itemIds.forEach((id) => {
            const boundingRect = itemEls[id]?.getBoundingClientRect();

            boundingRects[id] = {
                x: boundingRect?.x ?? 0,
                y: boundingRect?.y ?? 0,
                width: boundingRect?.width ?? 0,
                height: boundingRect?.height ?? 0,
                top: boundingRect?.top ?? 0,
                left: boundingRect?.left ?? 0,
            };
        });
        return boundingRects;
    }

    function updateOverlayBoundingRects(newRects: Record<string, DOMElementBounds>) {
        overylayBoundingRects.value = { ...overylayBoundingRects.value, ...newRects };
    }

    function getItemEl(itemId: string) {
        return draggables.value[itemId]?.el;
    }

    function getItemEls(itemIds: string[]) {
        const itemEls: Record<string, DOMElement> = {};

        itemIds.forEach((id) => {
            itemEls[id] = draggables.value[id]?.el;
        });

        return itemEls;
    }

    function getBoundingRects(itemIds: string[]) {
        const boundingRects: Record<string, DOMElementBounds> = {};
        itemIds.forEach((id) => {
            boundingRects[id] = draggableBoundingRects.value[id];
        });
        return boundingRects;
    }

    function SwapContainer(event: DndDragEvent) {
        console.log(event);
    }

    function OnDragStart(event: DndDragEvent) {
        active.value = event.activeId;
        draggableBoundingRects.value = calculateBoundingRects(Object.keys(draggables.value));
        overylayBoundingRects.value = { ...draggableBoundingRects.value };

        console.log('Drag started');
        console.log(draggables.value);
        console.log(draggableBoundingRects.value);
        console.log(overylayBoundingRects.value);
    }

    function OnMove(event: DndDragEvent) {
        if (event.activeContainerId !== event.containerOver) {
        }
    }

    function OnDragEnd(event: DndDragEvent) {
        active.value = undefined;
        if (event.activeContainerId !== event.containerOver) {
            SwapContainer(event);
        }

        overylayBoundingRects.value = {};
    }

    // Register event listeners
    eventBus.listen('draggable:startdrag', OnDragStart);
    eventBus.listen('draggable:enddrag', OnDragEnd);
    eventBus.listen('draggable:move', OnMove);

    return {
        isDragging: computed(() => !!active.value),
        draggableBoundingRects,
        overylayBoundingRects,
        registerContainer,
        registerDraggable,
        unregisterContainer,
        unregisterDraggable,
        updateOverlayBoundingRects,
        getContainerOver,
        getDraggableOver,
        getItemEl,
        getItemEls,
        getBoundingRects,
    };
});
