function railwayCss(properties,zoom,style) {
    if(properties.railway){
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
        if (/*properties["railway"] === 'subway' && */zoom >= 12 && zoom <=14) {
            
            style['color'] = '#999';
            style['weight'] = 2;
			style['dashArray'] = 15,5;
			style['lineCap'] = 'square';
        }        
        if (/*properties["railway"] === 'subway' && */zoom >= 14) {
            
            style['color'] = '#999';
            style['weight'] = 5;
			style['dashArray'] = 15,5;
			style['lineCap'] = 'square';
        }
        if (/*properties["railway"] === 'subway' && */(properties["tunnel"]=='yes' || properties["tunnel"]=='true') && zoom >= 12) {
            
            style['color'] = '#999';
            style['weight'] = 3;
			style['dashArray'] = 15,5;
			style['lineCap'] = 'square';
        }
    }

    return style;
}