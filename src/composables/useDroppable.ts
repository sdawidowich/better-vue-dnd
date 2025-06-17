import type { DndDragEvent, DOMElement } from '@/types/types'
import { onMounted, onUnmounted, type ModelRef, type Ref } from 'vue'
import { useEventBus } from './useEventBus'
import { useCollisionDetection } from './useCollisionDetection'

export interface UseDroppableOptions {
    /* Callback when dragging end. */
    onHover?: (event: DndDragEvent) => void
    /* Callback when dragging end. */
    onDrop?: (event: DndDragEvent) => boolean
}

export type UseDroppableReturn = ReturnType<typeof useDroppable>

export function useDroppable(target: Ref<DOMElement>, item: ModelRef<Record<any, any> | undefined>, options: UseDroppableOptions = {}) {
    const { onHover, onDrop } = options;

    const collisionDetection = useCollisionDetection(target);
    const eventBus = useEventBus();

    function UpdateContainer(event: DndDragEvent) {
        if (!collisionDetection.collidesWith(event.overlayEl.value)) {
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

        UpdateContainer(event);
    }

    function OnDragEnd(event: DndDragEvent) {
        if (!collisionDetection.collidesWith(event.overlayEl.value) || item.value !== undefined) {
            return;
        }

        UpdateContainer(event);
    }

    onMounted(() => {
        eventBus.listen('draggable:enddrag', OnDragEnd);
        eventBus.listen('draggable:move', OnMove);
    });

    onUnmounted(() => {
        eventBus.unlisten('draggable:enddrag', OnDragEnd);
        eventBus.unlisten('draggable:move', OnMove);
    });
}
