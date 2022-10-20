var Web3 = require('web3');
var json = require("./build/contracts/StoreMap.json");
var contract = require("truffle-contract");
var MyContract = contract(json);

// Step 3: Provision the contract with a web3 provider
MyContract.setProvider(new Web3.providers.HttpProvider("http://localhost:8545"));

// contract address 
var myContractInstance = MyContract.at("0xd5ad3dd3a371e63ff8fc9737fd85c9c6107da680");
var account = "0x6f43e4e5b4839f53d9e2d155afc1da49f798d5dc";

// read map in json format
var fs=require('fs');
// var map_file="./BeijingData.json";
var map_file="./BeijingData.json";

var maps = fs.readFileSync(map_file);
var lineReader = require('line-reader');

var counter = 1;

lineReader.eachLine(map_file, function(line, last, cb) {
	// wx4er
	if(counter > 18841){
		add_map(line);
	}
    cb();
	if(counter > 18841){
		// 1000时间太短，可能不能正常存储
		sleep(1000);
		console.log(counter);
	}
	counter++;
});


var hash_array;
function add_map(line){
	var minzoom;
    var oneway;
    var building;
	var name;
	var highway;

	var line_json = JSON.parse(line);
	var path_arr = line_json.geometry.coordinates;

	var gas = 300000;
    var path_length = 0;
    var path = [];
	// 判断是否是多边形
	// console.log(line_json.geometry.type);
	if(line_json.geometry.type == "Point"){
		minzoom = 14;
		var point_x = parseFloat(path_arr[0]);
		var point_y = parseFloat(path_arr[1]);
		var point_geohash = encode_geohash(point_x,point_y,11);
		path.push(point_geohash);
		gas += 110000;
		// console.log("onepoint",point_geohash);
	} 
	else if(line_json.geometry.type == "LineString"){
		minzoom = 9;
		path_length = path_arr.length;
		// console.log(path_length);
        for(var i = 0 ; i < path_length ; i++){
            var point = path_arr[i];
            var point_x = parseFloat(point[0]);
            var point_y = parseFloat(point[1]);
            var point_geohash = encode_geohash(point_x,point_y,11);
            path.push(point_geohash);
            gas += 110000;
            // console.log("onepoint",point_geohash);
        }
	}
	else if(line_json.geometry.type == "MultiPolygon"){
		minzoom = 12;
		path_length = path_arr[0][0].length;
		// console.log(path_length);
		for(var i = 0 ; i < path_length ; i++){
            var point = path_arr[0][0][i];
            var point_x = parseFloat(point[0]);
            var point_y = parseFloat(point[1]);
            var point_geohash = encode_geohash(point_x,point_y,11);
            path.push(point_geohash);
            gas += 110000;
            // console.log("onepoint",point_geohash);
        }
	}
	// 获取其他必要参数值
	if(line_json.properties.name == undefined){
		name = "";
	}
	else{
		name = line_json.properties.name;
	}
	if(line_json.properties.building == undefined){
		building = 0;
	}
	else{
		building = 1;
	}
	if(line_json.properties.highway == undefined){
		highway = "";
	}
	else{
		highway = line_json.properties.highway;
	}
	if(line_json.properties.oneway == undefined){
		oneway = 0;
	}
	else{
		oneway = 1;
	}

	// 将地图信息存储到区块链
	add_oneline(counter, minzoom, oneway, building, highway, name, line_json.geometry.type, path, gas, 0);
	// console.log(counter,minzoom,oneway,building,highway,name,line_json.geometry.type,path);

	// console.log(path);
	//区域绑定
	hash_array = new Array();
	if(line_json.geometry.type == "Point" || line_json.geometry.type == "MultiPolygon"){
		bind_other_geohash(counter, path);
	}
	else if(line_json.geometry.type == "LineString"){
		var point1 = path_arr[0];
		x1 = parseFloat(point1[0]);
		y1 = parseFloat(point1[1]);
		var point2 = path_arr[path_arr.length-1];
		x2 = parseFloat(point2[0]);
		y2 = parseFloat(point2[1]);
		console.log(point1,point2);
		bind_road_geohash(counter,x1, x2, y1, y2, path);
	}
}

