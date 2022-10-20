<template>
	<div>
		<div class="dache-plan-root" id="root">
			<div class="close" @click="move">V</div>
			<div class="dache-plan-content">
				<div class="partners-container">
					<div class="partners-wrapper" v-if="passengerId !== ''">
						<div>
							<img
								src="https://map-mobile-resource.cdn.bcebos.com/icon/rec/taxi/default/feidi_siji%403x1013.png"
								class="logo"
								style="width: 30px; height: 30px; margin-right: 3px"
							/>
							<span class="name text-overflow">{{ passengerId }}</span>
						</div>
						<div>
							<span class="price-desc text-overflow"
								>乘客位置：<span style="font-size: 20px">{{
									passengerPlace
								}}</span></span
							>
						</div>
						<br />
						<div>
							<span>
								乘客目的地：<span style="font-size: 20px">{{ endPlace }}</span>
							</span>
						</div>
					</div>
				</div>
				<div class="btn-container">
					<!-- <input v-model="credit" class="button credit" /> -->
					<div
						class="button pickup"
						id="pickupBtn"
						@click="pickUp()"
						v-if="!isPickedUp"
					>
						确认接该乘客
					</div>
					<div class="button nopickup" @click="noPickUp()" v-if="!isPickedUp">
						拒绝接该乘客
					</div>
					<div class="button Msg" v-if="isPickedUp">{{ btnMsg }}</div>
				</div>
				<!---->
			</div>
			<!----><!---->
		</div>
	</div>
