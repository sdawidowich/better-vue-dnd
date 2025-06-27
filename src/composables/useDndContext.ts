import type { DndDragEvent, DroppableOptions, DndContainer, DndDraggable, DOMElement } from '@/types/types'
import { defineStore } from 'pinia';
import { onMounted, onUnmounted, ref, useId, type DeepReadonly, type Ref} from 'vue';
import { useCollisionDetection } from './useCollisionDetection';
import { useEventBus } from './useEventBus';

export type UseDndContextReturn = ReturnType<typeof useDndContext>;

export const useDndContext = defineStore('dndContext', () => {
    const eventBus = useEventBus();
    const containers = ref<DndContainer[]>([]);
    const draggables = ref<DndDraggable[]>([]);
    const active = ref<string | undefined>();

    function registerContainer(el: Ref<DOMElement>, options: DroppableOptions) {
        const id = useId();
        containers.value.push({
            id: id,
            el: el.value,
            onMove: options.onMove,
            onDrop: options.onDrop,
            onHover: options.onHover,
        });

        return id;
    }
    
    function registerDraggable(el: Ref<DOMElement>, id: string) {
        draggables.value.push({
            id: id,
            el: el.value,
        });
    }

    function unregisterContainer(id: string) {
        const index = containers.value.findIndex((container) => container.id === id);
        if (index !== -1) {
            containers.value.splice(index, 1);
        }
    }

    function unregisterDraggable(id: string) {
        const index = draggables.value.findIndex((draggable) => draggable.id === id);
        if (index !== -1) {
            draggables.value.splice(index, 1);
        }
    }

    function getContainerOver(overlay: DeepReadonly<Ref<DOMElement>>) : string | undefined {
        const collisionDetection = useCollisionDetection(overlay);
        const closestIndex = collisionDetection.closestElement(Object.values(containers.value).map(dz => dz.el));
        const closestContainer = closestIndex !== null ? containers.value[closestIndex] : null;

        if (!closestContainer || !collisionDetection.collidesWith(closestContainer.el)) {
            return;
        }

        return closestContainer.id;
    }

    function getDraggableOver(overlay: DeepReadonly<Ref<DOMElement>>) : string | undefined {
        const collisionDetection = useCollisionDetection(overlay);
        const closestIndex = collisionDetection.closestElement(Object.values(draggables.value).map(db => db.el));
        const closestDraggable = closestIndex !== null ? draggables.value[closestIndex] : null;

        if (!closestDraggable || !collisionDetection.collidesWith(closestDraggable.el)) {
            return;
        }

        return closestDraggable.id;
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
        registerContainer,
        registerDraggable,
        unregisterContainer,
        unregisterDraggable,
        getContainerOver,
        getDraggableOver,
    };
});
