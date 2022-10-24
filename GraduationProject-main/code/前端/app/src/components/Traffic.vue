<template>
  <div>
    <div class="dache-plan-root" v-if="!isEnd">
      <div class="dache-plan-content">
        <div class="partners-container">
          <div class="partners-wrapper">
            <div class="msg" v-if="!isFind">{{ Msg }}</div>
            <ul class="partners" v-if="isFind">
              <li class="partner-item-c">
                <div>
                  <img
                    src="https://map-mobile-resource.cdn.bcebos.com/icon/rec/taxi/default/feidi_siji%403x1013.png"
                    class="logo"
                    style="width: 30px; height: 30px; margin-right: 3px"
                  />
                  <span class="name text-overflow">{{ vehicleId }}</span>
                </div>
                <span class="price-desc text-overflow"
                  >车辆位置：<span style="font-size: 20px">{{
                    vehiclePlace
                  }}</span></span
                >
              </li>
            </ul>
          </div>
        </div>
        <button class="button" v-if="!isFind">请等待..</button>
        <button class="button" v-if="isFind && !isArriveStart">
          请等待车辆到达出发地...
        </button>
        <button
          class="button"
          id="startBtn"
          @click="start"
          v-if="!isboard && isArriveStart"
        >
          点击确认上车
        </button>
        <button class="button" v-if="isboard && !isArriveEnd">请等待..</button>
        <button
          class="button"
          id="payBtn"
          @click="pay"
          v-if="isArriveEnd && !isPay"
        >
          点击支付
        </button>
        <button class="button" v-if="isPay">支付成功</button>
        <!---->
      </div>
      <!----><!---->
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
      isClicked: true,
      isFind: false,
      isPay: false,
      vehicleId: "",
      vehicleGeohash: "",
      vehiclePlace: "等待车辆接单...",
      Msg: "正在为您调度车辆,请稍等...",
      isArriveStart: false,
      isArriveEnd: false,
      costAll: NaN,
      isboard: false,
      positionPoint: null,
      startPoint: null,
      endPoint: null,
      isLayer: false,
      isEnd: false,
      points: [],
    };
  },
  mounted() {
    this.isEnd = false;
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
        console.log(event);
        let color = this.isboard == false ? "#FFFF00" : "#00FF00";
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
            //add route point to map
            //var isboard = this.isboard;
            // function draw2(p, q) {
            //   if (q == astarRoute.length) {
            //     return 1;
            //   }
            //   function doit2(geohash1, geohash2, isboard) {
            //     console.log("geohash1, geohash2: ", geohash1, geohash2);
            //     let route = L.polyline([geohash1, geohash2], {
            //       color: color,
            //       fillColor: color,
            //       fillOpacity: 1,
            //       weight: 7,
            //     });
            //     if (isboard == false) {
            //       vehicleLayers.push(route);
            //     } else {
            //       togetherLayers.push(route);
            //     }
            //     // map.addLayer(route)
            //     // sleep(100)
            //   }
            //   if (astarRoute[p] && astarRoute[q]) {
            //     setTimeout(doit2(astarRoute[p], astarRoute[q], isboard), 0);
            //   }

            //   draw2(p + 1, q + 1);
            // }
            // if (astarRoute.length != 0) draw2(0, 1);

            if (this.isboard == false) {
              this.isArriveStart = true;
              console.log("vehicle arrive start place");
              this.$emit("updateEvent", "VehicleArriveStart");
              // this.vehicleGroup = L.layerGroup(vehicleLayers);
              // global_.map.addLayer(this.vehicleGroup);
            } else {
              this.isArriveEnd = true;
              console.log("vehicle arrive dst place");
              this.$emit("updateEvent", "VehicleArriveEnd");
              // this.togetherGroup = L.layerGroup(togetherLayers);
              // global_.map.addLayer(this.togetherGroup);
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
        this.$emit("updateEvent", "VehicleReject");
        console.log("车辆取消了交易");
        this.Msg = "车辆取消了交易";
        this.clear(false);
      }
    });
    this.manageVehicle();
  },
  methods: {
    initPassenger: async function () {
      return new Promise((reslove, reject) => {
        var passengerEnd = global_.dstGeohash;
        var passengerStart = global_.startGeohash;
        var passengerId = global_.userID;
        var trafficContract = global_.trafficContract;
        var web3Map = global_.web3Map;
        this.$emit("updateEvent", "initPositionStart");
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
            this.$emit("updateEvent", "initPositionEnd");
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
                this.$emit("updateEvent", "uploadPositionEnd");
                reslove();
              });
          });
      });
    },
    manageVehicle: async function () {
      if (!global_.startPoint) {
        // 画出乘客的起点
        if (global_.startPoint) global_.map.removeLayer(global_.startPoint);
        global_.startPoint = L.circle(global_.startGeohash, 10, {
          color: " 	#00FF00",
        });
        global_.map.addLayer(global_.startPoint);
      }
      if (!global_.dstPoint) {
        // 画出乘客的终点
        if (global_.dstPoint) global_.map.removeLayer(global_.dstPoint);
        global_.dstPoint = L.circle(global_.dstGeohash, 10, {
          color: " 	#DC143C",
        });
        global_.map.addLayer(global_.dstPoint);
      }
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
      this.isFind = false;
      var passengerId = global_.userID;
      var trafficContract = global_.trafficContract;
      var web3Map = global_.web3Map;

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
                //debug:changeID
                from: global_.ethAccount,
                // from: passengerId,
                gas: 5000000,
                position: "w3511111111111",
                txtime: 278000,
              })
              .then(
                (result2) => {
                  let getVehicleTime2 = Date.now() - getVehicleTime1;
                  console.log("getVehicleTime2: ", getVehicleTime2);

                  console.log("车辆选择成功:", result1);

                  this.$emit("updateEvent", "getVehicleEnd");
                  var vehiclePosition = web3Map.utils
                    .hexToAscii(result1[0])
                    .slice(0, 11);
                  this.vehicleGeohash = vehiclePosition;
                  this.vehiclePlace = global_.geoToPalceMap.get(
                    this.vehicleGeohash
                  );
                  console.log("vehicle at " + this.vehiclePlace);
                  this.vehiclePoint = L.circle(vehiclePosition, 20, {
                    color: " 	#FF8C00",
                  });
                  global_.map.addLayer(this.vehiclePoint);
                  var vehicleId = result1[1].slice(0, 42);
                  this.vehicleId = vehicleId;
                  this.vehicleGeohash = vehiclePosition;
                  global_.vehicleID = vehicleId;
                  global_.vehicleGeohash = vehiclePosition;
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
                    this.$emit("updateEvent", "noVehicle");
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
              this.$emit("updateEvent", "noVehicle");
              count = 0;
              this.clear(false);
            }
          }
        );
    },
    trafficSim: async function (routes) {
      console.log("begin to simulation: ");
      var vehicleId = global_.vehicleID;
      var interval = 100.0;
      var points = [];
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
          var geohash = encode_geohash(lon, lat, 20);
          setTimeout(
            (geohash) => {
              // global_.locationContract.methods
              //   .getQuality(vehicleId)
              //   .call((error, result) => {
              //     if (!error) {
              //       credit = result;
              //       console.log("credit" + " : " + credit);
              //       var point = L.polyline([geohash, geohash], {
              //         color: gradient[credit],
              //         fillColor: gradient[credit],
              //         fillOpacity: 1,
              //         weight: 17,
              //       });
              //       this.points.push(point);
              //       global_.map.addLayer(point);
              //     } else console.error(error);
              //   });

              credit = 100;
              var point = L.polyline([geohash, geohash], {
                color: gradient[credit],
                fillColor: gradient[credit],
                fillOpacity: 1,
                weight: 17,
              });
              this.points.push(point);
              global_.map.addLayer(point);
            },
            500 * (j + totalCount),
            geohash
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
      var passengerId = global_.userID;
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
              this.$emit("updateEvent", "payEnd");
              this.isPay = true;
              this.clear(true);
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
          // $("#vehicleEvent").val("乘客确认上车");
          this.isboard = true;
          console.log("乘客确认上车");
          this.$emit("updateEvent", "confirmBoardEnd");
        });
    },
    clear: function (isFinish) {
      var map = global_.map;
      if (isFinish) {
        global_.userGeohash = global_.dstGeohash;
        if (this.vehiclePoint) map.removeLayer(this.vehiclePoint);
        if (global_.userPoint) map.removeLayer(global_.userPoint);
        if (global_.nearestPoint) map.removeLayer(global_.nearestPoint);
        if (global_.startPoint) map.removeLayer(global_.startPoint);
        if (global_.dstPoint) map.removeLayer(global_.dstPoint);
        if (this.points.length != 0) {
          for (var item of this.points) {
            map.removeLayer(item);
          }
          this.points = [];
          global_.startPlace = "";
          global_.dstPlace = "";
          global_.startGeohash = "";
          global_.dstGeohash = "";
        }
        //绘制新的用户点
        global_.userPoint = L.circle(global_.userGeohash, 10, {
          color: "#00FFAA",
        });
        global_.map.addLayer(global_.userPoint);
        // draw the nearst point
        var distance = 10e10;
        var index;
        for (let i = 0; i < jointPoints.length; i++) {
          var tmp = getDistanceBtwGP(global_.userGeohash, jointPoints[i][0]);
          if (tmp < distance) {
            distance = tmp;
            index = i;
          }
        }
        global_.nearestPoint = L.circle(jointPoints[index][0], 20, {
          color: "#00CCFF",
        });
        global_.nearestPoint.on("click", (e) => {
          console.log(e.target._latlng);
          global_.startPlace = global_.geoToPalceMap.get(e.target._latlng);
          global_.startGeohash = e.target._latlng;
          console.log("已选择start place :" + global_.startPlace);
        });
        global_.map.addLayer(global_.nearestPoint);
      }
      global_.vehicleID = "";
      global_.vehicleGeohash = "";
      this.$emit("changeManageStatu", false);
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
  height: 215px;
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
.partners-container {
  padding-top: 17px;
}
.partners-wrapper {
  height: 94px;
  overflow: hidden;
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