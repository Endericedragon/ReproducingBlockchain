function landcoverCss(tags,zoom,style) {
// ___ Parks, woods, other green things ___	
var grass = '#cdebb0'; // also meadow, common, garden, village_green
var golf_course = '#b5e3b5';
var scrub = '#b5e3b5';
var forest = '#add19e';       // Lch(80,30,135)
var forest_text = '#46673b';  // Lch(40,30,135)
var park = '#c8facc';         // Lch(94,30,145) also recreation_ground
var orchard = '#aedfa3';

// ___ sports ___
var stadium = '#3c9'; // also sports_centre
var track = '#74dcba';
var pitch = '#8ad3af';

// ___ "base" landuses ___

var residential = '#e0dfdf';      // Lch(89,0,0)
var residential_line = '#B9B9B9'; // Lch(75,0,0)
var retail = '#FFD6D1';           // Lch(89,16,30)
var retail_line = '#D99C95';      // Lch(70,25,30)
var commercial = '#F2DAD9';       // Lch(89,8.5,25)
var commercial_line = '#D1B2B0';  // Lch(75,12,25)
var industrial = '#EBDBE8';       // Lch(89,9,330)
var industrial_line = '#C6B3C3';  // Lch(75,11,330)
var railway = industrial;
var railway_line = industrial_line;
var farmland = '#fbecd7';         // Lch(94,12,80) (Also used for farm)
var farmland_line = '#d6c4ab';    // Lch(80,15,80)

var farmyard = '#EFD6B5';         // Lch(87,20,80)
var farmyard_line = '#D1B48C';    // Lch(75,25,80)

// ___ Other ____

var aerodrome = '#e9e7e2';
var allotments = '#e5c7ab';
var apron = '#e9d1ff';
var bare_ground = '#eee5dc';
var campsite = '#def6c0'; // also caravan_site, picnic_site
var cemetery = '#aacbaf'; // also grave_yard
var construction = '#b6b592';
var danger_area = 'pink';
var garages = '#dfddce';
var heath = '#d6d99f';
//var mud = rgba(203,177,154,0.3)'; // produces '#e6dcd1 over var land
var parking = '#f7efb7';
var place_of_worship = '#cdccc9';
var place_of_worship_outline = '#111';
var playground = '#ccfff1';
var power = industrial;
var power_line = industrial_line;
var rest_area = '#efc8c8'; // also services
var sand = '#f5e9c6';
var educational_areas_and_hospital = '#f0f0d8';
var station = '#d4aaaa';
var tourism = '#734a08';
var quarry = '#c5c3c3';
var military = '#f55';
var beach = '#fff1ba';
var water_color ='#b5d0d0';



	//style['color'] = playground;//stroke_color
    //style['fillColor'] = playground;//fill_color
	//style['weight'] = 0.3;//stroke_width
	//type_11 :  'leisure' 'wetland' 'tourism' 'landuse' 'amenity' 'military' 'natural' 'power' 'aeroway'=='apron'||'aerodrome' 'highway'=='services'||'rest_area' 'railway'=='station'

	if(tags.leisure){
		if ((tags['leisure'] == 'park') && zoom >= 13) {
			style['color'] = park;
			style['fillColor'] = park;
			style['weight'] = 0.3;
		}
		if(tags['leisure'] == 'swimming_pool' && zoom >= 14) {
			style['fillColor'] = water_color;
			style['color'] = water_color;
			style['weight'] = 0.5;
		}

		if(tags['leisure'] == 'playground' && zoom >= 13) {
			style['fillColor'] = playground;
			style['color'] = playground;
			style['weight'] = 0.3;
		}

		if(tags['leisure'] == 'park' || tags['leisure'] == 'recreation_ground') {
			if(zoom >= 10) {
				style['fillColor'] = park;
			}
		}

		if((tags['leisure'] == 'golf_course' && zoom >= 10) || (tags['leisure'] == 'miniature_golf' && zoom >= 15)) {
			style['fillColor'] = golf_course;
		}

		if(tags['leisure'] == 'sports_centre' || tags['leisure'] == 'stadium') {
			if(zoom >= 10) {
				style['fillColor'] = stadium;
			}
		}

		if(tags['leisure'] == 'track' && zoom >= 10) {
			style['fillColor'] = track;
			if(zoom >= 15) {
				style['weight'] = 0.5;
				style['color'] = track;
			}
		}

		if(tags['leisure'] == 'pitch' && zoom >= 10) {
			style['fillColor'] = pitch;
			if(zoom >= 15) {
				style['weight'] = 0.5;
				style['color'] = pitch;
			}
		}
	}

	if(tags.wetland){
		if(tags['wetland'] == 'mud' || tags['wetland'] == 'tidalflat') {
			if(zoom >= 9) {
				style['fillColor'] = mud;
			}
		}

		if(tags['wetland'] == 'swamp' && zoom >= 8) {
			style['fillColor'] = forest;
		}

		if(tags['wetland'] == 'bog' || tags['wetland'] == 'string_bog') {
			if(zoom >= 10) {
				style['fillColor'] = heath;
			}
		}

		if(tags['wetland'] == 'wet_meadow' || tags['wetland'] == 'marsh') {
			if(zoom >= 10) {
				style['fillColor'] = grass;
			}
		}

	}

	if(tags.tourism){
		if(tags['tourism'] == 'camp_site' || tags['tourism'] == 'caravan_site' || tags['tourism'] == 'picnic_site') {
			if(zoom >= 10) {
				style['fillColor'] = campsite;
				style['color'] = campsite;
				style['weight'] = 0.3;
			}
		}
		if(tags['tourism'] == 'camp_site' || tags['tourism'] == 'caravan_site' || tags['tourism'] == 'picnic_site') {
			if(zoom >= 10) {
				style['fillColor'] = campsite;
				style['color'] = campsite;
				style['weight'] = 0.3;
			}
		}
	}

	if(tags.landuse){ 

		if(tags['landuse'] == 'allotments') {
			if(zoom >= 10 && zoom < 14) {
				style['fillColor'] = allotments;
			}
			if(zoom >= 14) {
				  //polygon_pattern_file: url('symbols/allotments.png');
				  //polygon_pattern_alignment: global;
				  style['fillColor'] = allotments;
				}
			}

			if(tags['landuse'] == 'forest') {
				if(zoom >= 8) {
					style['fillColor'] = forest;
				}
			}

			if(tags['landuse'] == 'farmyard' && zoom >= 10) {
				style['fillColor'] = farmyard;
				if(zoom >= 16) {
					style['weight'] = 0.5;
					style['color'] = farmyard_line;
				}
			}

			if(tags['landuse'] == 'farm' || tags['landuse'] == 'farmland' || tags['landuse'] == 'greenhouse_horticulture') {
				if(zoom >= 10) {
					style['fillColor'] = farmland;
					if(zoom >= 16) {
						style['weight'] = .5;
						style['color'] = farmland_line;
					}
				}
			}

			if(tags['landuse'] == 'meadow' || tags['landuse'] == 'grassland' || tags['landuse'] == 'grass' || tags['landuse'] == 'recreation_ground' || tags['landuse'] == 'village_green' || tags['landuse'] == 'common' || tags['landuse'] == 'garden') {
				if(zoom >= 10) {
					style['fillColor'] = grass;
				}
			}

			if(tags['landuse'] == 'retail' && zoom >= 10) {
				style['fillColor'] = retail;
				if(zoom >= 16) {
					style['weight'] = 0.5;
					style['color'] = retail_line;
				}
			}

			if(tags['landuse'] == 'industrial' && zoom >= 10) {
				style['fillColor'] = industrial;
				if(zoom >= 16) {
					style['weight'] = .5;
					style['color'] = industrial_line;
				}
			}

			if(tags['landuse'] == 'railway' && zoom >= 10) {
				style['fillColor'] = railway;
				if(zoom >= 16) {
					style['weight'] = 0.7;
					style['color'] = railway_line;
				}
			}


			if(tags['landuse'] == 'commercial' && zoom >= 10) {
				style['fillColor'] = commercial;
				if(zoom >= 16) {
					style['weight'] = 0.5;
					style['color'] = commercial_line;
				}
			}

			if(tags['landuse'] == 'brownfield' || tags['landuse'] == 'landfill' || tags['landuse'] == 'construction') {
				if(zoom >= 10) {
					style['fillColor'] = construction;
				}
			}

			if(tags['landuse'] == 'quarry' && zoom >= 10) {
				style['fillColor'] = quarry;
				//polygon_pattern_file: url('symbols/quarry.png');
				style['weight'] = 0.5;
				style['color'] = 'grey';
			}

		if(tags['landuse'] == 'vineyard') {
			if(zoom >= 10) {
				style['fillColor'] = orchard;
			}
			if(zoom >= 14) {
			  //polygon_pattern_file: url('symbols/vineyard.png');
			  //polygon_pattern_alignment: global;
			}
		}

		if(tags['landuse'] == 'orchard') {
			if(zoom >= 10) {
				style['fillColor'] = orchard;
			}
			if(zoom >= 14) {
			  //polygon_pattern_file: url('symbols/orchard.png');
			  //polygon_pattern_alignment: global;
			}
		}

		if(tags['landuse'] == 'cemetery'){
			if(zoom >= 10) {
				style['fillColor'] = cemetery;
			}
		}

		if(tags['landuse'] == 'residential' && zoom >= 10) {
			style['fillColor'] = residential;
			if(zoom >= 16) {
				style['weight'] = .5;
				style['color'] = residential_line;
			}
		}

		if(tags['landuse'] == 'garages' && zoom >= 13) {
			style['fillColor'] = garages;
		}

	}

	if(tags.amenity){  
		if(tags['amenity'] == 'grave_yard') {
			if(zoom >= 10) {
				style['fillColor'] = cemetery;
			}
		}

		if(tags['amenity'] == 'place_of_worship' && zoom >= 13) {
			style['fillColor'] = place_of_worship;
		    //polygon_clip: false;
		    if(zoom >= 15) {
		    	style['color'] = place_of_worship_outline;
		    	style['weight'] = 0.3;
		    // line_clip: false;
			}
		}

		if(tags['amenity'] == 'prison' && zoom >= 10) {
			style['color'] = '#888';
			style['weight'] = 3;
				//line_opacity: 0.329;
		}

		if(tags['amenity'] == 'hospital' || tags['amenity'] == 'university' || tags['amenity'] == 'college' || tags['amenity'] == 'school' || tags['amenity'] == 'kindergarten') {
			if(zoom >= 10) {
				style['fillColor'] = residential;
				if(zoom >= 12) {
					style['fillColor'] = educational_areas_and_hospital;
					if(zoom >= 13) {
						style['weight'] = 0.3;
						style['color'] = 'brown';
					}
				}
			}
		}

		if(tags['amenity'] == 'parking' && zoom >= 10 || tags['amenity'] == 'bicycle_parking' && zoom >= 10 || tags['amenity'] == 'motorcycle_parking' && zoom >= 10) {
			style['fillColor'] = parking;
			if(zoom >= 15) {
				style['weight'] = 0.3;
				style['color'] = parking;
			}
		}

	}

	if(tags.military){  
		if(tags['military'] == 'danger_area') {
			if(zoom >= 9 && zoom < 11) {
				style['fillColor'] = danger_area;
		      //polygon_opacity: 0.3;
		  }
		  if(zoom >= 11) {
		     // polygon_pattern_file: url('symbols/danger.png');
		     style['fillColor'] = danger_area;
		 }
		}
	}	



	if(tags.natural){ 
		if(tags['natural'] == 'wood') {
			if(zoom >= 8) {
				style['fillColor'] = forest;
			}
		}

		if(tags['natural'] == 'bare_rock' && zoom >= 9) {
			style['fillColor'] = bare_ground;
			if(zoom >= 13) {
		      //polygon_pattern_file: url('symbols/rock_overlay.png');
		  }
		}

		if(tags['natural'] == 'scree' || tags['natural'] == 'shingle') {
			if(zoom >= 9) {
				style['fillColor'] = bare_ground;
				if(zoom >= 13) {
		       // polygon_pattern_file: url('symbols/scree_overlay.png');
			   }
			}
		}

		if(tags['natural'] == 'sand' && zoom >= 9) {
			style['fillColor'] = sand;
		}

		if(tags['natural'] == 'heath' && zoom >= 10) {
			style['fillColor'] = heath;
		}

		if(tags['natural'] == 'scrub') {
			if(zoom >= 10) {
				style['fillColor'] = scrub;
			}
			if(zoom >= 14) {
				 // polygon_pattern_file: url('symbols/scrub.png');
			}
		}

		if(tags['natural'] == 'beach' && zoom >= 10) {
			style['fillColor'] = beach;
		   // polygon_pattern_file: url('symbols/beach.png');
		   // polygon_pattern_alignment: global;
		}
	}


	if(tags.power){ 

		if(tags['power'] == 'station' && zoom >= 10 || tags['power'] == 'generator' && zoom >= 10 || tags['power'] == 'sub_station' && zoom >= 13 || tags['power'] == 'substation' && zoom >= 13) {
			style['fillColor'] = industrial;
			if(zoom >= 15) {
				style['fillColor'] = power;
			}
			if(zoom >= 16) {
				style['weight'] = 0.5;
				style['color'] = power_line;
			}
		}

	}

	if(tags.aeroway){
		if(tags['aeroway'] == 'apron' && zoom >= 10) {
			style['fillColor'] = apron;
		}

		if(tags['aeroway'] == 'aerodrome' && zoom >= 10) {
			style['fillColor'] = aerodrome;
			style['weight'] = 0.2;
			style['color'] = aerodrome;
		}
	}  

	if(tags.highway){ 
		if(tags['highway'] == 'services' || tags['highway'] == 'rest_area') {
			if(zoom >= 10) {
				style['fillColor'] = rest_area;
			}
		}
	}

	if(tags.railway){ 
		if(tags['railway'] == 'station' && zoom >= 10) {
			style['fillColor'] = station;
		}
	}
return style;
}

