<template>
	<div>
		<search-start v-if="isSearchStart"></search-start>
		<search-dst v-if="isSearchDst"></search-dst>
		<div class="searchbox-main">
			<div class="searchbox-container" v-show="!isSearchStart && !isSearchDst">
				<div class="start">
					<div class="icon"></div>
					<input
						autocomplete="false"
						type="text"
						placeholder="请输入上车位置"
						class="text-overflow"
						v-model="startPlace"
						@click="searchStart"
					/>
				</div>
				<div class="line"></div>
				<div class="destination">
					<div class="icon"></div>
					<input
						autocomplete="false"
						type="text"
						placeholder="您要去哪里?"
						class="text-overflow"
						v-model="dstPlace"
						@click="searchDst"
					/>
				</div>
				<input
					class="button"
					type="button"
					id="startManageVehicle"
					@click="manageVehicle"
					v-if="isStartManaging"
					value="开始调度车辆"
				/>
				<div class="dots">
					<div class="dot"></div>
					<div class="dot"></div>
					<div class="dot"></div>
					<div class="dot"></div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import searchStart from "./searchStart.vue";
import searchDst from "./searchDst.vue";
import global_ from "./Global.vue";
import Traffic from "./Traffic.vue";
export default {
	name: "searchBox",
	data() {
		return {
			isClicked: false,
			startPlace: global_.startPlace,
			dstPlace: global_.dstPlace,
			isSearchStart: false,
			isSearchDst: false,
			isStartManaging: false,
		};
	},
	components: {
		searchStart,
		searchDst,
		Traffic,
	},
	mounted() {
		if (global_.getQueryVariable("start")) {
			global_.startGeohash = global_.getQueryVariable("start");
		}
		if (global_.getQueryVariable("end")) {
			global_.dstGeohash = global_.getQueryVariable("end");
		}
		if (global_.startPlace && global_.dstPlace) {
			this.startPlace = global_.startPlace;
			this.dstPlace = global_.dstPlace;
		}
		if (global_.dstGeohash && global_.startGeohash) {
			this.isStartManaging = true;
		}
		//init
		var greenIcon = L.icon({
			iconUrl: require("../assets/green.png"),
			iconSize: [24, 38],
			iconAnchor: [16, 16],
			ShadowSize: [41, 41],
			ShadowAnchor: [4, 62],
			popupAnchor: [1, -24],
		});
		var orangeIcon = L.icon({
			iconUrl: require("../assets/orange.png"),
			iconSize: [24, 38],
			iconAnchor: [16, 16],
			ShadowSize: [41, 41],
			ShadowAnchor: [4, 62],
			popupAnchor: [1, -24],
		});

		//listen
		eventBus.$on("isSearchStart", (val) => {
			this.isSearchStart = val;
		});
		eventBus.$on("isSearchDst", (val) => {
			this.isSearchDst = val;
		});
		eventBus.$on("comfirmStart", (name, geo) => {
			this.startPlace = name;
			global_.startGeohash = geo;
			global_.startPlace = name;
			let locaiton = [
				decode_geohash_simple(geo).lat,
				decode_geohash_simple(geo).lon,
			];
			global_.startPoint = L.marker(locaiton, { icon: greenIcon })
				.on("click", () => {
					this.startPlace = "";
					global_.startGeohash = "";
					global_.startPlace = "";
					global_.map.removeLayer(global_.startPoint);
				})
				.addTo(global_.map);
			if (global_.dstGeohash) {
				this.isStartManaging = true;
			} else {
				this.isStartManaging = false;
			}
		});
		eventBus.$on("comfirmDst", (name, geo) => {
			this.dstPlace = name;
			global_.dstGeohash = geo;
			global_.dstPlace = name;
			let locaiton = [
				decode_geohash_simple(geo).lat,
				decode_geohash_simple(geo).lon,
			];
			global_.dstPoint = L.marker(locaiton, { icon: orangeIcon })
				.on("click", () => {
					this.dstPlace = "";
					global_.dstGeohash = "";
					global_.dstPlace = "";
					global_.map.removeLayer(global_.dstPoint);
				})
				.addTo(global_.map);
			if (global_.startGeohash) {
				this.isStartManaging = true;
			} else {
				this.isStartManaging = false;
			}
		});
	},
	methods: {
		searchStart: function () {
			console.log("search start");
			this.isSearchStart = true;
		},
		searchDst: function () {
			console.log("search destination");
			this.isSearchDst = true;
			eventBus.$emit("isSearchDst", true);
		},

		manageVehicle: function () {
			if (!this.isClicked) {
				this.isClicked = true;
				if (global_.userID) {
					eventBus.$emit("isManaging", true);
				} else {
					this.isClicked = false;
					alert("please log in....");
				}
			}
		},
	},
};
</script>
<style>
.searchbox-container {
	padding: 8px 23px 8px 21px;
}
.searchbox-container .icon {
	width: 10px;
	height: 10px;
	background: #fff;
	border: 3px solid #6ad69f;
	border-radius: 50%;
	-webkit-box-sizing: border-box;
	box-sizing: border-box;
}
.searchbox-container .dots {
	display: -webkit-box;
	-webkit-box-pack: justify;
	display: -ms-flexbox;
	display: flex;
	position: absolute;
	-webkit-box-orient: vertical;
	-webkit-box-direction: normal;
	-ms-flex-direction: column;
	flex-direction: column;
	-ms-flex-pack: justify;
	justify-content: space-between;
	height: 18px;
	top: 46px;
	left: 24px;
	-webkit-transform: translateY(-50%);
	transform: translateY(-50%);
}
.searchbox-container .dots .dot {
	width: 3px;
	height: 3px;
	background: #ddd;
	border-radius: 50%;
}
.start input,
.destination input {
	-webkit-box-flex: 1;
	-ms-flex-positive: 1;
	flex-grow: 1;
	margin-left: 12px;
	font-size: 16px;
	color: #333;
}
.searchbox-container .line {
	background: #eaeaea;
	height: 1px;
	margin-left: 25px;
}
.searchbox-container .destination,
.searchbox-container .start {
	display: -webkit-box;
	-webkit-box-align: center;
	display: -ms-flexbox;
	display: flex;
	-ms-flex-align: center;
	align-items: center;
	height: 37px;
}
.searchbox-main {
	position: absolute;
	z-index: 10;
	left: 8px;
	right: 8px;
	bottom: 8px;
	background: #fff;
	border-radius: 5px;
	-webkit-box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.15);
	box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.15);
}
.searchbox-container .destination .icon {
	border-color: #ef4f4f;
}
.text-overflow {
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
}
input {
	background: none;
	outline: none;
	border: none;
}
.button {
	margin: 15px 8px 0;
	padding: 10px 0;
	background: #3385ff;
	font-size: 16px;
	color: #fff;
	text-align: center;
	border-radius: 100px;
	width: 95%;
}
.button:checked {
	background: #102b55;
}
</style>