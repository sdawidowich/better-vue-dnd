import type { ModelRef, Ref } from 'vue'

// General Types
export type DOMElement = HTMLElement | SVGElement | null | undefined;
export type DOMElementBounds = { x: number; y: number; width: number; height: number; top: number; left: number; };
export type DndDragEvent = { from: DOMElement; targetEl: Ref<DOMElement>; overlayEl: Ref<DOMElement>; item: ModelRef<Record<any, any> | undefined>; };
export type Pair<T, S> = { first: T; second: S };
export type Constructor<T> = new (...args: any[]) => T;
export type Position = { x: number; y: number; };
export type PointerType = 'mouse' | 'touch' | 'pen';
export type Axis = 'x' | 'y' | 'both';
export type DndContainer = 'dropzone' | 'sortable';