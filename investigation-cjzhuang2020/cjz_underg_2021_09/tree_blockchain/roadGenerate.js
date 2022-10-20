let precision ;
let Bits = [16, 8, 4, 2, 1];
let Base32 = "0123456789bcdefghjkmnpqrstuvwxyz".split("");

//geohash length
let glen = 11;
//geohashjson name
let gname = './costMap_GeoHash.json';
let interSectionFileName = '../树状区块链性能实验/intersections.json';

//read map in json format
let fs=require('fs');

// let regionLimit = ["wx4er", "wx4g2", "wx4ep", "wx4g0"];//限定地区范围，筛出范围内的路口点
let regionLimit = ["wx4er"];//限定地区范围，筛出范围内的路口点
let intersections = new Set();

//upLeft   116.32578894495964,   39.98897239565849
//downRight   116.32613226771355,   39.98880073428154

let originLinkUp = [[116.32613226771355,39.98897239565849],[116.32578894495964,39.98897239565849]];
let originLinkDown = [[116.32578894495964,39.98880073428154],[116.32613226771355,39.98880073428154]];
let originLinkLeft = [[116.32578894495964,39.98897239565849],[116.32578894495964,39.98880073428154]];
let originLinkRight = [[116.32613226771355,39.98880073428154],[116.32613226771355,39.98897239565849]];


let originRowUp1 = [[116.33128210902214,39.98897239565849],[116.32990881800652,39.98897239565849]];
let originRowUp2 = [[116.32990881800652,39.98897239565849],[116.32750555872917,39.98897239565849]];
let originRowUp3 = [[116.32750555872917,39.98897239565849],[116.32613226771355,39.98897239565849]];
let originRowDown1 = [[116.32613226771355,39.98880073428154],[116.32750555872917,39.98880073428154]];
let originRowDown2 = [[116.32750555872917,39.98880073428154],[116.32990881800652,39.98880073428154]];
let originRowDown3 = [[116.32990881800652,39.98880073428154],[116.33128210902214,39.98880073428154]];
let originColLeft = [[116.32578894495964,39.98880073428154],[116.32578894495964,39.98622581362724]];
let originColRight = [[116.32613226771355,39.98622581362724],[116.32613226771355,39.98880073428154]];

// let originRowUp = [[116.3319687,39.9889723],[116.3299088,39.9889723],[116.3275055,39.9889723],[116.3254456,39.9889723]];
// let originRowDown = [[116.3254456,39.9888007],[116.3275055,39.9888007],[116.3299088,39.9888007],[116.3319687,39.9888007]];
// let originColLeft = [[116.3251022,39.9888007],[116.3251022,39.9862258]];
// let originColRight = [[116.3254456,39.9862258],[116.3254456,39.9888007]];

//设定geohashjson格式
let totals,curcrs,geohashs=[];
let geohashjson = {
  crs: { properties: { name: 'urn:ogc:def:crs:EPSG::4326' }, type: 'name' },
  features: [],
  totalFeatures: 0,
  type: 'FeatureCollection'
}

setTimeout(() => {
	console.log('work');
	work()
}, 2000);
generateRoad()

function work(){
  let jsonstr = JSON.stringify(geohashjson);
  let intersectionsJson = JSON.stringify(Array.from(intersections));
	//onsole.log('jsonstr', jsonstr);
  //fs.writeFile('./geohashjson_heilongjiang7-border_8',jsonstr,{flag:'a',encoding:'utf-8',mode:'0666'},function(err){});
  fs.writeFileSync(gname,jsonstr,{flag:'w',encoding:'utf-8',mode:'0666'},function(err){});
  fs.writeFileSync(interSectionFileName,intersectionsJson,{flag:'w',encoding:'utf-8',mode:'0666'},function(err){
	  console.log("interSectionFileErr: ",err);
  });
}



