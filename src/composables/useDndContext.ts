import Dropzone from '@/components/dnd/Dropzone/Dropzone.vue';
import type SortableContainer from '@/components/sortable/SortableContainer/SortableContainer.vue';
import type { DndDragEvent } from '@/types/types'
import { defineStore } from 'pinia';
import { onMounted, onUnmounted, ref, useId, type ComponentPublicInstance, type Ref } from 'vue';
import { useCollisionDetection } from './useCollisionDetection';
import { useEventBus } from './useEventBus';

type DndContainer = {
    id: string;
    instance: ComponentPublicInstance;
    items: Ref<Record<string, any>[]>;
    onMove?: (event: DndDragEvent) => void;
    onDrop?: (event: DndDragEvent) => boolean;
    onHover?: (event: DndDragEvent) => void;
}

export type UseDndContextReturn = ReturnType<typeof useDndContext>;

export const useDndContext = defineStore('dndContext', () => {
    const eventBus = useEventBus();

    const containers = ref<Record<string, DndContainer>>({});

    function RegisterDropzone(instance: InstanceType<typeof Dropzone>) {
        const id = useId();
        containers.value[id] = {
            "id": id,
            "instance": instance,

        }

        return id;
    }

    function RegisterSortableContainer(instance: InstanceType<typeof SortableContainer>) {
        const id = useId();
        sortableContainers.value[id] = instance;

        return id;
    }

    function SwapContainer(event: DndDragEvent) {
        const collisionDetection = useCollisionDetection(event.overlayEl);
        const closestDropzone = collisionDetection.closestElement(Object.values(dropzones.value).map(dz => dz.$el));

        if (!collisionDetection.collidesWith(closestDropzone)) {
            return;
        }
        
        if (event.from !== target.value && event.targetEl.value && event.from) {
            if (onDrop && !onDrop(event)) {
                return;
            }

            event.from?.removeChild(event.targetEl.value);
            target.value?.appendChild(event.targetEl.value);
        }
    }

    function OnMove(event: DndDragEvent) {
        if (!collisionDetection.collidesWith(event.overlayEl.value) || item.value !== undefined) {
            return;
        }

        onHover?.(event);

        SwapContainer(event);
    }

    function OnDragEnd(event: DndDragEvent) {
        if (!collisionDetection.collidesWith(event.overlayEl.value) || item.value !== undefined) {
            return;
        }

        SwapContainer(event);
    }

    onMounted(() => {
        eventBus.listen('draggable:enddrag', OnDragEnd);
        eventBus.listen('draggable:move', OnMove);
    });

    onUnmounted(() => {
        eventBus.unlisten('draggable:enddrag', OnDragEnd);
        eventBus.unlisten('draggable:move', OnMove);
    });

    return {
        RegisterDropzone,
        RegisterSortableContainer,
    }
});
