<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'

const router = useRouter()

function logout() {
  localStorage.removeItem("user")
  router.push('/login')
}

</script>

<template>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css"
    integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
  <header>
    <div class="container">
      <div class="row">
        <div class="col">

          <nav class="navbar navbar-expand-lg bg-body-tertiary d-flex">
            <div>
              <img alt="Vue logo" class="logo" src="@/assets/logo.png" width="125" height="125" />
            </div>
            <div class="container-fluid">
              <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
              </button>
              <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                  <li class="nav-item">
                    <RouterLink to="/" class="nav-link">Home</RouterLink>
                  </li>
                  <li class="nav-item">
                    <RouterLink to="/immobiliers/list" class="nav-link">Gestion des immobilieres</RouterLink>
                  </li>
                  <li class="nav-item">
                    <RouterLink to="/users/list" class="nav-link">Gestion des utilisateurs</RouterLink>
                  </li>
                  <li class="nav-item">
                    <RouterLink to="/calendar" class="nav-link">Calendar</RouterLink>
                  </li>
                  <li class="nav-item">
                    <a @click="logout" href="javascript:void(0)" class="nav-link">Logout</a>
                  </li>
                </ul>
              </div>
            </div>
          </nav>

        </div>
      </div>
    </div>
  </header>

  <RouterView />

  <footer>
    <div class="container">
      <div class="row my-4">
        <div class="col">
          <hr>
          <p class="text-center">MyShop - 2023</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<style>
nav li .router-link-active,
nav li .router-link-exact-active {
  font-weight: bold;
  cursor: pointer;
}
</style>
