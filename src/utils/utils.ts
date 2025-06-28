import type { DraggableItem } from "@/types/types";
import type { Ref } from "vue";

export function reorderItems(items: Ref<DraggableItem[]>, activeId: string, draggableOver: string) {
    const oldIndex = items.value.findIndex((item) => item.id === activeId);
    const newIndex = items.value.findIndex((item) => item.id === draggableOver);
    
    if (oldIndex >= 0 && oldIndex < items.value.length && newIndex >= 0 && newIndex < items.value.length) {
        const tmp = items.value[oldIndex];
        items.value.splice(oldIndex, 1);
        items.value.splice(newIndex, 0, tmp);
    }
}