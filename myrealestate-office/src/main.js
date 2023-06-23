import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')


// import { defineStore } from 'pinia'

// export const usserStore = defineStore('user', {
//     state: () => {
//         return { isLoggedIn: false, name: "", firstname: "" }
//     },
//     actions: {
//         setUser(u) {
//             this.name = u.name
//             this.firstname = u.firstname
//             this.isLoggedIn = true
//         },
//     },
// })
