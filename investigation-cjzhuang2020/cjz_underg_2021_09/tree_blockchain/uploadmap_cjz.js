var Web3 = require('web3');
var json = require("./build/StoreMap.json");
var contract = require("truffle-contract");
var MyContract = contract(json);

// Step 3: Provision the contract with a web3 provider
MyContract.setProvider(new Web3.providers.HttpProvider("http://localhost:8545"));

// contract address 
var myContractInstance = MyContract.at("0x2efd384f692c5b11b10ce3e3c0ce261b65b9debc");
var account = "0xd89600f0a428205e31f8a51601b0205bd0adb0b7";

// read map in json format
var fs = require('fs');
// var map_file="./BeijingData.json";
var map_file = "./costMap_GeoHash.json";

var maps = fs.readFileSync(map_file);
var lineReader = require('line-reader');

//从上次中止上传的地方继续上传
let counter = 0;

// wx4er
let obj = JSON.parse(maps);
let roads = obj.features;

function uploadCountPerBlock() {
	let partTask = [];
	let loopNum = 200;

	for (let i = 0; i < loopNum; i++) {
		partTask.push(add_map(roads[counter]));
		counter++;
		if ((roads.length - counter) == 0) {
			Promise.all(partTask).then((resolve) => {
				console.log("地图数据上传完成");
			}, (reject) => { })
			break;
		}
	}
	if (partTask.length == loopNum) {
		Promise.all(partTask).then((resolve) => {
			uploadCountPerBlock();
		}, (reject) => { })
	}
}
uploadCountPerBlock();

var hash_array;
async function add_map(line) {
	var minzoom;
	var cost;
	var source;
	var target;
	var oneway;
	var building;
	var name;
	var highway;
	var gid;

	var line_json = line;
	var path_arr = line_json.geometry.coordinates;

	var gas = 3000000;
	var path_length = 0;
	var path = [];
	// 判断是否是多边形
	// console.log(line_json.geometry.type);
	if (line_json.geometry.type == "Point") {
		minzoom = 14;
		var point_x = parseFloat(path_arr[0]);
		var point_y = parseFloat(path_arr[1]);
		var point_geohash = encode_geohash(point_x, point_y, 11);
		path.push(point_geohash);
		gas += 110000;
		// console.log("onepoint",point_geohash);
	}
	else if (line_json.geometry.type == "LineString") {
		minzoom = 7;
		path_length = path_arr.length;
		// console.log(path_length);
		for (var i = 0; i < path_length; i++) {
			path.push(path_arr[i]);
			gas += 110000;
			// console.log("onepoint",point_geohash);
		}
	}
	else if (line_json.geometry.type == "MultiPolygon") {
		minzoom = 12;
		path_length = path_arr[0][0].length;
		// console.log(path_length);
		for (var i = 0; i < path_length; i++) {
			var point = path_arr[0][0][i];
			var point_x = parseFloat(point[0]);
			var point_y = parseFloat(point[1]);
			var point_geohash = encode_geohash(point_x, point_y, 11);
			path.push(point_geohash);
			gas += 110000;
			// console.log("onepoint",point_geohash);
		}
	}
	// 获取其他必要参数值 
	cost = line_json.properties.cost;
	source = line_json.properties.source;
	target = line_json.properties.target;

	if (line_json.properties.name == undefined) {
		name = "";
	}
	else {
		name = line_json.properties.name;
	}
	if (line_json.properties.building == undefined) {
		building = 0;
	}
	else {
		building = 1;
	}
	if (line_json.properties.highway == undefined) {
		highway = "";
	}
	else {
		highway = line_json.properties.highway;
	}
	if (line_json.properties.oneway == undefined) {
		oneway = 0;
	}
	else {
		oneway = 1;
	}

	gid = line_json.properties.gid;
	// 将地图信息存储到区块链
	await add_oneline(gid, minzoom, cost, source, target, oneway, building, highway, name, line_json.geometry.type, path, gas, 0);
	// console.log(counter,minzoom,oneway,building,highway,name,line_json.geometry.type,path);

	// console.log(path);
	//区域绑定
	hash_array = new Array();
	if (line_json.geometry.type == "Point" || line_json.geometry.type == "MultiPolygon") {
		bind_other_geohash(gid, path);
	}
	else if (line_json.geometry.type == "LineString") {
		await bind_road_geohash(gid, path);
	}
}

