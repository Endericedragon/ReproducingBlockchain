<template>
	<div>
		<div id="map"></div>

		<traffic v-if="isManaging" v-show="!isLogin"></traffic>
		<login></login>
	</div>
</template>
<script>
/*
  地图组件
*/
import L from "leaflet";
import global_ from "./Global";
import Login from "./Login.vue";
import Traffic from "./Traffic.vue";

const initPosGeohash = "wx4enz9fy7cp";

export default {
	name: "mapContent",
	components: { Login, Traffic },
	data() {
		return {
			isManaging: false,
			isLogin: false,
			eventText: "",
		};
	},
	mounted() {
		//init the map
		this.initMap();

		this.isReady = true;

		//listen
		eventBus.$on("islogining", (val) => {
			this.isLogin = val;
		});
		eventBus.$on("isManaging", (val) => {
			this.isManaging = val;
		});
	},
	methods: {
		initMap: function () {
			console.log(">>>Init the map...");
			var locaiton = [
				decode_geohash_simple("wx4enx478f6").lat,
				decode_geohash_simple("wx4enx478f6").lon,
			];

			global_.map = L.map("map", {
				center: locaiton, // 地图中心
				zoom: 14, //缩放比列
				zoomControl: true, //禁用 + - 按钮
				doubleClickZoom: true, // 禁用双击放大
				attributionControl: false, // 移除右下角leaflet标识
			});
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'&copy; <a 	href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(global_.map);
			
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
	z-index: 0;
}
input {
	height: 40px;
	width: 100px;
	margin: 10px;
}
</style>