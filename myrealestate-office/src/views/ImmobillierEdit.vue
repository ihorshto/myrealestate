<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getUserToken } from '/utils'

const route = useRoute();
const router = useRouter();

let product = ref({});
let productstypes = ref([])

async function loadProduct() {
  try {
    let response = await fetch(`http://localhost:8000/office/products/${route.params.id}`, {
      headers: {
        'authorization': `Bearer ${getUserToken()}`
      }
    })
    let json = await response.json();
    product.value = json.data;
    console.log("product VALUE", product.value)
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

    console.log("Products type", productstypes.value);
  } catch (e) {
    console.warn(e);
  }
}

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

async function saveProduct() {
  let method = "PUT", url = `http://localhost:8000/office/products/${route.params.id}`;
  if (base64Image != "") product.value.image = base64Image;
  if (route.params.id == '0') {
    method = "POST";
    url = `http://localhost:8000/office/products`;
  }
  try {
    let response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${getUserToken()}`
      },
      body: JSON.stringify(product.value)

    })
    console.log('product value save', product.value);
    let json = await response.json();
    product.value = json.data;
    router.push('/immobiliers/list');
  } catch (e) {
    console.warn(e);
  }

}

let base64Image = "";
function onChangeImage(evt) {
  const selectedfile = evt.target.files;
  if (selectedfile.length > 0) {
    const [imageFile] = selectedfile;
    const fileReader = new FileReader();
    fileReader.onload = () => {
      base64Image = fileReader.result;
      const newImage = document.createElement('img');
      newImage.src = base64Image;
      newImage.width = 200;
      console.log("newImage", newImage.outerHTML);
      document.getElementById('thumbnail').innerHTML = newImage.outerHTML;
    };
    fileReader.readAsDataURL(imageFile);
  }
}

loadProduct();
loadTypesProducts();
loadUsers();

</script>

<template>
  <main>
    <div class="container">
      <div class="row my-3">
        <div class="col">
          <h1>Edition d'un immo</h1>
          <form>
            <div class="mb-3">
              <label for="name" class="form-label">Nom du immo</label>
              <input type="text" class="form-control" id="name" v-model="product.name">
            </div>
            <div class="mb-3">
              <label for="price" class="form-label">Prix</label>
              <input type="text" class="form-control" id="price" v-model="product.price">
            </div>
            <div class="mb-3">
              <label for="description" class="form-label">Description</label>
              <textarea class="form-control" id="description" rows="3" v-model="product.description"></textarea>
            </div>
            <div class="mb-3">
              <label for=" " class="form-label">Image (.jpg seulement)</label>
              <input type="file" class="form-control" id="image" @change="onChangeImage">
            </div>
            <div id="thumbnail" class="mb-3">
              <!-- <img :src=product.image alt="" width="200"  > -->
            </div>
            <div class="mb-3">
              <label for="type_immo" class="form-label mr-2">Type immo: </label>

              <select v-model="product.type_immo">
                <option id="type_immo" class="form-control" v-for="type_immo in productstypes" :key="type_immo.id"
                  :value="type_immo.id">
                  {{ type_immo.id }} - {{ type_immo.name }}
                </option>
              </select>
              <!-- <input type="text" class="form-control" id="price" v-model="product.type_immo"> -->
            </div>
            <div class="mb-3">
              <label for="id_client" class="form-label mr-2">ID client: </label>

              <select v-model="product.id_client">
                <option id="type_immo" class="form-control" v-for="user in users" :key="user.id" :value="user.id">
                  {{ user.id }} - {{ user.name }}
                </option>
              </select>
              <!-- <input type="text" class="form-control" id="id_client" v-model="product.id_client"> -->
            </div>
            <button type="button" class="btn btn-primary mt-3" @click.prevent="saveProduct">Enregistrer</button>
          </form>
        </div>
      </div>
    </div>

  </main>
</template>
