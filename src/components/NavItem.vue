<script setup lang="ts">
    import { computed } from 'vue';
    import { RouterLink, useRouter } from 'vue-router';

    const props = defineProps<{
        to: string;
        label: string;
    }>();

    const router = useRouter();
    const atRoute = computed(() => router.currentRoute.value.path === props.to);
</script>


<template>
    <div class="flex items-center">
        <RouterLink
            class="px-2 py-1 rounded-sm hover:border-emerald-400 border"
            :class="{ 'border-emerald-400/40': atRoute, 'border-transparent': !atRoute }"
            :to="to">
            {{ label }}
        </RouterLink>
    </div>
</template>
