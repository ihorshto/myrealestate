<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getUserToken } from '/utils'

const route = useRoute();
const router = useRouter();

let user = ref({})

async function loadUser() {
  try {
    let response = await fetch(`http://localhost:8000/office/users/${route.params.id}`, {
      headers: {
        'authorization': `Bearer ${getUserToken()}`
      }
    })
    let json = await response.json();
    user.value = json.data;
  } catch (e) {
    console.warn(e);
  }
}

loadUser();

// 1 3 2 4

// 1 3 4 2

async function saveUser() {
  let method = "PUT", url = `http://localhost:8000/office/users/${route.params.id}`
  if (route.params.id == '0') {
    method = "POST"
    url = `http://localhost:8000/office/users`
  }
  try {
    let response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${getUserToken()}`
      },
      body: JSON.stringify(user.value)
    });

    let json = await response.json()

    user.value = json.data;
    router.push('/users/list')
  } catch (e) {
    console.warn(e);
  }
}

</script>

<template>
  <main>
    <div class="container">
      <div class="row my-3">
        <div class="col">
          <h1>Edition d'un utilisateur</h1>
          <form>
            <div class="mb-3">
              <label for="name" class="form-label">Nom utilisateur</label>
              <input type="text" class="form-control" id="name" v-model="user.name">
            </div>
            <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <input type="email" class="form-control" id="email" v-model="user.email">
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">Mot de passe</label>
              <input type="password" class="form-control" id="password" v-model="user.password">
            </div>
            <button type="submit" class="btn btn-primary" @click.prevent="saveUser">Enregistrer</button>
          </form>
        </div>
      </div>
    </div>

  </main>
</template>
