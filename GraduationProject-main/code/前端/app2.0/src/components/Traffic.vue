<template>
	<div class="dache-plan-root" id="root">
		<div class="close" @click="move">V</div>
		<div class="dache-plan-content">
			<div class="partners-container">
				<div class="partners-wrapper">
					<div class="msg center" v-if="!isFind">{{ Msg }}</div>
					<div class="partners" v-if="isFind && !isPay">
						<div>
							<img
								src="https://map-mobile-resource.cdn.bcebos.com/icon/rec/taxi/default/feidi_siji%403x1013.png"
								class="logo"
								style="width: 30px; height: 30px; margin-right: 3px"
							/>
							<span class="name text-overflow">{{ vehicleId }}</span>
						</div>
						<div>
							<span class="price-desc text-overflow"
								>车辆位置：<span style="font-size: 20px">{{
									vehiclePlace
								}}</span></span
							>
						</div>
						<div>
							<span class="price-desc text-overflow"
								>车辆评分：<span style="font-size: 20px">{{
									vehicleCredit
								}}</span></span
							>
						</div>
						<div>
							<span class="price-desc text-overflow" v-if="isFind"
								>车辆行驶时间：<span style="font-size: 20px">{{
									costAll
								}}</span></span
							>
						</div>
					</div>
					<div class="evaluation-panel" v-if="isPay">
						<div class="text-overflow" center>邀请您为本次服务评分:</div>
						<li
							v-for="item in CreditRecords"
							v-bind:key="item[0]"
							@click="evaluate(item[0])"
						>
							<div class="item center">
								{{ item[1] }}
							</div>
						</li>
					</div>
				</div>
			</div>
			<div
				class="btn center"
				id="startBtn"
				@click="start"
				v-if="!isboard && isArriveStart"
			>
				点击确认上车
			</div>
			<div
				class="btn center"
				id="payBtn"
				@click="pay"
				v-if="isArriveEnd && !isPay"
			>
				点击支付
			</div>
		</div>
	</div>
