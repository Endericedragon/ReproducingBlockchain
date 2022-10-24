//修改后要返回当前直接crtl+Z  （目前没怎么改）
//记录十字路口
// let adjacencyList = {}
//记录gid用来去重
import global_ from '../../src/components/Global'
import {GetHighway} from './GetHighway.js'
let gidList = []

function getRoads(geohash) {
	console.log("getRoads");
	// console.log(web3Map.utils.asciiToHex('test'));
	var roads = new Array();
	if(geohash.length == 5){
		GetOneline(geohash,roads,0);
	}
	else if(geohash.length == 4){
		geohash = geohash + Base32[31];
		GetOneline(geohash,roads,31);
	}
}

function GetOneline(geohash,roads,count){
	console.log(geohash)
	if(count == 0){
		global_ .mapContract.methods.get_types(global_.web3Map.utils.asciiToHex(geohash)).call(function(error,result){
			if(!error){
				var roadInfo  = result[0];
				var roadName  = result[1];
				var roadHighway = result[2];
				var roadGtype  = result[3];
				var roadPath  = result[4];

				var pointer = 0;
				for (var i = 0; i < roadName.length; i++){
					var road = new Object();
					road.gid = roadInfo[i*5].valueOf();
					road.minzoom  = roadInfo[i*7 + 1].valueOf();
					road.cost  = roadInfo[i*7 + 2].valueOf();
					road.source  = roadInfo[i*7 + 3].valueOf();
					road.target  = roadInfo[i*7 + 4].valueOf();
					road.oneway = roadInfo[i*7 + 5].valueOf();
					road.building  = roadInfo[i*7 + 6].valueOf();

					road.name = hex2str(roadName[i]);
					road.highway = GetHighway(global_.web3Map.utils.hexToAscii(roadHighway[i]));
					if(road.highway == undefined){
						road.highway = "residential";
					}
					road.gtype = GetGtype(web3Map.utils.hexToAscii(roadGtype[i]));
					
					road.path = new Array();

					//read path
					var path_num = parseInt(roadPath[pointer++],16);
					for(var j=0; j< path_num; j++){
						var temp = web3Map.utils.hexToAscii(roadPath[pointer++]);
						road.path.push(temp);
					}
					road.sourceGeohash = road.path[0];
					road.targetGeohash = road.path[path_num - 1];
					roads.push(road);
				}
				console.log("roads:",roads);
				ChangeJSON(roads);
				// console.log("adjacencyList['wx4eqcet93t']", adjacencyList["wx4eqcet93t"])
				// console.log("adjacencyList['wx4er19mece']", adjacencyList["wx4er19mece"])
				// console.log("adjacencyList['wx4epnz0q70']", adjacencyList["wx4epnz0q70"])
			}
			else{
				console.error(error);
			}
		});	
	}
	else{
		// console.log("web3Map.utils.asciiToHex(geohash)", web3Map.utils.asciiToHex(geohash))
		global_ .mapContract.methods.get_types(global_.web3Map.utils.asciiToHex(geohash)).call(function(error,result){
			// if(geohash == "wx4er") console.log("get_types:", result);
			if(!error){
				var roadInfo  = result[0];
				var roadName  = result[1];
				var roadHighway = result[2];
				var roadGtype  = result[3];
				var roadPath  = result[4];

				var pointer = 0;
				for (var i = 0; i < roadName.length; i++){
					var road = new Object();
					road.gid = roadInfo[i*7].valueOf();
					road.minzoom  = roadInfo[i*7+ 1].valueOf();
					road.cost  = roadInfo[i*7 + 2].valueOf();
					road.source  = roadInfo[i*7 + 3].valueOf();
					road.target  = roadInfo[i*7 + 4].valueOf();
					road.oneway = roadInfo[i*7 + 5].valueOf();
					road.building  = roadInfo[i*7 + 6].valueOf();

					road.name = hex2str(roadName[i]);
					road.highway = GetHighway(global_.web3Map.utils.hexToAscii(roadHighway[i]));
					if(road.highway == undefined){
						road.highway = "residential";
					}
					road.gtype = GetGtype(global_.web3Map.utils.hexToAscii(roadGtype[i]));
					
					road.path = new Array();

					//read path
					var path_num = parseInt(roadPath[pointer++],16);
					for(var j=0; j< path_num; j++){
						var temp = global_.web3Map.utils.hexToAscii(roadPath[pointer++]);
						road.path.push(temp);
					}
					road.sourceGeohash = road.path[0];
					road.targetGeohash = road.path[path_num - 1];
					roads.push(road);
				}
				// console.log("roads:",roads);
				count--;
				geohash = geohash.substring(0,4)+Base32[count];
				GetOneline(geohash,roads,count)
				// ChangeJSON(roads);

			}
			else{
				console.error(error);
			}
		});	
	}
}

