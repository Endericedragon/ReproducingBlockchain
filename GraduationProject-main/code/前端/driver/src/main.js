// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import global_ from './components/Global'
Vue.prototype.GLOBAL = global_
Vue.config.productionTip = false
 global_.initContract(global_.mapContract,global_.trafficContract )
 global_.initData(global_.placeNames)
 
console.log("contract: "+global_.mapContract)
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})


