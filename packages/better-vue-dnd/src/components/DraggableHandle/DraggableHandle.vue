<script setup lang="ts">
    import type { DOMElement } from '../../types/types';
    import { GripVertical } from 'lucide-vue-next';
    import { inject, onMounted, useTemplateRef } from 'vue';

    defineProps<{
        icon?: string;
    }>();

    const handleRef = useTemplateRef<DOMElement>('handleEl');
    const registerHandle = inject<(handleEl: DOMElement) => void | undefined>('registerHandle');
    const inOverlay = inject<boolean>('inOverlay', false);
    
    onMounted(() => {
        if (handleRef.value && registerHandle && !inOverlay) {
            registerHandle(handleRef.value);
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
