import type { Ref } from "vue";

// General Types
export type DOMElement = HTMLElement | SVGElement | null | undefined;
export type DOMElementBounds = {
    x: number;
    y: number;
    width: number;
    height: number;
    top: number;
    left: number;
};
export type DndDragEvent = {
    activeId: string;
    activeContainerId?: string;
    containerOver?: string;
    draggableOver?: string;
};
export type Pair<T, S> = { first: T; second: S };
export type Constructor<T> = new (...args: any[]) => T;
export type Position = { x: number; y: number };
export type PointerType = 'mouse' | 'touch' | 'pen';
export type Axis = 'x' | 'y' | 'both';
export type ContainerType = 'dropzone' | 'sortable';
export type DraggableItem = Record<string, any> & {
    id: string;
};
export type DroppableOptions = {
    group?: string;
    onHover?: (event: DndDragEvent) => boolean;
    onDrop?: (event: DndDragEvent) => boolean;
    onMove?: (event: DndDragEvent) => boolean;
};
export type DndContainer = {
    id: string;
    el: Ref<DOMElement>;
    onMove?: (event: DndDragEvent) => boolean;
    onDrop?: (event: DndDragEvent) => boolean;
    onHover?: (event: DndDragEvent) => boolean;
};
export type DndDraggable = {
    id: string;
    el: Ref<DOMElement>;
};