<script setup lang="ts">
    import type { DOMElementBounds } from '@/types/types';
    import { computed, type StyleValue } from 'vue';

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
        transform: props.transform,
    }));
</script>

<template>
    <div v-if="visible" class="touch-none fixed select-none cursor-pointer z-20 " :style="style">
        <slot />
    </div>
</template>
