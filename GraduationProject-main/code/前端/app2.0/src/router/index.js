import Vue from 'vue'
import Router from 'vue-router'
import searchStart from '../components/searchStart.vue'
import searchDst from '../components/searchDst.vue'
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
    },
    {
      path: '/searchStart',
      name: 'searchStart',
      component: searchStart,
      meta:{
        keepAlive:false,
      }
    },
    {
      path: '/searchDst',
      name: 'searchDSt',
      component: searchDst,
      meta:{
        keepAlive:false,
      }
    }
  ]
})
