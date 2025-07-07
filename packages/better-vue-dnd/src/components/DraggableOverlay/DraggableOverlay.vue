<script setup lang="ts">
    import gsap from 'gsap';
    import { type DOMElement, type DOMElementBounds } from '../../types/types';
    import { provide, useTemplateRef, type CSSProperties, type Ref } from 'vue';

    defineProps<{
        visible: boolean;
        elBounds: DOMElementBounds;
        overlayStyle: CSSProperties;
    }>();

    const overlayEl = useTemplateRef<DOMElement>('overlayEl');

    provide('inOverlay', true);
    defineExpose<{
        el: Ref<DOMElement>;
    }>({
        el: overlayEl,
    });

    function onDragEnd(el: Element, done: () => void) {
        gsap.to(el, {
            duration: 0.1,
            delay: 0.05,
            x: 0,
            y: 0,
            ease: 'linear',
            onComplete: done
        });
    }
</script>

<template>
    <Transition name="drag" :css="false" :duration="0.15" @leave="onDragEnd">
        <div
            v-if="visible"
            ref="overlayEl"
            class="touch-none fixed select-none cursor-pointer z-[1000]"
            :style="overlayStyle"
        >
            <slot />
        </div>
    </Transition>
</template>