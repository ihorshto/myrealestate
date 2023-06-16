<script setup>
import {
  ref
} from 'vue'
import {
  useRouter
} from 'vue-router'
import {
  getUserToken
} from '/utils'

const router = useRouter();

let products = ref([])
async function loadProducts() {
  try {
    let response = await fetch('http://localhost:8000/office/products', {
      method: "GET",
      headers: {
        'authorization': `Bearer ${getUserToken()}`
      }
    })
    let json = await response.json();
    products.value = json.data;
  } catch (e) {
    console.warn(e);
  }
}

function newProduct() {
  router.push('/products/edit/0');
}
async function deleteProd(id) {
  if (window.confirm("Voulez-vous vraiment supprimer ce produit ?")) {
    try {
      let response = await fetch(`http://localhost:8000/office/products/${id}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${getUserToken()}`
        }
      })
      let json = await response.json();
      loadProducts();
    } catch (e) {
      console.warn(e);
    }
  }
}

function getImageUrl(product) {
  return `http://localhost:8000/products/${product.id}.jpg`;
}

loadProducts();
</script>

<template>
  <main>
    <div class="container">
      <div class="row my-3">
        <div class="col d-flex justify-content-between">
          <h1>Liste des terrains</h1>

          <div>
            <button @click="newProduct" class="btn btn-info">Nouveau produit</button>
          </div>
        </div>
        <h2>Category:</h2>
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <RouterLink to="/immobiliers/maisons" class="nav-link">1 - Maisons</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/immobiliers/appartements" class="nav-link">2 - Appartements</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/immobiliers/terrains" class="nav-link">3 - Terrains</RouterLink>
          </li>
        </ul>
      </div>

      <div class="row">
        <div class="col">
          <table class="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom du produit</th>
                <th>Prix</th>
                <th>Image</th>
                <th>Type</th>
                <th>Id client</th>
                <th>&nbsp;</th>

              </tr>
            </thead>
            <tbody>
              <tr v-for="product in products" :key="product.id">
                <td v-if="product.type_immo == 3">
                  {{ product.id }}
                </td>
                <td v-if="product.type_immo == 3">
                  {{ product.name }}
                </td>
                <td v-if="product.type_immo == 3">
                  {{ product.price }} €
                </td>
                <td v-if="product.type_immo == 3"><img v-if="product.hasImg" :src="getImageUrl(product)"
                    style="max-height: 100px; max-width:100px" />
                </td>
                <td v-if="product.type_immo == 3">
                  {{ product.type_immo }}
                </td>
                <td v-if="product.type_immo == 3">
                  {{ product.id_client }}
                </td>
                <td v-if="product.type_immo == 3"><a :href="`/products/edit/${product.id}`"
                    class="btn btn-sm btn-primary">Modifier</a> <a :href="`javascript:void(0)`"
                    class="btn btn-sm btn-danger" @click.prevent="deleteProd(product.id)">Effacer</a></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

  </main>
</template>