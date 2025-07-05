<script setup lang="ts">
    import type { DOMElement } from '../../types/types';
    import { GripVertical } from 'lucide-vue-next';
    import { inject, onMounted, useTemplateRef } from 'vue';

    defineProps<{
        icon?: string;
    }>();

    const handleEl = useTemplateRef<DOMElement>('handleEl');
    const registerHandle = inject<(handleEl: DOMElement) => void | undefined>('registerHandle');
    const inOverlay = inject<boolean>('inOverlay', false);

    onMounted(() => {
        if (handleEl.value && registerHandle && !inOverlay) {
            registerHandle(handleEl.value);
        }
    });
</script>

<template>
    <div ref="handleEl" class="flex items-center">
        <i v-if="icon" :class="icon"></i>
        <GripVertical v-else :size="18" />
        <slot />
    </div>
</template>
