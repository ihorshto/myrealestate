<script setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getUserToken } from '/utils'

const router = useRouter();
const route = useRoute();

console.log(route.params)

let products = ref([])
let productstypes = ref([])
async function loadProducts() {
  try {
    let t = route.params.typeimmo ? route.params.typeimmo : "";
    let response = await fetch('http://localhost:8000/office/products?typeimmo=' + t, {
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
async function loadTypesProducts() {
  try {
    let response = await fetch('http://localhost:8000/office/productstypes', {
      method: "GET",
      headers: {
        'authorization': `Bearer ${getUserToken()}`
      }
    })
    let json = await response.json();
    productstypes.value = json.data;
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
loadTypesProducts();

// function changeProductType(producttype) {
//   router.push('/immobiliers/' + producttype)
//   loadProducts();
// }

watch(
  () => route.fullPath,
  async () => {
    loadProducts();
  }
);

</script>

<template>
  <main>
    <div class="container">
      <div class="row my-3">
        <div class="col d-flex justify-content-between">
          <h1>Liste des immobiliers</h1>
          <div>
            <button @click="newProduct" class="btn btn-info">Nouveau produit</button>
          </div>
        </div>
        <h2>Category:</h2>
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item" v-for="producttype in productstypes" :key="producttype.id">
            <RouterLink :to="`/immobiliers/${producttype.id}`" class="nav-link">{{ producttype.name }}</RouterLink>
            <!-- <a :href="`/immobiliers/${producttype.id}`">{{ producttype.name }}</a> -->
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
                <th>&nbsp;</th>

              </tr>
            </thead>
            <tbody>
              <tr v-for="product in products" :key="product.id">
                <td>{{ product.id }}</td>
                <td>{{ product.name }}</td>
                <td>{{ product.price }} €</td>
                <td><img v-if="product.hasImg" :src="getImageUrl(product)" style="max-height: 100px; max-width:100px" />
                </td>
                <td>{{ product.type_immo }} </td>
                <td><a :href="`/products/edit/${product.id}`" class="btn btn-sm btn-primary">Modifier</a> <a
                    :href="`javascript:void(0)`" class="btn btn-sm btn-danger"
                    @click.prevent="deleteProd(product.id)">Effacer</a></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

  </main>
</template>
