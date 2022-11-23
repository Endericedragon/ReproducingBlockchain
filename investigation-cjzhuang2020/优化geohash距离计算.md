算法代码分析：

```jsx
<script>
  //上1右1左0下0
  var deltaLat = 0.596496069;
  var deltaLon = [1.191555127,1.1800798,1.157239659,1.123254668,1.07845212,1.023263489,0.958220271,0.883948868,0.801164554,0.710664587,0.613320532,0.510069865,0.401906947,0.289873444,0.175048303,0.05853735];
 
  var cgz_lr = [[128,256],[256,512],[128,128],[256,256],[512,512],[128,256],[256,512],[128,128],[256,256],[512,512],[128,256],[256,512],[128,128],[256,256],[512,512],[128,256],[256,512],[128,128]];

  var Bits = [16, 8, 4, 2, 1];
  var precision = 10;
  var divnum = 4;
  var Base32 = "0123456789bcdefghjkmnpqrstuvwxyz".split("");

  //getDistanceByGeohash() wx4er44qvg wx4er44x2j
  let geo1 = "wx4er61yc5"
  let geo2 = "wx4er63c1j"
  //console.log("getBase32: ", getBase32(geo1)[0].toString(2), getBase32(geo1)[1].toString(2))
  //console.log("getLatBase32: ", getLatBase32(geo1).toString(2))
  console.log("getDistanceByGeohash: ", getDistanceByGeohash(geo1, geo2))
  console.log("deltaLon.length: ", deltaLon.length)
  console.log("cgz_lr.length: ", cgz_lr.length)

  function getDistanceByGeohash(geohash1, geohash2) {//获取两个geohash距离的主函数
    var vector = getVector2(geohash1, geohash2);
    var ans = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);
    return ans;
  }

  function getVector(geohash1, geohash2) { //获取两个geohash的东西距离和南北距离
    var ans = new Array();

    var londelta = getLonDelta(geohash1);
    var latdelta = getLatDelta(geohash1);
    console.log("londelta: ", londelta)
    console.log("latdelta: ", latdelta)
    var dislat1 = getLatBase32(geohash1);
    var dislon1 = getLonBase32(geohash1);
    var dislat2 = getLatBase32(geohash2);
    var dislon2 = getLonBase32(geohash2);

    console.log("dislat1: ", dislat1.toString(2))
    console.log("dislat2: ", dislat2.toString(2))
    console.log("dislat2 - dislat1: ", dislat2 - dislat1)
    var dislat = (dislat2 - dislat1) * latdelta;
    var dislon = (dislon2 - dislon1) * londelta;
    ans.push(dislon);
    ans.push(dislat);

    return ans;
  }

  function getVector2(geohash1, geohash2) { //geohash算向量
    var ans = new Array();
    var londelta = getLonDelta(geohash1);
    var latdelta = getLatDelta(geohash1);
    for(let i = 0; i < geohash1.length; i++){
      if(geohash1[i] != geohash2[i]){
        geohash1 = geohash1.slice(i)
        geohash2 = geohash2.slice(i)
      }
    }
    console.log("geohash1:", geohash1)
    console.log("geohash2:", geohash2)
    
    console.log("londelta: ", londelta)
    console.log("latdelta: ", latdelta)
    var dislat1 = getLatBase32(geohash1);
    var dislon1 = getLonBase32(geohash1);
    var dislat2 = getLatBase32(geohash2);
    var dislon2 = getLonBase32(geohash2);

    console.log("dislat1: ", dislat1.toString(2))
    console.log("dislat2: ", dislat2.toString(2))
    console.log("dislat2 - dislat1: ", dislat2 - dislat1)
    var dislat = (dislat2 - dislat1) * latdelta;
    var dislon = (dislon2 - dislon1) * londelta;
    ans.push(dislon);
    ans.push(dislat);

    return ans;
  }

  
  function getLonDelta(geohash) {//当前geohash块的东西宽度
	//console.log("getLonDelta");
	lat = getLatBase32(geohash);
	lat = lat >> (precision * 5 / 2 - (divnum + 1));//取前5位（divnum+1=5）
	if ((lat & (1 << divnum)) != (1 << divnum)) {//if lat的第一位是0
		lat = (1 << (divnum + 1) - 1) - lat;
	}
	lat = lat - (1 << divnum);
	return deltaLon[lat];
}

function getLatDelta(geohash) {//当前geohash块的南北宽度
	lon = getLonBase32(geohash);
	return deltaLat;
}

function getLonBase32(geohash) { //获取当前geohash相对地球原点的东西偏移块数
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

function getLatBase32(geohash) {//获取当前geohash相对地球原点的南北偏移块数
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
        console.log("i:", i, "j:", j, "latNow:", latNow, "cd:", cd, "mask:", mask, "lat:", lat, "latTo2:", lat.toString(2))
			}
			even = !even;
		}
	}

	return lat;
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
</script>
```

