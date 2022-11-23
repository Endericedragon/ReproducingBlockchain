let fs=require('fs');
let resultFolder = "./cjz_underg_result/"
let gname = "./pointsResult";


function work(){
  
}

let deltaLat = 0.596496069;
let deltaLon = [1.191555127,1.1800798,1.157239659,1.123254668,1.07845212,1.023263489,0.958220271,0.883948868,0.801164554,0.710664587,0.613320532,0.510069865,0.401906947,0.289873444,0.175048303,0.05853735];

let Bits = [16, 8, 4, 2, 1];
let precision = 10;
let divnum = 4;


let region = "wx4eqf";
let centerBase = "93d6e7sktmwq".split("");
let edgeBase = "012458bcfghjnpruvxyz".split("");
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
let Borders = [["prxz", "bcfguvyz", "028b", "0145hjnp"],
	["bcfguvyz", "prxz", "0145hjnp", "028b"]];

let averageResult = [];
let  lessCenterResult = [];
let moreCenterResult = [];

//车辆在区域内的路口随机初始化, 第一个参数是总数，第二个参数是持续时间(min)
function intersectionVehiclePositionTime(vehicleNum, duration){
    let initNum = 0;
    let intersectionVehicleResult = [];
    let intersections = JSON.parse(fs.readFileSync('./intersections.json', 'utf-8'));
    //初始化的位置时间
    for(let i = 0; i < initNum; i++){
        let positionTime = {};
        let randomPosition = intersections[Math.floor(Math.random()*intersections.length)];
        positionTime.position = randomPosition;
        positionTime.time = 0;//时间为0，意思是系统实验开始时初始化的位置
        intersectionVehicleResult.push(positionTime);
    }
    //动态添加的位置时间
    for(let i = 1; i <= vehicleNum - initNum; i++){

        let positionTime = {};
        let randomPosition = intersections[Math.floor(Math.random()*intersections.length)];
        positionTime.position = randomPosition;
        let timeInterval = Math.floor(duration * 60 * 1000 / (vehicleNum - initNum));
        let time = timeInterval * i;
        positionTime.time = time;
        intersectionVehicleResult.push(positionTime);
    }
    let positionTimeFile = "./positionInit/vPosTime.json";
    let jsonstr = JSON.stringify(intersectionVehicleResult);
    fs.writeFile(positionTimeFile,jsonstr,{flag:'w',encoding:'utf-8',mode:'0666'},function(err){});
    // console.log(intersectionVehicleResult);
}
// intersectionVehiclePositionTime(800, 0);

//乘客在区域内的路口随机初始化, 第一个参数是总数，第二个参数是持续时间(min)
function intersectionPassengerPositionTime(passengerNum, duration){

    let initNum = 0;
    let intersectionPassengerResult = [];
    let intersections = JSON.parse(fs.readFileSync('./intersections.json', 'utf-8'));
    //初始化的位置时间
    for(let i = 0; i < initNum; i++){
        let positionTime = {};
        let startPosition = intersections[Math.floor(Math.random()*intersections.length)];
        let endPosition = intersections[Math.floor(Math.random()*intersections.length)];
        while(getDistanceByGeohash(startPosition.slice(0,10), endPosition.slice(0,10)) < 1000 || getDistanceByGeohash(startPosition.slice(0,10), endPosition.slice(0,10)) > 2500){
            endPosition = intersections[Math.floor(Math.random()*intersections.length)];
        }
        
        positionTime.start = startPosition;
        positionTime.end = endPosition;
        positionTime.time = 0;//时间为0，意思是系统实验开始时初始化的位置
        intersectionPassengerResult.push(positionTime);
    }
    for(let i = 1; i <= passengerNum - initNum; i++){
        let positionTime = {};
        let startPosition = intersections[Math.floor(Math.random()*intersections.length)];
        let endPosition = intersections[Math.floor(Math.random()*intersections.length)];
        while(getDistanceByGeohash(startPosition.slice(0,10), endPosition.slice(0,10)) < 1000 || getDistanceByGeohash(startPosition.slice(0,10), endPosition.slice(0,10)) > 2500){
            endPosition = intersections[Math.floor(Math.random()*intersections.length)];
        }
        
        positionTime.start = startPosition;
        positionTime.end = endPosition;
        let timeInterval = Math.floor(duration * 60 * 1000 / (passengerNum - initNum));
        let time = timeInterval * i;
        positionTime.time = time;
        intersectionPassengerResult.push(positionTime);
    }
    let positionTimeFile = "./positionInit/pPosTime.json";
    let jsonstr = JSON.stringify(intersectionPassengerResult);
    fs.writeFileSync(positionTimeFile,jsonstr,{flag:'w',encoding:'utf-8',mode:'0666'},function(err){});
    // console.log(intersectionPassengerResult);
}
intersectionPassengerPositionTime(390, 0);