</template>
<script>
/*
  事件组件
*/
import global_ from "../components/Global.vue";
import {
	verifyRecord11,
	verifyRecord22,
	verifyRecord33,
	verifyRecord44,
	verifyRecord55,
	verifyRecord66,
} from "../../static/js/verifyRecord.js";
import { gradientColor } from "../../static/js/gradientColor.js";
var gradient = new gradientColor("#FF0000", "#00FF00", 101);
//the path of new file
var fs = require("fs");
var newFile = "./res.json";
var credit_res = [];
var credit_count = 0;
export default {
	name: "Traffic",
	data() {
		return {
			passengerId: "",
			passengerGeohash: "",
			passengerPlace: "",
			endGeohash: "",
			endPlace: "",
			startPoint: null,
			endPoint: null,
			astarTimes: [],
			isPickedUp: false,
			btnMsg: "",
			points: [],
			credit: global_.credit,
			count: 0,
		};
	},
	mounted() {
		//init
		var greenIcon = L.icon({
			iconUrl: require("../assets/green.png"),
			iconSize: [24, 38],
			iconAnchor: [16, 16],
			ShadowSize: [41, 41],
			ShadowAnchor: [4, 62],
			popupAnchor: [1, -24],
		});
		var trafficContract = global_.trafficContract;
		var creditContract = global_.creditContract;
		var web3Map = global_.web3Map;
		var vehicleId = global_.userID;
		//event
		trafficContract.events.Myevent((error, event) => {
			var map = global_.map;
			if (error != null) {
				console.log("Myevent_error: ", error);
			}
			//whether to pick up the passenger
			if (
				event.returnValues.vehicleId.slice(0, 42) == vehicleId.toLowerCase()
			) {
				console.log("get passenger");
				//console.log(event);
				this.passengerId = event.returnValues.passengerId.slice(0, 42);

				//获取乘客上车地，并绘制
				this.passengerGeohash = web3Map.utils
					.hexToAscii(event.returnValues.passengerGeohash)
					.slice(0, 11);
				this.passengerPlace = global_.geoToPalceMap.get(this.passengerGeohash);
				let locaiton = [
					decode_geohash_simple(this.passengerGeohash).lat,
					decode_geohash_simple(this.passengerGeohash).lon,
				];
				this.startPoint = L.marker(locaiton, { icon: greenIcon }).addTo(
					global_.map
				);
			}
		});
		//监听乘客付款事件
		trafficContract.events.payEvent((error, event) => {
			var endGeohash = this.endGeohash;
			if (error != null) {
				console.log("payEvent_error: ", error);
			}
			if (
				event.returnValues.vehicleId.slice(0, 42) == vehicleId.toLowerCase()
			) {
				console.log("payEvent: " + "乘客已付款");
				this.btnMsg = "乘客付款成功，等待清空数据...";
				this.clear();
				trafficContract.methods
					.setVehicleStatusEmpty(vehicleId)
					.send({
						from: global_.ethAccount,
						gas: 500000,
						position: endGeohash,
						txtime: Date.now(),
					})
					.then((result) => {
						trafficContract.methods
							.setVehicle(vehicleId, web3Map.utils.asciiToHex(endGeohash))
							.send({
								from: global_.ethAccount,
								gas: 500000,
								position: endGeohash,
								txtime: Date.now(),
							})
							.then((result) => {
								console.log("置状态为空车");
							});
					});
			}
		});

		//监听乘客上车事件
		trafficContract.events.boardEvent((error, event) => {
			if (error != null) {
				console.log("boardEvent_error: ", error);
			}
			if (
				event.returnValues.vehicleId.slice(0, 42) == vehicleId.toLowerCase()
			) {
				console.log("boardEvent: " + "乘客已上车");
				this.btnMsg = "确认乘客已上车";
				console.log("执行了调度算法,车辆到达乘客所在位置");
				this.manageToEnd();
			}
		});

		//  location verify
		setInterval(() => {
			var result = verifyRecord11[this.count];
      console.log(this.count+" : "+result);
			if (result != "undefined") {
				creditContract.methods
					.revalueByValidation(vehicleId.toLowerCase(), this.count, result, true)
					.send({
						from: global_.ethAccount,
						gas: 500000,
						position: "w3511111111111",
						txtime: Date.now(),
					})
            	this.count++;
    
			
			}
			if (this.count >= verifyRecord33.length) this.count = 0;
		}, 2000);

   },
	methods: {
		move: function () {
			var div = document.getElementById("root");
			if (parseInt(getLocation(div, "bottom")) < 0) {
				CSSmove(div, "bottom", 0, 50, () => {});
			} else CSSmove(div, "bottom", -250, 50, () => {});
		},
		//确认接乘客
		pickUp: async function () {
			var vehicleLayers = [];
			var trafficContract = global_.trafficContract;
			var mapContract = global_.mapContract;
			var web3Map = global_.web3Map;
			var map = global_.map;
			var vehicleId = global_.userID;
			var vehiclePosition = global_.userGeohash;
			var passengerId = this.passengerId;
			var passengerGeohash = this.passengerGeohash;
			this.isPickedUp = true;
			this.btnMsg = "请前往乘客出发地: " + this.passengerPlace;
			global_.creditContract.methods.revalueByOrder(global_.userID, true).send({
				from: global_.ethAccount,
				gas: 500000,
				position: "w3511111111111",
				txtime: Date.now(),
			});
			if (vehiclePosition == passengerGeohash) {
				//store route
				trafficContract.methods
					.storeRoutes(0, vehicleId, passengerId, [])
					.send({
						from: global_.ethAccount,
						gas: 8000000,
						position: vehiclePosition,
						txtime: Date.now(),
					})
					.then(
						(result) => {
							console.log("存储路径成功");
						},
						function (error) {
							console.log("存储路径失败:", error);
						}
					);
			} else {
				let astarTime1 = Date.now();
				mapContract.methods
					.astar(
						web3Map.utils.asciiToHex(vehiclePosition),
						web3Map.utils.asciiToHex(passengerGeohash)
					)
					.call({ from: global_.ethAccount, gas: 50000000000 })
					.then(
						(result) => {
							let astarTime2 = Date.now() - astarTime1;
							let countFrag = 0;
							for (let i = 0; i < result[0].length; i++) {
								if (
									result[0][i].toString() !=
									"0x0000000000000000000000000000000000000000000000000000000000000000"
								) {
									countFrag++;
								}
							}
							this.astarTimes.push({
								astarTime2,
								countFrag,
							});
							console.log("路径规划用时：", astarTime2, "ms");
							console.log("astar-result: ", result);

							let astarOriginRoute = result[0];
							let costAll = Number(result[1]);
							console.log("车辆行驶时间：", costAll);
							//store route
							trafficContract.methods
								.storeRoutes(costAll, vehicleId, passengerId, astarOriginRoute)
								.send({
									from: global_.ethAccount,
									gas: 8000000,
									position: vehiclePosition,
									txtime: Date.now(),
								})
								.then(
									function (result) {
										console.log("存储路径成功");
									},
									function (error) {
										console.log("存储路径失败:", error);
									}
								);
							let astarRoute = [];
							for (let i = 0; i < result[0].length; i++) {
								if (
									result[0][i].toString() !=
									"0x0000000000000000000000000000000000000000000000000000000000000000"
								) {
									let temp = web3Map.utils
										.hexToAscii(result[0][i])
										.slice(0, 11);
									astarRoute.push(temp);
								}
							}
							astarRoute.reverse();
							console.log("astar: ", astarRoute);

							if (astarRoute.length != 0) this.trafficSim(astarRoute);
						},
						function (err) {
							console.error("astarErr: ", err);
						}
					);
			}
		},
		noPickUp: async function () {
			var trafficContract = global_.trafficContract;
			var vehicleId = global_.userID;
			var passengerId = this.passengerId;
			var vehiclePosition = global_.userGeohash;
			console.log("选择不去接乘客:", vehicleId, passengerId);
			global_.creditContract.methods
				.revalueByOrder(global_.vehicleID, false)
				.send({
					from: global_.ethAccount,
					gas: 500000,
					position: "w3511111111111",
					txtime: Date.now(),
				});
			trafficContract.methods
				.setRejectVehicleStatus(vehicleId, passengerId)
				.send({
					from: global_.ethAccount,
					gas: 5000000,
					position: vehiclePosition,
					txtime: Date.now(),
				})
				.then((result) => {
					console.log("状态转为空车");
					this.clear();
				});
		},
		trafficSim: async function (routes) {
			var carIcon = L.icon({
				iconUrl: require("../assets/car.png"),
				iconSize: [24, 38],
				iconAnchor: [16, 16],
				ShadowSize: [41, 41],
				ShadowAnchor: [4, 62],
				popupAnchor: [1, -24],
			});
			console.log("begin to simulation: ");
			var creditContract = global_.creditContract;
			var interval = 10.0;
			var totalCount = 0;
			for (var i = 0; i + 1 < routes.length; i++) {
				var arr;
				var route = [routes[i], routes[i + 1]];

				arr = decode_geohash(route[0]);
				var startLon = (arr[0] + arr[1]) / 2;
				var startLat = (arr[2] + arr[3]) / 2;

				arr = decode_geohash(route[1]);
				var endLon = (arr[0] + arr[1]) / 2;
				var endLat = (arr[2] + arr[3]) / 2;

				var dis = getDistanceBtwP(startLat, startLon, endLat, endLon);
				var count = Math.floor(dis / interval) + 1;
				var dLat = endLat - startLat;
				var dLon = endLon - startLon;

				for (var j = 1; j <= count; j++) {
					var credit;
					var lat = startLat + (j / count) * dLat;
					var lon = startLon + (j / count) * dLon;

					setTimeout(
						(lat, lon) => {
							//get credit by contact
							creditContract.methods
								.getCredit(global_.userID.toLowerCase())
								.call({ from: global_.ethAccount, gas: 50000000000 })
								.then((result) => {
									credit = result;
                  console.log("credit:"+credit);
									let locaiton = [lat, lon];
									global_.map.removeLayer(global_.userPoint);
									global_.userPoint = L.marker(locaiton, {
										icon: carIcon,
									}).addTo(global_.map);

									var point = L.polyline([locaiton, locaiton], {
										color: gradient[credit],
										fillColor: gradient[credit],
										fillOpacity: 1,
										weight: 17,
									});
									this.points.push(point);
									global_.map.addLayer(point);
								});
						},
						500 * (j + totalCount),
						lat,
						lon
					);
				}
				totalCount += count;
			}
		},
		manageToEnd: async function () {
			var orangeIcon = L.icon({
				iconUrl: require("../assets/orange.png"),
				iconSize: [24, 38],
				iconAnchor: [16, 16],
				ShadowSize: [41, 41],
				ShadowAnchor: [4, 62],
				popupAnchor: [1, -24],
			});
			var togetherLayers = [];
			var trafficContract = global_.trafficContract;
			var mapContract = global_.mapContract;
			var web3Map = global_.web3Map;
			var map = global_.map;
			var vehicleId = global_.userID;
			var passengerId = this.passengerId;
			var passengerGeohash = this.passengerGeohash;
			let astarTime1 = Date.now();
			console.log("passengerID:" + passengerId);
			//获取乘客目的地，并绘制
			trafficContract.methods
				.getPassengerEnd(this.passengerId)
				.call({ from: vehicleId, gas: 50000000 })
				.then((result) => {
					console.log(result);
					this.endGeohash = web3Map.utils.hexToAscii(result).slice(0, 11);
					console.log("目的地坐标:", this.endGeohash);
					this.endPlace = global_.geoToPalceMap.get(this.endGeohash);
					let locaiton = [
						decode_geohash_simple(this.endGeohash).lat,
						decode_geohash_simple(this.endGeohash).lon,
					];
					this.endPoint = L.marker(locaiton, { icon: orangeIcon }).addTo(
						global_.map
					);
					mapContract.methods
						.astar(
							web3Map.utils.asciiToHex(passengerGeohash),
							web3Map.utils.asciiToHex(this.endGeohash)
						)
						.call({ from: vehicleId, gas: 50000000000 })
						.then(
							(result) => {
								let astarTime2 = Date.now() - astarTime1;
								let countFrag = 0;
								for (let i = 0; i < result[0].length; i++) {
									if (
										result[0][i].toString() !=
										"0x0000000000000000000000000000000000000000000000000000000000000000"
									) {
										countFrag++;
									}
								}
								this.astarTimes.push({
									astarTime2,
									countFrag,
								});
								console.log("路径规划用时：", astarTime2, "ms");
								this.btnMsg =
									"请前往 " + this.endPlace + "  计划用时" + astarTime2 + " ms";
								console.log("astar-result: ", result);
								let astarOriginRoute = result[0];
								let costAll = Number(result[1]);
								trafficContract.methods
									.storeRoutes(
										costAll,
										vehicleId,
										passengerId,
										astarOriginRoute
									)
									.send({
										//debug:changeID
										from: global_.ethAccount,
										// from: vehicleId,
										gas: 5000000,
										position: passengerGeohash,
										txtime: Date.now(),
									})
									.then((result) => {
										console.log("存储路径成功");
									
									});

								let astarRoute = [];
								for (let i = 0; i < result[0].length; i++) {
									if (
										result[0][i].toString() !=
										"0x0000000000000000000000000000000000000000000000000000000000000000"
									) {
										let temp = web3Map.utils
											.hexToAscii(result[0][i])
											.slice(0, 11);
										astarRoute.push(temp);
									}
								}
								astarRoute.reverse();
								console.log("astar: ", astarRoute);

								if (astarRoute.length != 0) this.trafficSim(astarRoute);

								console.log("执行了调度算法,车辆将乘客送到了终点");
								this.btnMsg = "等待乘客付款....";
							},
							function (err) {
								console.error("astarErr: ", err);
							}
						);
				});
		},
		clear: function () {
			var carIcon = L.icon({
				iconUrl: require("../assets/car.png"),
				iconSize: [24, 38],
				iconAnchor: [16, 16],
				ShadowSize: [41, 41],
				ShadowAnchor: [4, 62],
				popupAnchor: [1, -24],
			});
			var map = global_.map;
			global_.userGeohash = this.endGeohash;
			global_.creditContract.methods
				.getCredit(global_.userID)
				.call({ from: global_.ethAccount, gas: 50000000000 })
				.then((result) => {
					var credit = result;
					eventBus.$emit(
						"vehicleStatuChange",
						global_.userID,
						global_.geoToPalceMap.get(global_.userGeohash),
						credit
					);
				});

			if (this.startPoint) map.removeLayer(this.startPoint);
			if (this.endPoint) map.removeLayer(this.endPoint);
			if (global_.userPoint) map.removeLayer(global_.userPoint);
			if (this.points.length != 0) {
				for (var item of this.points) {
					//		map.removeLayer(item);
				}
				this.points = [];
			}

			this.passengerId = "";
			this.passengerPlace = "";
			this.passengerGeohash = "";
			this.endPlace = "";
			this.endGeohash = "";
			this.isPickedUp = false;
			//add point to map
			let locaiton = [
				decode_geohash_simple(global_.userGeohash).lat,
				decode_geohash_simple(global_.userGeohash).lon,
			];
			global_.userPoint = L.marker(locaiton, {
				icon: carIcon,
			}).addTo(global_.map);
		},
	},
};
</script>
<style>
.dache-plan-root {
	position: absolute;
	height: 300px;
	bottom: 8px;
	right: 8px;
	left: 8px;
	padding-bottom: 10px;
	padding-top: 16px;
	background: #fff;
	z-index: 10;
	border-radius: 5px;
	-webkit-box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.15);
	box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.15);
	-webkit-box-sizing: border-box;
	box-sizing: border-box;
}
.dache-plan-content {
	height: 100%;
}
.partners-container {
	padding-top: 17px;
	height: 200px;
}
.partners-wrapper {
	height: 100%;
	padding-left: 30px;
	display: flex;
	justify-content: center;
	flex-direction: column;
	overflow: scroll;
}
.partners,
.partner-item-c {
	display: -webkit-box;
	display: -ms-flexbox;
	display: flex;
	justify-content: center;
	overflow-x: scroll;
	-webkit-overflow-scrolling: touch;
	height: 100px;
}
.partner-item-c {
	flex-direction: column;
}
.partners .partner-item-c {
	margin-left: 8px;
	-ms-flex-negative: 0;
	flex-shrink: 0;
}
.partners .partner-item {
	position: relative;
	display: -webkit-box;
	display: -ms-flexbox;
	display: flex;
	-webkit-box-orient: vertical;
	-webkit-box-direction: normal;
	-ms-flex-direction: column;
	flex-direction: column;
	-webkit-box-align: center;
	-ms-flex-align: center;
	align-items: center;
	-webkit-box-pack: center;
	-ms-flex-pack: center;
	justify-content: center;
	width: 100%;
	height: 94px;
	padding: 15px;
	border-radius: 6px;
	font-size: 12px;
	color: #333;
	-webkit-box-sizing: border-box;
	box-sizing: border-box;
}
.btn-container {
	display: flex;
}
.button {
	margin: 15px 8px 0;
	padding: 10px 0;
	background: #3385ff;
	font-size: 16px;
	color: #fff;
	text-align: center;
	border-radius: 100px;
	width: 45%;
}
.button:active {
	background: #102b55;
}
.nopickup {
	background: #ee9e09;
	flex: 2;
}
.pickup {
	flex: 2;
}
.credit {
	flex: 1;
	background-color: lightslategray;
}
.Msg {
	width: 100%;
}
.partners .partner-item .partner-title .name,
.partners .partner-item {
	font-size: 12px;
}
.text-overflow {
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
}
</style>