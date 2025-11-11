import type { DOMElement, DndContainerOptions } from '../types/types';
import { onMounted, onUnmounted, ref, type Ref } from 'vue';
// import { useDndContext } from './useDndContext';

export type UseDropzoneReturn = ReturnType<typeof useDropzone>;

export function useDropzone(containerEl: Ref<DOMElement>, options: DndContainerOptions) {
    // const dndContext = useDndContext();
    const containerId = ref<string | undefined>(undefined);

    console.log(options);

    onMounted(() => {
        if (containerEl.value) {
            // containerId.value = dndContext.registerContainer(containerEl, options);
        }
    });

    onUnmounted(() => {
        if (containerId.value) {
            // dndContext.unregisterContainer(containerId.value);
        }
    });

    return {
        containerId,
    };
}
