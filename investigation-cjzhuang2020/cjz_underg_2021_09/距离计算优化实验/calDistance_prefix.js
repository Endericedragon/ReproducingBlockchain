var Web3 = require('web3');
var deltaLat = 0.596496069;
var deltaLon = [1.191555127,1.1800798,1.157239659,1.123254668,1.07845212,1.023263489,0.958220271,0.883948868,0.801164554,0.710664587,0.613320532,0.510069865,0.401906947,0.289873444,0.175048303,0.05853735];
var Base32 = "0123456789bcdefghjkmnpqrstuvwxyz".split("");
var Bits = [16, 8, 4, 2, 1];
var precision = 10;
var divnum = 4;

var web3
var calDistanceContract;
var account = "0x6285ac64b56E4328eB47Fac281090Ed40147F51B";
var calDistanceContractAddress = "0xf3451745c752912d9bb34d75ff83a912e31e5ff9"
var calDistanceContractAbi = [
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "newP",
				"type": "uint256"
			}
		],
		"name": "changeP",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "newPrecision",
				"type": "uint256"
			}
		],
		"name": "changePrecision",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "dequeue",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "geohash",
				"type": "bytes32"
			},
			{
				"internalType": "uint256",
				"name": "cost",
				"type": "uint256"
			}
		],
		"name": "enqueue",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "string",
				"name": "geohash",
				"type": "string"
			}
		],
		"name": "getLatBlock",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "string",
				"name": "geohash",
				"type": "string"
			}
		],
		"name": "getLonBlock",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "nextGeohash",
				"type": "bytes32"
			},
			{
				"internalType": "bytes32",
				"name": "endGeohash",
				"type": "bytes32"
			}
		],
		"name": "manhattan",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "geohash1",
				"type": "bytes32"
			},
			{
				"internalType": "bytes32",
				"name": "geohash2",
				"type": "bytes32"
			}
		],
		"name": "sliceGeoHash",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "top",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
]
web3 = new Web3(new Web3.providers.WebsocketProvider("ws://127.0.0.1:8546"));



calDistanceContract = new web3.eth.Contract(calDistanceContractAbi,calDistanceContractAddress);

// let geohashs = [
// 	["wx4eqm1s6c", "wx4eqv7hy8"],//1999.8m
// 	["wx4eqm1s6c", "wx4ermkzm0"],//4001.8m
// 	["wx4eqm1s6c", "wx4ervw84x"],//6000.15m
// 	["wx4eqm1s6c", "wx4g2t83b1"],//7999.47m
// 	["wx4eqm1s6c", "wx4g3j9fy5"],//10000.44m
// 	["wx4eqm1s6c", "wx4g3tedsk"],//12001.85m
// 	["wx4eqm1s6c", "wx4g6jt3cf"],//14000.60m
// 	["wx4eqm1s6c", "wx4g6twbrr"],//15999.40m
// 	["wx4eqm1s6c", "wx4g7m2xte"],//18001.15m
// 	["wx4eqm1s6c", "wx4g7v6qek"]//20001.2m
// ]
// let geohashs = [
// 	["wx4eqm1s6c", "wx4eqv7hy8"],//1999.8m
// 	["wx4eqm1s6c", "wx4g7v6qek"],//20001.2m
// 	["wx4eqm1s6c", "wx55khkeke"],//50131m
// 	["wx4eqm1s6c", "wx5e3tkeke"],//99008m
// 	["wx4eqm1s6c", "wxh52skeke"],//153319m
// 	["wx4eqm1s6c", "wxh7qjkeke"],//202197m
// 	["wx4eqm1s6c", "wxj73dkeke"],//301769m
// 	["wx4eqm1s6c", "wxn5kfkeke"],//400431m
// 	["wx4eqm1s6c", "wxpgjpkeke"],//604100m
// 	["wx4eqm1s6c", "wz57kekeke"],//1007793m
// ]

let geohashs = [
	["wx4eqm1s6c", "wx4eqm1s6e"],//1.48m
	["wx4eqm1s6c", "wx4eqm1ske"],//6.30m
	["wx4eqm1s6c", "wx4eqm1kek"],//27.32m
	["wx4eqm1s6c", "wx4eqmkeke"],//370.98m
	["wx4eqm1s6c", "wx4eqkekek"],//359.47m
	["wx4eqm1s6c", "wx4ekekeke"],//6088.31m
	["wx4eqm1s6c", "wx4kekekek"],//46397.90m
	["wx4eqm1s6c", "wxkekekeke"],//273983.31m
	["wx4eqm1s6c", "wkekekekek"],//1758923.30m
	["wx4eqm1s6c", "kekekekek"],//24253931.56m
]

let records = [];



async function work(geohash1, geohash2, record){
    let startTime = Date.now();
    await calDistanceContract.methods.manhattan(web3.utils.asciiToHex(geohash1), web3.utils.asciiToHex(geohash2)).call(function(error, result){
        let endTime = Date.now() - startTime;//统计响应时间
        record.gasUsed.push(parseInt(result[2]));//统计gas
        record.timeUsed.push(endTime);
		console.log("manhattan_result events: ", result);
        record.calResult.push(getDistance(result[0],result[1],geohash1, geohash2));//lat, lon
        
    })
}
//定义工作流程
async function workLoop(){
	for(let i = 0; i < 10; i++){
		let geohash1 = geohashs[i][0];
		let geohash2 = geohashs[i][1];
		let distanceScale = 2000 * (i + 1);
		let record = {
			distanceScale: 0,
			gasUsed: [],
			timeUsed: [],
			calResult:[]
		}
		record.distanceScale = distanceScale;
		for(let j = 0; j < 1000; j++){
			await work(geohash1, geohash2, record);
		}
		let res = {};
		res.distanceScale = record.distanceScale;
		res.aveGas = record.gasUsed.reduce((pre, cur) => pre + cur) / record.gasUsed.length;
		res.aveTime = record.timeUsed.reduce((pre, cur) => pre + cur) / record.timeUsed.length;
		res.aveDistance = record.calResult.reduce((pre, cur) => pre + cur) / record.calResult.length;
		records.push(res);
	}
	console.log("records: ", records);
}
workLoop();
// work()

function getDistance(dislat, dislon,geohash1, geohash2) { //

	var londelta = getLonDelta(geohash1);
	var latdelta = getLatDelta(geohash1);
	dislat = dislat * latdelta;
	dislon = dislon * londelta;
    // console.log("londelta latdelta dislat dislon", londelta, latdelta, dislat, dislon)
    var ans = Math.sqrt(dislat * dislat + dislon * dislon);
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