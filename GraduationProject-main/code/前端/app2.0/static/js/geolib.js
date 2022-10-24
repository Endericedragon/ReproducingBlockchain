//var deltaLon = [38, 37, 34, 30, 24, 18, 11, 4];
//var deltaLon = [38, 37, 34, 30, 24, 18, 11, 4];
var deltaLat = 0.596496069;
var deltaLon = [1.191555127,1.1800798,1.157239659,1.123254668,1.07845212,1.023263489,0.958220271,0.883948868,0.801164554,0.710664587,0.613320532,0.510069865,0.401906947,0.289873444,0.175048303,0.05853735];

var Bits = [16, 8, 4, 2, 1];
var precision = 11;
var divnum = 4;
var Base32 = "0123456789bcdefghjkmnpqrstuvwxyz".split("");

function getDistanceBtwP(LatA, LonA, LatB, LonB)//��γ�������
{  
	var radLng1 = LatA * Math.PI / 180.0;  
	var radLng2 = LatB * Math.PI / 180.0;  
	var a = radLng1 - radLng2;  
	var b = (LonA - LonB) * Math.PI/ 180.0;  
	var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2)+ Math.cos(radLng1) * Math.cos(radLng2) * Math.pow(Math.sin(b / 2), 2))) * 6378.137; //·µ»Øµ¥Î»Îª¹«Àï  
	return s * 1000;  
}

function getDistanceByGeohash(geohash1, geohash2) {//geohash�����
	var vector = getVector(geohash1, geohash2);
	var ans = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);
	return ans;
}

function getVector(geohash1, geohash2) { //geohash������
	var ans = new Array();

	var londelta = getLonDelta(geohash1);
	var latdelta = getLatDelta(geohash1);

	var dislat1 = getLatBase32(geohash1);
	var dislon1 = getLonBase32(geohash1);
	var dislat2 = getLatBase32(geohash2);
	var dislon2 = getLonBase32(geohash2);

	var dislat = (dislat2 - dislat1) * latdelta;
	var dislon = (dislon2 - dislon1) * londelta;
	ans.push(dislon);
	ans.push(dislat);

	return ans;
}

function getProjection(geol1, geol2, geop) {//���ͶӰ�� AΪ�� BCΪ���ϵ�
	if (geol1 == geol2) {
		return geol1;
	}
	var ba = getVector(geol1, geop);
	var bc = getVector(geol1, geol2);

	var ebc = bc;
	var t = getDistanceByGeohash(geol1, geol2);

	if (t == 0) {
		console.log("ֱ�߶˵���ͬһ��");
		return 0;
	}
	ebc[0] = ebc[0] / t;
	ebc[1] = ebc[1] / t;
	var bdl = (ba[0] * ebc[0]) + (ba[1] * ebc[1]);

	var bd = new Array();
	bd.push(ebc[0] * bdl);
	bd.push(ebc[1] * bdl);

	bd[0] = Math.round(bd[0] / getLonDelta(geol1));
	bd[1] = Math.round(bd[1] / getLatDelta(geol1));

	var ans = CalculateShift(geol1, bd[1], bd[0]);

	return ans;
}

function CalculateShift(geohash, latoffset, lonoffset) {
	var lat = getLatBase32(geohash);
	var lon = getLonBase32(geohash);	

	lat = (lat + latoffset + (1 << (precision * 5 / 2))) & ((1 << (precision * 5 / 2)) - 1);
	lon = (lon + lonoffset + (1 << (precision * 5 / 2))) & ((1 << (precision * 5 / 2)) - 1);

	return MergeGeohash(lat, lon);
}

function MergeGeohash(lat, lon) {
	var geohash = "";
	var flag = 0;
	var temp = 0;
	var bit = 0;
	for (var i = (precision * 5 / 2 - 1); i >= 0; i--) {
		bit = (lon >> i) & 1;
		temp = temp * 2 + bit;
		flag++;
		if (flag == 5) {
			geohash += Base32[temp];
			flag = 0;
			temp = 0;			
		}
		bit = (lat >> i) & 1;
		temp = temp * 2 + bit;
		flag++;
		if (flag == 5) {
			geohash += Base32[temp];
			flag = 0;
			temp = 0;			
		}
	}
	return geohash;
}

function getDisPointToLine(geol1, geol2, geop) {//geohash��㵽�߾���
	getDistanceByGeohash(getProjection(geol1, geol2, geop), geop);
}

function getVecPointToLine(geol1, geol2, geop) {//geohash��㵽������
	getVector(getProjection(geol1, geol2, geop), geop);
}

