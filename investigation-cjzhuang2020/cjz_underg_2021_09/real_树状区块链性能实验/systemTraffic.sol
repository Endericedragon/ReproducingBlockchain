pragma solidity ^0.5.16;

contract StoreTraffic{

    uint256 deltaLat10 = 596496069;
    uint256[] deltaLon10 = [1191555127, 1180079800,1157239659,1123254668,1078452120,1023263489,958220271,883948868,801164554,710664587,613320532,510069865,401906947,289873444,175048303,58537350];
    uint256 deltaLat9 = 4771968552;
    uint256[] deltaLon9 = [4766220508,4720319200,4628958636,4493018672,4313808480,4093053956,3832881084,3535795472,3204658216,2842658348,1607627788,1159493776,700193212,234149400];
    uint256 deltaLat8 = 19087874208;
    uint256[] deltaLon8 = [38129764064,37762553600,37031669088,35944149376,34510467840,32744431648,30663048672,28286363776,25637265728,22741266784,19626257024,16322235680,12861022304,9275950208,5601545696,1873195200];
    uint256 deltaLat7 = 152702993664;
    uint256[] deltaLon7 = [152519056256,151050214400,148126676352,143776597504,138041871360,130977726592,122652194688,113145455104,102549062912,90965067136,78505028096,65288942720,51444089216,37103800832,22406182784,7492780800];

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
    bytes32[] vehicleIdList;
    mapping(bytes32 => uint256) vehicleIdToIndexList;

    mapping(uint256 => bytes32) vehiclesList;
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
        if(vehicles[vehicleId].vehicleId == 0x0000000000000000000000000000000000000000000000000000000000000000){
            vehicles[vehicleId].vehicleId = vehicleId;
            vehicles[vehicleId].position = geohash;
            vehicles[vehicleId].status = 0;
            vehicleIdToIndexList[vehicleId] = vehicleIdList.length;
            vehicleIdList.push(vehicleId);
        }else{
            vehicles[vehicleId].vehicleId = vehicleId;
            vehicles[vehicleId].position = geohash;
            vehicles[vehicleId].status = 0;
        }
    }

    function deleteVehicle(bytes32 vehicleId) public {
        if(vehicleId == vehicles[vehicleId].vehicleId){
            uint256 index = vehicleIdToIndexList[vehicleId];
            vehicleIdToIndexList[vehicleIdList[vehicleIdList.length - 1]] = index;
            vehicleIdList[index] = vehicleIdList[vehicleIdList.length - 1];
            vehicleIdList.pop();
            delete vehicles[vehicleId];
            delete vehicleIdToIndexList[vehicleId];
        }
    }

    function setVehicle(bytes32 vehicleId, bytes32 vehicleGeohash) public {
        vehicles[vehicleId].position = vehicleGeohash;
    }

    function getVehicle(bytes32 passengerGeohash) public view returns (bytes32, bytes32, uint256){
        uint256 u1 = gasleft();
        bytes32 position;
        uint256 index;
        for(uint256 i = 0; i < vehicleIdList.length; i++){
            if(manhattan(passengerGeohash,vehicles[vehicleIdList[i]].position) < manhattan(passengerGeohash,position)){
                if(vehicles[vehicleIdList[i]].status == 0){
                    position = vehicles[vehicleIdList[i]].position;
                    index = i;
                }
            }
        }
        uint256 u2 = u1 - gasleft();
        return (position,vehicleIdList[index], u2);
    }

    function getVehicleByRegion(bytes32 passengerGeohash, bytes32[] memory regionVehicles) public view returns (bytes32, bytes32, uint256){
        uint256 u1 = gasleft();
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
        uint256 u2 = u1 - gasleft();
        return (position,regionVehicles[index], u2);
    }

    function getVehicleStatus(bytes32 vehicleId) public view returns (int32){
        int32 status = int32(vehicles[vehicleId].status);
        return status;
    }
    function getVehicleId(bytes32 vehicleId) public view returns (bytes32){
        bytes32 id = vehicles[vehicleId].vehicleId;
        return id;
    }
    function getVehicleIdList()public view returns (bytes32[] memory){
        return vehicleIdList;
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
        bytes32 start;
        bytes32 end;
        uint256 status;
    }

    mapping(bytes32 => passenger) passengers;

    mapping(uint256 => bytes32) passengersList;
    uint256 passengersLength = 0;

    function initPassenger(
        bytes32 passengerId,
        bytes32 start,
        bytes32 end
    ) public {
        passengers[passengerId].start = start;
        passengers[passengerId].end = end;
        passengers[passengerId].status = 0;
        passengersList[passengersLength] = passengerId;
        passengersLength = passengersLength + 1;
    }

    
    function setPassengerDemand(
        bytes32 passengerId,
        bytes32 startGeohash,
        bytes32 endGeohash
    ) public {
        passengers[passengerId].start = startGeohash;
        passengers[passengerId].end = endGeohash;
    }


    function getPassengerEnd(bytes32 passengerId) public view returns (bytes32 end){
        end = passengers[passengerId].end;
    }

    function manhattan(bytes32 nextGeohash, bytes32 endGeohash) public view returns (uint256){
        if(nextGeohash == endGeohash){
            return 0;
        }
        //数该长度下的geohash对应的格子数
        
        //前缀匹配优化速度
        string memory shortNext;
        string memory shortEnd;
        bool flag;
        
        (shortNext, shortEnd,flag) = sliceGeoHash(nextGeohash, endGeohash);

        uint256 dislat1 = getLatBlock(shortNext);
        uint256 dislat2 = getLatBlock(shortEnd);
        uint256 dislon1 = getLonBlock(shortNext);
        uint256 dislon2 = getLonBlock(shortEnd);
        
        uint256 dislat;
        uint256 dislon;

        uint256 deltaLat = getLatDelta();
        uint256 deltaLon = getLonDelta(nextGeohash);
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
        if(flag == true){//前缀相同的位数有奇数个，经纬度的解码发生了颠倒
            return (dislon*deltaLat + dislat*deltaLon);
        }else{
            return (dislat*deltaLat + dislon*deltaLon);
        }
    }
    
    //前缀匹配，geohash精度调整范围是7、8、9、10
    uint256 PRECISION = 10;
    function changePrecision(uint256 newPrecision) public returns (uint256){
        PRECISION = newPrecision;
        return PRECISION;
    }
    function sliceGeoHash(bytes32 geohash1, bytes32 geohash2) public view returns (string memory, string memory, bool){
        bytes32 geo1 = geohash1;
        bytes32 geo2 = geohash2;
        uint256 len = geo1.length;
        //geohash different start index
        uint256 index;
        bool flag;
        //geohash different length
        uint256 dif = 0;
        for (index = 0; index < len; index++) {
            if (geo1[index] != geo2[index]) {
                break;
            }
        }
        if(index % 2 == 1){
            flag = true;
        }else{
            flag = false;
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
        return (string(shortGeo1), string(shortGeo2), flag);
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
                if (!even) {
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
                if (even) {
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
    uint256 divnum = 4;
    function getLonDelta(bytes32 geohash) public view returns (uint256){
        uint256 index = 0;
        bytes memory geo = new bytes(2);
        for (uint256 i = 0; i < 2; i++) {
            geo[index] = geohash[i];
            index++;
        }
        uint256 lat = getLatBlock(string(geo));
        // lat = lat >> (PRECISION * 5 / 2 - (divnum + 1));
        if ((lat & (1 << divnum)) != (1 << divnum)) {
            lat = (1 << (divnum + 1) - 1) - lat;
        }
        lat = lat - (1 << divnum);
        if(PRECISION == 7){
            return deltaLon7[lat];
        }else if(PRECISION == 8){
            return deltaLon8[lat];
        }else if(PRECISION == 9){
            return deltaLon9[lat];
        }else if(PRECISION == 10){
            return deltaLon10[lat];
        }
        return lat;
    }
    function getLatDelta() public view returns (uint256){
        if(PRECISION == 7){
            return deltaLat7;
        }else if(PRECISION == 8){
            return deltaLat8;
        }else if(PRECISION == 9){
            return deltaLat9;
        }else if(PRECISION == 10){
            return deltaLat10;
        }
    }
}
