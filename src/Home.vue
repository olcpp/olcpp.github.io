<template>
    <div style="margin: 10px;">
        <div>
            <h2 style="display: inline; padding-right: 10px;">The OLCPP Project</h2>
            <RouterLink to="/docs">Docs</RouterLink>
        </div>
        <hr />
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
<<<<<<< HEAD
        <a @click="runPrivate" href="javascript:void(0)">Run a private app</a>
=======
>>>>>>> 09ea24c8b8ea3c2b183f86d27e08e77f7898a0d7
    </div>
</template>

<script setup lang="ts">
import { useFetch } from '@vueuse/core';
import { useRouter } from 'vue-router';

const { isFinished, data } = useFetch('/apps/apps.json').json();
const router = useRouter();

function runPrivate() {
    const id = prompt("App ID?");
    if (id) {
        router.push(`/run/${id}`);
    }
}
</script>
