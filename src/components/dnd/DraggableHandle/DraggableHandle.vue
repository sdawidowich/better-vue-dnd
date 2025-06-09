<script setup lang="ts">
    const props = withDefaults(
        defineProps<{
            icon?: string;
        }>(),
        {
            icon: 'drag-icon',
        },
    );
</script>

<template>
    <div>
        <i :class="props.icon"></i>
        <slot />
    </div>
</template>