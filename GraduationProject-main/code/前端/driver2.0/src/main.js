// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import global_ from './components/Global'
import 'leaflet/dist/leaflet.css'
// 引入Leaflet对象 挂载到Vue上，便于全局使用，也可以单独页面中单独引用
import * as L from 'leaflet'
import 'leaflet.pm'
import 'leaflet.pm/dist/leaflet.pm.css'

Vue.config.productionTip = false;
Vue.L = Vue.prototype.$L = L

/* leaflet icon */
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
})


Vue.prototype.GLOBAL = global_
Vue.config.productionTip = false
global_.initContract(global_.mapContract,global_.trafficContract )
 global_.initData(global_.placeNames)
//console.log("contract: "+global_.mapContract
window.eventBus=new Vue();
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})


