// let origin = "wx4epnz0q70"
let vehicleRoute = [
    'wx4epnzb2fu', 'wx4epqb27dc', 'wx4epqbbq4v', 'wx4epqc82ff',
    'wx4epqf076y', 'wx4epqf8q4g', 'wx4epqg22dz', 'wx4epqgb76u',
    'wx4epqu2q4b', 'wx4epqv02dv', 'wx4epqt58tv', 'wx4epqmp08t',
    'wx4epqm42et', 'wx4epqjj8wm', 'wx4epqj109m', 'wx4epmvh2sj',
    'wx4epmtp8xj', 'wx4epmt509v', 'wx4epmmn2sv', 'wx4epmm18xt',
    'wx4epmjj0dt', 'wx4epmj02tm', 'wx4epkv5b8m', 'wx4epktp0ej',
    'wx4epkt42wj', 'wx4epkmjb8v', 'wx4epkm10ev', 'wx4epkjh2wt',
    'wx4ep7vpb9t', 'wx4ep7v50sm', 'wx4ep7tn2xm', 'wx4ep7t1bdj',
    'wx4ep7mj0sv', 'wx4ep7m02xv', 'wx4ep7j5bdt', 'wx4ep6vp0tt',
    'wx4ep6v488m', 'wx4ep6tjbem', 'wx4ep6t10wj', 'wx4ep6mh89j',
    'wx4ep6jpbev', 'wx4ep6j50wv', 'wx4ep3vn89t', 'wx4ep3v1bst',
    'wx4ep3tj0xm', 'wx4ep3t08dm', 'wx4ep3m5btj', 'wx4ep3jp28j',
    'wx4ep3j48dv', 'wx4ep2vjbtv', 'wx4ep2vtgmc', 'wx4ep2yjvvy',
    'wx4ep2yvbtf', 'wx4ep2zmgjz', 'wx4ep2zvvvg', 'wx4ep8btbtb',
    'wx4ep8cjgju', 'wx4ep8ctvvc', 'wx4ep8fmbmv', 'wx4ep8fvgjf',
    'wx4ep8gmvty', 'wx4ep8ujbmg', 'wx4ep8utgjb', 'wx4ep8vjvtu',
    'wx4ep8vvbmc', 'wx4ep8ymfvv', 'wx4ep8yvvtf', 'wx4ep8ztbjy',
    'wx4epbbjfvg', 'wx4epbbtvmz', 'wx4epbcmbju', 'wx4epbcvfvb',
    'wx4epbfmvmv', 'wx4epbgjbjc', 'wx4epbgtfty', 'wx4epbujvmf',
    'wx4epbutzvz', 'wx4epbvmftg', 'wx4epbvvvmb', 'wx4epbymzvu'
]

// new s({name:"getPosition",call:"eth_getPosition",params:2,inputFormatter:[v.inputAddressFormatter,v.inputDefaultBlockNumberFormatter]}),
// new s({name:"getAccountByRegion",call:"eth_getAccountByRegion",params:2,inputFormatter:[v.inputRegionFormatter,v.inputDefaultBlockNumberFormatter]}),
// new s({name:"getTxByRegion",call:"eth_getTxByRegion",params:2,inputFormatter:[v.inputRegionFormatter,v.inputDefaultBlockNumberFormatter]}),
// new s({name:"getRpByRegion",call:"eth_getRpByRegion",params:2,inputFormatter:[v.inputRegionFormatter,v.inputDefaultBlockNumberFormatter]}),

// let Bits = [16, 8, 4, 2, 1];
// let Base32 = "0123456789bcdefghjkmnpqrstuvwxyz".split("");

// let originLL = decode_geohash(origin)
// let lon = originLL[0]
// let lat = originLL[2]

// for(let i = 0; i < 10; i++){
//     lon = lon +  0.0008
//     let cur = encode_geohash(lon, lat, 11)
//     vehicleRoute.push(cur)
// }
// for(let i = 0; i < 40; i++){
//     lat = lat - 0.0008
//     let cur = encode_geohash(lon, lat, 11)
//     vehicleRoute.push(cur)
// }
// for(let i = 0; i < 30; i++){
//     lon = lon + 0.0008
//     let cur = encode_geohash(lon, lat, 11)
//     vehicleRoute.push(cur)
// }

// console.log(vehicleRoute)

// function encode_geohash(longitude, latitude,precision){
// 	var geohash = "";
// 	var even = true;
// 	var bit = 0;
// 	var ch = 0;
// 	var pos = 0;
//     var lat = [-90,90];
// 	var lon = [-180,180];
// 	while(geohash.length < precision){
// 		var mid;

//         if (even)
//         {
//             mid = (lon[0] + lon[1])/2;
//             if (longitude > mid)
//             {
//                 ch |= Bits[bit];
//                 lon[0] = mid;
//              }
//             else
//                 lon[1] = mid;
//         }
// 		else
//         {
//             mid = (lat[0] + lat[1])/2;
//             if (latitude > mid)
//             {
//                 ch |= Bits[bit];
//                 lat[0] = mid;
//             }
//             else
//                 lat[1] = mid;
// 		}
//         even = !even;
//         if (bit < 4)
//             bit++;
//         else
//         {
//             geohash += Base32[ch];
//             bit = 0;
//             ch = 0;
//         }
// 	}
// 	return geohash;
// }

// function decode_geohash(geohash)
// {
// 	var even = true;
//     var lat = [-90,90];
// 	var lon = [-180,180];

// 	for(var i=0; i< geohash.length; i++)
// 	{
// 		var c= geohash[i];
// 		var cd = Base32.indexOf(c);
// 		for (var j = 0; j < 5; j++)
// 		{
// 			var mask = Bits[j];
// 			if (even)
// 			{
// 				RefineInterval(lon, cd, mask);
// 			}
// 			else
// 			{
// 				RefineInterval(lat, cd, mask);
// 			}
// 			even = !even;
// 		}
// 	}

// 	return new Array(lon[0], lon[1], lat[0], lat[1]);
// }

// function RefineInterval(interval, cd, mask)
// {
// 	if ((cd & mask) != 0)
// 	{
// 		interval[0] = (interval[0] + interval[1])/2;
// 	}
// 	else
// 	{
// 		interval[1] = (interval[0] + interval[1])/2;
// 	}
// }