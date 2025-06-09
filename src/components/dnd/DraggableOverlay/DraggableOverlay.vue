<script setup lang="ts">
    import type { DOMElementBounds } from '@/types/types';
    import { computed } from 'vue';

    const props = defineProps<{
        visible: boolean;
        elBounds: DOMElementBounds;
        transformX: number;
        transformY: number;
    }>();

    const style = computed(() => ({
        top: props.elBounds.top + 'px',
        left: props.elBounds.left + 'px',
        width: props.elBounds.width + 'px',
        height: props.elBounds.height + 'px',
        transform: `translate(${props.transformX}px, ${props.transformY}px)`,
    }));
</script>

<template>
    <div v-if="visible" class="touch-none fixed select-none cursor-pointer z-20 " :style="style">
        <slot />
    </div>
</template>
