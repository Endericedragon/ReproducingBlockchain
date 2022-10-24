<template>
	<div>
		<div id="map"></div>
		<input type="button" id="eventBtn" v-model="eventText" style="" />
		<search-box v-if="!isManaging && !isLogin"></search-box>
		<traffic v-if="isManaging " v-show=" !isLogin"></traffic>
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
import searchBox from "./searchBox.vue";
import Traffic from "./Traffic.vue";
import jointPoints from "../../static/js/joint_points";


export default {
	name: "mapContent",
	components: { searchBox, Login, Traffic },
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
	computed: {
		getNearset() {},
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
				zoom: 20, //缩放比列
				zoomControl: false, //禁用 + - 按钮
				doubleClickZoom: false, // 禁用双击放大
				attributionControl: false, // 移除右下角leaflet标识
			});
			L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'&copy; <a 	href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(global_.map);
			var defaultIcon = L.icon({
				iconUrl: require("../assets/gray.png"),
				iconSize: [24, 38],
				iconAnchor: [16, 16],
				ShadowSize: [41, 41],
				ShadowAnchor: [4, 62],
				popupAnchor: [1, -24],
			});

			var initMarkers = L.layerGroup();
			for (let item of jointPoints) {
				let locaiton = [
					decode_geohash_simple(item[0]).lat,
					decode_geohash_simple(item[0]).lon,
				];
				console.log(locaiton);
				let marker = L.marker(locaiton, { icon: defaultIcon });
				marker.on("mouseover", () => {
					marker.bindPopup(item[1]).openPopup();
				});
				marker.on("mouseout", () => {
					marker.closePopup();
				});
				var timer;
				marker.on("click", () => {
					if (global_.startPlace === "") {
						eventBus.$emit("comfirmStart", item[1], item[0]);
					} else {
						eventBus.$emit("comfirmDst", item[1], item[0]);
					}
				});

				marker.addTo(initMarkers);
			}
			global_.map.addLayer(initMarkers);
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