import type { Axis, DndDragEvent, DOMElement, DOMElementBounds, DraggableItem, PointerType, Position, } from '../types/types';
import { computed, onMounted, onUnmounted, ref, toValue, type CSSProperties, type DeepReadonly, type MaybeRefOrGetter, type Ref } from 'vue';
import { useEventBus, type Events } from './useEventBus';
import { useDndContext } from './useDndContext';
import { defaultWindow, isClient, toRefs, useElementBounding, useEventListener, useThrottleFn } from '@vueuse/core';

export interface UseDraggableOptions {
    /* Prevent events defaults */
    preventDefault?: MaybeRefOrGetter<boolean>;

    /* Prevent events propagation */
    stopPropagation?: MaybeRefOrGetter<boolean>;

    /* Whether dispatch events in capturing phase */
    capture?: boolean;

    /* Element to attach `pointermove` and `pointerup` events to. */
    draggingElement?: MaybeRefOrGetter<
        HTMLElement | SVGElement | Window | Document | null | undefined
    >;

    /* Element for calculating bounds (If not set, it will use the event's target). */
    containerElement?: MaybeRefOrGetter<HTMLElement | SVGElement | null | undefined>;

    /* Handle that triggers the drag event */
    handle?: MaybeRefOrGetter<HTMLElement | SVGElement | null | undefined>;

    /* Pointer types that listen to. */
    pointerTypes?: PointerType[];

    /* Initial position of the element. */
    initialValue?: MaybeRefOrGetter<Position>;

    /* Callback when the dragging starts. Return `false` to prevent dragging. */
    onStart?: (position: Position, event: PointerEvent) => void | false;

    /* Callback during dragging. */
    onMove?: (position: Position, event: PointerEvent) => void;

    /* Callback when dragging end. */
    onEnd?: (position: Position, event: PointerEvent) => void;

    /* Axis to drag on. */
    axis?: Axis;

    /* Axis to drag on. */
    snapToCursor?: MaybeRefOrGetter<boolean>;

    /* Disabled drag and drop. */
    disabled?: MaybeRefOrGetter<boolean>;

    /*
     * Mouse buttons that are allowed to trigger drag events.
     *
     * - `0`: Main button, usually the left button or the un-initialized state
     * - `1`: Auxiliary button, usually the wheel button or the middle button (if present)
     * - `2`: Secondary button, usually the right button
     * - `3`: Fourth button, typically the Browser Back button
     * - `4`: Fifth button, typically the Browser Forward button
     *
     */
    buttons?: MaybeRefOrGetter<number[]>;
}

export type UseDraggableReturn = ReturnType<typeof useDraggable>;

