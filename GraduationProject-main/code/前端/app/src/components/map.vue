<template>
  <div>
    <div id="map"></div>
      <input type="button" id="eventBtn" v-model="eventText" style="" />
    <login  @updateEvent="updateEvent" v-if="isReady"></login>
    <search-box @changeManageStatu="changeManageStatu" v-if="!isManaging" ></search-box>
     <traffic  @changeManageStatu="changeManageStatu" @updateEvent="updateEvent"  v-if="isManaging"></traffic>
  </div>
</template>
<script>
/*
  地图组件
*/
import global_ from "./Global";
import Login from "./Login.vue";
import { getRoads } from "../../static/js/getRoads.js";
import { update_map } from "../../static/js/mapConfig.js";
import searchBox from "./searchBox.vue";
import Traffic from "./Traffic.vue"
const initPosGeohash = "wx4enz9fy7cp";

export default {
  name: "mapContent",
  components: { searchBox, Login ,Traffic},
  data(){
    return{
        isManaging:false,
        isReady:false,
        eventText:""
    }
  },
  mounted() {
    //init the map
    this.initMap();
    getRoads("wx4e");
    update_map(global_.map);
    this.isReady=true;
  },
  computed: {
    getNearset() {},
  },
  methods: {
    initMap: function () {
      console.log(">>>Init the map...");
      global_.map = L.map("map", { maxZoom: 18, minZoom: 1 }).setView(
        initPosGeohash,
        12
      );
    },
    changeManageStatu:function(param){
      this.isManaging=param;
    },
    updateEvent: function (param) {
     this.eventText=param;
    },
  },
};
</script>
<style>
#map {
  width: 100%;
  height: 100%;
  position: absolute;
  overflow: hidden;
  background-color: rgba(255, 240, 192, 0.746);
}
input {
  height: 40px;
  width: 100px;
  margin: 10px;
}
</style>