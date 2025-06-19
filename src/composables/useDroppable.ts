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
    
}
