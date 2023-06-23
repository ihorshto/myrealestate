import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import ImmobilliersList from '../views/ImmobilliersList.vue'
import ProductsEdit from '../views/ImmobillierEdit.vue'
import UsersList from '../views/UsersList.vue'
import UsersEdit from '../views/UsersEdit.vue'
// import ImmobillierMaisons from '../views/ImmobilierMaisons.vue'
// import ImmobilierAppartments from '../views/ImmobilierAppartments.vue'
// import ImmobilierTerrains from '../views/ImmobilierTerrains.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/immobiliers/list',
      name: 'immobilierlist',
      component: ImmobilliersList,
      meta: { requiresAuth: true }
    },
    {
      path: '/immobiliers/edit/:id',
      name: 'immobilieredit',
      component: ProductsEdit,
      meta: { requiresAuth: true }
    },
    {
      path: '/users/list',
      name: 'userslist',
      component: UsersList,
      meta: { requiresAuth: true }
    },
    {
      path: '/users/edit/:id',
      name: 'usersedit',
      component: UsersEdit,
      meta: { requiresAuth: true }
    },
    {
      path: '/immobiliers/:typeimmo',
      name: 'immobiliertypes',
      component: ImmobilliersList,
      meta: { requiresAuth: true }
    },
  ]
})

router.beforeEach((to, from, next) => {
  console.log("🚀 ~ file: index.js:47 ~ router.beforeEach ~ to:", to)
  if (to.matched.some(record => record.meta.requiresAuth)) {
    let u = localStorage.getItem('user')
    const user = u ? JSON.parse(u) : null
    if (user?.token) {
      next()
    } else {
      next({ name: 'login' })
    }
  } else {
    next()
  }
})


export default router
