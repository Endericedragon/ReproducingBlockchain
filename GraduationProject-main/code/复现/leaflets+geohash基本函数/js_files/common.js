function generateUUID() {
	var d = new Date().getTime();
	var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	//var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = (d + Math.random()*16)%16 | 0;
		d = Math.floor(d/16);
		return (c=='x' ? r : (r&0x3|0x8)).toString(16);
	});
	return uuid;
};

function hex2str(hex){ 
	hex = hex.substr(0,2).toLowerCase() === "0x" ? hex.substr(2) : hex;
	var str = ""; 
	for(var i = 0;i < hex.length;i+=4){ 
		str += String.fromCharCode(parseInt(hex.substr(i,4),16)); 
	} 
	return str; 
} 

function printObj(obj){ 
	var description = ""; 
	for(var i in obj){ 
		var property=obj[i]; 
		description+=i+" = "+property+"\n"; 
	} 
	alert(description); 
} 

function remove_duplicate_road(roads){
	var real_roads = [];
	var gids = [];

	for(var i =0; i< roads.length; i++){
		if(gids.indexOf(roads[i].gid.valueOf()) != -1){
			continue;
		}
		gids.push(roads[i].gid.valueOf());
		real_roads.push(roads[i]);
	}
	return real_roads;
}

//点PCx,PCy到线段PAx,PAy,PBx,PBy的距离  
function get_distance_linestring(path, PCx, PCy)  
{       
	var index = 0;
	var min_distance = 9999;
    for(var i=0; i<path.length/2 - 1; i++){
		var distance = get_distance(path[i*2], path[i*2+1], path[i*2+2], path[i*2+3], PCx, PCy);
		if(distance < min_distance){
			min_distance = distance;
			index = i;
		}
	}
	return [min_distance, index];
}


//点PCx,PCy到线段PAx,PAy,PBx,PBy的距离  
function get_distance(x1, y1,x2, y2, PCx, PCy)  
{       
    var a,b,c;    
    a=getDistanceBtwP(y1,x1,y2,x2);//经纬坐标系中求两点的距离公式  
    b=getDistanceBtwP(y2,x2,PCy,PCx);//经纬坐标系中求两点的距离公式  
    c=getDistanceBtwP(y1,x1,PCy,PCx);//经纬坐标系中求两点的距离公式  
    if(b*b>=c*c+a*a)return c;
    if(c*c>=b*b+a*a)return b;
    var l=(a+b+c)/2;     //周长的一半     
    var s=Math.sqrt(l*(l-a)*(l-b)*(l-c));  //海伦公式求面积 
    return 2*s/a;
}

function getDistanceBtwP(LatA, LonA, LatB, LonB)//根据两点经纬度计算距离(m),X经度，Y纬度
{  
    var radLng1 = LatA * Math.PI / 180.0;  
    var radLng2 = LatB * Math.PI / 180.0;  
    var a = radLng1 - radLng2;  
    var b = (LonA - LonB) * Math.PI/ 180.0;  
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2)+ Math.cos(radLng1) * Math.cos(radLng2) * Math.pow(Math.sin(b / 2), 2))) * 6378.137; //返回单位为公里  
    return s * 1000;  
}

function project_linestring(point, path)
{
	var info = get_distance_linestring(path, point.lon, point.lat);
	var index = info[1];

	var distance = project(point, path[index*2], path[index*2+1], path[index*2+2], path[index*2+3]);
	var offset = 0;
	var total_length = 0;
	for(var i=0; i<path.length/2 - 1; i++){
		var tmp_dist = getDistanceBtwP(path[i*2+1], path[i*2], path[i*2+3], path[i*2+2]);
		if(i < index){
			distance += tmp_dist;
		}
		total_length += tmp_dist;
	}
	offset = distance / total_length;
	point.offset = offset;
	point.distance = distance;
	//type of position. 1-in the range of intersection near to start point, 2-....end point, 3- on the road
	var range = 40;//range of intersection.
	if(distance < range){
		point.type = 1;
	}
	else if(total_length - distance < range){
		point.type = 2;
	}
	else{
		point.type = 3;
	}
}

//reference: http://blog.csdn.net/gf771115/article/details/26721055
function project(point, x1, y1, x2, y2)
{
	var px = point.lon;
	var py = point.lat;
	var a,b,c;    
    a=getDistanceBtwP(y1,x1,y2,x2);//经纬坐标系中求两点的距离公式  
    b=getDistanceBtwP(y2,x2,py,px);//经纬坐标系中求两点的距离公式  
    c=getDistanceBtwP(y1,x1,py,px);//经纬坐标系中求两点的距离公式  
    if(b*b>=c*c+a*a){
		point.lon = x1;
		point.lat = y1;
		return 0;
	}
    if(c*c>=b*b+a*a){
		point.lon = x2;
		point.lat = y2;
		return a;
	}
	var k = ((px-x1)*(x2-x1) + (py-y1)*(y2-y1))/(Math.pow(x2-x1,2) + Math.pow(y2-y1,2));
	point.lon = x1 + k*x2 - k*x1;
	point.lat = y1 + k*y2 - k*y1;
	var distance = getDistanceBtwP(point.lat, point.lon, y1,x1);
	return distance;
	
}


function storeGPS(info)
{
	var xmlhttp;
	if (window.XMLHttpRequest)
	{// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	}
	else
	{// code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.open("POST","storeGPS.php",true);
	xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xmlhttp.send("info=" + info);
}

//for desc sort
function compare_candidate(a,b){
	return b.prop - a.prop;
}

//5 minutes each seq
function get_cur_seq(){
	var period = 1;//by minute
	var date=new Date();
	var seq = Math.floor((date.getHours() * 60 + date.getMinutes()) / period);
	var max_seq = 24*60/period;
	if(seq == 0){
		seq = 1;
	}
	else if(seq > max_seq){
		seq = max_seq;
	}
	return seq;
}

function read_trajectory(data, matching_window){
	data = data.split(/,|\r?\n/);
	//alert(data[0]);	
	for(var i=0; i< data.length - 1;){
		var point = {};
		point.utc = data[i];
		point.lat = data[i+1];
		point.lon = data[i+2];
		//alert(point.lon);
		matching_window.push(point);
		i += 3;
	}
}

//judge whether two roads are connected
function is_route(road1, road2){
	if(road1.gid == road2.gid){
		return true;
	}
	var type = 0;
	if(road1.source == road2.source){
		type = 1;
	}
	else if(road1.source == road2.target){
		type = 2;
	}
	else if(road1.target == road2.source){
		type = 3;
	}
	else if(road1.target == road2.target){
		type = 4;
	}

	if(road1.oneway == 1){
		if(road2.oneway == 1 && type == 3){
			return true;
		}
		else if(road2.oneway == 0 && type >=3){
			return true;
		}
	}
	else if(road1.oneway == 0){
		if(road2.oneway == 1 && (type == 1 || type == 3)){
			return true;
		}
		else if(road2.oneway == 0 && type > 0){
			return true;
		}
	}

	return false;
}

function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}

