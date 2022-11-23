let fs=require('fs');
let Web3 = require('web3');
let web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

//generate accounts 90* 9,分布在9个六位GeoHash区域内
//Traffic contract

let gname = "./coupleResult/p6Shao.json";
let startTime = Date.now();


var trafficContractAddress = '0x0311d0c7f879fb34fe0a10233f4e7241ff5b7382';

let passengerIdList = JSON.parse(fs.readFileSync('./accountResult/partPassenger.json', 'utf-8'));
let passengerPositionList = JSON.parse(fs.readFileSync('./pointsResult/passenger100.json', 'utf-8'));

let couples = [];
let countNum = 0;


let trafficContractAbi = JSON.parse(fs.readFileSync('./trafficContractAbi.json', 'utf-8'));
let trafficContract = new web3.eth.Contract(trafficContractAbi,trafficContractAddress);

//乘客发出调度请求
function manageVehicleByRegion6(){

    for(let i = 0; i < passengerIdList.length; i++){
		let regionVehicles = [];
		let region6 = passengerPositionList[i].slice(0,6);
		web3.eth.getAccountByRegion(region6).then(function(result){
			if(result != null){
				// console.log("regionTask: ", result)
				// let regionVehiclesAll = Object.entries(result);
				// console.log("regionVehiclesAll: ",regionVehiclesAll);
				let resultVehicles = Object.keys(result);
				let resultVehiclesTime = Object.values(result);
				for(let j = 0 ; j < resultVehicles.length; j++){
					if(resultVehiclesTime[j] > (startTime - 60000) && resultVehiclesTime[j] < Date.now()){
						regionVehicles.push(resultVehicles[j]);
					}
				}
				getVehicleByRegion(passengerIdList[i], passengerPositionList[i], regionVehicles, 0);
				// console.log("getAccountByRegion: ",result);
			}
		})
    }
}
manageVehicleByRegion6();

async function getVehicleByRegion(passengerId, positionGeohash, regionVehicles, count){
	let getVehicleTime1 = Date.now()
	// console.log("regionVehicles: ", regionVehicles);
	trafficContract.methods.getVehicleByRegion(web3.utils.asciiToHex(positionGeohash), regionVehicles).call({from: passengerId, gas: 500000000}).then(async function(result1){
		let getVehicleTime2 = Date.now() - getVehicleTime1;
		if(getVehicleTime2 == 0){
			console.log("regionVehicles: ", regionVehicles);
		}
		trafficContract.methods.setVehicleStatus(result1[1], passengerId, web3.utils.asciiToHex(positionGeohash)).send({from: passengerId, gas: 5000000,position:"w3511111111111",txtime:278000}).then(function(result2){

            vehiclePosition = web3.utils.hexToAscii(result1[0]).slice(0, 11);
			vehicleId = result1[1].slice(0,42);
            let couple = {
                passenger: passengerId,
                vehicle: vehicleId,
                passengerGeoHash: positionGeohash,
                vehicleGeoHash: vehiclePosition,
                theirDistance: getDistanceByGeohash(positionGeohash, vehiclePosition),
                gasCost: parseInt(result1[2]),
                getVehicleTime: getVehicleTime2
            }
            couples.push(couple);
            countNum++;
            if(countNum == passengerIdList.length){
                let jsonstr = JSON.stringify(couples);
                fs.writeFileSync(gname,jsonstr,{flag:'w',encoding:'utf-8',mode:'0666'},function(err){});
            }
			
		},function(error2){
			console.log(`乘客${passengerId}第${count}次请求调度的车辆冲突了`);
			count++;
			if(count < 15){
				// $("#vehicleEvent").val("调度车辆中");
				// console.log("调度车辆中");
				getVehicleByRegion(passengerId, positionGeohash, regionVehicles, count);
			}else{
				// $("#vehicleEvent").val("当前没有合适的车辆");
				// console.log("当前没有合适的车辆");
                let couple = {
                    passenger: passengerId,
                    vehicle: "0x0000000000000000000000000000000000000000",
                    passengerGeoHash: positionGeohash,
                    vehicleGeoHash: "wwwwwwwwwww",
                    theirDistance: 0,
                    gasCost: 0,
                    getVehicleTime: 0
                }
                couples.push(couple);
                countNum++;
                if(countNum == passengerIdList.length){
                    let jsonstr = JSON.stringify(couples);
                    fs.writeFileSync(gname,jsonstr,{flag:'w',encoding:'utf-8',mode:'0666'},function(err){});
                }
			}
		})
	},function(error1){
		console.log(`乘客${passengerId}第${count}次请求没有调度到车`);
		count++;
		if(count < 15){
			// $("#vehicleEvent").val("调度车辆中");
			// console.log("调度车辆中");
			getVehicleByRegion(passengerId, positionGeohash, regionVehicles, count);
		}else{
			// $("#vehicleEvent").val("当前没有合适的车辆");
			// console.log("当前没有合适的车辆");
			let couple = {
                passenger: passengerId,
                vehicle: "0x0000000000000000000000000000000000000000",
                passengerGeoHash: positionGeohash,
                vehicleGeoHash: "wwwwwwwwwww",
                theirDistance: 0,
                gasCost: 0,
                getVehicleTime: 0
            }
            couples.push(couple);
            countNum++;
            if(countNum == passengerIdList.length){
                let jsonstr = JSON.stringify(couples);
                fs.writeFileSync(gname,jsonstr,{flag:'w',encoding:'utf-8',mode:'0666'},function(err){});
            }
		}
	});
}

