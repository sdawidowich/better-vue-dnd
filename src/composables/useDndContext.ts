import type { DndDragEvent, DroppableOptions, DndContainer, DndDraggable, DOMElement, DOMElementBounds } from '@/types/types'
import { defineStore } from 'pinia';
import { computed, onMounted, onUnmounted, ref, useId, type DeepReadonly, type Ref} from 'vue';
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

    function getContainerOver(overlay: DeepReadonly<Ref<DOMElement>>) : string | undefined {
        const collisionDetection = useCollisionDetection(overlay);
        const containerArr = Object.values(containers.value);
        const closestIndex = collisionDetection.closestElement(containerArr.map((dz) => dz.el));
        const closestContainer = closestIndex !== null ? containerArr[closestIndex] : null;

        if (!closestContainer || !collisionDetection.collidesWith(closestContainer.el)) {
            return;
        }

        return closestContainer.id;
    }

    function getDraggableOver(overlay: DeepReadonly<Ref<DOMElement>>) : string | undefined {
        const collisionDetection = useCollisionDetection(overlay);
        const draggableArr = Object.values(draggables.value);
        const closestIndex = collisionDetection.closestElement(draggableArr.map((db) => db.el));
        const closestDraggable = closestIndex !== null ? draggableArr[closestIndex] : null;

        if (!closestDraggable || !collisionDetection.collidesWith(closestDraggable.el)) {
            return;
        }

        return closestDraggable.id;
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

        itemIds.forEach(id => {
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
        overylayBoundingRects.value = { ...draggableBoundingRects.value};
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

    onMounted(() => {
        eventBus.listen('draggable:startdrag', OnDragStart);
        eventBus.listen('draggable:enddrag', OnDragEnd);
        eventBus.listen('draggable:move', OnMove);
    });

    onUnmounted(() => {
        eventBus.unlisten('draggable:startdrag', OnDragStart);
        eventBus.unlisten('draggable:enddrag', OnDragEnd);
        eventBus.unlisten('draggable:move', OnMove);
    });

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