</template>
<script>
import global_ from "../components/Global.vue";
import jointPoints from "../../static/js/joint_points";
let count = 0;
import { gradientColor } from "../../static/js/gradientColor.js";
var gradient = new gradientColor("#FF0000", "#00FF00", 101);
export default {
	name: "Traffic",
	data() {
		return {
			isClicked: false,
			isFind: false,
			isPay: false,
			vehicleId: "",
			vehicleCredit: NaN,
			vehicleGeohash: "",
			vehiclePoint: null,
			vehiclePlace: "loading...",
			Msg: "正在为您调度车辆,请稍等...",
			isArriveStart: false,
			isArriveEnd: false,
			costAll: NaN,
			isboard: false,
			points: [],
			CreditRecords: [
				[-2, "terriable"],
				[2, "normal"],
				[4, "comfortable"],
			],
		};
	},
	mounted() {
		//passengerEvent
		var trafficContract = global_.trafficContract;
		var web3Map = global_.web3Map;

		trafficContract.events.routeEvent((error, event) => {
			var passengerId = global_.userID;
			var vehicleId = global_.vehicleID;
			if (error) {
				console.log("error: ", error);
			}
			if (
				event.returnValues.passengerId.slice(0, 42) == passengerId.toLowerCase()
			) {
				trafficContract.methods
					.getRoutes(vehicleId)
					.call({ from: passengerId, gas: 500000 })
					.then((result) => {
						console.log("getRoutes: ", result);
						let astarRoute = [];
						this.costAll = Number(result[1]);
						console.log("车辆行驶时间：", this.costAll);
						for (let i = 0; i < result[0].length; i++) {
							if (
								result[0][i].toString() !=
								"0x0000000000000000000000000000000000000000000000000000000000000000"
							) {
								let temp = web3Map.utils.hexToAscii(result[0][i]).slice(0, 11);
								astarRoute.push(temp);
							}
						}
						astarRoute.reverse();

						console.log("astar: ", astarRoute);
						if (astarRoute.length != 0) this.trafficSim(astarRoute);

						if (this.isboard == false) {
							this.isArriveStart = true;
							console.log("vehicle arrive start place");
						} else {
							this.isArriveEnd = true;
							console.log("vehicle arrive dst place");
						}
					});
				this.isClicked = false;
			}
		});

		//rejectEvent
		trafficContract.events.rejectEvent((error, event) => {
			var passengerId = global_.userID;
			if (error) {
				console.log("error: ", error);
			}
			if (
				event.returnValues.passengerId.slice(0, 42) == passengerId.toLowerCase()
			) {
				console.log(event);
				console.log("车辆取消了交易");
				this.Msg = "车辆取消了交易";
				this.clear(false);
			}
		});
		this.manageVehicle();
	},
	methods: {
		move: function () {
			var div = document.getElementById("root");
			if (parseInt(getLocation(div, "bottom")) < 0) {
				CSSmove(div, "bottom", 0, 50, () => {});
			} else CSSmove(div, "bottom", -250, 50, () => {});
		},
		initPassenger: async function () {
			return new Promise((reslove, reject) => {
				var passengerEnd = global_.dstGeohash;
				var passengerStart = global_.startGeohash;
				var passengerId = global_.userID;
				var trafficContract = global_.trafficContract;
				var web3Map = global_.web3Map;

				trafficContract.methods
					.initPassenger(passengerId, web3Map.utils.asciiToHex(passengerStart))
					.send({
						//debug:changeID
						from: global_.ethAccount,
						//from: passengerId,
						gas: 500000,
						position: "w3511111111111",
						txtime: 278000,
					})
					.then((error, result) => {
					
						console.log("乘客位置已记录");
						//更新乘客信息
						trafficContract.methods
							.setPassengerDemand(
								passengerId,
								web3Map.utils.asciiToHex(passengerStart),
								web3Map.utils.asciiToHex(passengerEnd)
							)
							.send({
								from: global_.ethAccount,
								gas: 5000000,
								position: "w3511111111111",
								txtime: 278000,
							})
							.then(() => {
								console.log("乘客出发点和目的地已记录在智能合约");
							
								reslove();
							});
					});
			});
		},
		manageVehicle: async function () {
			if (!global_.userID) {
				alert("请先登录");
			} else {
				await this.initPassenger();
				console.log("开始调度车辆");
				this.isClicked = true;
				this.isFind = false;
				this.isEnd = false;
				//返回距离乘客最近的空车的位置
				var passengerStart = global_.startGeohash;
				this.getVehicle(passengerStart).then(() => {
					this.isFind = true;
					this.isClicked = false;
				});
			}
		},
		getVehicle: async function (positionGeohash) {
			var carIcon = L.icon({
				iconUrl: require("../assets/car.png"),
				iconSize: [24, 38],
				iconAnchor: [16, 16],
				ShadowSize: [41, 41],
				ShadowAnchor: [4, 62],
				popupAnchor: [1, -24],
			});
			this.isFind = false;
			var passengerId = global_.userID;
			var trafficContract = global_.trafficContract;
			var web3Map = global_.web3Map;
			var creditContract = global_.creditContract;
			let getVehicleTime1 = Date.now();
			trafficContract.methods
				.getVehicle(web3Map.utils.asciiToHex(positionGeohash))
				.call({ from: passengerId, gas: 500000000 })
				.then(
					(result1) => {
						trafficContract.methods
							.setVehicleStatus(
								result1[1],
								passengerId,
								web3Map.utils.asciiToHex(positionGeohash)
							)
							.send({
								from: global_.ethAccount,

								gas: 5000000,
								position: "w3511111111111",
								txtime: 278000,
							})
							.then(
								(result2) => {
									console.log("车辆选择成功:", result1);
									var vehiclePosition = web3Map.utils
										.hexToAscii(result1[0])
										.slice(0, 11);
									var vehicleId = result1[1].slice(0, 42);
									this.vehicleId = vehicleId;
									global_.vehicleID = vehicleId;
									global_.vehicleGeohash = vehiclePosition;
									this.vehicleGeohash = vehiclePosition;
									this.vehiclePlace = global_.geoToPalceMap.get(
										this.vehicleGeohash
									);
									console.log("vehicle at " + this.vehiclePlace);
									creditContract.methods
										.getCredit(global_.vehicleID.toLowerCase())
											.call({ from: global_.ethAccount, gas: 50000000000 })
										.then((result) => {
											this.vehicleCredit = result;
											console.log("credit: "+result);
										});
									//draw
									let locaiton = [
										decode_geohash_simple(this.vehicleGeohash).lat,
										decode_geohash_simple(this.vehicleGeohash).lon,
									];
									this.vehiclePoint = L.marker(locaiton, {
										icon: carIcon,
									}).addTo(global_.map);

									this.isFind = true;
								},
								(error2) => {
									count++;
									if (count < 50) {
										console.log("调度车辆中");

										this.getVehicle(positionGeohash);
									} else {
										console.log("当前没有合适的车辆: " + count);

										this.Msg = "当前没有合适的车辆";

										count = 0;
										this.clear(false);
									}
								}
							);
					},
					(error1) => {
						// console.log("error1: ", error1);
						count++;
						if (count < 50) {
							console.log("调度车辆中");
							this.getVehicle(positionGeohash);
						} else {
							console.log("当前没有合适的车辆: " + count);
							this.Msg = "当前没有合适的车辆";

							count = 0;
							this.clear(false);
						}
					}
				);
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
			var creditContract=global_.creditContract;
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
					
					var lat = startLat + (j / count) * dLat;
					var lon = startLon + (j / count) * dLon;

					setTimeout(
						(lat, lon) => {
							//get credit by contact
							creditContract.methods
								.getCredit(global_.vehicleID.toLowerCase())
									.call({ from: global_.ethAccount, gas: 50000000000 })
								.then((result) => {
									var  credit = result;
										console.log("credit: "+result);
									let locaiton = [lat, lon];
									global_.map.removeLayer(this.vehiclePoint);
									this.vehiclePoint = L.marker(locaiton, {
										icon: carIcon,
									}).addTo(global_.map);

									var point = L.polyline([locaiton,locaiton], {
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
						lat,lon
					);
				}
				totalCount += count;
			}
		},
		pay: function () {
			if (!this.isClicked) {
				this.isClicked = true;
				this.getOff();
			}
		},
		start: function () {
			if (!this.isClicked) {
				this.isClicked = true;
				this.getOn();
			}
		},
		getOff: function () {
			var trafficContract = global_.trafficContract;
			var web3Traffic = global_.web3Traffic;
			var vehicleId = global_.vehicleID;
			var costAll = this.costAll;
			if (!costAll) {
				costAll = 111;
				console.log("error :cosatAll doesn't exit");
			}
			console.log("开始支付订单");
			web3Traffic.eth
				.sendTransaction({
					from: global_.ethAccount,
					to: vehicleId,
					value: 50000000 * costAll,
					position: "w3511111111111",
					txtime: 278000,
				})
				.then((receipt) => {
					trafficContract.methods
						.confirmPay(vehicleId)
						.send({
							//debug:changeID
							from: global_.ethAccount,
							//  from: passengerId,
							gas: 5000000,
							position: "w3511111111111",
							txtime: 278000,
						})
						.then((result) => {
							console.log("乘客支付了订单");
							this.isPay = true;
						});
				});
		},
		getOn: function () {
			var passengerId = global_.userID;
			var trafficContract = global_.trafficContract;

			var vehicleId = global_.vehicleID;

			trafficContract.methods
				.confirmBoard(vehicleId)
				.send({
					from: global_.ethAccount,
					gas: 5000000,
					position: "w3511111111111",
					txtime: 278000,
				})
				.then((result) => {
					this.isboard = true;
					console.log("乘客确认上车");
					this.move();
				});
		},
		clear: function (isFinish) {
				var blueIcon = L.icon({
				iconUrl: require("../assets/blue.png"),
				iconSize: [24, 38],
				iconAnchor: [16, 16],
				ShadowSize: [41, 41],
				ShadowAnchor: [4, 62],
				popupAnchor: [1, -24],
			});
			var map = global_.map;
			if (isFinish) {
				global_.userGeohash = global_.dstGeohash;
				global_.startPlace = "";
				global_.dstPlace = "";
				global_.startGeohash = "";
				global_.dstGeohash = "";
				if(global_.userPoint)global_.map.removeLayer(global_.userPoint);
					let locaiton = [
					decode_geohash_simple(global_.userGeohash).lat,
					decode_geohash_simple(global_.userGeohash).lon,
				];
				global_.userPoint = L.marker(locaiton, { icon: blueIcon }).addTo(global_.map)
			}
			if(this.points){
				for(let item of this.points){
					global_.map.removeLayer(item);
				}
				this.points=[];
			}
			if(global_.startPoint)global_.map.removeLayer(global_.startPoint);
			if(global_.dstPoint)global_.map.removeLayer(global_.dstPoint);
			global_.vehicleID = "";
			global_.vehicleGeohash = "";
			global_.map.removeLayer(this.vehiclePoint);
			eventBus.$emit("isManaging", false);
		},
		evaluate: function (val) {
			console.log("evaluate: " + val);
			global_.creditContract.methods.revalueByEvaluate(global_.vehicleID.toLowerCase(),val).send(
			{
              from: global_.ethAccount,
              gas: 500000,
              position: "w3511111111111",
              txtime: Date.now(),
            }
			)
			this.clear(true);
		},
		getVehicleStatus: async function (vehicleId) {
			await trafficContract.methods
				.getVehicleStatus(vehicleId)
				.call({ from: passengerId, gas: 50000000 })
				.then(function (result) {
					console.log("getVehicleStatus: ", result);
				});
		},
	},
};
</script>
<style>
.dache-plan-root {
	position: absolute;
	height: 300px;
	bottom: 0px;
	border-radius: 10px;
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
	animation: move;
	animation-duration: 0.5s;
	background-color: rgb(255, 248, 248);
	padding: 10px;
}
.dache-plan-content {
	display: flex;
	flex-direction: column;
	justify-content: center;
	margin-top: 10px;
	height: 100%;
}
.partners-container {
	padding-top: 10px;
	background-color: #fff;
	border-radius: 10px;
	box-shadow: 2px 2px 2px 2px rgba(144, 138, 138, 0.064);
}
.partners-wrapper {
	height: 150px;
	overflow: hidden;
}
.partners {
	display: -webkit-box;
	display: -ms-flexbox;
	display: flex;
	justify-content: center;
	flex-direction: column;
	overflow-x: scroll;
	-webkit-overflow-scrolling: touch;
	height: 150px;
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

.dache-plan-content .btn {
	position: relative;
	margin: 15px 8px 0;
	padding: 10px 0;
	font-size: 16px;
	text-align: center;
	border-radius: 100px;
	width: 95%;
}
.button:active {
	background: #102b55;
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
.evaluation-panel {
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	height: 100%;
}
.evaluation-panel li {
	flex: 1;
}
li .item {
	height: 100%;
}
li .item:hover {
	background-color: #a1b6d9;
}
li .item:active {
	background-color: #5285de;
}
</style>