
<script>
/*  全局变量组件
变量：用户信息、合约示例、地图实例
方法：initContract初始化合约实例、initData初始化相关数据
*/
import Web3 from "../../node_modules/web3/lib/index.js";
import {
  mapContractAddress,
  mapContractAbi,
} from "../../static/js/mapContract.js";
import {
  trafficContractAddress,
  trafficContractAbi,
} from "../../static/js/trafficContract.js";
import{
 creditContractAbi,
    creditContractAddress
}from "../../static/js/creditContract.js"
import jointPoints from "../../static/js/joint_points.js";

var web3;

//Map contract
var mapContract;
var web3Map;

//Traffic contract
var trafficContract;
var web3Traffic;

//Credit contract
var creditContract;
var web3Credit;

//map conponent
var map;
var geoToPalceMap = new Map();
var placeNames = [];
 var astarTimes= [];

//user info
var userID="";
var userGeohash="wx4enrprnep";
var userPoint=null;
var credit=0;

//stable var
var ethAccount="0xcF94eDc6506E6225D8a1961be2000385C1F7a3F6";

//Contract Init
function initContract(mapContract, web3Map, trafficContract, web3Traffic,creditContract,web3Credit) {
  console.log(">>>init contracts...");
  if (typeof web3 !== "undefined") {
    this.web3Map = new Web3(web3.currentProvider);
    this.web3Traffic = new Web3(web3.currentProvider);
    this.web3Credit=new Web3(web3.currentProvider);
  } else {
    this.web3Map = new Web3(
      new Web3.providers.WebsocketProvider("ws://localhost:8546")
    );
    this.web3Traffic = new Web3(
      new Web3.providers.WebsocketProvider("ws://localhost:8546")
    );
    this.web3Credit=new  Web3(
      new Web3.providers.WebsocketProvider("ws://localhost:8546")
    );
  }
  this.mapContract = new this.web3Map.eth.Contract(
    mapContractAbi,
    mapContractAddress
  );
  this.trafficContract = new this.web3Traffic.eth.Contract(
    trafficContractAbi,
    trafficContractAddress
  );
  this.creditContract=new this.web3Credit.eth.Contract(
 creditContractAbi,
    creditContractAddress
  )
 console.log("mapContract", this.mapContract);
  console.log("trafficContract",this. trafficContract);
  console.log("creditContract,",this.creditContract);
  console.log("OK!");
}

//data init
function initData(placeNames) {
  console.log(">>>>init data....");
  jointPoints.forEach((item) => {

    geoToPalceMap.set(item[0], item[1]);
  });
  var geohashToPalceMapItr = geoToPalceMap.values();
  for (let i = 0; i < geoToPalceMap.size; i++) {
    this.placeNames.push(geohashToPalceMapItr.next().value);
  }
}
function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return false;
}
export default {
  mapContract,
  web3Map,
  trafficContract,
  web3Traffic,
  creditContract,
  web3Credit,
  map,
  geoToPalceMap,
  placeNames,
  initContract,
  initData,
   getQueryVariable,
  userID,
  userGeohash,
  credit,
  userPoint,
   astarTimes,
   ethAccount
};
</script>