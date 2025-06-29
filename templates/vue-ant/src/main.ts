import { createApp } from 'vue'
import pinia from './store'

import App from './App.vue'
import router from './router'
import '@/styles/index.scss'

const app = createApp(App)

app.use(router)
app.use(pinia)
app.mount('#app')
