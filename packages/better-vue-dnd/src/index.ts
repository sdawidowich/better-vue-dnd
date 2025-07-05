import Draggable from "./components/Draggable/Draggable.vue";
import DraggableHandle from "./components/DraggableHandle/DraggableHandle.vue";
import DraggableOverlay from "./components/DraggableOverlay/DraggableOverlay.vue";
import Dropzone from "./components/Dropzone/Dropzone.vue";
import SortableContainer from "./components/SortableContainer/SortableContainer.vue";
import { useCollisionDetection } from "./composables/useCollisionDetection";
import { useDndContext } from "./composables/useDndContext";
import { useDraggable } from "./composables/useDraggable";
import { useDropzone } from "./composables/useDropzone";
import { useSortable } from "./composables/useSortable";
import { useEventBus } from "./composables/useEventBus";
import type { App } from "vue";


export default {
    install: (app: App) => {
        app.component("Draggable", Draggable);
        app.component("DraggableHandle", DraggableHandle);
        app.component("DraggableOverlay", DraggableOverlay);
        app.component("Dropzone", Dropzone);
        app.component("SortableContainer", SortableContainer);
    }
}

export {
    Draggable,
    DraggableHandle,
    DraggableOverlay,
    Dropzone,
    SortableContainer,
    useCollisionDetection,
    useDndContext,
    useDraggable,
    useDropzone,
    useSortable,
    useEventBus
};