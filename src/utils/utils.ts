import type { Ref } from "vue";

export function swap(lst: Ref<any>, i: number, j: number) {
    if (i < 0 || j < 0 || i >= lst.value.length || j >= lst.value.length) {
        return;
    }

    const temp = lst.value[i];
    lst.value[i] = lst.value[j];
    lst.value[j] = temp;
}