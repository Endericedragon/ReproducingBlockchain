pragma solidity ^0.5.16;

contract StoreTraffic{

		//乘客支付后触发支付监听通知车辆
		event payEvent(
			bytes32 vehicleId
		);
		function confirmPay(bytes32 vehicleId) public {
			emit payEvent(vehicleId);
		}

        //乘客获取导航结果后确认上车
		event boardEvent(
			bytes32 vehicleId
		);
		function confirmBoard(bytes32 vehicleId) public {
			emit boardEvent(vehicleId);
		}

    //导航结果的数据结构
		struct oneRoute{
			bytes32[] routeCoords;
			uint256 routeCost;
		}
		//存储导航结果，车辆id->导航结果
		mapping (bytes32 => oneRoute) routes;

    event routeEvent(
        bytes32 passengerId
    );
    function storeRoutes(uint256 cost, bytes32 vehicleId, bytes32 passengerId, bytes32[] memory route) public {
        routes[vehicleId].routeCoords = route;
				routes[vehicleId].routeCost = cost;
        emit routeEvent(passengerId);
    }
    function getRoutes(bytes32 vehicleId) public view returns(bytes32[] memory route, uint256 cost){
        route = routes[vehicleId].routeCoords;
				cost = routes[vehicleId].routeCost;
    }

    //存储车辆信息
    struct vehicle {
        bytes32 vehicleId;
        bytes32 position;
        uint256 status;
    }

    mapping(bytes32 => vehicle) vehicles;

    mapping(uint256 => bytes32) vehiclesList;
    uint256 vehiclesLength = 0;
    //乘客修改车辆的状态时触发的事件
    event Myevent(
        bytes32 vehicleId,
        bytes32 passengerId,
        bytes32 passengerGeohash
    );
    function initVehicle(
        bytes32 vehicleId,
        bytes32 geohash
    ) public {
        vehicles[vehicleId].vehicleId = vehicleId;
        vehicles[vehicleId].position = geohash;
        vehicles[vehicleId].status = 0;
        vehiclesList[vehiclesLength] = vehicleId;
        vehiclesLength = vehiclesLength + 1;
    }

    function deleteVehicle(bytes32 vehicleId) public {
        if(vehicleId == vehicles[vehicleId].vehicleId){
            delete vehicles[vehicleId];
            vehiclesLength = vehiclesLength - 1;
        }
    }

    function setVehicle(bytes32 vehicleId, bytes32 vehicleGeohash) public {
        vehicles[vehicleId].position = vehicleGeohash;
    }

    function getVehicle(bytes32 passengerGeohash) public view returns (bytes32, bytes32){
        bytes32 position;
        uint256 index;
        for(uint256 i = 0; i < vehiclesLength; i++){
            if(manhattan(passengerGeohash,vehicles[vehiclesList[i]].position) < manhattan(passengerGeohash,position)){
                if(vehicles[vehiclesList[i]].status == 0){
                    position = vehicles[vehiclesList[i]].position;
                    index = i;
                }
            }
        }
        return (position,vehiclesList[index]);
    }

    function getVehicleByRegion(bytes32 passengerGeohash, bytes32[] memory regionVehicles) public view returns (bytes32, bytes32){
        bytes32 position;
        uint256 index;
        for(uint256 i = 0; i < regionVehicles.length; i++){
            if(manhattan(passengerGeohash,vehicles[regionVehicles[i]].position) < manhattan(passengerGeohash,position)){
                if(vehicles[regionVehicles[i]].status == 0){
                    position = vehicles[regionVehicles[i]].position;
                    index = i;
                }
            }
        }
        return (position,regionVehicles[index]);
    }

    function getVehicleStatus(bytes32 vehicleId) public view returns (int32){
        int32 status = int32(vehicles[vehicleId].status);
        return status;
    }

    function setVehicleStatus(bytes32 vehicleId, bytes32 passengerId, bytes32 passengerGeohash) public {
        assert(vehicles[vehicleId].status == 0);
        emit Myevent(
            vehicleId,
            passengerId,
            passengerGeohash
        );
        vehicles[vehicleId].status = 1;
    }
		function setVehicleStatusEmpty(bytes32 vehicleId) public {
        assert(vehicles[vehicleId].status == 1);
        vehicles[vehicleId].status = 0;
    }

    //车辆拒绝接客
    event rejectEvent(
        bytes32 passengerId
    );
    function setRejectVehicleStatus(bytes32 vehicleId, bytes32 passengerId) public {
        vehicles[vehicleId].status = 0;
        emit rejectEvent(passengerId);
    }

    //存储乘客信息
    struct passenger {
        bytes32 passengerId;
        bytes32 position;
        bytes32 start;
        bytes32 end;
        uint256 status;
    }

    mapping(bytes32 => passenger) passengers;

    mapping(uint256 => bytes32) passengersList;
    uint256 passengersLength = 0;

    function initPassenger(
        bytes32 passengerId,
        bytes32 geohash
    ) public {
        passengers[passengerId].position = geohash;
        passengers[passengerId].status = 0;
        passengersList[passengersLength] = passengerId;
        passengersLength = passengersLength + 1;
    }

    function setPassengerPosition(
        bytes32 passengerId,
        bytes32 passengerGeohash
    ) public {
        passengers[passengerId].position = passengerGeohash;
    }
    
    function setPassengerDemand(
        bytes32 passengerId,
        bytes32 startGeohash,
        bytes32 endGeohash
    ) public {
        passengers[passengerId].start = startGeohash;
        passengers[passengerId].end = endGeohash;
    }

    function getPassengerPos(bytes32 passengerId) public view returns (bytes32 position){
        position = passengers[passengerId].position;
    }

    function getPassengerEnd(bytes32 passengerId) public returns (bytes32 end){
        end = passengers[passengerId].end;
        passengers[passengerId].status = 1;
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
}