// 将道路信息绑定在geohash块上
function bind_road_geohash(gid, x1, x2, y1, y2, path){
	var area_geohash;
	var min_x = Math.min(x1, x2);
	var max_x = Math.max(x1, x2);
	var min_y = Math.min(y1, y2);
	var max_y = Math.max(y1, y2);

	var step_x = x1 > x2 ? -1:1;
	var step_y = y1 > y2 ? -1:1;

	//get areas which has intersection with the road. for lon, 0.01 degree is equal to about 1000m and 1113m for lat
	for(var x = x1; x < max_x + 0.01 && x > min_x - 0.01; x+=0.01 * step_x){
		for(var y = y1; y < max_y + 0.01 && y > min_y - 0.01; y+=0.01 * step_y){
			// area_geohash6 = encode_geohash(x,y,6);
			 //area_geohash5 = encode_geohash(x,y,5);
			 area_geohash4 = encode_geohash(x,y,4);
			// area_geohash3 = encode_geohash(x,y,3);

			//duplicate geohash
			// 如果里面hash值都找的到
			// if((hash_array.indexOf(area_geohash6) != -1) && (hash_array.indexOf(area_geohash5) != -1) && (hash_array.indexOf(area_geohash4) != -1) && (hash_array.indexOf(area_geohash3) != -1)){
			// 	continue;
			// }
			if((hash_array.indexOf(area_geohash4) != -1)){
				continue;
			}
			// if(hash_array.indexOf(area_geohash6) == -1){
			// 	hash_array.push(area_geohash6);
			// 	if(has_intersection(path,area_geohash6,6)){
			// 		add_area_line(area_geohash6, gid, 150000, 0);
			// 		console.log("area_geohash6",area_geohash6);
			// 	}
			// }
			if(hash_array.indexOf(area_geohash4) == -1){
				hash_array.push(area_geohash4);
				if(has_intersection(path,area_geohash4,4)){
					add_area_line(area_geohash4, gid, 150000, 0);
					console.log("area_geohash4",area_geohash4);
				}
			}
			// if(hash_array.indexOf(area_geohash4) == -1){
			// 	hash_array.push(area_geohash4);
			// 	if(has_intersection(path,area_geohash4,4)){
			// 		add_area_line(area_geohash4, gid, 150000, 0);
			// 		console.log("area_geohash6",area_geohash4);
			// 	}
			// }
			// if(hash_array.indexOf(area_geohash3) == -1){
			// 	hash_array.push(area_geohash3);
			// 	if(has_intersection(path,area_geohash3,3)){
			// 		add_area_line(area_geohash3, gid, 150000, 0);
			// 		console.log("area_geohash6",area_geohash3);
			// 	}
			// }
		}
	}
}

// judge whether a road has intersection with an area described by a geohash value
function has_intersection(path,geohash,len){
	var i = 0;
	for(i = 0 ; i < path.length ; i++){
		if(path[i].substring(0,len) == geohash){
			return true;
		}
	}
	return false;
}

// 绑定
function bind_other_geohash(gid, path){
	// 对于Point和MultiPolygon，直接根据前缀绑定
	for(var i = 0 ; i < path.length ; i++){
		// var area_geohash6 = path[i].substring(0,6);
		//var area_geohash5 = path[i].substring(0,5);
		var area_geohash4 = path[i].substring(0,4);
		// var area_geohash3 = path[i].substring(0,3);

		// 同一信息避免重复存储至同一区域
		// if((hash_array.indexOf(area_geohash6) != -1) && (hash_array.indexOf(area_geohash5) != -1) && (hash_array.indexOf(area_geohash4) != -1) && (hash_array.indexOf(area_geohash3) != -1)){
		// 	continue;
		// }
		if((hash_array.indexOf(area_geohash4) != -1)){
			continue;
		}
		// if(hash_array.indexOf(area_geohash6) == -1){
		// 	hash_array.push(area_geohash6);
		// 	add_area_line(area_geohash6, gid, 150000, 0);
		// 	console.log("area_geohash6",area_geohash6);
		// }
		if(hash_array.indexOf(area_geohash4) == -1){
			hash_array.push(area_geohash4);
			add_area_line(area_geohash4, gid, 150000, 0);
			console.log("area_geohash4",area_geohash4);
		}
		// if(hash_array.indexOf(area_geohash4) == -1){
		// 	hash_array.push(area_geohash4);
		// 	add_area_line(area_geohash4, gid, 150000, 0);
		// 	console.log("area_geohash4",area_geohash4);
		// }
		// if(hash_array.indexOf(area_geohash3) == -1){
		// 	hash_array.push(area_geohash3);
		// 	add_area_line(area_geohash3, gid, 150000, 0);
		// 	console.log("area_geohash3",area_geohash3);
		// }
	}
}

function add_area_line(geohash, gid, gas, retry_times){
	console.log(retry_times);
	if(retry_times > 10){
		console.log("bind road failed. geohash: " + geohash + " ,gid: " + gid);
		return;
	}
	myContractInstance.add_area_line(geohash, gid,{from: account,gas: gas, position:"w3511111111111",txtime:278000}).then(function(result) {
  		// console.log(result);
	},
	function(err){
		console.log(err);
		add_area_line(geohash, gid, gas, retry_times + 1);
	});
}