// 将道路信息绑定在geohash块上
async function bind_road_geohash(gid, path) {

	//get areas which has intersection with the road. for lon, 0.01 degree is equal to about 1000m and 1113m for lat
	for (let i = 0; i < path.length; i++) {
		area_geohash5 = path[i].slice(0, 5)
		if ((hash_array.indexOf(area_geohash5) != -1)) {
			continue;
		}
		if (hash_array.indexOf(area_geohash5) == -1) {
			hash_array.push(area_geohash5);
			await add_area_line(area_geohash5, gid, 150000, 0);
			console.log("area_geohash5", area_geohash5);
		}
	}
}

// 绑定
function bind_other_geohash(gid, path) {
	// 对于Point和MultiPolygon，直接根据前缀绑定
	for (var i = 0; i < path.length; i++) {
		var area_geohash4 = path[i].substring(0, 4);
		if ((hash_array.indexOf(area_geohash4) != -1)) {
			continue;
		}
		if (hash_array.indexOf(area_geohash4) == -1) {
			hash_array.push(area_geohash4);
			add_area_line(area_geohash4, gid, 5000000, 0);
			console.log("area_geohash4", area_geohash4);
		}
	}
}

async function add_area_line(geohash, gid, gas, retry_times) {
	console.log(retry_times);
	if (retry_times > 10) {
		console.log("bind road failed. geohash: " + geohash + " ,gid: " + gid);
		return;
	}
	await myContractInstance.add_area_line(geohash, gid, { from: account, gas: gas, position: "w3511111111111", txtime: 278000 }).then(function (result) {
		// console.log(result);
	},
		function (err) {
			console.log("add_area_line err: ", err);
			add_area_line(geohash, gid, gas, retry_times + 1);
		});
}

async function add_oneline(gid, minzoom, cost, source, target, oneway, building, highway, name, gtype, path, gas, retry_times) {
	if (retry_times > 10) {
		console.log("add line failed. gid: " + gid);
		return;
	}
	// console.log("source, target", source, target);
	await myContractInstance.add_onetype(gid, minzoom, cost, source, target, oneway, building, highway, name, gtype, path, { from: account, gas: gas, position: "w3511111111111", txtime: 278000 }).then(function (result) {
		console.log("gid: ", gid);
		console.log("path: ", path)
	},
		function (err) {
			//retry
			console.log("add_onetype err: ", err)
			add_oneline(gid, minzoom, cost, source, target, oneway, building, highway, name, gtype, path, gas, retry_times + 1);
		});
}

// var precision = 6;
var Bits = [16, 8, 4, 2, 1];
var Base32 = "0123456789bcdefghjkmnpqrstuvwxyz".split("");

function encode_geohash(longitude, latitude, precision) {
	var geohash = "";
	var even = true;
	var bit = 0;
	var ch = 0;
	var pos = 0;
	var lat = [-90, 90];
	var lon = [-180, 180];
	while (geohash.length < precision) {
		var mid;

		if (even) {
			mid = (lon[0] + lon[1]) / 2;
			if (longitude > mid) {
				ch |= Bits[bit];
				lon[0] = mid;
			}
			else
				lon[1] = mid;
		}
		else {
			mid = (lat[0] + lat[1]) / 2;
			if (latitude > mid) {
				ch |= Bits[bit];
				lat[0] = mid;
			}
			else
				lat[1] = mid;
		}
		even = !even;
		if (bit < 4)
			bit++;
		else {
			geohash += Base32[ch];
			bit = 0;
			ch = 0;
		}
	}
	return geohash;
}