//第一个参数是总数，第二个参数是持续时间(min)
function vehiclePositionTime(vehicleNum, duration){
    let initNum = 60;
    //初始化的位置时间
    for(let i = 0; i < initNum; i++){
        let positionTime = {};
        let random7 = Math.floor(Math.random()*32);
        let random8 = Math.floor(Math.random()*32);
        let random9 = Math.floor(Math.random()*32);
        positionTime.position = region + Base32[random7] + Base32[random8] + Base32[random9] + "ek";
        positionTime.time = 0;//时间为0，意思是系统实验开始时初始化的位置
        averageResult.push(positionTime);
    }
    //动态添加的位置时间
    for(let i = 1; i <= vehicleNum - initNum; i++){
        let positionTime = {};
        let random7 = Math.floor(Math.random()*32);
        let random8 = Math.floor(Math.random()*32);
        let random9 = Math.floor(Math.random()*32);
        positionTime.position = region + Base32[random7] + Base32[random8] + Base32[random9] + "ek";
        let timeInterval = Math.floor(duration * 60 * 1000 / (vehicleNum - initNum));
        let time = timeInterval * i;
        positionTime.time = time;
        averageResult.push(position);
    }
    let positionTimeFile = "./positionInit/vPosTime.json";
    let jsonstr = JSON.stringify(averageResult);
    fs.writeFileSync(positionTimeFile,jsonstr,{flag:'w',encoding:'utf-8',mode:'0666'},function(err){});
    console.log(averageResult);
}
// vehiclePositionTime(240, 60);




function passengerPositionTime(passengerNum, duration){
    for(let i = 0; i < passengerNum; i++){
        let positionTime = {};
        let random7 = Math.floor(Math.random()*32);
        let random8 = Math.floor(Math.random()*32);
        let random9 = Math.floor(Math.random()*32);
        positionTime.position = region + Base32[random7] + Base32[random8] + Base32[random9] + "ek";
        let timeInterval = Math.floor(duration * 60 * 1000 / (passengerNum - 1));
        let time = timeInterval * i;
        positionTime.time = time;
        averageResult.push(position);
    }
    let positionTimeFile = "./positionInit/pPosTime.json";
    let jsonstr = JSON.stringify(averageResult);
    fs.writeFile(positionTimeFile,jsonstr,{flag:'w',encoding:'utf-8',mode:'0666'},function(err){});
    console.log(averageResult);
}
// passengerPositionTime(300, 60);


function averageGenerate(totalNumber){
    for(let i = 0; i < totalNumber; i++){
        let random7 = Math.floor(Math.random()*32);
        let random8 = Math.floor(Math.random()*32);
        let random9 = Math.floor(Math.random()*32);
        let position = region + Base32[random7] + Base32[random8] + Base32[random9] + "ek";
        averageResult.push(position);
    }
    gname += "/averageResult.json";
    let jsonstr = JSON.stringify(averageResult);
    fs.writeFile(gname,jsonstr,{flag:'w',encoding:'utf-8',mode:'0666'},function(err){});
    console.log(averageResult);
}
// averageGenerate(90);

