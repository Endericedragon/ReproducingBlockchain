pragma solidity ^0.5.16;

contract StoreMap{
	// 存储地图信息
	struct one_type
	{	
		int32 minzoom;
		int32 cost;
		bool  oneway;
		bool  building;
		bytes32 highway;
		bytes32 name;   //名称 
		int32 source;
		int32 target;
		bytes32 gtype;
		uint256 path_num;
		mapping(uint256 => bytes32) path;
	}
	//gid->one_type,store real types
	mapping(uint256 => one_type) types;
	// 区域道路结构体,用于存储区域内的道路信息
	struct  area_types{
		uint256 num;
		// num->gid,store gids of roads in the area
		mapping(uint256 => uint256) types_list;
	}
	// 对称
	mapping(bytes32 => area_types) public geo_maps;

	//-----------------cjz--------------------------------------------------
	//每个邻居节点的结构
	struct adj
	{	
		bytes32 sourceGeohash;
		bytes32 targetGeohash;
		int32 target;
		int32 cost;
		int32 gid;
	}
	//遍历邻居列表能够找到所有邻居
	struct adj_types{
		uint256 adjnum;
		mapping (uint256 => adj) adjs;
	}
	//通过路口geohash找到其邻居列表
	mapping(bytes32 => adj_types) public adjacencyList;

	//参数P
	uint256 P = 1;

	struct pathType{
		uint256 num;
		mapping(uint256 => bytes32) index;
		mapping(bytes32 => bytes32) map;
	}
	struct costSofarType{
		uint256 num;
		mapping(uint256 => bytes32) index;
		mapping(bytes32 => uint256) map;
	}
	//记录每个节点的父节点
	pathType paths;
	//记录起点到当前节点的实际费用
	costSofarType costSofar;
	//-----------------cjz--------------------------------------------------
	


	// 获取对应geohash区域内所有道路信息
	function get_types(bytes32 hash) view public returns (int32[] memory feature, bytes32[] memory names, bytes32[] memory highways, bytes32[] memory gtypes, bytes32[] memory path) {
		uint256 num = geo_maps[hash].num;
		uint256 path_num = 0;
		//different parm in different domain may cause duplicate declare error when compile, maybe a bug
		uint256 i;

		if(num > 0){
			feature = new int32[](7 * num);
			names = new bytes32[]( num );
			highways = new bytes32[]( num );
			gtypes = new bytes32[]( num );
			uint256 gid;
			for(i=0; i < num; i++){
				gid = geo_maps[hash].types_list[i]; 
				one_type storage single_type = types[gid];
				uint256 base = i * 7;
				feature[base] = int32(gid);
				feature[base + 1] = single_type.minzoom;
				feature[base + 2] = single_type.cost;
				feature[base + 3] = single_type.source;
				feature[base + 4] = single_type.target;
				if(single_type.oneway){
					feature[base + 5] = 1;
				}
				else{
					feature[base + 5] = 0;
				}
				if(single_type.building){
					feature[base + 6] = 1;
				}
				else{
					feature[base + 6] = 0;
				}
				path_num = path_num + 1 + single_type.path_num;
				names[i] = single_type.name;
				highways[i] = single_type.highway;
				gtypes[i] = single_type.gtype;
			}
			path = new bytes32[](path_num);
			uint256 pos = 0;
			for(i=0; i< num; i++){
				gid = geo_maps[hash].types_list[i];
				//may cause duplicate declare, don't know why
				one_type storage single_type2 = types[gid];
				path[pos++] = bytes32(single_type2.path_num);
				for(uint256 j=0; j< single_type2.path_num; j++){
					path[pos++] = single_type2.path[j];
				}
			}
		}
	}

	// 添加一条
	function add_onetype(uint256 gid, int32 minzoom, int32 cost, int32 source, int32 target, bool oneway, bool building, bytes32 highway, bytes32 name, bytes32 gtype, bytes32[] memory path) public {
		types[gid].minzoom = minzoom;
		types[gid].cost = cost;
		types[gid].source = source;
		types[gid].target = target;
		types[gid].oneway = oneway;
		types[gid].building = building;
		types[gid].highway = highway;
		types[gid].name = name;
		types[gid].gtype = gtype;

		adjacencyList[path[0]].adjs[adjacencyList[path[0]].adjnum].sourceGeohash = path[0];
		adjacencyList[path[0]].adjs[adjacencyList[path[0]].adjnum].targetGeohash = path[path.length - 1];
		adjacencyList[path[0]].adjs[adjacencyList[path[0]].adjnum].target = target;
		adjacencyList[path[0]].adjs[adjacencyList[path[0]].adjnum].cost = cost;
		adjacencyList[path[0]].adjs[adjacencyList[path[0]].adjnum++].gid = int32(gid);

		uint256 num = types[gid].path_num;
		for(uint256 i=0; i< path.length; i++){
			types[gid].path[num++] = path[i];
		}
		types[gid].path_num = num;
	}

	//bind a line to an area 
	function add_area_line(bytes32 hash, uint256 gid) public {
		uint256 num = geo_maps[hash].num++;
		geo_maps[hash].types_list[num] = gid;
	}
	//astar算法主流程逻辑
	function astar(bytes32 startGeohash, bytes32 endGeohash) public returns(bytes32[] memory backwards, uint256 costAll){
		enqueue(startGeohash, 0);
		costSofar.map[startGeohash] = 0;
		costSofar.index[costSofar.num] = startGeohash;
		costSofar.num++;
		bytes32 currentGeohash;
		uint256 priority;
		while (frontier.geohashs.length > 1) {
			currentGeohash = top(); 
			//remove smallest item
			dequeue();
			adj_types storage adjNodes = adjacencyList[currentGeohash];
			if (currentGeohash == endGeohash) {
				costAll = costSofar.map[currentGeohash];
				//处理paths获得最短路径
				bytes32 current = endGeohash;
				backwards = new bytes32[](paths.num);
				uint256 i = 0;
				while(current != startGeohash){
					backwards[i] = current;
					current = paths.map[current];
					i++;
				}
				backwards[i] = startGeohash;
				//将结构体清空
				for(uint256 j = 0; j < paths.num; j++){
					delete paths.map[paths.index[j]];
					delete paths.index[j];
				}
				paths.num = 0;
				for(uint256 j = 0; j < costSofar.num; j++){
					delete costSofar.map[costSofar.index[j]];
					delete costSofar.index[j];
				}
				costSofar.num = 0;
				while (frontier.geohashs.length > 1){
					dequeue();
				}
				break;
			}

			for (uint256 i = 0; i < adjNodes.adjnum; i++) {
				uint256 newCost = costSofar.map[currentGeohash] + uint256(adjacencyList[currentGeohash].adjs[i].cost);
				if (costSofar.map[adjNodes.adjs[i].targetGeohash] == 0 || newCost < costSofar.map[adjNodes.adjs[i].targetGeohash]) {
					if(costSofar.map[adjNodes.adjs[i].targetGeohash] == 0){
						costSofar.index[costSofar.num] = adjNodes.adjs[i].targetGeohash;
						costSofar.num++;
					}
					costSofar.map[adjNodes.adjs[i].targetGeohash] = newCost;
					priority = newCost * P + manhattan(adjNodes.adjs[i].targetGeohash, endGeohash);
					enqueue(adjNodes.adjs[i].targetGeohash, priority);
					if(paths.map[adjNodes.adjs[i].targetGeohash] == 0x0000000000000000000000000000000000000000000000000000000000000000){
						paths.index[paths.num] = adjNodes.adjs[i].targetGeohash;
						paths.num++;
					}
					paths.map[adjNodes.adjs[i].targetGeohash] = currentGeohash;
				}
			}
		}
	}
	
	
	function manhattan(bytes32 nextGeohash, bytes32 endGeohash) public view returns (uint256){
		if(nextGeohash == endGeohash){
			return 0;
		}
		//数该长度下的geohash对应的格子数
		
		//前缀匹配优化速度
		string memory shortNext;
		string memory shortEnd;
		
		(shortNext, shortEnd) = sliceGeoHash(nextGeohash, endGeohash);

		uint256 dislat1 = getLatBlock(shortNext);
		uint256 dislat2 = getLatBlock(shortEnd);
		uint256 dislon1 = getLonBlock(shortNext);
		uint256 dislon2 = getLonBlock(shortEnd);
		
		uint256 dislat;
		uint256 dislon;
		if(dislat2 > dislat1){
			dislat = dislat2 - dislat1;
		}else{
			dislat = dislat1 - dislat2;
		}
		if(dislon2 > dislon1){
			dislon = dislon2 - dislon1;
		}else{
			dislon = dislon1 - dislon2;
		}
		return (dislat + dislon);
	}
	
	//前缀匹配，geohash精度调整为8
	uint256 PRECISION = 8;
	function changePrecision(uint256 newPrecision) public returns (uint256){
		PRECISION = newPrecision;
		return PRECISION;
	}
	function changeP(uint256 newP) public returns (uint256){
		P = newP;
		return P;
	}
	function sliceGeoHash(bytes32 geohash1, bytes32 geohash2) public view returns (string memory, string memory){
		bytes32 geo1 = geohash1;
		bytes32 geo2 = geohash2;
		uint256 len = geo1.length;
		//geohash different start index
		uint256 index;
		//geohash different length
		uint256 dif = 0;
		for (index = 0; index < len; index++) {
			if (geo1[index] != geo2[index]) {
				break;
			}
		}
		dif = PRECISION - index;
		uint256 index2 = 0;
		bytes memory shortGeo1 = new bytes(dif);
		bytes memory shortGeo2 = new bytes(dif);
		for (uint256 j = index; j < PRECISION; j++) {
			shortGeo1[index2] = geo1[j];
			shortGeo2[index2] = geo2[j];
			index2++;
		}
		return (string(shortGeo1), string(shortGeo2));
	}
	
	uint256[] Bits = [16, 8, 4, 2, 1];
	string Base32 = "0123456789bcdefghjkmnpqrstuvwxyz";
	//geohash在纬度上的块数
	function getLatBlock(string memory geohash) public view returns (uint256) {
		//geohash纬度
		bool even = true;
		uint256 lat = 0;
		for (uint256 i = 0; i < bytes(geohash).length; i++) {
			byte c = bytes(geohash)[i];
			uint256 cd;
			for (uint256 j = 0; j < bytes(Base32).length; j++) {
				if (bytes(Base32)[j] == c) {
					cd = j;
					break;
				}
			}
			for (uint256 j = 0; j < 5; j++) {
				uint256 mask = Bits[j];
				if (even) {
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
	//geohash在经度上的块数
	function getLonBlock(string memory geohash) public view returns (uint256) {
		//geohash经度
		bool even = true;
		uint256 lon = 0;
		for (uint256 i = 0; i < bytes(geohash).length; i++) {
			byte c = bytes(geohash)[i];
			uint256 cd;
			for (uint256 j = 0; j < bytes(Base32).length; j++) {
				if (bytes(Base32)[j] == c) {
					cd = j;
					break;
				}
			}
			for (uint256 j = 0; j < 5; j++) {
				uint256 mask = Bits[j];
				if (!even) {
					lon = lon * 2;
					if ((cd & mask) != 0) {
						lon = lon + 1;
					}
				}
				even = !even;
			}
		}
		return lon;
	}
	
	//实现优先队列
	struct Heap {
		bytes32[] geohashs;
		mapping(bytes32 => uint256) map;
	}
	//唯一实例
	Heap frontier;
	//判断是否为空
	modifier notEmpty() {
		require(frontier.geohashs.length > 1);
		_;
	}
	//获得头元素
	function top() public view notEmpty() returns(bytes32) {
		return frontier.geohashs[1];
	}
	//出队（直接删除无返回值）
	function dequeue() public notEmpty(){
		require(frontier.geohashs.length > 1);
		
		bytes32 toReturn = top();
		frontier.geohashs[1] = frontier.geohashs[frontier.geohashs.length - 1];
		frontier.geohashs.pop();

		uint256 i = 1;

		while (i * 2 < frontier.geohashs.length) {
			uint256 j = i * 2;

			if (j + 1 < frontier.geohashs.length)
				if (frontier.map[frontier.geohashs[j]] > frontier.map[frontier.geohashs[j + 1]]) 
					j++;
			
			if (frontier.map[frontier.geohashs[i]] < frontier.map[frontier.geohashs[j]])
				break;
			
			(frontier.geohashs[i], frontier.geohashs[j]) = (frontier.geohashs[j], frontier.geohashs[i]);
			i = j;
		}
		delete frontier.map[toReturn];
	}
	//入队
	function enqueue(bytes32 geohash, uint256 cost) public {
		if (frontier.geohashs.length == 0) 
			// initialize
			frontier.geohashs.push(0x0000000000000000000000000000000000000000000000000000000000000000); 
		
		frontier.geohashs.push(geohash);
		frontier.map[geohash] = cost;
		uint256 i = frontier.geohashs.length - 1;
		while (i > 1 && frontier.map[frontier.geohashs[i / 2]] > frontier.map[frontier.geohashs[i]]) {
			(frontier.geohashs[i / 2], frontier.geohashs[i]) = (geohash, frontier.geohashs[i / 2]);
			i /= 2;
		}
	}
}

