/*
function waterCss(type,properties,zoom) {
	var style = new Array;
    if(type == 'waterway'){
        if (properties["waterway"] == 'river' && zoom >= 6) {
            
            style['color'] = '#0088FF';//stroke-color
            //style['fillColor'] = '#0088FF';
            style['weight'] = 5;
            //style['dashArray'] = 7;
        }
    }
    if(type == 'water'){
        if ((properties["natural"] == 'lake' && zoom >= 6) || (properties["natural"] == 'water' && zoom >= 6) || (properties["waterway"] == 'riverbank' && zoom >= 6) || (properties["natural"] == 'bay' && zoom >= 6)) {
            style['color'] = '#b5d0d0';
        }

        if(properties["water"] == 'lake' && zoom >=6){
            style['color'] = '#b5d0d0';
        }        
    }


    return style;
}
*/



function waterCss(tags,zoom,style) {
    //var style = new styleSheet();
    

  var water_text = '#6699cc';
  var glacier = '#ddecec';
  var glacier_line = '#9cf';
  var water_color = '#b5d0d0';

  //style['color'] color
  //style['fillColor'] fillColor
  //style['weight'] weight
  //style['dashArray'] dashArray
  //style['polygon_gamma'] polygon_gamma
  //style['lineCap'] lineCap
  //style['lineJoin'] lineJoin
  //style['line_clip'] line_clip
  //style['opacity'] opacity
  //style['flag_fill'] flag_fill

  if(tags.natural){

  //#water_areas 
    if(tags['natural'] == 'glacier') {
      if(zoom >= 6) {
        style['weight'] = 0.75;
        style['color'] = glacier_line;
        style['fillColor'] = glacier;
        if(zoom >= 8) {
          style['weight'] = 1.0;
        }
        if(zoom >= 10) {
          style['dashArray'] = 4,2;
          style['weight'] = 1.5;
        }
      }
    }

    if(tags['natural'] == 'water'){
      if(zoom >= 6) {
        style['fillColor'] = water_color;
      }
    }
  }

  if(tags.waterway){

    if(tags['waterway'] == 'dock' || tags['waterway'] == 'canal') {
      if(zoom >= 9){
        style['fillColor'] = water_color;
      }
    }

    if(tags['waterway'] == 'riverbank'){
      if(zoom >= 6) {
        style['fillColor'] = water_color;
      }
    }
  }

  if(tags.landuse){

    if(tags['landuse'] == 'basin' && zoom >= 7) {
      style['fillColor'] = water_color;
      /*
      if(way_pixels >= 4) {
        style['polygon_gamma'] = 0.75;
      }
      if(way_pixels >= 64) {
        style['polygon_gamma'] = 0.6;
      }
      */
    }

    if(tags['landuse'] == 'reservoir'){
      if(zoom >= 6) {
        style['fillColor'] = water_color;
      }
    }
  }


  // #water_lines_casing 
    if(tags['waterway'] == 'stream' || tags['waterway'] == 'ditch' || tags['waterway'] == 'drain') {
        if(zoom >= 13) {
          style['weight'] = 2.5;
          style['color'] = 'white';
          if(tags['waterway'] == 'stream' && zoom >= 15) {
            style['weight'] = 3.5;
          }
          if(tags['intermittent'] == 'yes') {
            style['dashArray'] = 4,3;
            style['lineCap'] = 'butt';
            style['lineJoin'] = 'round';
            style['line_clip'] = false;
          }
        }
    }

  //#water_lines_low_zoom 

    if(tags['waterway'] == 'river' && zoom >= 8 && zoom < 12) {
      if(tags['intermittent'] == 'yes') {
        style['dashArray'] = 8,4;
        style['lineCap'] = 'butt';
        style['lineJoin'] = 'round';
        style['line_clip'] = false;
      }
      style['color'] = water_color;
      style['weight'] = 0.7;
      if(zoom >= 9) { style['weight'] = 1.2; }
      if(zoom >= 10) { style['weight'] = 1.6; }
    }
    return style;
}

