<template>
  <div class="login">
    <div class="clickable square-btn" style="bottom: 250px" @click="inputID">
      <div class="btn-usercenter-bg"></div>
      <div id>{{ info }}</div>
    </div>
    <div class="loginInfo" style="bottom: 250px" v-if="isLoginInput">
      <input
        autocomplete="false"
        type="text"
        placeholder="请输入用户ID"
        class="text-overflow"
        v-model="usrID"
        @keyup.enter="login"
      />
      <button name="btn" @click="login">{{ btnText }}</button>
    </div>
  </div>
</template>
<script>
/*
  登录组件
*/
import global_ from "./Global.vue";
export default {
  name: "Login",
  data() {
    return {
      isLoginInput: false,
      isLogin: false,
      info: "请登录",
      btnText: "登录",
      usrID: global_.userID,
    };
  },
  mounted() {
    if (global_.getQueryVariable("id")) {
      this.usrID = global_.getQueryVariable("id");
      global_.userID = this.usrID;
      console.log("user id =" + this.usrID);
    }
    if (global_.getQueryVariable("place")) {
      global_.userGeohash = global_.getQueryVariable("place");
    }
    if (global_.userGeohash && global_.userID) {
      this.login();
    }
  },
  methods: {
    inputID: function () {
      this.isLoginInput = !this.isLoginInput;
      if (this.isLogin) {
        this.btnText = "退出登录";
      } else {
        this.btnText = "登录";
      }
    },
    //通过this.isLogin判断是登录还是退出登录
    login: function () {
      this.isLoginInput = false;
      //退出登录
      if (this.isLogin) {
        this.deleteVehicle().then(() => {
          this.info = "请登录";
          this.isLogin = false;
        });
      } else {
        //登录
        if (this.getUserById(this.usrID)) {
          this.initVehicle().then(() => {
            this.info = "欢迎您";
            this.isLogin = true;
            //add point to map
            global_.userPoint = L.circle(global_.userGeohash, 20, {
              color: "#00FFAA",
            });
            global_.map.addLayer(global_.userPoint);
          });
        } else {
          alert("登录失败，请重试");
        }
      }
    },

    getUserById: function (loginId) {
      global_.userID = loginId;
      return true;
    },

    //车辆上传位置，记录在合约上
    initVehicle: async function () {
       this.$emit("updateEvent","uploadPositionStart")
      var trafficContract = global_.trafficContract;
      var locationContract = global_.locationContract;
      var web3Map = global_.web3Map;
      var vehicleId = global_.userID;
      var vehiclePosition = global_.userGeohash;
      console.log("车辆开始上传位置");
      // init vehicle position information
      await trafficContract.methods
        .initVehicle(vehicleId, web3Map.utils.asciiToHex(vehiclePosition))
        .send({
          from: global_.ethAccount,
          gas: 50000000,
          position: vehiclePosition,
          txtime: Date.now(),
        });
        console.log("debug");
      //init vehicle credit information
      // await locationContract.methods
      //   .initUser(vehicleId, -2)
      //   .send({
      //     from: global_.ethAccount,
      //     gas: 50000000,
      //     position: "w3511111111111",
      //     txtime: Date.now(),
      //   });
        this.$emit("updateEvent","uploadPositionEnd")
      this.$emit("changeState", this.isLogin);
      console.log("车辆上传了位置");
    },

    //车辆登记，改变车辆状态
    deleteVehicle: async function () {
       this.$emit("updateEvent","deletePositionStart")
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
        .then( (result) =>{
          console.log("车辆注销了id");
             this.$emit("updateEvent","deletePositionEnd")
        });
    },
  },
};
</script>

<style>
.clickable {
  outline: none;
}
.loginInfo {
  position: absolute;
  border-radius: 5px;
  height: 38px;
  background-color: #fff;
  left: 50px;
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.15);
}
.loginInfo input {
  margin: 0;
}
.loginInfo button {
  margin: 6px;
  background-color: rgb(190, 189, 187);
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
  -webkit-box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.15);
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.15);
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