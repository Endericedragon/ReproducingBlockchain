let fs=require('fs');
let Web3 = require('web3');
let web3 = new Web3(new Web3.providers.WebsocketProvider("ws://127.0.0.1:8546"));
let deltaLat = 0.596496069;
let deltaLon = [1.191555127,1.1800798,1.157239659,1.123254668,1.07845212,1.023263489,0.958220271,0.883948868,0.801164554,0.710664587,0.613320532,0.510069865,0.401906947,0.289873444,0.175048303,0.05853735];
let Base32 = "0123456789bcdefghjkmnpqrstuvwxyz".split("");
let Neighbors = [[ "p0r21436x8zb9dcf5h7kjnmqesgutwvy", // Top
	"bc01fg45238967deuvhjyznpkmstqrwx", // Right
	"14365h7k9dcfesgujnmqp0r2twvyx8zb", // Bottom
	"238967debc01fg45kmstqrwxuvhjyznp", // Left
	], ["bc01fg45238967deuvhjyznpkmstqrwx", // Top
	"p0r21436x8zb9dcf5h7kjnmqesgutwvy", // Right
	"238967debc01fg45kmstqrwxuvhjyznp", // Bottom
	"14365h7k9dcfesgujnmqp0r2twvyx8zb", // Left
	]];
let Borders = [["prxz", "bcfguvyz", "028b", "0145hjnp"],["bcfguvyz", "prxz", "0145hjnp", "028b"]];
let Bits = [16, 8, 4, 2, 1];
let precision = 10;
let divnum = 4;
//Map contract
let mapContractAddress = '0x0311d0c7f879fb34fe0a10233f4e7241ff5b7382';
let mapContractAbi = JSON.parse(fs.readFileSync('./mapContractAbi.json', 'utf-8'));
let mapContract = new web3.eth.Contract(mapContractAbi,mapContractAddress);

//Traffic contract
let trafficContractAddress = '0x206a45a148d4beee28ac9fa26c74bc95b717e6fe';
let trafficContractAbi = JSON.parse(fs.readFileSync('./trafficContractAbi.json', 'utf-8'));
let trafficContract = new web3.eth.Contract(trafficContractAbi,trafficContractAddress);

let passengerIdList = JSON.parse(fs.readFileSync('./accountResult/partPassenger.json', 'utf-8'));
let passengerPositionList = JSON.parse(fs.readFileSync('./positionInit/pPosTime.json', 'utf-8'));


let passengerMessagesFile = "./passengerResult/system/30minPn.json";
let error1File = "./passengerResult/system/30minPnErr1.json";
let error2File = "./passengerResult/system/30minPnErr2.json";

let startTime = Date.now();
let countNum = 0;
let passengerMessages= [];

let error1Messages = [];
let error2Messages = [];

//乘客发出调度请求
async function manageVehicle(){

    for(let i = 0; i < passengerPositionList.length; i++){
		setTimeout(() => {
			passengerUnit(i)
		}, passengerPositionList[i].time);
    }
}
manageVehicle();

function passengerUnit(i){
	let passengerId = passengerIdList[i];
	let passengerMessage = {};

	trafficContract.methods.initPassenger(passengerId, web3.utils.asciiToHex(passengerPositionList[i].start), web3.utils.asciiToHex(passengerPositionList[i].end)).send({from: passengerId, gas: 5000000,position:"w3511111111111",txtime:278000}).then(function(error, result){

		console.log("乘客出发点和目的地已记录在智能合约");
		passengerMessage.passengerEnd = passengerPositionList[i].end;

		//返回距离乘客最近的空车的位置
		getVehicle(passengerIdList[i], passengerPositionList[i].start,passengerMessage, 0);

	})
}

