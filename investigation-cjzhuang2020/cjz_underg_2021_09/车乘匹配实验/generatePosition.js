let fs=require('fs');
let resultFolder = "./cjz_underg_result/"
let gname = "./pointsResult";


function work(){
  
}


let region = "wx4er";
let centerBase = "93d6e7sktmwq".split("");
let edgeBase = "012458bcfghjnpruvxyz".split("");
let Base32 = "0123456789bcdefghjkmnpqrstuvwxyz".split("");
var Neighbors = [[ "p0r21436x8zb9dcf5h7kjnmqesgutwvy", // Top
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

function averageGenerate(totalNumber){
    for(let i = 0; i < totalNumber; i++){
        let random6 = Math.floor(Math.random()*32);
        let random7 = Math.floor(Math.random()*32);
        let random8 = Math.floor(Math.random()*32);
        let random9 = Math.floor(Math.random()*32);
        let position = region + Base32[random6] + Base32[random7] + Base32[random8] + Base32[random9] + "ek";
        averageResult.push(position);
    }
    gname += "/vehicle100.json";
    let jsonstr = JSON.stringify(averageResult);
    fs.writeFileSync(gname,jsonstr,{flag:'w',encoding:'utf-8',mode:'0666'},function(err){});
    console.log(averageResult);
}
averageGenerate(100);

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