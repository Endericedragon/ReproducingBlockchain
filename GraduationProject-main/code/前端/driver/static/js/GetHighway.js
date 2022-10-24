function GetHighway(highway){
	if(highway.substring(0,15) == "traffic_signals"){
		return "traffic_signals";
	}
	else if(highway.substring(0,8) == "crossing"){
		return "crossing";
	}
	else if(highway.substring(0,8) == "bus_stop"){
		return "bus_stop";
	}	
	else if(highway.substring(0,17) == "motorway_junction"){
		return "motorway_junction";
	}
	else if(highway.substring(0,7) =="primary"){
		return "primary";
	}
	else if(highway.substring(0,9) == "secondary"){
		return "secondary";
	}
	else if(highway.substring(0,8) == "tertiary"){
		return "tertiary";
	}
	else if(highway.substring(0,11) == "residential"){
		return "residential";
	}
	else if(highway.substring(0,5) == "trunk"){
		return "trunk";
	}
	else if(highway.substring(0,7) == "service"){
		return "service";
	}
	else if(highway.substring(0,12) == "unclassified"){
		return "unclassified";
	}
	else if(highway.substring(0,14) == "secondary_link"){
		return "secondary_link";
	}
	else if(highway.substring(0,10) == "pedestrian"){
		return "pedestrian";
	}
	else if(highway.substring(0,7) == "footway"){
		return "footway";
	}
	else if(highway.substring(0,13) == "motorway_link"){
		return "motorway_link";
	}
	else if(highway.substring(0,8) == "platform"){
		return "platform";
	}
	else if(highway.substring(0,14) == "turning_circle"){
		return "turning_circle";
	}
	else if(highway.substring(0,11) == "street_lamp"){
		return "street_lamp";
	}
	else if(highway.substring(0,9) == "milestone"){
		return "milestone";
	}
	else if(highway.substring(0,9) == "rest_area"){
		return "rest_area";
	}
	else if(highway.substring(0,8) == "elevator"){
		return "elevator";
	}
	else if(highway.substring(0,12) == "speed_camera"){
		return "speed_camera";
	}
	else if(highway.substring(0,8) == "services"){
		return "services";
	}
	else if(highway.substring(0,12) == "turning_loop"){
		return "turning_loop";
	}
	else if(highway.substring(0,5) == "steps"){
		return "steps";
	}
	else if(highway.substring(0,10) == "trunk_link"){
		return "trunk_link";
	}
	else if(highway.substring(0,12) == "primary_link"){
		return "primary_link";
	}
	else if(highway.substring(0,13) == "tertiary_link"){
		return "tertiary_link";
	}
	else if(highway.substring(0,8) == "cycleway"){
		return "cycleway";
	}
	else if(highway.substring(0,8) == "motorway"){
		return "motorway";
	}
	else if(highway.substring(0,5) == "track"){
		return "track";
	}
	else if(highway.substring(0,4) == "path"){
		return "path";
	}
	else if(highway.substring(0,13) == "living_street"){
		return "living_street";
	}
	else if(highway.substring(0,12) == "construction"){
		return "construction";
	}
	else if(highway.substring(0,4) == "road"){
		return "road";
	}
	else if(highway.substring(0,2) == "no"){
		return "no";
	}
	else if(highway.substring(0,8) == "proposed"){
		return "proposed";
	}
	else if(highway.substring(0,7) == "disused"){
		return "disused";
	}
	else if(highway.substring(0,9) == "bridleway"){
		return "bridleway";
	}
	else if(highway.substring(0,7) == "raceway"){
		return "raceway";
	}
}
export  {
	GetHighway
}