/*
#text_line {
  if(tags[type] == 'cliff' && zoom >= 15 ||
  if(tags[type] == 'man_made_embankment' && zoom >= 15) {
    text_name: "[name)";
    text_halo_radius: 1;
    text_halo_fill: rgba(255,255,255,0.6);
    text_fill: #999;
    text_size: 10;
    text_face_name: book_fonts;
    text_placement: line;
    text_dy: 8;
    text_vertical_alignment: middle;
    text_spacing: 400;
  }
}
*/
/*
	var style = new Array;

	       style['color'] = playground;
           style['fillColor'] = playground;
           style['weight'] = 0.3;
	if(type == 'leisure'){
		if ((tags[type] == 'park') && zoom >= 13) {
           style['color'] = park;//stroke_color
           style['fillColor'] = park;//fill_color
           style['weight'] = 0.3;//stroke_width
        }
		
		if ((tags[type]== 'playground') && zoom >= 13) {
           style['color'] = playground;
           style['fillColor'] = playground;
           style['weight'] = 0.3;
        }
		
	}
		
	//landuse
	    if(type == 'landuse'){

		if ((tags[type]== 'quarry') && zoom >= 10) {
           style['color'] = 'grey';
           style['fillColor'] = quarry;
           style['weight'] = 0.5;
        }
	
		if ((tags[type]== 'vineyard' || tags[type] == 'orchard') && zoom >= 10) {
           style['color'] = orchard;
           style['fillColor'] = orchard;
           style['weight'] = 0.5;
        }
		
		if ((tags[type]== 'cemetery') && zoom >= 10) {
           style['color'] = cemetery;
           style['fillColor'] = cemetery;
           style['weight'] = 0.5;
        }
    }
    return style;
}
*/