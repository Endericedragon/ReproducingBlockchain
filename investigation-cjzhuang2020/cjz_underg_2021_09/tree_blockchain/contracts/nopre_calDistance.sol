	pragma solidity ^0.5.16;

	contract StoreMap{
		
		//-----------------cjz--------------------------------------------------
        uint256 deltaLat10 = 596496069;
        uint256[] deltaLon10 = [1191555127, 1180079800,1157239659,1123254668,1078452120,1023263489,958220271,883948868,801164554,710664587,613320532,510069865,401906947,289873444,175048303,58537350];
        uint256 deltaLat9 = 4771968552;
        uint256[] deltaLon9 = [4766220508,4720319200,4628958636,4493018672,4313808480,4093053956,3832881084,3535795472,3204658216,2842658348,1607627788,1159493776,700193212,234149400];
        uint256 deltaLat8 = 19087874208;
        uint256[] deltaLon8 = [38129764064,37762553600,37031669088,35944149376,34510467840,32744431648,30663048672,28286363776,25637265728,22741266784,19626257024,16322235680,12861022304,9275950208,5601545696,1873195200];
        uint256 deltaLat7 = 152702993664;
        uint256[] deltaLon7 = [152519056256,151050214400,148126676352,143776597504,138041871360,130977726592,122652194688,113145455104,102549062912,90965067136,78505028096,65288942720,51444089216,37103800832,22406182784,7492780800];
		
		
		function manhattan(bytes32 nextGeohash, bytes32 endGeohash) public view returns (uint256){
            if(nextGeohash == endGeohash){
                return 0;
            }
            //数该长度下的geohash对应的格子数

            string memory tenNext;
		    string memory tenEnd;
		
		    (tenNext, tenEnd) = formatGeoHash(nextGeohash, endGeohash);

            uint256 dislat1 = getLatBlock(tenNext);
            uint256 dislat2 = getLatBlock(tenEnd);
            uint256 dislon1 = getLonBlock(tenNext);
            uint256 dislon2 = getLonBlock(tenEnd);
            
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
            return (dislat*deltaLat + dislon*deltaLon);
        }

        function formatGeoHash(bytes32 geohash1, bytes32 geohash2) public pure returns (string memory, string memory){
            uint256 index = 0;
            bytes memory tenGeo1 = new bytes(10);
            bytes memory tenGeo2 = new bytes(10);
            for (uint256 i = 0; i < 10; i++) {
                tenGeo1[index] = geohash1[i];
                tenGeo2[index] = geohash2[i];
                index++;
            }
            return (string(tenGeo1), string(tenGeo2));
        }
		
		//前缀匹配，geohash精度调整为10
		uint256 PRECISION = 10;
		function changePrecision(uint256 newPrecision) public returns (uint256){
			PRECISION = newPrecision;
			return PRECISION;
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