function getDisPointToSegment(geol1, geol2, geop) {//geohash��㵽�߶ξ��룬����ͶӰ��������
	var a = getDistanceByGeohash(geol1, geop);
	var b = getDistanceByGeohash(geol2, geop);
	var c = getDistanceByGeohash(geol1, geol2);
	if (((c > a) && (c > b)) || 
		((a > b) && (a > c) && (b * b + c * c >= a * a)) || 
		((b > a) && (b > c) && (a * a + c * c >= b * b))) {
		//console.log(getDistanceByGeohash(getProjection(geol1, geol2, geop), geop));
		//console.log(geol1, geol2, geop, getDisPointToLine(geol1, geol2, geop));


		return [getDistanceByGeohash(getProjection(geol1, geol2, geop), geop), 0];
	} else {
		if (a < b) {
			return [a, 1];
		} else {
			return [b, 2];
		}
	}
}

function getBase32(geohash) {//geohashת������
	var geohashBase32_1 = 0;
	var geohashBase32_2 = 0;
	var geohashBase32 = new Array();

	for(var i = 0; i < geohash.length / 2; i++)
	{
		var c = geohash[i];
		var cd = Base32.indexOf(c);
		geohashBase32_1 = geohashBase32_1 << 5;
		geohashBase32_1 = geohashBase32_1 + cd;
	}
	//console.log(geohashBase32_1);
	for(var i = geohash.length / 2; i < geohash.length; i++)
	{
		var c = geohash[i];
		var cd = Base32.indexOf(c); 
		geohashBase32_2 = geohashBase32_2 << 5;
		geohashBase32_2 = geohashBase32_2 + cd;
	}
	//console.log(geohashBase32_2);	

	geohashBase32.push(geohashBase32_1);
	geohashBase32.push(geohashBase32_2);

	return geohashBase32;	
}

function getLonDelta(geohash) {//��ǰ�������
	//console.log("getLonDelta");
	lat = getLatBase32(geohash);
	lat = lat >> (precision * 5 / 2 - (divnum + 1));
	if ((lat & (1 << divnum)) != (1 << divnum)) {
		lat = (1 << (divnum + 1) - 1) - lat;
	}
	lat = lat - (1 << divnum);
	return deltaLon[lat];
}

function getLatDelta(geohash) {//��ǰ�ϱ����
	lon = getLonBase32(geohash);
	return deltaLat;
}

