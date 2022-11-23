//记录十字路口
// let adjacencyList = {}
//记录gid用来去重
let gidList = []

function getRoads(geohash) {
	// console.log("getRoads");
	// console.log(web3Map.utils.asciiToHex('test'));
    if(geohash.length == 3){
        GetOneline3(geohash);
    }else if(geohash.length == 4){
        GetOneline4(geohash);
    }else if(geohash.length == 5){
        GetOneline5(geohash);
    }
}

async function GetOneline3(geohash){
    let roads = [];
    for(let i = 0; i < 32; i++){
        let geohash1 = geohash + Base32[i];
        for(let j = 0; j < 32; j++){
            let geohash2 = geohash1 + Base32[j];
            console.log(geohash2)
            await getTypes(geohash2, roads);
        }
    }
    console.log("roads:",roads);
    ChangeJSON(roads);
}

async function GetOneline4(geohash){
    let roads = [];
    for(let i = 0; i < 32; i++){
        let geohash1 = geohash + Base32[i];
        console.log(geohash1)
        await getTypes(geohash1, roads);
    }
    console.log("roads:",roads);
    ChangeJSON(roads);
}

async function GetOneline5(geohash){
    let roads = [];
    console.log(geohash)
    await getTypes(geohash, roads);
    console.log("roads:",roads);
    ChangeJSON(roads);
}


async function getTypes(geohash, roads){
    await mapContract.methods.get_types(web3Map.utils.asciiToHex(geohash)).call(function(error,result){
        // if(geohash == "wx4er") console.log("get_types:", result);
        if(!error){
            var roadInfo  = result[0];
            var roadName  = result[1];
            var roadHighway = result[2];
            var roadGtype  = result[3];
            var roadPath  = result[4];

            var pointer = 0;
            for (var i = 0; i < roadName.length; i++){
                console.log("roadinfoCost: ", roadInfo[i*7 + 2]);
                var road = new Object();
                road.gid = roadInfo[i*7].valueOf();
                road.minzoom  = roadInfo[i*7+ 1].valueOf();
                road.cost  = roadInfo[i*7 + 2].valueOf();
                road.source  = roadInfo[i*7 + 3].valueOf();
                road.target  = roadInfo[i*7 + 4].valueOf();
                road.oneway = roadInfo[i*7 + 5].valueOf();
                road.building  = roadInfo[i*7 + 6].valueOf();

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
                road.sourceGeohash = road.path[0];
                road.targetGeohash = road.path[path_num - 1];
                roads.push(road);
            }
        }
        else{
            console.error(error);
        }
    });	
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
	// console.log(map_data);
	update_map();
}

