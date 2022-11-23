# investigation-cjzhuang2020

 * [开题报告wiki页面](http://os.cs.tsinghua.edu.cn/research/investigation/cjzhuang2020)

[2021-09-05网格实现基本流程展示](https://www.notion.so/2021-09-15-541f855ebe884e20b9a9c3c6034fc983)

[9/14——9/21实现道路轨迹规划 (notion.so)](https://www.notion.so/9-14-9-21-3b1c19a9984e4f3ea01a4f03c7826077)

[9/21——9/29将路径规划工作迁移到智能合约 (notion.so)](https://www.notion.so/9-21-9-29-cb17927045cd4c1bab604ef09aba580b)



**现有成果：**

	1. 完成了基于geohash的区块链智能合约地图数据存储
	1. 完成了基于geohash的区块链智能合约路径导航
	1. 完成了出租车系统的车乘调度逻辑和并发控制
	1. 系统部署在支持区域状态的树状区块链上，可利用区域状态进行车辆调度

**可能的改进工作：**

	1. 将调度系统升级为可拼车系统，融入碳中和环保理念
	1. 对geohash、分布式和以太坊域名（ENS）的概念进行探究结合
	1. 探索更先进的分布式系统导航算法或车辆调度算法
	1. 探索基于区块链的更安全的加密验证机制
	1. 探索适配于此系统的信誉值机制，给车辆和乘客加上可计算的信誉值属性，提高双方可信度



**HTML文件说明：(按创建的先后顺序)**

system开头的都是比较早的文件，功能有欠缺

sys_passenger1和sys_passenger2是未配置自动化脚本之前进行正确性测试的两个乘客终端

sys_vehicle1和sys_vehicle2是未配置自动化脚本之前进行正确性测试的两个车辆终端

后来用基于python的selenium框架写出了自动运行浏览器的脚本文件，具体过程可以参考《[多节点调度系统.md](http://xn--cssy2kuwrxrlfjcr7hwlt.md)》

sys_passenger是自动化脚本调用的乘客终端

sys_vehicle是自动化脚本调用的车辆终端

这两种终端，通过不同的账户id，进行对应身份信息的分配

geopaint.html：没啥用，应该是在成佳壮之前别人测试地图工具用的

gps2geohash.html：一个用来将经纬度点转成geohash点的页面，也能算距离，方便测试用

double_cjz.html：测试导航算法的客户端

singleSystem.html：用来测试单行网格的终端

real_eth_cjz.html：测试智能合约上的astar算法用的终端 real_js_cjz.html：测试js实现的astar算法用的终端

traffic-testreal.html：测试多车辆信誉值计算，现在还没用 traffic-testsim.html：测试多车辆信誉值计算，现在还没用

**JS文件说明：**

a-star-search-eth.js：利用js本身有的优先队列（frontier）数据结构进行astar算法的geohash化。

 a-star-search.js：测试用的文件，由于智能合约不支持优先队列，故在js脚本中先测试一下怎么模拟实现优先队列。

BeijingGeoHash.json：存储北京市的矢量地图数据，但不是最新的数据 bitmap.js：扒取北京市地图最新数据，数据从数据库导出成json后，在前端做测试用的文件

common.js：存一些工具函数的文件

db-tools.js：一位叫董斌的学长做毕设的时候存工具函数的文件，应该用不太到 

geohash-new.js：存geohash工具函数的文件 geohash.js：存geohash工具函数的文件 

GeohashLayer.GeoJSON.js：将生成好的geojson直接粘贴到这里便可在前端直接渲染出geohash矢量地图 

geolib.js：存geohash工具函数的文件 

GetHighway.js：存储地图类型工具函数 

getRoads.js：用来从区块链扒取地图的工具函数 

gpsarray.js：存真实的车辆gps轨迹 

gradientColor.js：不同的信誉值对应不同的颜色，渐变效果

landcover.js：用来存储地图样式 

leaflet-src-Geohash.js：geohash矢量地图的底层实现 

leaflet-src.js：原经纬度矢量地图的底层实现，一般不用管 

leaflet.css：存储地图样式，一般不用管 

leaflet.label-src.js：矢量地图的底层，一般不用管 

leaflet.label.css：矢量地图的底层样式，一般不用管 

leaflet.label.js：矢量地图的底层，一般不用管 

main.css：样式文件，一般不用管 

mapConfig.js：地图配置文件，一般不用管 

mapContract.js：存地图合约配置的文件，区块链部署MapContract合约后，要将这个文件里的地址和abi改成新的。 

neighbors.js：模拟邻居车辆用的文件 

OSMBuildings-Leaflet.debug.js：配置文件，一般不用管 

passenger1.js：第一名乘客的位置、起止点等配置 

passenger2.js：第二名乘客的位置、起止点等配置 

passengers.js：自动化后，乘客的位置、起止点等配置

passenger_test.py：自动化逻辑文件 

railway.js：地图配置文件，一般不管 

routes.js：一些真实轨迹坐标点，目前没有用 

storeAdj.js：astar算法需要存储邻居，这是存储邻居的数据结构 

StoreMap.js：曾经用来存储MapContract abi的文件，现在自动化后不再使用了 

test.js：一般不用 

testMap.js：存地图json数据用的文件 

TileLayer.GeoJSON.js：一般不管 

toBytes32.js：将geohash转成bytes32，用来在remix上输入bytes32参数测试智能合约的函数 

trafficContract.js：存地图合约配置的文件，区块链部署TrafficContract合约后，要将这个文件里的地址和abi改成新的。 

vehicle.js：

vehicle1.js：第一名车辆的位置等配置 

vehicle2.js：第二名车辆的位置等配置 

vehicles.js：自动化后，车辆的位置等配置 

vehicle_test.py：自动化逻辑文件 

verifyRecord.js：邻居车辆对主车辆反馈的消息，现在不用 

water.js：一般不管 

ways.js：一般不管

