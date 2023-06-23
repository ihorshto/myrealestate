<script setup>
import { useUserStore } from '@/stores/user'
// let user = JSON.parse(localStorage.getItem("user"));

const user = useUserStore();
console.log("user", user);
</script>

<template>
  <main>
    <div class="container my-3">
      <div class="row">
        <div class="col">
          <h1>Bienvenue {{ user.name }}</h1>
        </div>
      </div>
      <div class="row mt-4">
        <div class="col">
          <div>
            <a class="btn btn-primary" href="/products/list">Gestion des produits</a>
          </div>
          <div class="mt-3">
            <a class="btn btn-primary" href="/users/list">Gestion des utilisateurs</a>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
