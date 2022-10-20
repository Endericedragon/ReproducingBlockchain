import Vue from 'vue'
import Router from 'vue-router'
import mapContent from '../components/map.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'map',
      component:mapContent,
      meta:{
        keepAlive:false,
      }

    }
  ]
})
