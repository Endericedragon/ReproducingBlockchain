pragma solidity ^0.5.16;

contract calDistance{

	//参数P
	uint256 P = 1;
	
	function manhattan(bytes32 nextGeohash, bytes32 endGeohash) public view returns (uint256, uint256, uint256){
        uint256 u0 = gasleft();
		if(nextGeohash == endGeohash){
			return (0, 0, 0);
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
        uint256 u1 = gasleft();
        uint256 diff = u0 - u1;
		return (dislat, dislon, diff);
	}

    
	
	//前缀匹配，geohash精度调整为10
	uint256 PRECISION = 10;
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

