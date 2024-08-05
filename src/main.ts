import { createApp } from 'vue';
import { createRouter, createWebHistory, RouteLocationNormalizedGeneric } from "vue-router";

import 'katex/dist/katex.css';

import App from './App.vue';
import Home from './Home.vue';
import Runner from "./Runner.vue";
import Docs from './Docs.vue';

const app = createApp(App);
const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: Home,
            meta: {
                title: () => `OLCPP`
            }
        },
        {
            path: '/run/:id',
            component: Runner,
            props: true,
            meta: {
                title: (to: RouteLocationNormalizedGeneric) => `${to.params.id} - OLCPP`
            }
        },
        {
            path: '/docs/:id?',
            component: Docs,
            props: true,
            meta: {
                title: (to: RouteLocationNormalizedGeneric) => {
                    const id = (to.params.id ? to.params.id : `intro`) as string;
                    return `${id.charAt(0).toUpperCase() + id.slice(1)} - OLCPP Docs`;
                }
            }
        }
    ],
});
router.afterEach((to, from) => {
    document.title = (to.meta.title as Function)(to, from) as string;
});
app.use(router);
app.mount('#app');
