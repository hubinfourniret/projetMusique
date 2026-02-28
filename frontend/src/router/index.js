import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import LoginView from "@/views/LoginView.vue";
import HomeView from "@/views/HomeView.vue";
import FocusView from "@/views/FocusView.vue";

export default createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: LoginView },
        {
            path: '/home',
            component: AppLayout,
            children: [
                { path: '', component: HomeView },
            ]
        },
        {path: "/focus", component: FocusView },
    ]
})
