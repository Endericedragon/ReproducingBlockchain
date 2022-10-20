<template>
	<div class="login">
		<div class="clickable square-btn" style="top: 40px" @click="inputID">
			<div class="btn-usercenter-bg"></div>
			<div id>{{ info }}</div>
		</div>
		<div class="loginInfo" v-if="isLogin">
			<div class="close" @click="inputClose">X</div>
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
	</div>
</template>
<script>
import global_ from "./Global.vue";
export default {
	name: "Login",

	data() {
		return {
			isLogin: false,
			info: "请登录",
			usrID: "",
		};
	},
	mounted() {
		if (global_.getQueryVariable("id")) {
			this.usrID = global_.getQueryVariable("id");
			global_.userID = this.usrID;
			this.login();
		}
	},
	methods: {
		inputID: function () {
			this.isLogin = !this.isLogin;
			eventBus.$emit("islogining", this.isLogin);
		},
		inputClose: function () {
			this.isLogin = !this.isLogin;
			eventBus.$emit("islogining", this.isLogin);
		},
		login: function () {
			//init
			var blueIcon = L.icon({
				iconUrl: require("../assets/blue.png"),
				iconSize: [24, 38],
				iconAnchor: [16, 16],
				ShadowSize: [41, 41],
				ShadowAnchor: [4, 62],
				popupAnchor: [1, -24],
			});
			if (this.getPassengerById(this.usrID)) {
				this.info = "欢迎您";
				let locaiton = [
					decode_geohash_simple(global_.userGeohash).lat,
					decode_geohash_simple(global_.userGeohash).lon,
				];
				global_.userPoint = L.marker(locaiton, { icon: blueIcon })
				.addTo(global_.map);
				this.isLogin = false;
				eventBus.$emit("islogining", this.isLogin);
				console.log("user " + this.usrID + "login");
			} else {
				this.info = "请登录";
				alert("登录失败，请重试");
			}
		},
		getPassengerById: function (loginId) {
			if (!loginId) return false;
			global_.userID = loginId;
			return true;
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
</style>