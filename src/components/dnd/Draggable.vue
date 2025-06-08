<script setup lang="ts">
    const props = withDefaults(defineProps<{
        handle?: boolean;
    }>(), {
        handle: false
    });
</script>

<template>
    <div>
        <slot />
    </div>
</template>
