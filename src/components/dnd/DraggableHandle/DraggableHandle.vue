<script setup lang="ts">
    import type { DOMElement } from '@/types/types';
    import { GripVertical } from 'lucide-vue-next';
    import { inject, onMounted, useTemplateRef, type Ref } from 'vue';

    defineProps<{
        icon?: string;
    }>();

    const handleEl = useTemplateRef<DOMElement>("handleEl");
    const registerHandle = inject<(handleEl: Ref<DOMElement>) => void | undefined>('registerHandle');

    onMounted(() => {
        if (handleEl.value && registerHandle) {
            registerHandle(handleEl);
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