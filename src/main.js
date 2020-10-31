import Vue from 'vue'
import BootstrapVue from "bootstrap-vue"
import App from './App.vue'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-vue/dist/bootstrap-vue.css"
import VuePouchDB from 'vue-pouch-db'

Vue.use(BootstrapVue)
Vue.use(VuePouchDB)

new Vue({
  el: '#app',
  render: h => h(App)
})