function averageVehiclePointsGenerate(totalNumber){
    let neighbourList = getNeighbour(region);
    neighbourList.unshift(region);
    for(let j = 0; j < neighbourList.length; j++){
        for(let i = 0; i < totalNumber; i++){
            let random7 = Math.floor(Math.random()*32);
            let random8 = Math.floor(Math.random()*32);
            let random9 = Math.floor(Math.random()*32);
            let position = neighbourList[j] + Base32[random7] + Base32[random8] + Base32[random9] + "ek";
            averageResult.push(position);
        }
    }
    gname += "/averageResult.json";
    let jsonstr = JSON.stringify(averageResult);
    fs.writeFile(gname,jsonstr,{flag:'w',encoding:'utf-8',mode:'0666'},function(err){});
    console.log(averageResult);
}
// averageVehiclePointsGenerate(60);

function lessCenterGenerate(totalNumber){
    let centerNum = Math.floor(totalNumber * 0.2);
    let edgeNum = Math.floor(totalNumber * 0.8);

    for(let i = 0; i < centerNum; i++){
        let random7 = Math.floor(Math.random()*12);
        let random8 = Math.floor(Math.random()*32);
        let random9 = Math.floor(Math.random()*32);
        let position = region + centerBase[random7] + Base32[random8] + Base32[random9] + "ek";
        lessCenterResult.push(position);
    }
    for(let i = 0; i < edgeNum; i++){
        let random7 = Math.floor(Math.random()*20);
        let random8 = Math.floor(Math.random()*32);
        let random9 = Math.floor(Math.random()*32);
        let position = region + edgeBase[random7] + Base32[random8] + Base32[random9] + "ek";
        lessCenterResult.push(position);
    }
    gname += "/lessCenterResult.json";
    let jsonstr = JSON.stringify(lessCenterResult);
    fs.writeFile(gname,jsonstr,{flag:'w',encoding:'utf-8',mode:'0666'},function(err){});
    console.log(lessCenterResult);
}
// lessCenterGenerate(90);

function moreCenterGenerate(totalNumber){
    let centerNum = Math.floor(totalNumber * 0.8);
    let edgeNum = Math.floor(totalNumber * 0.2);

    for(let i = 0; i < centerNum; i++){
        let random7 = Math.floor(Math.random()*12);
        let random8 = Math.floor(Math.random()*32);
        let random9 = Math.floor(Math.random()*32);
        let position = region + centerBase[random7] + Base32[random8] + Base32[random9] + "ek";
        moreCenterResult.push(position);
    }
    for(let i = 0; i < edgeNum; i++){
        let random7 = Math.floor(Math.random()*20);
        let random8 = Math.floor(Math.random()*32);
        let random9 = Math.floor(Math.random()*32);
        let position = region + edgeBase[random7] + Base32[random8] + Base32[random9] + "ek";
        moreCenterResult.push(position);
    }
    gname += "/moreCenterResult.json";
    let jsonstr = JSON.stringify(moreCenterResult);
    fs.writeFile(gname,jsonstr,{flag:'w',encoding:'utf-8',mode:'0666'},function(err){});
    console.log(moreCenterResult);
}
// moreCenterGenerate(90);






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

function getDistanceByGeohash(geohash1, geohash2) {//geohash�����
	let vector = getVector(geohash1, geohash2);
	let ans = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);
	return ans;
}

function getVector(geohash1, geohash2) { //geohash������
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

function getLonDelta(geohash) {//��ǰ�������
	//console.log("getLonDelta");
	lat = getLatBase32(geohash);
	lat = lat >> (precision * 5 / 2 - (divnum + 1));
	if ((lat & (1 << divnum)) != (1 << divnum)) {
		lat = (1 << (divnum + 1) - 1) - lat;
	}
	lat = lat - (1 << divnum);
	return deltaLon[lat];
}

function getLatDelta(geohash) {//��ǰ�ϱ����
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