### 如何通过geohash计算两点之间的距离？

【提要】：长度为10位的geohash格子，每个格子的南北长是固定的，每个格子的东西宽度，可以按纬度的不同大致划分为16个区域，最后按纬度索引到不同的区域，即不同的东西宽度。也就是如下数据的由来：（单位：m）

```jsx
var deltaLat = 0.596496069;
var deltaLon = [1.191555127,1.1800798,1.157239659,1.123254668,1.07845212,1.023263489,0.958220271,0.883948868,0.801164554,0.710664587,0.613320532,0.510069865,0.401906947,0.289873444,0.175048303,0.05853735];
```

【基本思路】：

1. 数格子，两个geohash之间东西差多少个格子，南北差多少个格子。
2. 东西距离：东西差的格子数*每个格子的东西宽度，其中格子的宽度根据纬度的不同而变化。
3. 南北距离：南北差的格子数*每个格子的南北长度，所有地理位置的格子南北长度是不变的。
4. 直线距离：用东西和南北距离做勾股定理。

【如何数geohash块】：

1. 将geohash解码，获得经度二进制串和纬度二进制串。
2. 这个二进制串的十进制值，表示的是当前的geohash精度下，当前的geohash相对于地球原点的东西geohash格子数和南北geohash格子数。
3. 将两个geohash相对原点的格子数相减，即可得到这两个geohash之间相差的格子数。

【如何获取格子的长度和宽度】：

1. 在10位geohash的块中，南北长度都一致，此时主要考虑东西宽度随纬度的变化，即主要考虑getLatDelta(geohash)这个函数的原理。
2. 将geohash解码，获得纬度二进制串。
3. 根据纬度二进制串的前五位，将整个地球的南北划为32个相同南北长度的区域，南北半球各16个相同南北长度的区域
4. 计算出16个区域各自的东西宽度，根据纬度二进制串的前五位不同索引到相应的宽度，即为当前区域大致的东西宽度。

代码函数分析：

- function getDistanceByGeohash(geohash1, geohash2)//获取两个geohash距离的主函数
- function getVector(geohash1, geohash2)//获取两个geohash的东西距离和南北距离
- function getLonDelta(geohash)//获取格子的东西宽度
- function getLatDelta(geohash)//获取格子的南北长度
- function getLonBase32(geohash)//获取当前geohash相对地球原点的东西偏移块数
- function getLatBase32(geohash)//获取当前geohash相对地球原点的南北偏移块数
- RefineInterval(latNow, cd, mask)//解码为二进制串，利用此步骤进行数块

【算法优化】：

将两个geohash相对原点的数格子，改为两个geohash基于相同的前缀数格子。

原理：由于相同前缀解码后算出来的二进制串是相同的，对随后的减法并无影响，故只对geohash中不同的位开始的子串进行数格子和距离计算。

算法的JS实现：

```jsx
function getVector2(geohash1, geohash2) { //geohash算向量
    var ans = new Array();
    var londelta = getLonDelta(geohash1);
    var latdelta = getLatDelta(geohash1);

		//主要优化的地方
    for(let i = 0; i < geohash1.length; i++){
      if(geohash1[i] != geohash2[i]){
        geohash1 = geohash1.slice(i)
        geohash2 = geohash2.slice(i)
      }
    }//优化到此结束

    console.log("geohash1:", geohash1)
    console.log("geohash2:", geohash2)
    
    console.log("londelta: ", londelta)
    console.log("latdelta: ", latdelta)
    var dislat1 = getLatBase32(geohash1);
    var dislon1 = getLonBase32(geohash1);
    var dislat2 = getLatBase32(geohash2);
    var dislon2 = getLonBase32(geohash2);

    console.log("dislat1: ", dislat1.toString(2))
    console.log("dislat2: ", dislat2.toString(2))
    console.log("dislat2 - dislat1: ", dislat2 - dislat1)
    var dislat = (dislat2 - dislat1) * latdelta;
    var dislon = (dislon2 - dislon1) * londelta;
    ans.push(dislon);
    ans.push(dislat);

    return ans;
  }
```

算法采用智能合约实现时步骤更为复杂，

原因：

1. 智能合约不支持string类型的高级操作接口。
2. 智能合约中一个函数内包括参数和返回值，最多定义16个变量。

目前实现了智能合约的前缀算法
