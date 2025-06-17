<script setup lang="ts">
    import { type DOMElement, type DOMElementBounds } from '@/types/types';
    import { computed, ref, type Ref, type StyleValue } from 'vue';

    const props = defineProps<{
        visible: boolean;
        elBounds: DOMElementBounds;
        transform: string;
    }>();

    const style = computed<StyleValue>(() => ({
        top: props.elBounds.top + 'px',
        left: props.elBounds.left + 'px',
        width: props.elBounds.width + 'px',
        height: props.elBounds.height + 'px',
        '--drag-transform': props.transform,
    }));

    const el = ref<DOMElement>(null);

    defineExpose<{
        el: Ref<DOMElement>
    }>({ 
        el
    });
</script>

<template>
    <Transition name="drag">
        <div v-if="visible" ref="el" class="touch-none fixed select-none cursor-pointer z-20 drag-overlay" :style="style">
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