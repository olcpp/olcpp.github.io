import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from "vue-router";

import App from './App.vue';
import Home from './Home.vue';
import Runner from "./Runner.vue";

const app = createApp(App);
const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        { path: '/', component: Home },
        { path: '/run/:id', component: Runner, props: true }
    ],
});
app.use(router);
app.mount('#app');
