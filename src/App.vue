<script setup lang="ts">
    import { RouterView } from 'vue-router'
    import NavItem from './components/NavItem.vue';
</script>

<template>
    <div class="flex flex-col gap-4">
        <header>
            <div>
                <nav class="flex items-center gap-2">
                    <NavItem to="/" label="Home" />
                    <NavItem to="/examples" label="Examples" />
                </nav>
            </div>
        </header>
        <RouterView />
    </div>
</template>
