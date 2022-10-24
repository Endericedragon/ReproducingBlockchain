<template>
	<div class="login">
		<div class="clickable square-btn" style="top: 40px" @click="inputID">
			<div class="btn-usercenter-bg"></div>
			<div id>{{ info }}</div>
		</div>
		<div class="loginInfo" v-if="isLogin">
			<div class="close" @click="inputClose">X</div>
			<div v-if="!isAlreadyLogin">
				<div class="titleText center" style="font-family: PingFangSC-Regular">
					Login
				</div>
				<div style="padding: 10px; width: 100%; margin-top: 20px">
					<input
						class="input center"
						placeholder="please input your account number"
						v-model="usrID"
					/>
				</div>
				<div style="padding: 10px; width: 100%; margin-top: 20px">
					<div class="btn center" @click="login">login</div>
				</div>
			</div>
			<div class="info-panel" v-if="isAlreadyLogin">
				<div class="partners">
					<div>
						<img
							src="https://map-mobile-resource.cdn.bcebos.com/icon/rec/taxi/default/feidi_siji%403x1013.png"
							class="logo"
							style="width: 30px; height: 30px; margin-right: 3px"
						/>
						<span class="name text-overflow">{{ usrID }}</span>
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
				</div>
				<div style="padding: 10px; width: 100%; margin-top: 20px">
					<div class="btn center" @click="login">unlogin</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import global_ from "./Global.vue";
export default {
	name: "Login",

	data() {
		return {
			isLogin: false,
			isAlreadyLogin: false,
			info: "请登录",
			usrID: "",
			vehiclePlace: "",
			vehicleCredit: 50,
		};
	},
	mounted() {
		if (global_.getQueryVariable("id")) {
			this.usrID = global_.getQueryVariable("id");
			global_.userID = this.usrID;
			this.login();
		}
		eventBus.$on("vehicleStatuChange", (id, credit, palce) => {
			this.usrID = id;
			this.vehiclePlace = palce;
			this.vehicleCredit = credit;
		});
	},
	methods: {
		inputID: function () {
			this.isLogin = !this.isLogin;
			eventBus.$emit("islogining", this.isLogin);
			if (this.isAlreadyLogin) {
				global_.creditContract.methods
					.getCredit(global_.userID.toLowerCase())
					.call({ from: global_.ethAccount, gas: 50000000000 })
					.then((result) => {
						global_.credit = result;
						this.vehicleCredit = result;
						console.log("debug: "+result);
					});
			}
		},
		inputClose: function () {
			this.isLogin = !this.isLogin;
			eventBus.$emit("islogining", this.isLogin);
		},
		login: function () {
			var carIcon = L.icon({
				iconUrl: require("../assets/car.png"),
				iconSize: [24, 38],
				iconAnchor: [16, 16],
				ShadowSize: [41, 41],
				ShadowAnchor: [4, 62],
				popupAnchor: [1, -24],
			});
			//退出登录
			if (this.isAlreadyLogin) {
				this.deleteVehicle().then(() => {
						global_.creditContract.methods
							.initUser(global_.userID, 0)
							.send({
								from: global_.ethAccount,
								gas: 500000,
								position: "w3511111111111",
								txtime: Date.now(),
							})
							.then
					this.info = "请登录";
					this.isLogin = false;
					this.isAlreadyLogin = false;
					global_.map.removeLayer(global_.userPoint);
					eventBus.$emit("islogining", this.isLogin);
				});
			} else {
				//登录
				if (this.getUserById(this.usrID)) {
					this.initVehicle().then(() => {
						this.info = "欢迎您";
						//add point to map
						let locaiton = [
							decode_geohash_simple(global_.userGeohash).lat,
							decode_geohash_simple(global_.userGeohash).lon,
						];
						global_.userPoint = L.marker(locaiton, {
							icon: carIcon,
						}).addTo(global_.map);
						global_.creditContract.methods
							.initUser(global_.userID.toLowerCase(), -1)
							.send({
								from: global_.ethAccount,
								gas: 500000,
								position: "w3511111111111",
								txtime: Date.now(),
							})
							.then(() => {
								var credit;
								global_.creditContract.methods
									.getCredit(global_.userID.toLowerCase())
									.call({ from: global_.ethAccount, gas: 50000000000 })
									.then((result) => {
										credit = result;
										global_.credit = credit;
										this.vehicleCredit = credit;
										this.vehiclePlace = global_.geoToPalceMap.get(
											global_.userGeohash
										);
										console.log("credit: " + credit);
									});
							});
						this.isLogin = false;
						this.isAlreadyLogin = true;
						eventBus.$emit("isManaging", true);
						eventBus.$emit("islogining", this.isLogin);
					});
				} else {
					this.info = "请登录";
					alert("登录失败，请重试");
				}
			}
		},
		getUserById: function (loginId) {
			if (!loginId) return false;
			global_.userID = loginId;
			return true;
		},
		//车辆上传位置，记录在合约上
		initVehicle: async function () {
			var trafficContract = global_.trafficContract;
			var web3Map = global_.web3Map;
			var vehicleId = global_.userID;
			var vehiclePosition = global_.userGeohash;
			console.log("车辆开始上传位置");
			// init vehicle position information
			await trafficContract.methods
				.initVehicle(vehicleId, web3Map.utils.asciiToHex(vehiclePosition))
				.send({
					from: global_.ethAccount,
					gas: 500000,
					position: vehiclePosition,
					txtime: Date.now(),
				});
			console.log("车辆上传了位置");
		},

		//车辆登记，改变车辆状态
		deleteVehicle: async function () {
			var vehicleId = global_.userID;
			var trafficContract = global_.trafficContract;
			await trafficContract.methods
				.deleteVehicle(vehicleId)
				.send({
					from: global_.ethAccount,
					gas: 5000000,
					position: "w3511111111111",
					txtime: Date.now(),
				})
				.then((result) => {
					console.log("车辆注销了id");
				});
		},
	},
};
</script>

