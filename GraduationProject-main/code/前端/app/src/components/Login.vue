<template>
  <div class="login">
    <div class="clickable square-btn" style="bottom: 250px" @click="inputID">
      <div class="btn-usercenter-bg"></div>
      <div id>{{ info }}</div>
    </div>
    <div class="loginInfo" style="bottom: 250px" v-if="isLogin">
      <input
        autocomplete="false"
        type="text"
        placeholder="请输入用户ID"
        class="text-overflow"
        v-model="usrID"
        @keyup.enter="login"
      />
    </div>
  </div>
</template>
<script>
import jointPoints from '../../static/js/joint_points';
import global_ from "./Global.vue";
export default {
  name: "Login",

  data() {
    return {
      isLogin: false,
      info: "请登录",
      usrID: global_.userID,
    };
  },
  mounted(){
    if(global_.getQueryVariable("id")){
        this.usrID=global_.getQueryVariable("id");
        global_.userID=this.usrID;

        this.login();
    }
  },
  methods: {
    inputID: function () {
      this.isLogin = true;
    },
    login: function () {
      this.isLogin = false;
      if (this.getPassengerById(this.usrID)) {
        this.info = "欢迎您";
        global_.userPoint =L.circle(global_.userGeohash, 10, {
            color: "#00FFAA",
          });
        global_.map.addLayer(global_.userPoint);

          var distance = 10e10;
          var index;
          for (let i = 0; i < jointPoints.length; i++) {
            var tmp = getDistanceBtwGP(global_.userGeohash, jointPoints[i][0]);
            if (tmp < distance) {
              distance = tmp;
              index = i;
            }
          }
          global_.nearestPoint = L.circle(jointPoints[index][0], 5, {
            color: "#00CCFF",
          });
          global_.nearestPoint.on("click", (e) => {
           
            global_.startPlace = global_.geoToPalceMap.get(e.target._latlng);
            global_.startGeohash = e.target._latlng;
             console.log("已选择start place :"+global_.startPlace);

          });
          global_.map.addLayer(global_.nearestPoint);
          this.$emit("updateEvent", "login");
        console.log("user "+this.usrID+"login");
      } else {
        alert("登录失败，请重试");
      }
    },
    getPassengerById: function (loginId) {
      if(!loginId) return false;
      global_.userID=loginId;
      return true;
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