<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { useUserStore } from '../stores/user';
let userStore = useUserStore();

const router = useRouter();

let login = ref("");
let password = ref("");

async function goLogin() {
  try {
    let response = await fetch("http://localhost:8000/office/login", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ login: login.value, password: password.value })
    })
    let json = await response.json();
    if (json.data) {
      // localStorage.setItem("user", JSON.stringify(json.data));
      console.log(JSON.stringify(json.data));
      userStore.setUser(JSON.stringify(json.data));
      router.push('/');
    }
  } catch (e) {
    console.warn(e);
  }

}
</script>

<template>
  <main>
    <div class="container mt-3">
      <div class="row">
        <div class="col">
          <div class="mb-3">
            <label for="login" class="form-label">Identifiant</label>
            <input type="text" class="form-control" id="login" v-model="login">
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Mot de passe</label>
            <input type="password" class="form-control" id="password" v-model="password">
          </div>
          <button type="button" class="btn btn-primary" @click.prevent="goLogin">S'identifier</button>
        </div>
      </div>
    </div>
  </main>
</template>
