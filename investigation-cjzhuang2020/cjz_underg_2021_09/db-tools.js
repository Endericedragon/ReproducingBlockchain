function getRoads(geohash) {
	// console.log("getRoads");
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
		mapContract.methods.get_types(web3Map.utils.asciiToHex(geohash)).call(function(error,result){
		if(!error){
			var roadInfo  = result[0];
			var roadName  = result[1];
			var roadHighway = result[2];
			var roadGtype  = result[3];
			var roadPath  = result[4];

			var pointer = 0;
			for (var i = 0; i < roadName.length; i++){
				var road = new Object();
				road.gid = roadInfo[i*4].valueOf();
				road.minzoom  = roadInfo[i*4 + 1].valueOf();
				road.oneway = roadInfo[i*4 + 2].valueOf();
				road.building  = roadInfo[i*4 + 3].valueOf();

				road.name = hex2str(roadName[i]);
				road.highway = GetHighway(web3Map.utils.hexToAscii(roadHighway[i]));
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
				roads.push(road);
			}
			console.log("roads:",roads);
			ChangeJSON(roads);
		}
		else{
			console.error(error);
		}
		});	
	}
	else{
		mapContract.methods.get_types(web3Map.utils.asciiToHex(geohash)).call(function(error,result){
		if(!error){
			var roadInfo  = result[0];
			var roadName  = result[1];
			var roadHighway = result[2];
			var roadGtype  = result[3];
			var roadPath  = result[4];

			var pointer = 0;
			for (var i = 0; i < roadName.length; i++){
				var road = new Object();
				road.gid = roadInfo[i*4].valueOf();
				road.minzoom  = roadInfo[i*4 + 1].valueOf();
				road.oneway = roadInfo[i*4 + 2].valueOf();
				road.building  = roadInfo[i*4 + 3].valueOf();

				road.name = hex2str(roadName[i]);
				road.highway = GetHighway(web3Map.utils.hexToAscii(roadHighway[i]));
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

function GetHighway(highway){
	if(highway.substring(0,15) == "traffic_signals"){
		return "traffic_signals";
	}
	else if(highway.substring(0,8) == "crossing"){
		return "crossing";
	}
	else if(highway.substring(0,8) == "bus_stop"){
		return "bus_stop";
	}	
	else if(highway.substring(0,17) == "motorway_junction"){
		return "motorway_junction";
	}
	else if(highway.substring(0,7) =="primary"){
		return "primary";
	}
	else if(highway.substring(0,9) == "secondary"){
		return "secondary";
	}
	else if(highway.substring(0,8) == "tertiary"){
		return "tertiary";
	}
	else if(highway.substring(0,11) == "residential"){
		return "residential";
	}
	else if(highway.substring(0,5) == "trunk"){
		return "trunk";
	}
	else if(highway.substring(0,7) == "service"){
		return "service";
	}
	else if(highway.substring(0,12) == "unclassified"){
		return "unclassified";
	}
	else if(highway.substring(0,14) == "secondary_link"){
		return "secondary_link";
	}
	else if(highway.substring(0,10) == "pedestrian"){
		return "pedestrian";
	}
	else if(highway.substring(0,7) == "footway"){
		return "footway";
	}
	else if(highway.substring(0,13) == "motorway_link"){
		return "motorway_link";
	}
	else if(highway.substring(0,8) == "platform"){
		return "platform";
	}
	else if(highway.substring(0,14) == "turning_circle"){
		return "turning_circle";
	}
	else if(highway.substring(0,11) == "street_lamp"){
		return "street_lamp";
	}
	else if(highway.substring(0,9) == "milestone"){
		return "milestone";
	}
	else if(highway.substring(0,9) == "rest_area"){
		return "rest_area";
	}
	else if(highway.substring(0,8) == "elevator"){
		return "elevator";
	}
	else if(highway.substring(0,12) == "speed_camera"){
		return "speed_camera";
	}
	else if(highway.substring(0,8) == "services"){
		return "services";
	}
	else if(highway.substring(0,12) == "turning_loop"){
		return "turning_loop";
	}
	else if(highway.substring(0,5) == "steps"){
		return "steps";
	}
	else if(highway.substring(0,10) == "trunk_link"){
		return "trunk_link";
	}
	else if(highway.substring(0,12) == "primary_link"){
		return "primary_link";
	}
	else if(highway.substring(0,13) == "tertiary_link"){
		return "tertiary_link";
	}
	else if(highway.substring(0,8) == "cycleway"){
		return "cycleway";
	}
	else if(highway.substring(0,8) == "motorway"){
		return "motorway";
	}
	else if(highway.substring(0,5) == "track"){
		return "track";
	}
	else if(highway.substring(0,4) == "path"){
		return "path";
	}
	else if(highway.substring(0,13) == "living_street"){
		return "living_street";
	}
	else if(highway.substring(0,12) == "construction"){
		return "construction";
	}
	else if(highway.substring(0,4) == "road"){
		return "road";
	}
	else if(highway.substring(0,2) == "no"){
		return "no";
	}
	else if(highway.substring(0,8) == "proposed"){
		return "proposed";
	}
	else if(highway.substring(0,7) == "disused"){
		return "disused";
	}
	else if(highway.substring(0,9) == "bridleway"){
		return "bridleway";
	}
	else if(highway.substring(0,7) == "raceway"){
		return "raceway";
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

		tmp[0].properties.minzoom = roads[i].minzoom; 
		// tmp[0].properties.minzoom = 9; 
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
	// console.log(map_data);
	update_map();
}