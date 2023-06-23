// import { ref, computed } from 'vue';

import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
    // arrow function recommended for full type inference
    state: () => {
        let u = localStorage.getItem("user");
        if (u) {
            u = JSON.parse(u);
        }
        else {
            u = {
                id: 0,
                name: "",
                password: "",
                token: ""
            }
        }
        return u;
    },
    actions: {
        setUser(user) {
            this.id = user.id
            this.name = user.name
            this.password = user.password
            this.token = user.token
            // console.log("user", user);
            // console.log("Json user", JSON.stringify(user))
            // debugger
            localStorage.setItem("user", user);
        }
    }
})