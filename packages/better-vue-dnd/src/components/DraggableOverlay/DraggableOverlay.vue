<script setup lang="ts">
    import { type DOMElement, type DOMElementBounds } from '../../types/types';
    import { provide, useTemplateRef, type Ref, type StyleValue } from 'vue';

    defineProps<{
        visible: boolean;
        elBounds: DOMElementBounds;
        activeStyle: StyleValue;
    }>();

    const overlayEl = useTemplateRef<DOMElement>('overlayEl');

    provide('inOverlay', true);
    defineExpose<{
        el: Ref<DOMElement>;
    }>({
        el: overlayEl,
    });
</script>

<template>
    <Transition name="drag">
        <div
            v-if="visible"
            ref="overlayEl"
            class="touch-none fixed select-none cursor-pointer z-[1000] drag-overlay"
            :style="activeStyle"
        >
            <slot />
        </div>
    </Transition>
</template>

<style scoped>
.drag-overlay {
    transform: var(--drag-transform, translate(0px, 0px));
}

.drag-leave-active {
    transition-property: transform;
    transition-duration: 0.15s;
    transition-timing-function: ease-out;
}

.drag-leave-to {
    transform: translate(0px, 0px);
}
</style>
