import mitt from 'mitt'
import type { DndDragEvent } from '@/types/types'

type Events = {
    'draggable:startdrag': DndDragEvent;
    'draggable:move': DndDragEvent;
    'draggable:enddrag': DndDragEvent;
}

const emitter = mitt<Events>()

export function useEventBus() {
    return { emit: emitter.emit, listen: emitter.on, unlisten: emitter.off }
}
