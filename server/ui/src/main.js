import Vue from 'vue/dist/vue.js'
import App from './App.vue'
import VueRouter from 'vue-router'

Vue.config.productionTip = false

import Buefy from 'buefy'
import 'buefy/dist/buefy.css'

Vue.use(Buefy)
Vue.use(VueRouter)

const routes = [
  { path: '/:username/:password', component: App },
  { path: '/', component: App },
]
const router = new VueRouter({
  routes
})

new Vue({
  router
}).$mount('#app')
