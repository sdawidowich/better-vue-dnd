<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
    <main class="flex flex-col gap-4 text-neutral-100 space-y-16">
        <section class="relative overflow-hidden rounded-3xl border border-neutral-800/70 bg-neutral-900/60 backdrop-blur-sm p-10 ring-1 ring-emerald-400/40">
            <div class="pointer-events-none absolute inset-0">
                <div class="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-emerald-500/15 blur-3xl" />
                <div class="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-emerald-500/15 blur-3xl" />
            </div>
            <div class="relative flex flex-col gap-6">
                <h1 class="text-4xl  font-extrabold leading-tight tracking-tight">
                    <span class="bg-gradient-to-r from-emerald-300 to-emerald-700 bg-clip-text text-transparent">
                        Better Vue DnD
                    </span>
                </h1>
                <p class="text-sm text-neutral-400 leading-relaxed">
                    A lightweight, composable drag & drop + sortable library for Vue 3.
                </p>
                <div class="flex flex-wrap items-center gap-4">
                    <RouterLink
                        to="/examples"
                        class="rounded-md px-6 py-3 text-sm font-semibold bg-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 border border-emerald-400/40"
                    >
                        <span>View Examples</span>
                    </RouterLink>
                    <RouterLink
                        to="/"
                        class="rounded-md px-6 py-3 text-sm font-semibold bg-emerald-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 border border-emerald-700/40"
                    >
                        <span>Docs (Coming Soon)</span>
                    </RouterLink>
                </div>
                <div class="pt-4">
                    <code class="block w-full overflow-auto rounded-lg bg-neutral-950/80 p-4 text-[12px] leading-relaxed border border-neutral-800/80 shadow-inner">
                        <span class="text-neutral-500"># install</span><br />
                        <span class="text-emerald-400">pnpm</span> add better-vue-dnd
                    </code>
                </div>
            </div>
        </section>
    </main>
</template>
