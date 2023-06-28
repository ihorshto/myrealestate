<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getUserToken } from '/utils'

const route = useRoute();
const router = useRouter();

let product = ref({});

async function loadProduct() {
  try {
    let response = await fetch(`http://localhost:8000/office/products/${route.params.id}`, {
      headers: {
        'authorization': `Bearer ${getUserToken()}`
      }
    })
    let json = await response.json();
    product.value = json.data;
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
    let json = await response.json();
    product.value = json.data;
    router.push('/products/list');
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
      document.getElementById('thumbnail').innerHTML = newImage.outerHTML;
    };
    fileReader.readAsDataURL(imageFile);
  }
}

loadProduct();
console.log('product', product);
</script>

<template>
  <main>
    <div class="container">
      <div class="row my-3">
        <div class="col">
          <h1>Edition d'un produit</h1>
          <form>
            <div class="mb-3">
              <label for="name" class="form-label">Nom du produit</label>
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
              <label for="image" class="form-label">Image (.jpg seulement)</label>
              <input type="file" class="form-control" id="image" @change="onChangeImage">
            </div>
            <div id="thumbnail"></div>
            <div class="mb-3">
              <label for="type_immo" class="form-label">Type immo</label>
              <input type="text" class="form-control" id="type_immo" v-model="product.type_immo">
            </div>
            <div class="mb-3">
              <label for="id_client" class="form-label">ID client</label>
              <input type="text" class="form-control" id="id_client" v-model="product.id_client">
            </div>
            <button type="button" class="btn btn-primary mt-3" @click.prevent="saveProduct">Enregistrer</button>
          </form>
        </div>
      </div>
    </div>

  </main>
</template>