function generateRoad(){
	rowCol(17,9);
	//输入行数和列数即可生成相应的网格状单行道
	function rowCol(row, col){
		let gid = 1;
		for(let i = 0; i < row; i++){
			for(let j = 0; j < col; j++){
				let deltaLon = j * 0.0054931640625;
				let deltaLat = i * 0.00274658203125;
				let linkUpPoints = [];
				let linkDownPoints = [];
				let linkLeftPoints = [];
				let linkRightPoints = [];

				let rowUp1Points = [];
				let rowUp2Points = [];
				let rowUp3Points = [];
				let rowDown1Points = [];
				let rowDown2Points = [];
				let rowDown3Points = [];
				let colLeftPoints = [];
				let colRightPoints = [];
				for(let k = 0; k < 2; k++){
					let tmpUp = inputs(glen, originLinkUp[k][0] + deltaLon, originLinkUp[k][1] - deltaLat);
					let tmpDown = inputs(glen, originLinkDown[k][0] + deltaLon, originLinkDown[k][1] - deltaLat);
					let tmpLeft = inputs(glen, originLinkLeft[k][0] + deltaLon, originLinkLeft[k][1] - deltaLat);
					let tmpRight = inputs(glen, originLinkRight[k][0] + deltaLon, originLinkRight[k][1] - deltaLat);
                    let colLeft = inputs(glen, originColLeft[k][0] + deltaLon, originColLeft[k][1] - deltaLat);
					let colRight = inputs(glen, originColRight[k][0] + deltaLon, originColRight[k][1] - deltaLat);
					linkUpPoints.push(tmpUp);
					linkDownPoints.push(tmpDown);
					linkLeftPoints.push(tmpLeft);
					linkRightPoints.push(tmpRight);
                    colLeftPoints.push(colLeft);
					colRightPoints.push(colRight);

					let rowUp1 = inputs(glen, originRowUp1[k][0] + deltaLon, originRowUp1[k][1] - deltaLat);
					let rowUp2 = inputs(glen, originRowUp2[k][0] + deltaLon, originRowUp2[k][1] - deltaLat);
					let rowUp3 = inputs(glen, originRowUp3[k][0] + deltaLon, originRowUp3[k][1] - deltaLat);
					let rowDown1 = inputs(glen, originRowDown1[k][0] + deltaLon, originRowDown1[k][1] - deltaLat);
					let rowDown2 = inputs(glen, originRowDown2[k][0] + deltaLon, originRowDown2[k][1] - deltaLat);
					let rowDown3 = inputs(glen, originRowDown3[k][0] + deltaLon, originRowDown3[k][1] - deltaLat);
					
					rowUp1Points.push(rowUp1);
					rowUp2Points.push(rowUp2);
					rowUp3Points.push(rowUp3);
					rowDown1Points.push(rowDown1);
					rowDown2Points.push(rowDown2);
					rowDown3Points.push(rowDown3);
					
				}
				geohashjson.features.push({
					properties: {
						minzoom: 7,
						highway: 'secondary',
						cost: Math.floor(1000000000 * getDistanceBtwP(originLinkUp[1][1],originLinkUp[1][0],originLinkUp[0][1],originLinkUp[0][0])),
						gid: gid++,
						name: 'test',
						source:1,
      			target:1,
						oneway: 'yes'
					},
					geometry:{
						coordinates: linkUpPoints,
						type: "LineString"			
					},
					type:'Feature'
				});
				geohashjson.features.push({
					properties: {
						minzoom: 7,
						highway: 'secondary',
						cost: Math.floor(1000000000 * getDistanceBtwP(originLinkDown[1][1],originLinkDown[1][0],originLinkDown[0][1],originLinkDown[0][0])),
						gid: gid++,
						name: 'test',
						source:1,
      			target:1,
						oneway: 'yes'
					},
					geometry:{
						coordinates: linkDownPoints,
						type: "LineString"			
					},
					type:'Feature'
				});
				geohashjson.features.push({
					properties: {
						minzoom: 7,
						highway: 'secondary',
						cost: Math.floor(1000000000 * getDistanceBtwP(originLinkLeft[1][1],originLinkLeft[1][0],originLinkLeft[0][1],originLinkLeft[0][0])),
						gid: gid++,
						name: 'test',
						source:1,
      			target:1,
						oneway: 'yes'
					},
					geometry:{
						coordinates: linkLeftPoints,
						type: "LineString"			
					},
					type:'Feature'
				});
				geohashjson.features.push({
					properties: {
						minzoom: 7,
						highway: 'secondary',
						cost: Math.floor(1000000000 * getDistanceBtwP(originLinkRight[1][1],originLinkRight[1][0],originLinkRight[0][1],originLinkRight[0][0])),
						gid: gid++,
						name: 'test',
						source:1,
      			target:1,
						oneway: 'yes'
					},
					geometry:{
						coordinates: linkRightPoints,
						type: "LineString"			
					},
					type:'Feature'
				});

				geohashjson.features.push({
					properties: {
						minzoom: 7,
						highway: 'secondary',
						cost: Math.floor(1000000000 * getDistanceBtwP(originRowUp1[originRowUp1.length - 1][1],originRowUp1[originRowUp1.length - 1][0],originRowUp1[0][1],originRowUp1[0][0])),
						gid: gid++,
						name: 'test',
						source:1,
      			target:1,
						oneway: 'yes'
					},
					geometry:{
						coordinates: rowUp1Points,
						type: "LineString"			
					},
					type:'Feature'
				});
				geohashjson.features.push({
					properties: {
						minzoom: 7,
						highway: 'secondary',
						cost: Math.floor(1000000000 * getDistanceBtwP(originRowUp2[originRowUp2.length - 1][1],originRowUp2[originRowUp2.length - 1][0],originRowUp2[0][1],originRowUp2[0][0])),
						gid: gid++,
						name: 'test',
						source:1,
      			target:1,
						oneway: 'yes'
					},
					geometry:{
						coordinates: rowUp2Points,
						type: "LineString"			
					},
					type:'Feature'
				});
				geohashjson.features.push({
					properties: {
						minzoom: 7,
						highway: 'secondary',
						cost: Math.floor(1000000000 * getDistanceBtwP(originRowUp3[originRowUp3.length - 1][1],originRowUp3[originRowUp3.length - 1][0],originRowUp3[0][1],originRowUp3[0][0])),
						gid: gid++,
						name: 'test',
						source:1,
      			target:1,
						oneway: 'yes'
					},
					geometry:{
						coordinates: rowUp3Points,
						type: "LineString"			
					},
					type:'Feature'
				});
				geohashjson.features.push({
					properties: {
						minzoom: 7,
						highway: 'secondary',
						cost: Math.floor(1000000000 * getDistanceBtwP(originRowDown1[originRowDown1.length - 1][1],originRowDown1[originRowDown1.length - 1][0],originRowDown1[0][1],originRowDown1[0][0])),
						gid: gid++,
						name: 'test',
						source:1,
      			target:1,
						oneway: 'yes'
					},
					geometry:{
						coordinates: rowDown1Points,
						type: "LineString"			
					},
					type:'Feature'
				});
				geohashjson.features.push({
					properties: {
						minzoom: 7,
						highway: 'secondary',
						cost: Math.floor(1000000000 * getDistanceBtwP(originRowDown2[originRowDown2.length - 1][1],originRowDown2[originRowDown2.length - 1][0],originRowDown2[0][1],originRowDown2[0][0])),
						gid: gid++,
						name: 'test',
						source:1,
      			target:1,
						oneway: 'yes'
					},
					geometry:{
						coordinates: rowDown2Points,
						type: "LineString"			
					},
					type:'Feature'
				});
				geohashjson.features.push({
					properties: {
						minzoom: 7,
						highway: 'secondary',
						cost: Math.floor(1000000000 * getDistanceBtwP(originRowDown3[originRowDown3.length - 1][1],originRowDown3[originRowDown3.length - 1][0],originRowDown3[0][1],originRowDown3[0][0])),
						gid: gid++,
						name: 'test',
						source:1,
      			target:1,
						oneway: 'yes'
					},
					geometry:{
						coordinates: rowDown3Points,
						type: "LineString"			
					},
					type:'Feature'
				});
				geohashjson.features.push({
					properties: {
						minzoom: 7,
						highway: 'secondary',
						cost: Math.floor(1000000000 * getDistanceBtwP(originColLeft[1][1],originColLeft[1][0],originColLeft[0][1],originColLeft[0][0])),
						gid: gid++,
						name: 'test',
						source:1,
      			target:1,
						oneway: 'yes'
					},
					geometry:{
						coordinates: colLeftPoints,
						type: "LineString"			
					},
					type:'Feature'
				});
				geohashjson.features.push({
					properties: {
						minzoom: 7,
						highway: 'secondary',
						cost: Math.floor(1000000000 * getDistanceBtwP(originColRight[1][1],originColRight[1][0],originColRight[0][1],originColRight[0][0])),
						gid: gid++,
						name: 'test',
						source:1,
      			target:1,
						oneway: 'yes'
					},
					geometry:{
						coordinates: colRightPoints,
						type: "LineString"			
					},
					type:'Feature'
				});
				geohashjson.totalFeatures += 8;
			}
		}
	}
}

function inputs(input_p,longitude, latitude){
	precision = input_p;
	let cur_geohash = encode_geohash(longitude, latitude);
	if(regionLimit.indexOf(cur_geohash.slice(0, 5)) >= 0){
		intersections.add(cur_geohash);
	}
	return cur_geohash;
}



function encode_geohash(longitude, latitude){
	let geohash = "";
	let even = true;
	let bit = 0;
	let ch = 0;
	let pos = 0;
    let lat = [-90,90];
	let lon = [-180,180];
	while(geohash.length < precision){
		let mid;

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

function getDistanceBtwP(LatA, LonA, LatB, LonB)//根据两点经纬度计算距离(m),X经度，Y纬度
{
    var radLng1 = LatA * Math.PI / 180.0; 
    var radLng2 = LatB * Math.PI / 180.0;
    var a = radLng1 - radLng2;  
    var b = (LonA - LonB) * Math.PI/ 180.0;  
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2)+ Math.cos(radLng1) * Math.cos(radLng2) * Math.pow(Math.sin(b / 2), 2))) * 6378.137; //返回单位为公里  
    return s * 1000;  
}