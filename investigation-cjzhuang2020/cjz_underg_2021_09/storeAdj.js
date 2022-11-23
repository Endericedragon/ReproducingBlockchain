let adjacencyList = {};
function storeAdj(maps){
    let road_json=maps;
    //console.log("road_json:"+road_json);
    let path_strings = road_json.RECORDS;
    for(let i = 0; i < path_strings.length; i++){
        let path_string = JSON.parse(path_strings[i].row_to_json);
        // console.log('path_string', path_string);
        let cursource = path_string.source;
        let curtarget = path_string.target;
        let sourceGeohash = inputs(path_string.x1, path_string.y1)
        let targetGeohash = inputs(path_string.x2, path_string.y2)
        let obj = {
            sourceGeohash: sourceGeohash,
            targetGeohash: targetGeohash,
            target: curtarget,
            cost: path_string.cost,
            gid: path_string.gid
        };
        if (adjacencyList[cursource]) {
            adjacencyList[cursource].push(obj);
        }
        else {
            adjacencyList[cursource] = [obj];
        }
        console.log("store gid: ", path_string.gid)
        if(i == path_strings.length - 1){
            console.log("storeAdj ok!")
        }
    }
}


function inputs(longitude, latitude){
	var cur_geohash = encode_geohash(longitude, latitude);
	return cur_geohash;
}

function encode_geohash(longitude, latitude){
    let precision = 11;
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