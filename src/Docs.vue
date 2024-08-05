<template>
    <div style="margin: 10px;">
        <div>
            <h2 style="display: inline; padding-right: 10px;">OLCPP Docs</h2>
            <RouterLink to="/" style="padding-right: 4px;">Home</RouterLink>
            <RouterLink to="/docs/intro">Intro</RouterLink>
        </div>
        <hr />
        <div v-if="!props.id || props.id == 'intro'">
            <Intro></Intro>
        </div>
    </div>
</template>
<script setup lang="ts">
import Intro from './Docs/intro.md';
const props = defineProps<{ id?: string; }>();
</script>