export function useDraggable(
    draggableEl: Ref<DOMElement>,
    overlayEl: DeepReadonly<Ref<DOMElement>>,
    item: DraggableItem,
    containerId: Ref<string | undefined> | undefined,
    options: UseDraggableOptions = {},
) {
    const {
        pointerTypes,
        preventDefault,
        stopPropagation,
        onMove,
        onEnd,
        onStart,
        initialValue,
        axis = 'both',
        snapToCursor,
        draggingElement = defaultWindow,
        containerElement,
        buttons = [0],
    } = options;

    const eventBus = useEventBus();
    const dndContext = useDndContext();
    const position = ref<Position>(toValue(initialValue) ?? { x: 0, y: 0 });
    const draggingHandle = ref<DOMElement>();
    const pressedDelta = ref<Position>();
    const { x: targetX, y: targetY, top: targetTop, left: targetLeft, width: targetWidth, height: targetHeight, update: updateTargetBounding } = useElementBounding(draggableEl);
    const targetRect = computed<DOMElementBounds>(() => ({ x: targetX.value, y: targetY.value, width: targetWidth.value, height: targetHeight.value, top: targetTop.value, left: targetLeft.value }));
    const cleanupListeners = ref<() => void>();
    const overlayStyle = computed<CSSProperties>(() => {
        const boundingRect = dndContext.overylayBoundingRects[item.id]

        return {
            top: (boundingRect?.top ?? 0) + 'px',
            left: (boundingRect?.left ?? 0) + 'px',
            width: (boundingRect?.width ?? 0) + 'px',
            height: (boundingRect?.height ?? 0) + 'px',
            transform: `translate(${position.value.x - (boundingRect?.left ?? 0)}px, ${position.value.y - (boundingRect?.top ?? 0)}px)`,
        }
    })

    const filterEvent = (e: PointerEvent) => {
        if (pointerTypes) return pointerTypes.includes(e.pointerType as PointerType);
        return true;
    };

    const throttledEmit = useThrottleFn(
        (type: keyof Events, event: DndDragEvent) => eventBus.emit(type, event),
        75,
    );

    function AddEventListeners() {
        if (isClient) {
            cleanupListeners.value?.();

            const config = () => ({
                capture: options.capture ?? true,
                passive: !toValue(preventDefault),
            });

            const cleanupPointerDown = useEventListener(draggingHandle, 'pointerdown', start, config);
            const cleanupPointerMove = useEventListener(draggingElement,'pointermove',move,config);
            const cleanupPointerUp = useEventListener(draggingElement, 'pointerup', end, config);

            cleanupListeners.value = () => {
                cleanupPointerDown();
                cleanupPointerMove();
                cleanupPointerUp();
            };
        }
    }

    function registerHandle(handleEl: DOMElement) {
        draggingHandle.value = handleEl;
    }

    function updatePos(e: PointerEvent) {
        if (!pressedDelta.value) return;

        updateTargetBounding();

        const container = toValue(containerElement);
        let { x, y } = position.value;

        if (axis === 'x' || axis === 'both') {
            x = e.clientX - pressedDelta.value.x;

            if (snapToCursor) {
                x = e.clientX - targetWidth.value / 2;
            }
            if (container) {
                x = Math.min(Math.max(0, x), container.scrollWidth - targetWidth.value);
            }
        } else {
            x = targetLeft.value;
        }

        if (axis === 'y' || axis === 'both') {
            y = e.clientY - pressedDelta.value.y;

            if (snapToCursor) {
                y = e.clientY - targetHeight.value / 2;
            }
            if (container) {
                y = Math.min(Math.max(0, y), container.scrollHeight - targetHeight.value);
            }
        } else {
            y = targetTop.value;
        }

        position.value = { x, y };
    }

    const handleEvent = (e: PointerEvent) => {
        if (toValue(preventDefault)) e.preventDefault();
        if (toValue(stopPropagation)) e.stopPropagation();
    };

    const start = (e: PointerEvent) => {
        if (!toValue(buttons).includes(e.button)) return;
        if (toValue(options.disabled) || !filterEvent(e)) return;


        updateTargetBounding();
        console.log(draggableEl.value)

        const container = toValue(containerElement);
        const containerRect = container?.getBoundingClientRect?.();
        const delta = {
            x:
                e.clientX -
                (container
                    ? targetLeft.value - containerRect!.left + container.scrollLeft
                    : targetLeft.value),
            y:
                e.clientY -
                (container
                    ? targetTop.value - containerRect!.top + container.scrollTop
                    : targetTop.value),
        };

        if (onStart?.(delta, e) === false) return;

        pressedDelta.value = delta;

        updatePos(e);
        handleEvent(e);

        eventBus.emit('draggable:startdrag', {
            activeId: item.id,
            activeContainerId: containerId?.value,
            containerOver: dndContext.getContainerOver(overlayEl),
            draggableOver: dndContext.getDraggableOver(overlayEl),
        });
    };

    const move = (e: PointerEvent) => {
        if (toValue(options.disabled) || !filterEvent(e)) return;

        if (!pressedDelta.value) return;

        updatePos(e);
        onMove?.(position.value, e);
        handleEvent(e);

        throttledEmit('draggable:move', {
            activeId: item.id,
            activeContainerId: containerId?.value,
            containerOver: dndContext.getContainerOver(overlayEl),
            draggableOver: dndContext.getDraggableOver(overlayEl),
        });
    };

    const end = (e: PointerEvent) => {
        if (toValue(options.disabled) || !filterEvent(e)) return;

        if (!pressedDelta.value) return;

        pressedDelta.value = undefined;

        updatePos(e);
        onEnd?.(position.value, e);
        handleEvent(e);

        eventBus.emit('draggable:enddrag', {
            activeId: item.id,
            activeContainerId: containerId?.value,
            containerOver: dndContext.getContainerOver(overlayEl),
            draggableOver: dndContext.getDraggableOver(overlayEl),
        });
    };

    onMounted(() => {
        if (draggableEl.value) {
            dndContext.registerDraggable(draggableEl, item.id);
        }

        if (draggableEl.value && !draggingHandle.value) {
            draggingHandle.value = draggableEl.value;
        }

        AddEventListeners();
    });

    onUnmounted(() => {
        dndContext.unregisterDraggable(item.id);
        cleanupListeners.value?.();
    });

    return {
        ...toRefs(position),
        position,
        isDragging: computed(() => !!pressedDelta.value),
        rect: targetRect,
        overlayStyle: overlayStyle,
        registerHandle,
    };
}