function getOff(passengerId, vehicleId){
	console.log("开始支付订单");
	// web3.eth.sendTransaction({
	// 	from: passengerId,
	// 	to: vehicleId,
	// 	value: 50000000,
	// 	position:"w3511111111111",
	// 	txtime:278000
	// })
	// .then(function(receipt){
	trafficContract.methods.confirmPay(vehicleId).send({ from: passengerId, gas: 5000000,position:"w3511111111111",txtime:278000}).then(function(result){
		console.log("乘客支付了订单");
	})
	// });
}

async function getVehicle(passengerId, positionGeohash, passengerMessage, count){
	let getVehicleTime1 = Date.now()
	trafficContract.methods.getVehicle(web3.utils.asciiToHex(positionGeohash)).call({from: passengerId, gas: 500000000}).then(async function(result1){
		let getVehicleTime2 = Date.now() - getVehicleTime1;

		trafficContract.methods.setVehicleStatus(result1[1], passengerId, web3.utils.asciiToHex(positionGeohash)).send({from: passengerId, gas: 5000000,position:"w3511111111111",txtime:278000}).then(function(result2){

            let vehiclePosition = web3.utils.hexToAscii(result1[0]).slice(0, 11);
			let vehicleId = result1[1].slice(0,42);

			passengerMessage.passengerId = passengerId;
			passengerMessage.vehicleId = vehicleId;
			passengerMessage.vehiclePosition = vehiclePosition;
			passengerMessage.passengerStart = positionGeohash;
			passengerMessage.theirDistance = getDistanceByGeohash(positionGeohash, vehiclePosition);
			passengerMessage.gasCost = parseInt(result1[2]);
			passengerMessage.getVehicleTime = getVehicleTime2;


			//passengerEvent
			let isboard = false;
			trafficContract.events.routeEvent(function(error, event){
				if(error){
					console.log("error: ",error);
				}
				if(event.returnValues.passengerId.slice(0,42) == passengerId.toLowerCase()){
					// console.log(event);
					// let color = (isboard == false) ? "#FFFF00" : "#00FF00";
					if(isboard == false){
						isboard = true;

						trafficContract.methods.confirmBoard(passengerMessage.vehicleId).send({ from: passengerId, gas: 5000000,position:"w3511111111111",txtime:278000}).then(function(result){
							console.log(`乘客${passengerId}确认上车`);
							passengerMessages.push(passengerMessage);
							countNum++;
							if(countNum >= passengerIdList.length - 10){
								writeOut();
							}
						});

					}else{
						getOff(passengerId, passengerMessage.vehicleId);

						console.log(`乘客${passengerId}到达目的地`);
						isboard = false;
					}
				}
			})
			
		},function(error2){
			console.log(`乘客${passengerId}第${count}次请求调度的车辆冲突了`);
			let error2Message = `乘客${passengerId}第${count}次请求调度的车辆冲突了`;
			error2Messages.push(error2Message);
			count++;
			if(count < 10){
				// $("#vehicleEvent").val("调度车辆中");
				// console.log("调度车辆中");
				getVehicle(passengerId, positionGeohash, passengerMessage, count);
			}else{
				// $("#vehicleEvent").val("当前没有合适的车辆");
				// console.log("当前没有合适的车辆");
                let passengerMessage = {
                    passengerId: passengerId,
                    vehicleId: "0x0000000000000000000000000000000000000000",
					vehiclePosition: "wwwwwwwwwww",
                    passengerStart: positionGeohash,
                    theirDistance: 0,
                    gasCost: 0,
                    getVehicleTime: 0
                }
                passengerMessages.push(passengerMessage);
                countNum++;
                if(countNum >= passengerIdList.length - 10){
                    writeOut();
                }
			}
		})
	},function(error1){
		console.log(`乘客${passengerId}第${count}次请求没有调度到车`);
		let error1Message = `乘客${passengerId}第${count}次请求没有调度到车`;
		error1Messages.push(error1Message);
		count++;
		if(count < 10){
			// $("#vehicleEvent").val("调度车辆中");
			// console.log("调度车辆中");
			getVehicle(passengerId, positionGeohash, passengerMessage, count);
		}else{
			// $("#vehicleEvent").val("当前没有合适的车辆");
			// console.log("当前没有合适的车辆");
			let passengerMessage = {
				passengerId: passengerId,
				vehicleId: "0x0000000000000000000000000000000000000000",
				vehiclePosition: "wwwwwwwwwww",
				passengerStart: positionGeohash,
				theirDistance: 0,
				gasCost: 0,
				getVehicleTime: 0
			}
			passengerMessages.push(passengerMessage);
            countNum++;
            if(countNum >= passengerIdList.length - 10){
                writeOut();
            }
		}
	});
}