<style>
* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}
.center {
	text-align: center;
}
.input {
	position: relative;
	width: 100%;
	font-family: PingFangSC-Regular, sans-serif;
	background-color: #eee9e9ab;
	color: rgba(99, 98, 98, 0.771);
	border-radius: 50px;
	margin: 0px;
}
.btn:hover {
	background-color: rgb(23, 134, 238);
}
.btn:active {
	background-color: rgb(16, 72, 125);
}
.btn {
	height: 40px;
	position: relative;
	width: 100%;
	font-family: PingFangSC-Regular, sans-serif;
	font-size: 20px;
	color: #fff;
	border-radius: 50px;
	background-color: rgba(126, 187, 241, 0.543);
}
.close {
	position: absolute;
	top: 10px;
	right: 10px;
	color: gray;
	font-size: 20px;
	cursor: pointer;
}
.clickable {
	outline: none;
}
.loginInfo {
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	position: absolute;
	bottom: 0px;
	border-radius: 10px;
	height: 400px;
	background-color: rgb(255, 255, 255);
	box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.15);
	animation-name: move;
	animation-duration: 0.5s;
}
@keyframes move {
	0% {
		transform: translateY(400px);
	}
	100% {
		transform: translateY(0px);
	}
}
.square-btn {
	border-radius: 5px;
	font-size: 10px;
	position: absolute;
	width: 38px;
	height: 38px;
	cursor: pointer;
	background: #fff;
	left: 8px;
}
.square-btn div {
	width: 100%;
	text-align: center;
}
.btn-usercenter-bg {
	height: 20px;
	margin-bottom: 2px;
	background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAgCAMAAABn/9sTAAAAWlBMVEUAAABERERFRUVERERERERJSUlERERGRkZERERsbGxFRUVERERGRkZERERERERERERFRUVGRkZNTU1FRUVFRUVFRUVHR0dERERERERFRUVFRUVJSUlMTExERETfJ5oXAAAAHXRSTlMA7b2Z8yLYQfkDq6E60seyZigO5npcFZKOiUMxGxwvCdIAAADDSURBVDjLpdPZDoMgEEBRBQQU963r/P9vtomkRoYyJHPfNDlBYCyiGamV0tIUuVUCfKLKE20Jv8o2aw0vvMlZR8AlQQsDQYYkMiSSJDokmiQqJIpBWB/G3/4THTLjKnkDQ48lf/j5v9h7uNeXF1s/pcVWAvSv83m+AagxAebh2IIzx0rVepxEU/8V/XlSwsmhg29JUwtAEVPzgERrTEw2RWzs3BpI1mCx2zSxOyIjEOHbcRRxiHQU6RBZKLIgYiliC98HCONCl4sDIeAAAAAASUVORK5CYII=);
	background-repeat: no-repeat;
	background-size: 25px 16px;
	background-position: bottom;
}
.info-panel {
	padding: 40px;
}
.partners {
	display: -webkit-box;
	display: -ms-flexbox;
	display: flex;
	justify-content: center;
	flex-direction: column;
	overflow-x: scroll;
	-webkit-overflow-scrolling: touch;
	height: 200px;
}
</style>