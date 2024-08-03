<template>
    <table v-if="isFinished" border="1">
        <thead>
            <tr>
                <th>名称</th>
                <th>作者</th>
                <th>类型</th>
                <th>许可证</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="app of data">
                <td>
                    <RouterLink :to="`/run/${app.id}`"> {{ app.name }} </RouterLink>
                </td>
                <td>
                    {{ app.author }}
                </td>
                <td>
                    {{ app.type }}
                </td>
                <td>
                    {{ app.license }}
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script setup lang="ts">
import { useFetch } from '@vueuse/core';

const { isFinished, data } = useFetch('/apps/apps.json').json();
</script>
