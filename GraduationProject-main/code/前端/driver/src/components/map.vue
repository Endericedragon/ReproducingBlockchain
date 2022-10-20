<template>
  <div>
    <div id="map"></div>
    <input type="button"  id ="eventBtn" v-model="eventText"  style="" />
    <login @changeState="changeTrafficState" @updateEvent="updateEvent"></login>
    <traffic @updateEvent="updateEvent" v-if="isLogin"></traffic>
  </div>
</template>
<script>
/*
  地图组件
*/
import global_ from "./Global";
import { getRoads } from "../../static/js/getRoads.js";
import { update_map } from "../../static/js/mapConfig.js";
import Traffic from "./Traffic.vue";
import Login from "./Login.vue";

const initPosGeohash = "wx4enz9fy7cp";

export default {
  name: "mapContent",
  components: { Traffic, Login },
  data() {
    return {
      refresh: true,
      startPoint: null,
      dstPoint: null,
      isLogin: false,
      eventText:"",
    };
  },
  mounted() {
    this.initMap();
    getRoads("wx4e");
    update_map(global_.map);
  },
  methods: {
    //初始化地图
    initMap: function () {
      console.log(">>>Init the map...");
      global_.map = L.map("map", { maxZoom: 18, minZoom: 1 }).setView(
        global_.userGeohash,
        12
      );
    },
    changeTrafficState: function () {
      this.isLogin = !this.isLogin;
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