function getLatBase32(geohash) {//geohashγ��
	var even = true;
	var latNow = [-90, 90];
	var lonNow = [-180, 180];

	lat = 0;

	for(var i = 0; i < geohash.length; i++)
	{
		var c = geohash[i];
		var cd = Base32.indexOf(c);
		for (var j = 0; j < 5; j++)
		{
			var mask = Bits[j];
			if (even)
			{
				RefineInterval(lonNow, cd, mask);
			}
			else
			{
				RefineInterval(latNow, cd, mask);
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

function getLonBase32(geohash) { //geohash����
	var even = true;
	var latNow = [-90, 90];
	var lonNow = [-180, 180];

	lon = 0;

	for(var i = 0; i < geohash.length; i++)
	{
		var c = geohash[i];
		var cd = Base32.indexOf(c);
		for (var j = 0; j < 5; j++)
		{
			var mask = Bits[j];
			if (even)
			{
				RefineInterval(lonNow, cd, mask);
				lon = lon * 2;
				if ((cd & mask) != 0) {
					lon = lon + 1;
				}				
			}
			else
			{
				RefineInterval(latNow, cd, mask);
			}
			even = !even;
		}
	}

	return lon;
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

function CalculateAdjacent(hash, dir)
{
	var lastChr = hash[hash.length - 1];
	var type = hash.length % 2;
	var nHash = hash.substring(0, hash.length - 1);

	if (Borders[type][dir].indexOf(lastChr) != -1)
	{
		nHash = CalculateAdjacent(nHash, dir);
	}
	return nHash + Base32[Neighbors[type][dir].indexOf(lastChr)];
}


/*
function getDistanceByGeohash(geohash1, geohash2) {//µãµ½µã¾àÀë
	var base32_1 = getBase32(geohash1);
	var base32_2 = getBase32(geohash2);
	var base32_1_1 = base32_1[0];
	var base32_1_2 = base32_1[1];
	var base32_2_1 = base32_2[0];
	var base32_2_2 = base32_2[1];

	console.log((base32_1_1 ^ base32_2_1));
	console.log((base32_1_2 ^ base32_2_2));

	var ans = 0;

	var dislon1 = 0;
	var dislat1 = 0;
	var dislon2 = 0;
	var dislat2 = 0;	
	var now1 = 0;
	var now2 = 0;
	var flag = 0;

	var c = 1 << (geohash1.length * 5 / 4) - 1;
	var temp = (geohash1.length * 5 / 4 - 1) * 2;	

	if ((base32_1_1 ^ base32_2_1) != 0) {
		flag = 1; //²»Ì«¿ÉÄÜ
	}

	var c = 1 << (geohash1.length * 5 / 4) - 1;
	var temp = (geohash1.length * 5 / 4 - 1) * 2;
	for (var i = 0; i < geohash1.length * 5 / 4; i++) {
		now1 = ((base32_1_2) >> temp) & 3;
		now2 = ((base32_2_2) >> temp) & 3;
		if (now1 != now2) {
			flag = 1;
		}
		if (flag == 1) {
			dislon1 = dislon1 + (now1 >> 1) * c;
			dislat1 = dislat1 + (now1 & 1) * c;
			dislon2 = dislon2 + (now2 >> 1) * c;
			dislat2 = dislat2 + (now2 & 1) * c;
		}
		temp = temp - 2;
		c = c / 2;
	}
	londelta = getLonDelta(geohash1);
	latdelta = getLatDelta(geohash1);
	if (flag == 0) {
		ans = Math.round(Math.sqrt(londelta * londelta + latdelta * latdelta) / 4);
	} else {
		var dislat = Math.abs(dislat1 - dislat2) * latdelta;
		var dislon = Math.abs(dislon1 - dislon2) * londelta;
		ans = Math.round(Math.sqrt(dislat * dislat + dislon * dislon));
	}

	return ans;
}
*/
/*

function getVector(geohash1, geohash2) { //geohash������
	var ans = new Array();

	var londelta = getLonDelta(geohash1);
	var latdelta = getLatDelta(geohash1);

	var base32_1 = getBase32(geohash1);
	var base32_2 = getBase32(geohash2);
	var base32_1_1 = base32_1[0];
	var base32_1_2 = base32_1[1];
	var base32_2_1 = base32_2[0];
	var base32_2_2 = base32_2[1];

	//console.log((base32_1_1 ^ base32_2_1));
	//console.log((base32_1_2 ^ base32_2_2));


	var dislon1 = 0;
	var dislat1 = 0;
	var dislon2 = 0;
	var dislat2 = 0;	
	var now1 = 0;
	var now2 = 0;
	var flag = 0;

	var c = 1 << ((geohash1.length * 5 / 2) - 1);
	var temp = (geohash1.length * 5 / 4 - 1) * 2;	

	if ((base32_1_1 ^ base32_2_1) != 0) {
		for (var i = 0; i < geohash1.length * 5 / 4; i++) {
			now1 = ((base32_1_1) >> temp) & 3;
			now2 = ((base32_2_1) >> temp) & 3;
			if (now1 != now2) {
				flag = 1;
			}
			if (flag == 1) {
				dislon1 = dislon1 + (now1 >> 1) * c;
				dislat1 = dislat1 + (now1 & 1) * c;
				dislon2 = dislon2 + (now2 >> 1) * c;
				dislat2 = dislat2 + (now2 & 1) * c;
			}
			temp = temp - 2;
			c = c / 2;
		}		
	}

	var c = 1 << ((geohash1.length * 5 / 4) - 1);
	var temp = (geohash1.length * 5 / 4 - 1) * 2;
	for (var i = 0; i < geohash1.length * 5 / 4; i++) {
		now1 = ((base32_1_2) >> temp) & 3;
		now2 = ((base32_2_2) >> temp) & 3;
		if (now1 != now2) {
			flag = 1;
		}
		if (flag == 1) {
			dislon1 = dislon1 + (now1 >> 1) * c;
			dislat1 = dislat1 + (now1 & 1) * c;
			dislon2 = dislon2 + (now2 >> 1) * c;
			dislat2 = dislat2 + (now2 & 1) * c;
		}
		temp = temp - 2;
		c = c / 2;
	}
	londelta = getLonDelta(geohash1);
	latdelta = getLatDelta(geohash1);
	if (flag == 0) {
		//ans = Math.round(Math.sqrt(londelta * londelta + latdelta * latdelta) / 4);
		ans.push(0);
		ans.push(0);
	} else {
		//var dislat = Math.abs(dislat1 - dislat2) * latdelta;
		//var dislon = Math.abs(dislon1 - dislon2) * londelta;
		var dislat = (dislat2 - dislat1) * latdelta;
		var dislon = (dislon2 - dislon1) * londelta;
		ans.push(dislon);
		ans.push(dislat);
		//ans = Math.round(Math.sqrt(dislat * dislat + dislon * dislon));
	}
	return ans;
}
*/