function GetGtype(gtype){
	if(gtype.substring(0,5) == "Point"){
		return "Point";
	}
	else if(gtype.substring(0,10) == "LineString"){
		return "LineString";
	}
	else if(gtype.substring(0,12) == "MultiPolygon"){
		return "MultiPolygon";
	}
}

function ChangeJSON(roads){
	var init_data = [{"type":"FeatureCollection","totalFeatures":0,"features":[],"crs":null},{"crs":{"properties":{"name":"urn:ogc:def:crs:EPSG::4326"},"type":"name"},"features":[],"totalFeatures":0,"type":"FeatureCollection"}];
	// init_data = JSON.parse(init_data);
	// console.log(init_data);
	var roads_num = roads.length;
	for(var i = 0 ; i < roads_num ; i++){
		var tmp = [{"properties":{},"geometry":{"coordinates":[],"type":""},"type":"Feature"}];

		
		if(gidList.indexOf(roads[i].gid) === -1){
			gidList.push(roads[i].gid)
		}else{
			continue
		}

		// let startNode = roads[i].path[0].substring(0,11)
		// let endNode = roads[i].path[roads[i].path.length - 1].substring(0,11)

		// let obj = {
		// 	end: endNode,
		// 	cost: roads[i].cost,
		// 	attrs: roads[i].gid
		// };
		// // console.log("startNode", startNode)
		// if (adjacencyList[startNode]) {
		// 	adjacencyList[startNode].push(obj);
		// }
		// else {
		// 	adjacencyList[startNode] = [obj];
		// }
		tmp[0].properties.minzoom = roads[i].minzoom; 
		// tmp[0].properties.minzoom = 9; 
		tmp[0].properties.cost = roads[i].cost; 
		tmp[0].properties.source = roads[i].source; 
		tmp[0].properties.target = roads[i].target; 
		tmp[0].properties.sourceGeohash = roads[i].sourceGeohash; 
		tmp[0].properties.targetGeohash = roads[i].targetGeohash; 
		tmp[0].properties.name = roads[i].name;
		if(roads[i].oneway == 1){
			tmp[0].properties.oneway = "yes";
		}
		if(roads[i].building == 1){
			tmp[0].properties.building = "yes";
		}
		// geohashTile对于部分类型不能显示，造成前端爆炸
		tmp[0].properties.highway = roads[i].highway; 
		// tmp[0].properties.highway = "residential"; 

		var path = [];
		for(var j = 0 ; j < roads[i].path.length ; j++){
			if(roads[i].gtype == "MultiPolygon"){
				path.push(roads[i].path[j].substring(0,11));
			}
			else
				tmp[0].geometry.coordinates.push(roads[i].path[j].substring(0,11));
		}
		// console.log("path",path);
		if(roads[i].gtype == "MultiPolygon"){
			tmp[0].geometry.coordinates.push(path);
		}
		tmp[0].geometry.type = roads[i].gtype;
		init_data[1].features.push(tmp[0]);
	}

	init_data[1].totalFeatures = init_data[1].features.length;
	// console.log(init_data);
	map_data = 	JSON.stringify(init_data);
	map_data =  JSON.parse(map_data);
	 console.log(map_data);
	 return map_data;
//	update_map(global_.map);
}
export  {
	getRoads
}

