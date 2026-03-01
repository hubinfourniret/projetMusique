import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import {useQueueStore} from "@/stores/queueStore.js";

createApp(App).use(router).mount('#app')

const queueStore = useQueueStore()
queueStore.connect()