function add_oneline(gid, minzoom, oneway, building, highway, name, gtype, path, gas, retry_times){
	if(retry_times > 10){
		console.log("add line failed. gid: " + gid);
		return;
	}
	myContractInstance.add_onetype(gid, minzoom, oneway, building, highway, name, gtype, path, {from: account,gas: gas, position:"w3511111111111",txtime:278000}).then(function(result) {
		//console.log(result);
	},
	function(err){
		//retry
		add_oneline(gid, minzoom, oneway, building, highway, name, gtype, path, gas, retry_times+1);
	});
}

function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}

// var precision = 6;
var Bits = [16, 8, 4, 2, 1];
var Base32 = "0123456789bcdefghjkmnpqrstuvwxyz".split("");

function encode_geohash(longitude, latitude,precision){
	var geohash = "";
	var even = true;
	var bit = 0;
	var ch = 0;
	var pos = 0;
    var lat = [-90,90];
	var lon = [-180,180];
	while(geohash.length < precision){
		var mid;

        if (even)
        {
            mid = (lon[0] + lon[1])/2;
            if (longitude > mid)
            {
                ch |= Bits[bit];
                lon[0] = mid;
             }
            else
                lon[1] = mid;
        }
		else
        {
            mid = (lat[0] + lat[1])/2;
            if (latitude > mid)
            {
                ch |= Bits[bit];
                lat[0] = mid;
            }
            else
                lat[1] = mid;
		}
        even = !even;
        if (bit < 4)
            bit++;
        else
        {
            geohash += Base32[ch];
            bit = 0;
            ch = 0;
        }
	}
	return geohash;
}

function decode_geohash(geohash)
{
	var even = true;
    var lat = [-90,90];
	var lon = [-180,180];

	for(var i=0; i< geohash.length; i++)
	{
		var c= geohash[i];
		var cd = Base32.indexOf(c);
		for (var j = 0; j < 5; j++)
		{
			var mask = Bits[j];
			if (even)
			{
				RefineInterval(lon, cd, mask);
			}
			else
			{
				RefineInterval(lat, cd, mask);
			}
			even = !even;
		}
	}

	return new Array(lon[0], lon[1], lat[0], lat[1]);
}

var Neighbors = [[ "p0r21436x8zb9dcf5h7kjnmqesgutwvy", // Top
	"bc01fg45238967deuvhjyznpkmstqrwx", // Right
	"14365h7k9dcfesgujnmqp0r2twvyx8zb", // Bottom
	"238967debc01fg45kmstqrwxuvhjyznp", // Left
	], ["bc01fg45238967deuvhjyznpkmstqrwx", // Top
	"p0r21436x8zb9dcf5h7kjnmqesgutwvy", // Right
	"238967debc01fg45kmstqrwxuvhjyznp", // Bottom
	"14365h7k9dcfesgujnmqp0r2twvyx8zb", // Left
	]];

var Borders = [["prxz", "bcfguvyz", "028b", "0145hjnp"],
	["bcfguvyz", "prxz", "0145hjnp", "028b"]];


function getNeighbour(hash)
{
	var hash_neighbour = new Array();
	var hash_top = CalculateAdjacent(hash,0);
	hash_neighbour.push(hash_top);
	var hash_right = CalculateAdjacent(hash,1);
	hash_neighbour.push(hash_right);
	var hash_bottom = CalculateAdjacent(hash,2);
	hash_neighbour.push(hash_bottom);
	var hash_left = CalculateAdjacent(hash,3);
	hash_neighbour.push(hash_left);

	var hash_top_left = CalculateAdjacent(hash_top, 3);
	hash_neighbour.push(hash_top_left);
	var hash_top_right = CalculateAdjacent(hash_top, 1);
	hash_neighbour.push(hash_top_right);
	var hash_bottom_left = CalculateAdjacent(hash_bottom, 3);
	hash_neighbour.push(hash_bottom_left);
	var hash_bottom_right = CalculateAdjacent(hash_bottom, 1);
	hash_neighbour.push(hash_bottom_right);

	return hash_neighbour;
}


function CalculateAdjacent(hash, dir)
{
	var lastChr = hash[hash.length - 1];
	var type = hash.length % 2;
	var nHash = hash.substring(0, hash.length - 1);

	if (Borders[type][dir].indexOf(lastChr) != -1)
	{
		nHash = CalculateAdjacent(nHash, dir);
	}
	return nHash + Base32[Neighbors[type][dir].indexOf(lastChr)];
}

function RefineInterval(interval, cd, mask)
{
	if ((cd & mask) != 0)
	{
		interval[0] = (interval[0] + interval[1])/2;
	}
	else
	{
		interval[1] = (interval[0] + interval[1])/2;
	}
}

