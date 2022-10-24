import global_ from "../../src/components/Global";
var map;
function styleSheet() {
    this.color = undefined;
    this.fillColor = undefined;
    this.weight = undefined;
    this.dashArray = undefined;
    this.lineCap = 'round';
    this.lineJoin = 'round';
    this.line_clip = false;
    this.opacity = 1;
    this.fillOpacity = 0;
}
//样式表原型
function mystyle(feature) {
    var zoom = map.getZoom();
    var style = new styleSheet();
    var style = waterCss(feature.properties, zoom, style);
    var style = waysCss(feature.properties, zoom, style);
    var style = landcoverCss(feature.properties, zoom, style);
    var style = railwayCss(feature.properties, zoom, style);
    if (style.fillColor !== undefined) {
        style.fillOpacity = 1;
    }
    return style;
};

//标记图标和文字标签对象以便处理
//标签显示位置未做geohash修改
function myoneach(feature, layer) {
    if (map.getZoom() < feature.properties.minzoom) {
        return;
    }
    //2021_9_12去掉了不必要的展示细节
};

function myLowfilter(feature, layer) {
    if (map.getZoom() < feature.properties.minzoom) {
        return false;
    }
    if (map.getZoom() > 18) {
        if (feature.properties.room === 'building') {
            return true;
        }
        else {
            return false;
        }
    }
    else {
        if (feature.geometry.type === 'Point' || feature.properties.level || feature.properties.building || feature.properties.natural === 'water' || feature.properties.railway) {
            return false;
        }
        else {
            if (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon')
                return true;
        }
    }
};
function myHighfilter(feature, layer) {
    if (map.getZoom() < feature.properties.minzoom) {
        return false;
    }
    if (map.getZoom() > 18) {
        if (feature.properties.level && feature.properties.room && feature.properties.room !== 'building' && feature.geometry.type !== 'Point') {
            return true;
        }
        else {
            return false;
        }
    }
    else {
        if (feature.geometry.type === 'Point' || feature.properties.level || feature.properties.building) {
            return false;
        }
        else {
            if (feature.geometry.type !== 'Polygon' || feature.properties.natural === 'water' || feature.properties.railway)
                return true;
        }
    }
};
var GeohashURL = null
var GeohashlowLayer
var GeohashhighLayer
function update_map(map_) {
   
    map = map_
    console.log(">>>>>>>>>>>>>>>>update map...");
    if (GeohashlowLayer && GeohashlowLayer) {
        map.removeLayer(GeohashlowLayer);
        map.removeLayer(GeohashhighLayer);
    }

    GeohashlowLayer = new L.GeohashLayer.GeoJSON(GeohashURL, { maxZoom: 18, minZoom: 1 },
        {
            style: mystyle,
            onEachFeature: myoneach,
            filter: myLowfilter
        })
    map.addLayer(GeohashlowLayer);

    GeohashhighLayer = new L.GeohashLayer.GeoJSON(GeohashURL, { maxZoom: 18, minZoom: 1 },
        {
            style: mystyle,
            onEachFeature: myoneach,
           filter: myHighfilter
        })
     map.addLayer(GeohashhighLayer);
return [GeohashhighLayer,GeohashlowLayer]
}
// function remove_map(map_){
//     map = map_
//     console.log(">>>>>>>>>>>>>>>>remove map");
//     if (GeohashlowLayer && GeohashlowLayer) {
//         map.removeLayer(GeohashlowLayer);
//         map.removeLayer(GeohashhighLayer);
//     }
// }
// var URL = window.location.href;		
//geoserver上提供geohashjson的地址，根据geohash值即可得到
// var GeohashURL = URL + 'geoserver/h/{z}/{h}';
// 实际上此时的GeoHashURL就没有用上，用的还是静态数据
// console.log("GeohashURL:",GeohashURL);
// console.log("显示底层图形");
// var GeohashURL =null;
// var GeohashlowLayer = new L.GeohashLayer.GeoJSON(GeohashURL,{maxZoom:18,minZoom:1},
// {
//     style:mystyle,
//     onEachFeature:myoneach,
//     filter:myLowfilter
// })
// map.addLayer(GeohashlowLayer);
// // console.log("底层图形已显示");

// // console.log("显示高层图形");
// var GeohashhighLayer = new L.GeohashLayer.GeoJSON(GeohashURL,{maxZoom:18,minZoom:1},
// {
//     style:mystyle,
//     onEachFeature:myoneach,
//     filter:myHighfilter
// })
// map.addLayer(GeohashhighLayer);
// // console.log("高层图形已显示");



// var tmp_geojson =  ["wx4eqcet93y","wx4eqcet93y"];
// var line =  L.polyline(tmp_geojson, {color:'#FF0000',fillColor:'#FF0000',fillOpacity:1});
// console.log(line);
// map.addLayer(line);
// GeohashhighLayer.setZIndex(4);
// GeohashlowLayer.setZIndex(3);		

export { update_map,remove_map }