async function regionTask(region, regionVehicles){
	await trafficContract.eth.getAccountByRegion(region).then(function(result){
		if(result != null){
			// console.log("regionTask: ", result)
			let regionVehiclesAll = Object.entries(result);
			// console.log("regionVehiclesAll: ",regionVehiclesAll);
			resultVehicles = Object.keys(result);
			for(let j = 0 ; j < resultVehicles.length; j++){
				if(resultVehiclesTime[j] > (startTime - 60000) && resultVehiclesTime[j] < Date.now()){
					regionVehicles.push(resultVehicles[j]);
				}
			}
			// console.log("getAccountByRegion: ",result);
		}
	},function(error){
		console.log("getAccountByRegion error");
	})
}


// eth.sendTransaction({from:eth.accounts[0],to:eth.accounts[2],value:web3.toWei(1,"ether"),position:"wx4erg11111111",txtime:6})
var deltaLat = 0.596496069;
var deltaLon = [1.191555127,1.1800798,1.157239659,1.123254668,1.07845212,1.023263489,0.958220271,0.883948868,0.801164554,0.710664587,0.613320532,0.510069865,0.401906947,0.289873444,0.175048303,0.05853735];
var Base32 = "0123456789bcdefghjkmnpqrstuvwxyz".split("");
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
var Bits = [16, 8, 4, 2, 1];
var precision = 10;
var divnum = 4;

function getDistanceByGeohash(geohash1, geohash2) {//geohash�����
	var vector = getVector(geohash1.slice(0,10), geohash2.slice(0,10));
	var ans = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);
	return ans;
}

function getVector(geohash1, geohash2) { 
	var ans = new Array();

	var londelta = getLonDelta(geohash1);
	var latdelta = getLatDelta(geohash1);
	var dislat1 = getLatBase32(geohash1);
	var dislon1 = getLonBase32(geohash1);
	var dislat2 = getLatBase32(geohash2);
	var dislon2 = getLonBase32(geohash2);

	var dislat = (dislat2 - dislat1) * latdelta;
	var dislon = (dislon2 - dislon1) * londelta;
	ans.push(dislon);
	ans.push(dislat);
	return ans;
}


function getLonDelta(geohash) {
	//console.log("getLonDelta");
	lat = getLatBase32(geohash);
	lat = lat >> (precision * 5 / 2 - (divnum + 1));
	if ((lat & (1 << divnum)) != (1 << divnum)) {
		lat = (1 << (divnum + 1) - 1) - lat;
	}
	lat = lat - (1 << divnum);
	return deltaLon[lat];
}

function getLatDelta(geohash) {
	lon = getLonBase32(geohash);
	return deltaLat;
}

function getLatBase32(geohash) {//geohashγ��
	var even = true;
	var latNow = [-90, 90];
	var lonNow = [-180, 180];

	lat = 0;

	for(var i = 0; i < geohash.length; i++)
	{
		var c = geohash[i];
		var cd = Base32.indexOf(c);
		for (var j = 0; j < 5; j++)
		{
			var mask = Bits[j];
			if (even)
			{
				RefineInterval(lonNow, cd, mask);
			}
			else
			{
				RefineInterval(latNow, cd, mask);
				lat = lat * 2;
				if ((cd & mask) != 0) {
					lat = lat + 1;
				}
			}
			even = !even;
		}
	}

	return lat;
}

function getLonBase32(geohash) { //geohash����
	var even = true;
	var latNow = [-90, 90];
	var lonNow = [-180, 180];

	lon = 0;

	for(var i = 0; i < geohash.length; i++)
	{
		var c = geohash[i];
		var cd = Base32.indexOf(c);
		for (var j = 0; j < 5; j++)
		{
			var mask = Bits[j];
			if (even)
			{
				RefineInterval(lonNow, cd, mask);
				lon = lon * 2;
				if ((cd & mask) != 0) {
					lon = lon + 1;
				}				
			}
			else
			{
				RefineInterval(latNow, cd, mask);
			}
			even = !even;
		}
	}

	return lon;
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
	
	if((Base32[Neighbors[type][dir].indexOf(lastChr)])){
		return nHash + Base32[Neighbors[type][dir].indexOf(lastChr)];
	}
	else{
		return nHash;
	}
}