function writeOut(){
	let messageJson = JSON.stringify(passengerMessages);
	let err1Json = JSON.stringify(error1Messages);
	let err2Json = JSON.stringify(error2Messages);
	fs.writeFileSync(passengerMessagesFile,messageJson,{flag:'w',encoding:'utf-8',mode:'0666'},function(err){});
	fs.writeFileSync(error1File,err1Json,{flag:'w',encoding:'utf-8',mode:'0666'},function(err){});
	fs.writeFileSync(error2File,err2Json,{flag:'w',encoding:'utf-8',mode:'0666'},function(err){});
}


// eth.sendTransaction({from:eth.accounts[0],to:eth.accounts[2],value:web3.toWei(1,"ether"),position:"wx4erg11111111",txtime:6})


function getDistanceByGeohash(geohash1, geohash2) {//geohash�����
	let vector = getVector(geohash1.slice(0,10), geohash2.slice(0,10));
	let ans = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);
	return ans;
}

function getVector(geohash1, geohash2) { 
	let ans = new Array();

	let londelta = getLonDelta(geohash1);
	let latdelta = getLatDelta(geohash1);
	let dislat1 = getLatBase32(geohash1);
	let dislon1 = getLonBase32(geohash1);
	let dislat2 = getLatBase32(geohash2);
	let dislon2 = getLonBase32(geohash2);

	let dislat = (dislat2 - dislat1) * latdelta;
	let dislon = (dislon2 - dislon1) * londelta;
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
	let even = true;
	let latNow = [-90, 90];
	let lonNow = [-180, 180];

	lat = 0;

	for(let i = 0; i < geohash.length; i++)
	{
		let c = geohash[i];
		let cd = Base32.indexOf(c);
		for (let j = 0; j < 5; j++)
		{
			let mask = Bits[j];
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
	let even = true;
	let latNow = [-90, 90];
	let lonNow = [-180, 180];

	lon = 0;

	for(let i = 0; i < geohash.length; i++)
	{
		let c = geohash[i];
		let cd = Base32.indexOf(c);
		for (let j = 0; j < 5; j++)
		{
			let mask = Bits[j];
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
	let hash_neighbour = new Array();
	let hash_top = CalculateAdjacent(hash,0);
	hash_neighbour.push(hash_top);
	let hash_right = CalculateAdjacent(hash,1);
	hash_neighbour.push(hash_right);
	let hash_bottom = CalculateAdjacent(hash,2);
	hash_neighbour.push(hash_bottom);
	let hash_left = CalculateAdjacent(hash,3);
	hash_neighbour.push(hash_left);

	let hash_top_left = CalculateAdjacent(hash_top, 3);
	hash_neighbour.push(hash_top_left);
	let hash_top_right = CalculateAdjacent(hash_top, 1);
	hash_neighbour.push(hash_top_right);
	let hash_bottom_left = CalculateAdjacent(hash_bottom, 3);
	hash_neighbour.push(hash_bottom_left);
	let hash_bottom_right = CalculateAdjacent(hash_bottom, 1);
	hash_neighbour.push(hash_bottom_right);

	return hash_neighbour;
}


function CalculateAdjacent(hash, dir)
{
	let lastChr = hash[hash.length - 1];
	let type = hash.length % 2;
	let nHash = hash.substring(0, hash.length - 1);
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