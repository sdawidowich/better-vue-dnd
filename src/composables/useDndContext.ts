import type { DndDragEvent, DroppableOptions, DndContainer, DndDraggable, DOMElement, DraggableItem, DOMElementBounds } from '@/types/types'
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

    function getItemEl(item: Ref<DraggableItem>) {
        return draggables.value[item.value.id]?.el;
    }

    function getItemEls(items: Ref<DraggableItem[]>) {
        const itemEls: Record<string, DOMElement> = {};

        items.value.forEach(item => {
            itemEls[item.id] = draggables.value[item.id]?.el;
        });

        return itemEls;
    }

    function getBoundingRect(item: Ref<DraggableItem>) {
        const itemEl = getItemEl(item);
        const boundingRect = itemEl?.getBoundingClientRect();

        return {
            x: boundingRect?.x ?? 0,
            y: boundingRect?.y ?? 0,
            width: boundingRect?.width ?? 0,
            height: boundingRect?.height ?? 0,
            top: boundingRect?.top ?? 0,
            left: boundingRect?.left ?? 0,
        };
    }

    function getBoundingRects(items: Ref<DraggableItem[]>) {
        const itemEls = getItemEls(items);

        const boundingRects: Record<string, DOMElementBounds> = {};
        items.value.forEach((item) => {
            const boundingRect = itemEls[item.id]?.getBoundingClientRect();

            boundingRects[item.id] = {
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

    function SwapContainer(event: DndDragEvent) {
        console.log(event);
    }

    function OnDragStart(event: DndDragEvent) {
        active.value = event.activeId;
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

        console.log(event);
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
        isDragging: computed(() => active.value),
        registerContainer,
        registerDraggable,
        unregisterContainer,
        unregisterDraggable,
        getContainerOver,
        getDraggableOver,
        getItemEl,
        getItemEls,
        getBoundingRect,
        getBoundingRects
    };
});
