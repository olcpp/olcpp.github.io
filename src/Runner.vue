<template>
    <div v-if="isFetching">Loading assets...</div>
    <Console v-if="isFinished && data.type == 'console'" :moduleUrl="`/apps/${props.id}/main.mjs`" />
</template>

<script setup lang="ts">
import { useFetch } from '@vueuse/core';
import Console from './Runner/Console.vue';

const props = defineProps<{
    id: string;
}>();

const { isFetching, isFinished, data } = useFetch(`/apps/${props.id}/app.json`).json();
</script>