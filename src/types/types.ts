import type { Ref } from 'vue'

// General Types
export type DOMElement = HTMLElement | SVGElement | null | undefined
export type DndDragEvent = { from: DOMElement; item: Ref<DOMElement> }
export type Pair<T, S> = { first: T; second: S }
export type Constructor<T> = new (...args: any[]) => T
