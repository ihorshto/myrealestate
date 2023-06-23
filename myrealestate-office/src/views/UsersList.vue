<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getUserToken } from '/utils'

const router = useRouter()

let users = ref([])
async function loadUsers() {
  try {
    let response = await fetch('http://localhost:8000/office/users', {
      method: "GET",
      headers: {
        'authorization': `Bearer ${getUserToken()}`
      }
    })
    let json = await response.json()
    users.value = json.data
  } catch (e) {
    console.warn(e);
  }

}

function newUser() {
  router.push('/users/edit/0')
}
async function deleteUser(id) {
  if (window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
    try {
      let response = await fetch(`http://localhost:8000/office/users/${id}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${getUserToken()}`
        }
      })
      let json = await response.json()
      loadUsers()
    } catch (e) {
      console.warn(e);
    }

  }
}

loadUsers();
</script>

<template>
  <main>
    <div class="container">
      <div class="row my-3">
        <div class="col d-flex justify-content-between">
          <h1>Liste des utilisateurs</h1>
          <div>
            <button @click="newUser" class="btn btn-info">Nouveau utilisateur</button>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col">
          <table class="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom utilisateur</th>
                <th>Email</th>
                <th>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id">
                <td>{{ user.id }}</td>
                <td>{{ user.name }}</td>
                <td>{{ user.email }}</td>
                <td><a :href="`/users/edit/${user.id}`" class="btn btn-sm btn-primary">Modifier</a> <a
                    :href="`javascript:void(0)`" class="btn btn-sm btn-danger"
                    @click.prevent="deleteUser(user.id)">Eff</a></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

  </main>
</template>
