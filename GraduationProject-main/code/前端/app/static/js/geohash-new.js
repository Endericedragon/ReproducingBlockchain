var precision;
var Bits = [16, 8, 4, 2, 1];
var Base32 = "0123456789bcdefghjkmnpqrstuvwxyz".split("");

function encode_geohash(longitude, latitude,z){
	var geohash = "";
	var even = true;
	var bit = 0;
	var ch = 0;
	var pos = 0;
  var lat = [-90,90];
	var lon = [-180,180];
	//增加根据缩放等级z的geohash编码长度判断
	switch(true){
		case z <=5:
		{
			precision = 2;
			break;	
		}
		case z>=6 && z<=9:
		{
			precision = 4;
			break;
		}
		case z>=10 && z<=13:
		{
			precision = 5;
			break;
		}
		case z>=14 && z<=16:
		{
			precision = 6;
			break;
		}
		case z>=17 && z<=18:
		{
			precision = 7;
			break;
		}
		default:
		{
			precision = 10;
			break;
		}
	
	}
	
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

function decode_geohash(geohash)
{
	var even = true;
    var lat = [-90,90];
	var lon = [-180,180];

	for(var i=0; i< geohash.length; i++)
	{
		var c= geohash[i];
		var cd = Base32.indexOf(c);
		for (var j = 0; j < 5; j++)
		{
			var mask = Bits[j];
			if (even)
			{
				RefineInterval(lon, cd, mask);
			}
			else
			{
				RefineInterval(lat, cd, mask);
			}
			even = !even;
		}
	}

	return new Array(lon[0], lon[1], lat[0], lat[1]);
}

//decode geohash array to coord array
function decode_geohashs(geohashs){
	var even = true;
  var lat = [-90,90];
	var lon = [-180,180];
	var tmpg,tlon,tlat,curcoord = [];
	var coords = new Array();
	var coords0= new Array();
	var geohashs0 = geohashs[0];
	for(var k = 0;k<geohashs0.length;k++){
		tmpg = geohashs0[k];
		for(var i=0; i< tmpg.length; i++)
			{
				var c= tmpg[i];
				var cd = Base32.indexOf(c);
				for (var j = 0; j < 5; j++)
				{
					var mask = Bits[j];
					if (even)
					{
						RefineInterval(lon, cd, mask);
					}
					else
					{
						RefineInterval(lat, cd, mask);
					}
					even = !even;
				}
			}
		tlon = (lon[0]+lon[1])/2;
		tlat = (lat[0]+lat[1])/2;
		//保留7位小数并四舍五入
		tlon = (Math.round(tlon*10000000)/10000000).toFixed(7);
		tlat = (Math.round(tlat*10000000)/10000000).toFixed(7);
		curcoord = [tlon,tlat];
		coords.push(curcoord);
		even = true;
		lat = [-90,90];
	  lon = [-180,180];
	}	
	coords0.push(coords);
	return coords0;
}

//decode of Linestring
function decode_geohashsLine(geohashs){
	var even = true;
  var lat = [-90,90];
	var lon = [-180,180];
	var tmpg,tlon,tlat,curcoord = [];
	var coords = new Array();
	var coords0= new Array();
	var geohashs0 = geohashs;
	for(var k = 0;k<geohashs0.length;k++){
		tmpg = geohashs0[k];
		for(var i=0; i< tmpg.length; i++)
			{
				var c= tmpg[i];
				var cd = Base32.indexOf(c);
				for (var j = 0; j < 5; j++)
				{
					var mask = Bits[j];
					if (even)
					{
						RefineInterval(lon, cd, mask);
					}
					else
					{
						RefineInterval(lat, cd, mask);
					}
					even = !even;
				}
			}
		tlon = (lon[0]+lon[1])/2;
		tlat = (lat[0]+lat[1])/2;
		//保留7位小数并四舍五入
		tlon = (Math.round(tlon*10000000)/10000000).toFixed(7);
		tlat = (Math.round(tlat*10000000)/10000000).toFixed(7);
		curcoord = [tlon,tlat];
		coords.push(curcoord);
		even = true;
		lat = [-90,90];
	  lon = [-180,180];
	}	
	//coords0.push(coords);
	return coords;
}

function has_intersection_linestring(path, bound){
	for(var i=0; i<path.length/2 - 1; i++){
		if(has_intersection(path[i*2], path[i*2+2], path[i*2+1], path[i*3], bound)){
			return true;
		}
	}
	return false;
}


function has_intersection(x1, x2, y1, y2, bound){
	//top edge
	var tx = (bound.min_y - y1) * (x2-x1)/(y2-x2) + x1;
	if((tx >= x1 && tx <= x2 || tx <= x1 && tx >= x2) && tx >= bound.min_x && tx <= bound.max_x){
		return true;
	}
	
	//bottom edge
	var bx = (bound.max_y - y1) * (x2-x1)/(y2-x2) + x1;
	if((bx >= x1 && bx <= x2 || bx <= x1 && bx >= x2) && bx >= bound.min_x && bx <= bound.max_x){
		return true;
	}
	//left edge
	var ly = (bound.min_x - x1) * (y2-x2) / (x2 - x1) + x1;
	if((ly >= y1 && ly <= y2 || ly <= y1 && ly >= y2) && ly >= bound.min_y && ly <= bound.max_y){
		return true;
	}
	//right edge
	var ry = (bound.max_x - x1) * (y2-x2) / (x2 - x1) + x1;
	if((ry >= y1 && ry <= y2 || ry <= y1 && ry >= y2) && ry >= bound.min_y && ry <= bound.max_y){
		return true;
	}
	return false;
}

var Neighbors = [[ "p0r21436x8zb9dcf5h7kjnmqesgutwvy", // Top
	"bc01fg45238967deuvhjyznpkmstqrwx", // Right
	"14365h7k9dcfesgujnmqp0r2twvyx8zb", // Bottom
	"238967debc01fg45kmstqrwxuvhjyznp", // Left
	], ["bc01fg45238967deuvhjyznpkmstqrwx", // Top
	"p0r21436x8zb9dcf5h7kjnmqesgutwvy", // Right
	"238967debc01fg45kmstqrwxuvhjyznp", // Bottom
	"14365h7k9dcfesgujnmqp0r2twvyx8zb", // Left
	]];

var Borders = [["prxz", "bcfguvyz", "028b", "0145hjnp"],
	["bcfguvyz", "prxz", "0145hjnp", "028b"]];


function getNeighbour(hash)
{
	var hash_neighbour = new Array();
	var hash_top = CalculateAdjacent(hash,0);
	hash_neighbour.push(hash_top);
	var hash_right = CalculateAdjacent(hash,1);
	hash_neighbour.push(hash_right);
	var hash_bottom = CalculateAdjacent(hash,2);
	hash_neighbour.push(hash_bottom);
	var hash_left = CalculateAdjacent(hash,3);
	hash_neighbour.push(hash_left);

	var hash_top_left = CalculateAdjacent(hash_top, 3);
	hash_neighbour.push(hash_top_left);
	var hash_top_right = CalculateAdjacent(hash_top, 1);
	hash_neighbour.push(hash_top_right);
	var hash_bottom_left = CalculateAdjacent(hash_bottom, 3);
	hash_neighbour.push(hash_bottom_left);
	var hash_bottom_right = CalculateAdjacent(hash_bottom, 1);
	hash_neighbour.push(hash_bottom_right);

	return hash_neighbour;
}


function CalculateAdjacent(hash, dir)
{
	var lastChr = hash[hash.length - 1];
	var type = hash.length % 2;
	var nHash = hash.substring(0, hash.length - 1);

	if (Borders[type][dir].indexOf(lastChr) != -1)
	{
		nHash = CalculateAdjacent(nHash, dir);
	}
	
	if((Base32[Neighbors[type][dir].indexOf(lastChr)])){
		return nHash + Base32[Neighbors[type][dir].indexOf(lastChr)];
	}
	else{
		return nHash;
	}
	
}

function RefineInterval(interval, cd, mask)
{
	if ((cd & mask) != 0)
	{
		interval[0] = (interval[0] + interval[1])/2;
	}
	else
	{
		interval[1] = (interval[0] + interval[1])/2;
	}
}

function get_geohash_by_tile(x,y,z){
	var x1 = tile2long(x,z);
	var x2 = tile2long(x+1,z);
	var y1 = tile2lat(y,z);
	var y2 = tile2lat(y+1,z);

	var min_x = Math.min(x1, x2);
	var max_x = Math.max(x1, x2);
	var min_y = Math.min(y1, y2);
	var max_y = Math.max(y1, y2);

	var hash_array = new Array();
	for(var x = min_x; x < max_x + 0.01; x+=0.01){
		for(var y = min_y; y < max_y + 0.01; y+=0.01){
			geohash = encode_geohash(x, y);
			//duplicate geohash
			if(hash_array.indexOf(geohash) != -1){
				continue;
			}
			hash_array.push(geohash);
		}
	}
	return hash_array;
}

function tile2long(x,z) {
	return (x/Math.pow(2,z)*360-180);
}
function tile2lat(y,z) {
	var n=Math.PI-2*Math.PI*y/Math.pow(2,z);
	return (180/Math.PI*Math.atan(0.5*(Math.exp(n)-Math.exp(-n))));
}

//获得目标位置到相对中心点(世界全显示)geohash块的像素距离
//14位geohash，不做剪切，最高精度
//new-setting-2--根据每个geohashtile计算位置，只需计算最后不相同的位数
function get_tar_dis(geohash,zoom,cg,cg_center) {
	  //截取geohash有效位数	  
	  var c1 = cg.length;
		//curg = geohash.substr(0,c1);
		var c2 = geohash.length;
		var c3 = c1>c2?c2:c1;
		curg = geohash.substr(0,c3);
		cg = cg.substr(0,c3);
			
		//减少相同点的计算量之1：与中心点位置相同
		if(curg == cg)
		{
			this._curg = cg;
			this._gt = cg_center;
			return cg_center;
		}
		//减少相同点的计算量之2：与前一个点相同
		if(curg == this._curg){
			return this._gt;
			}
			

		//数组表示geohash相对位置，按照划分有两组位置
		var g_ral_pos = [["prxz","nqwy","jmtv","hksu","57eg","46df","139c","028b"],["bcfguvyz","89destwx","2367kmqr","0145hjnp"]];
		
		//计算到中心点位置相对像素距离
		var gt = [],gt_x=0,gt_y=0;
		
		//计算每一位geohash所代表的像素范围
		//var cgz_lr = geohash_length_range_p(zoom);
		//简化上述计算，由于计算结果不会改变，这里直接保存计算结果，不需要每次重新计算
		var cgz_lr;

		switch(zoom){
				case 1:
				cgz_lr = [[128,256],[32,32],[4,8],[1,1],[0.125,0.25],[0.03125,0.03125],[0.00390625,0.0078125],[0.000976563,0.000976563],[0.00012207,0.00024414],[0.00003052,0.00003052],[0.00000381,0.00000763],[0.00000095,0.00000095],[0.00000012,0.00000024],[0.00000003,0.00000003]]; 
				break;
			case 2:
				cgz_lr = [[256,512],[64,64],[8,16],[2,2],[0.25,0.5],[0.0625,0.0625],[0.0078125,0.015625],[0.001953125,0.001953125],[0.00024414,0.00048828],[0.00006104,0.00006104],[0.00000763,0.00001526],[0.00000191,0.00000191],[0.00000024,0.00000048],[0.00000006,0.00000006]]; 
				break;
			case 3:
				cgz_lr = [[512,1024],[128,128],[16,32],[4,4],[0.5,1],[0.125,0.125],[0.015625,0.03125],[0.00390625,0.00390625],[0.00048828,0.00097656],[0.00012207,0.00012207],[0.00001526,0.00003052],[0.00000381,0.00000381],[0.00000048,0.00000095],[0.00000012,0.00000012]]; 
				break;
			case 4:
				cgz_lr = [[1024,2048],[256,256],[32,64],[8,8],[1,2],[0.25,0.25],[0.03125,0.0625],[0.0078125,0.0078125],[0.00097656,0.00195313],[0.00024414,0.00024414],[0.00003052,0.00006104],[0.00000763,0.00000763],[0.00000095,0.00000191],[0.00000024,0.00000024]]; 
				break;
			case 5:
				cgz_lr = [[2048,4096],[512,512],[64,128],[16,16],[2,4],[0.5,0.5],[0.0625,0.125],[0.015625,0.015625],[0.00195313,0.00390625],[0.00048828,0.00048828],[0.00006104,0.00012207],[0.00001526,0.00001526],[0.00000191,0.00000381],[0.00000048,0.00000048]]; 
				break;
			case 6:
				cgz_lr = [[4096,8192],[1024,1024],[128,256],[32,32],[4,8],[1,1],[0.125,0.25],[0.03125,0.03125],[0.00390625,0.00781250],[0.00097656,0.00097656],[0.00012207,0.00024414],[0.00003052,0.00003052],[0.00000381,0.00000763],[0.00000095,0.00000095]]; 
				break;
			case 7:	
				cgz_lr = [[8192,16384],[2048,2048],[256,512],[64,64],[8,16],[2,2],[0.25,0.5],[0.0625,0.0625],[0.00781250,0.01562500],[0.00195313,0.00195313],[0.00024414,0.00048828],[0.00006104,0.00006104],[0.00000763,0.00001526],[0.00000191,0.00000191]]; 
				break;
			case 8:
				cgz_lr = [[16384,32768],[4096,4096],[512,1024],[128,128],[16,32],[4,4],[0.5,1],[0.125,0.125],[0.01562500,0.03125000],[0.00390625,0.00390625],[0.00048828,0.00097656],[0.00012207,0.00012207],[0.00001526,0.00003052],[0.00000381,0.00000381]]; 
				break;
			case 9:
				cgz_lr = [[32768,65536],[8192,8192],[1024,2048],[256,256],[32,64],[8,8],[1,2],[0.25,0.25],[0.03125000,0.06250000],[0.00781250,0.00781250],[0.00097656,0.00195313],[0.00024414,0.00024414],[0.00003052,0.00006104],[0.00000763,0.00000763]]; 
				break;
			case 10:	
				cgz_lr = [[65536,131072],[16384,16384],[2048,4096],[512,512],[64,128],[16,16],[2,4],[0.5,0.5],[0.06250000,0.12500000],[0.01562500,0.01562500],[0.00195313,0.00390625],[0.00048828,0.00048828],[0.00006104,0.00012207],[0.00001526,0.00001526]]; 
				break;
			case 11:
				cgz_lr = [[131072,262144],[32768,32768],[4096,8192],[1024,1024],[128,256],[32,32],[4,8],[1,1],[0.12500000,0.25000000],[0.03125000,0.03125000],[0.00390625,0.00781250],[0.00097656,0.00097656],[0.00012207,0.00024414],[0.00003052,0.00003052]]; 
				break;
			case 12:	
				cgz_lr = [[262144,524288],[65536,65536],[8192,16384],[2048,2048],[256,512],[64,64],[8,16],[2,2],[0.25000000,0.50000000],[0.06250000,0.06250000],[0.00781250,0.01562500],[0.00195313,0.00195313],[0.00024414,0.00048828],[0.00006104,0.00006104]]; 
				break;
			case 13:	
				cgz_lr = [[524288,1048576],[131072,131072],[16384,32768],[4096,4096],[512,1024],[128,128],[16,32],[4,4],[0.50000000,1.00000000],[0.12500000,0.12500000],[0.01562500,0.03125000],[0.00390625,0.00390625],[0.00048828,0.00097656],[0.00012207,0.00012207]]; 
				break;
			case 14:
				cgz_lr = [[1048576,2097152],[262144,262144],[32768,65536],[8192,8192],[1024,2048],[256,256],[32,64],[8,8],[1.00000000,2.00000000],[0.25000000,0.25000000],[0.03125000,0.06250000],[0.00781250,0.00781250],[0.00097656,0.00195313],[0.00024414,0.00024414]]; 
				break;
			case 15:	
				cgz_lr = [[2097152,4194304],[524288,524288],[65536,131072],[16384,16384],[2048,4096],[512,512],[64,128],[16,16],[2.00000000,4.00000000],[0.50000000,0.50000000],[0.06250000,0.12500000],[0.01562500,0.01562500],[0.00195313,0.00390625],[0.00048828,0.00048828]]; 
				break;
			case 16:	
				cgz_lr = [[4194304,8388608],[1048576,1048576],[131072,262144],[32768,32768],[4096,8192],[1024,1024],[128,256],[32,32],[4.00000000,8.00000000],[1.00000000,1.00000000],[0.12500000,0.25000000],[0.03125000,0.03125000],[0.00390625,0.00781250],[0.00097656,0.00097656]]; 
				break;
			case 17:
				cgz_lr = [[8388608,16777216],[2097152,2097152],[262144,524288],[65536,65536],[8192,16384],[2048,2048],[256,512],[64,64],[8.00000000,16.00000000],[2.00000000,2.00000000],[0.25000000,0.50000000],[0.06250000,0.06250000],[0.00781250,0.01562500],[0.00195313,0.00195313]];
				break;		
			default:
			cgz_lr = [[16777216,33554432],[4194304,4194304],[524288,1048576],[131072,131072],[16384,32768],[4096,4096],[512,1024],[128,128],[16,32],[4,4],[0.5,1],[0.125,0.125],[0.015625,0.03125],[0.00390625,0.00390625]];				
		}   
			
		//计算块内中心点和目标点的相对位置
		var i,j,ilen,jlen,tg,tgc,type_index,cxy=[],tmpp=-1,s1=false,s2=false,          	cal_x,cal_y,cal_c_x,cal_c_y;//geohash相对中心点位置;
		for(i=0,ilen=cg.length;i<ilen;i++){
			tgc = cg.substr(i,1);//块内中心点的一位不同字符
			tg = curg.substr(i,1);//目标点的一位不同字符
			//从编码不同位置开始计算
			if(tg == tgc){
				continue;
			}
			
			s1=false;
			s2=false;		
			
			type_index = (i+1) % 2;		//奇数位为纬度，第一次先分为四块，偶数位为经度
			
			for(j=0,jlen = g_ral_pos[type_index].length;j<jlen;j++){
				//块内中心点一个字符的相对位置
				if (g_ral_pos[type_index][j].indexOf(tgc)!= -1){
						cal_c_x = g_ral_pos[type_index][j].indexOf(tgc);
						cal_c_y = j;
						s1 = true;
				}
				//目标点一个字符的相对位置
				if (g_ral_pos[type_index][j].indexOf(tg)!= -1){
						cal_x = g_ral_pos[type_index][j].indexOf(tg);
						cal_y = j;
						s2 = true;
				}
				if(s1&&s2){break;}		
			}
			//相对位置差
			cal_x = cal_x - cal_c_x;
			cal_y = cal_y - cal_c_y;
			//相对像素差
			gt_x = gt_x + cal_x*cgz_lr[i][0];
			gt_y = gt_y + cal_y*cgz_lr[i][1];
		}
		
		//目标点像素坐标
		gt_x = cg_center[0] + gt_x;
		gt_y = cg_center[1] + gt_y;
		
		gt.push(gt_x);
		gt.push(gt_y);
		this._gt = gt;
		this._curg = curg;
		return gt;
}

/*相对像素差转为相对位置差思路：
从tile的geohash名出发(从这一位里，新点的像素坐标刚好不在tile中心+像素范围的范围里，然后就可以开始寻找x位置差和y位置差了)，
加上位置差之后的像素范围必须包含目标point的像素，然后计算下一位，直到hash位数到达tile.length*/
function get_new_geohash(point,zoom,curTileCenterGeoHash,curTileCenterPoint) {
	//截取geohash有效位数	  
	//var c1 = cg.length;
	//curg = geohash.substr(0,c1);
	//var c2 = geohash.length;
	//var c3 = c1>c2?c2:c1;
	//curg = geohash.substr(0,c3);
	//cg = cg.substr(0,c3);

	//记录一个变化的中心点point
	var activePoint = curTileCenterPoint
	
		
	//减少相同点的计算量之1：与中心点位置相同
	if(point == curTileCenterPoint)
	{
		this._curg = curTileCenterGeoHash;
		this._gt = curTileCenterPoint;
		return curTileCenterGeoHash;
	}
	//减少相同点的计算量之2：与前一个点相同
	if(point == this._gt){
		return this._curg;
	}
		

	//数组表示geohash相对位置，按照划分有两组位置
	var g_ral_pos = [["prxz","nqwy","jmtv","hksu","57eg","46df","139c","028b"],["bcfguvyz","89destwx","2367kmqr","0145hjnp"]];
	
	
	//计算每一位geohash所代表的像素范围
	//var cgz_lr = geohash_length_range_p(zoom);
	//简化上述计算，由于计算结果不会改变，这里直接保存计算结果，不需要每次重新计算
	var cgz_lr;

	switch(zoom){
			case 1:
			cgz_lr = [[128,256],[32,32],[4,8],[1,1],[0.125,0.25],[0.03125,0.03125],[0.00390625,0.0078125],[0.000976563,0.000976563],[0.00012207,0.00024414],[0.00003052,0.00003052],[0.00000381,0.00000763],[0.00000095,0.00000095],[0.00000012,0.00000024],[0.00000003,0.00000003]]; 
			break;
		case 2:
			cgz_lr = [[256,512],[64,64],[8,16],[2,2],[0.25,0.5],[0.0625,0.0625],[0.0078125,0.015625],[0.001953125,0.001953125],[0.00024414,0.00048828],[0.00006104,0.00006104],[0.00000763,0.00001526],[0.00000191,0.00000191],[0.00000024,0.00000048],[0.00000006,0.00000006]]; 
			break;
		case 3:
			cgz_lr = [[512,1024],[128,128],[16,32],[4,4],[0.5,1],[0.125,0.125],[0.015625,0.03125],[0.00390625,0.00390625],[0.00048828,0.00097656],[0.00012207,0.00012207],[0.00001526,0.00003052],[0.00000381,0.00000381],[0.00000048,0.00000095],[0.00000012,0.00000012]]; 
			break;
		case 4:
			cgz_lr = [[1024,2048],[256,256],[32,64],[8,8],[1,2],[0.25,0.25],[0.03125,0.0625],[0.0078125,0.0078125],[0.00097656,0.00195313],[0.00024414,0.00024414],[0.00003052,0.00006104],[0.00000763,0.00000763],[0.00000095,0.00000191],[0.00000024,0.00000024]]; 
			break;
		case 5:
			cgz_lr = [[2048,4096],[512,512],[64,128],[16,16],[2,4],[0.5,0.5],[0.0625,0.125],[0.015625,0.015625],[0.00195313,0.00390625],[0.00048828,0.00048828],[0.00006104,0.00012207],[0.00001526,0.00001526],[0.00000191,0.00000381],[0.00000048,0.00000048]]; 
			break;
		case 6:
			cgz_lr = [[4096,8192],[1024,1024],[128,256],[32,32],[4,8],[1,1],[0.125,0.25],[0.03125,0.03125],[0.00390625,0.00781250],[0.00097656,0.00097656],[0.00012207,0.00024414],[0.00003052,0.00003052],[0.00000381,0.00000763],[0.00000095,0.00000095]]; 
			break;
		case 7:	
			cgz_lr = [[8192,16384],[2048,2048],[256,512],[64,64],[8,16],[2,2],[0.25,0.5],[0.0625,0.0625],[0.00781250,0.01562500],[0.00195313,0.00195313],[0.00024414,0.00048828],[0.00006104,0.00006104],[0.00000763,0.00001526],[0.00000191,0.00000191]]; 
			break;
		case 8:
			cgz_lr = [[16384,32768],[4096,4096],[512,1024],[128,128],[16,32],[4,4],[0.5,1],[0.125,0.125],[0.01562500,0.03125000],[0.00390625,0.00390625],[0.00048828,0.00097656],[0.00012207,0.00012207],[0.00001526,0.00003052],[0.00000381,0.00000381]]; 
			break;
		case 9:
			cgz_lr = [[32768,65536],[8192,8192],[1024,2048],[256,256],[32,64],[8,8],[1,2],[0.25,0.25],[0.03125000,0.06250000],[0.00781250,0.00781250],[0.00097656,0.00195313],[0.00024414,0.00024414],[0.00003052,0.00006104],[0.00000763,0.00000763]]; 
			break;
		case 10:	
			cgz_lr = [[65536,131072],[16384,16384],[2048,4096],[512,512],[64,128],[16,16],[2,4],[0.5,0.5],[0.06250000,0.12500000],[0.01562500,0.01562500],[0.00195313,0.00390625],[0.00048828,0.00048828],[0.00006104,0.00012207],[0.00001526,0.00001526]]; 
			break;
		case 11:
			cgz_lr = [[131072,262144],[32768,32768],[4096,8192],[1024,1024],[128,256],[32,32],[4,8],[1,1],[0.12500000,0.25000000],[0.03125000,0.03125000],[0.00390625,0.00781250],[0.00097656,0.00097656],[0.00012207,0.00024414],[0.00003052,0.00003052]]; 
			break;
		case 12:	
			cgz_lr = [[262144,524288],[65536,65536],[8192,16384],[2048,2048],[256,512],[64,64],[8,16],[2,2],[0.25000000,0.50000000],[0.06250000,0.06250000],[0.00781250,0.01562500],[0.00195313,0.00195313],[0.00024414,0.00048828],[0.00006104,0.00006104]]; 
			break;
		case 13:	
			cgz_lr = [[524288,1048576],[131072,131072],[16384,32768],[4096,4096],[512,1024],[128,128],[16,32],[4,4],[0.50000000,1.00000000],[0.12500000,0.12500000],[0.01562500,0.03125000],[0.00390625,0.00390625],[0.00048828,0.00097656],[0.00012207,0.00012207]]; 
			break;
		case 14:
			cgz_lr = [[1048576,2097152],[262144,262144],[32768,65536],[8192,8192],[1024,2048],[256,256],[32,64],[8,8],[1.00000000,2.00000000],[0.25000000,0.25000000],[0.03125000,0.06250000],[0.00781250,0.00781250],[0.00097656,0.00195313],[0.00024414,0.00024414]]; 
			break;
		case 15:	
			cgz_lr = [[2097152,4194304],[524288,524288],[65536,131072],[16384,16384],[2048,4096],[512,512],[64,128],[16,16],[2.00000000,4.00000000],[0.50000000,0.50000000],[0.06250000,0.12500000],[0.01562500,0.01562500],[0.00195313,0.00390625],[0.00048828,0.00048828]]; 
			break;
		case 16:	
			cgz_lr = [[4194304,8388608],[1048576,1048576],[131072,262144],[32768,32768],[4096,8192],[1024,1024],[128,256],[32,32],[4.00000000,8.00000000],[1.00000000,1.00000000],[0.12500000,0.25000000],[0.03125000,0.03125000],[0.00390625,0.00781250],[0.00097656,0.00097656]]; 
			break;
		case 17:
			cgz_lr = [[8388608,16777216],[2097152,2097152],[262144,524288],[65536,65536],[8192,16384],[2048,2048],[256,512],[64,64],[8.00000000,16.00000000],[2.00000000,2.00000000],[0.25000000,0.50000000],[0.06250000,0.06250000],[0.00781250,0.01562500],[0.00195313,0.00195313]];
			break;		
		default:
		cgz_lr = [[16777216,33554432],[4194304,4194304],[524288,1048576],[131072,131072],[16384,32768],[4096,4096],[512,1024],[128,128],[16,32],[4,4],[0.5,1],[0.125,0.125],[0.015625,0.03125],[0.00390625,0.00390625]];				
	}   
		
	//计算块内中心点和目标点的相对位置
	var frontGeoHash, restGeoHash='', i,j,ilen,jlen,targetGeoHash,tgc,type_index,cal_c_x,cal_c_y;//geohash相对中心点位置;
	for(i=0,ilen=curTileCenterGeoHash.length;i<ilen;i++){
		//获取中心像素值
		var g_x = activePoint.x
		var g_y = activePoint.y
		tgc = curTileCenterGeoHash.substr(i,1);//块内中心点的一位不同字符
		let gs_x = cgz_lr[i][0];//当前的geohashtile大小
		let gs_y = cgz_lr[i][1];
		gs_x = gs_x / 2;
		gs_y = gs_y / 2;
		let left=g_x+gs_x, right=g_x-gs_x, top=g_y-gs_y, bottom=g_y+gs_y
		if(point.x >= right && point.x <= left && point.y >= top && point.y <= bottom)
		{
			frontGeoHash = curTileCenterGeoHash.substr(0,i+1)
			continue
		}
		type_index = (i+1) % 2;
		for(j=0,jlen = g_ral_pos[type_index].length;j<jlen;j++){
			//块内中心点一个字符的相对位置
			if (g_ral_pos[type_index][j].indexOf(tgc)!= -1){
				cal_c_y = g_ral_pos[type_index][j].indexOf(tgc);//个人理解，原get_tar_dis中的x和y记反了,顺着意思来
				cal_c_x = j;
				s1 = true;
				for(let a = 0; a < g_ral_pos[type_index].length; a++){
					left = left + (a-cal_c_x) * cgz_lr[i][0]
					right = right + (a-cal_c_x) * cgz_lr[i][0]
					activePoint.x = activePoint.x + (a-cal_c_x) * cgz_lr[i][0]
					if(point.x >= right && point.x <= left){
						for(let b = 0; b < g_ral_pos[type_index][a].length; b++){
							top = top + (b-cal_c_y) * cgz_lr[i][1]
							bottom = bottom + (b-cal_c_y) * cgz_lr[i][1]
							activePoint.y = activePoint.y + (b-cal_c_y) * cgz_lr[i][1]
							if(point.y >= top && point.y <= bottom){
								restGeoHash += g_ral_pos[type_index][a][b]
							}
						}
					}
				}
			}
		}
	}
	//目标点geohash
	targetGeoHash = frontGeoHash+restGeoHash
	return targetGeoHash
}


//geohash在不同缩放等级zoom下，不同编码长度length所覆盖的像素范围range
function geohash_length_range_p(zoom){
	var gl = [1,1,2,2,2,3,3,4,4,4,5,5,6,6,6,7,7,8,8];  

	var gs_x = 256/(Math.pow(8,parseInt((gl[zoom-1]+1)/2))*Math.pow(4,parseInt(gl[zoom-1]/2))/Math.pow(2,zoom));
	var gs_y = 256/(Math.pow(8,parseInt(gl[zoom-1]/2))*Math.pow(4,parseInt((gl[zoom-1]+1)/2))/Math.pow(2,zoom));
	
	//计算到屏幕坐标x,y都<=1
	var g_x = gs_x,g_y = gs_y,//geohash位数与屏幕像素坐标
	    gl_l=gl[zoom-1];//geohash位数
	var g_z_lr = [];
	
	//初始值存入
	g_z_lr.push([g_x,g_y]); 

	while(g_x>=1 || g_y>=1){		
			g_x = g_x / (Math.pow(8,((gl_l+1)%2))*Math.pow(4,((gl_l)%2)));
			g_y = g_y / (Math.pow(4,((gl_l+1)%2))*Math.pow(8,((gl_l)%2)));
			gl_l = gl_l + 1;
			
				g_z_lr.push([g_x,g_y]); 
	}
	return g_z_lr;
}

//--------------------------------------------------------
//get new center of geohash with specified length----------------------------
//获取geohash指定长度的中心点
//--------------------------------------------------------
function get_specifiedlen_center(geohash,len){
	//数组表示geohash相对位置，按照划分有两组位置
	var g_ral_pos = [["prxz","nqwy","jmtv","hksu","57eg","46df","139c","028b"],["bcfguvyz","89destwx","2367kmqr","0145hjnp"]];
	var gtype,xp,yp,new_center = geohash,i;
	if(geohash.length >= len){
		new_center = geohash.substring(0,len);
		}
	else {
		for(i=geohash.length;i<len;i++){
			gtype = i % 2;
			yp = g_ral_pos[gtype].length / 2;
			xp = g_ral_pos[gtype][0].length / 2;
			new_center = new_center + g_ral_pos[gtype][yp].substr(xp,1);
		}
	}
	return new_center;
}

//--------------------------------------------------------
//get new center of geohash with specified length about zoom----------------------------
//根据缩放等级zoom获取geohash指定长度的中心点
//--------------------------------------------------------
function get_specifiedlen_center_z(geohash,z){
	var gel = [5,6,6,7,7,7,8,8,9,9,9,10,10,11,11,11,12,12];
	//数组表示geohash相对位置，按照划分有两组位置
	var g_ral_pos = [["prxz","nqwy","jmtv","hksu","57eg","46df","139c","028b"],["bcfguvyz","89destwx","2367kmqr","0145hjnp"]];
	var gtype,xp,yp,new_center = geohash,i;
	var len = gel[z-1];
	if(geohash.length >= len){
		new_center = geohash.substring(0,len);
		}
	else {
		for(i=geohash.length;i<len;i++){
			gtype = i % 2;
			yp = g_ral_pos[gtype].length / 2;
			xp = g_ral_pos[gtype][0].length / 2;
			new_center = new_center + g_ral_pos[gtype][yp].substr(xp,1);
		}
	}
	return new_center;
}
