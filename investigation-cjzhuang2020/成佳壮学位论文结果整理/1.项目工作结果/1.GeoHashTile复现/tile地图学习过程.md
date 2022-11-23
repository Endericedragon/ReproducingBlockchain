打开index.html

地图不能实现滚动缩放，下面是手动调节

![image-20210308000859843](C:\Users\LENOVO\AppData\Roaming\Typora\typora-user-images\image-20210308000859843.png)

修改缩放倍数为6

![image-20210308000952649](C:\Users\LENOVO\AppData\Roaming\Typora\typora-user-images\image-20210308000952649.png)

可以看清地图的轮廓，海南，不知直接改坐标改到北京对不对，因为还不知道下面的JSON文件记录的是啥

---

可以看到控制台报错了，错误如下：

![image-20210308001134738](C:\Users\LENOVO\AppData\Roaming\Typora\typora-user-images\image-20210308001134738.png)

源码位置：

![image-20210308001304485](C:\Users\LENOVO\AppData\Roaming\Typora\typora-user-images\image-20210308001304485.png)

这儿哪错了？看不出来

网上搜索类似报错，说可能是兼容问题，或者是遍历某个数组时溢出了，

鉴于是工具文件就先不管

尝试改了改，文件太大放弃修改并还原。

---

想先实现地图的自动缩放

本想自己通过leaflet的简单demo实现一个地图，但总是报错（好像是身份验证没通过？）...

![image-20210308224313638](C:\Users\LENOVO\AppData\Roaming\Typora\typora-user-images\image-20210308224313638.png)

佛了，再看看教程吧

---

把定位"w7"直接换成leaflet官网给的伦敦坐标试试？

失败了，显示不出东西来

---

看了下源码server_side的文件，里面引用的文件都不在，直觉是server端没发挥作用

---

- 对比了下李玮祺毕设的leaflet文件和geohashtile的leaflet文件，发现缺一个leaflet-src.js，观察浏览器代码发现，拖动和缩放的功能都是基于这个文件里的leaflet-map-pane实现的，直接paste并引用，没效果

- 再对比发现多一个leaflet-src-Geohash.js，那就应该在这里实现拖动和缩放

- 我来实现？好像不用，人家里面有leaflet-map-pane

那么index.html动不了是怎么回事呢？在哪调用这个leaflet-map-pane？

- copy了tileLayer ，没用
- 李玮祺的tileLayer是一个AJAX格式的引用，有一个辅助文件TileLayer.GeoJSON.js，AJAX我还没学过——但这个文件仿佛跟师姐这边的server有点关系

---

跟代码混了下脸熟，之后根据论文了解服务器功能和客户端功能会更有效率

---

### 提问：

- 师姐的源码和leaflet基本版本哪个更开箱即用？找到一个不知道行不行
- 哪些是工具文件？
- 我对server端的理解还不充分，需要事先运行吗？（比如npm run dev之类）
- "w7"是什么？怎么寻找相应地区的geohash？
- 怎么把海南的数据改成北京的？
- 我的最大缩放只能改到7，再放大就看不到地图了，怎么看到道路呢？
- 哪些是工具文件？哪些文件里的代码需要自己改？



---



- 发现leaflet-src-Geohash里有重复定义的函数



- leaflet-src-Geohash.js 9309行发现

```
/*zc
 * L.Geohashlayer.
 is a class that you can use as a base for loading
 * Geohash map from blockchain.
 */
```

注释

L.GeohashLayer = L.Class.extend



- tileLayer Dom树结构：

[Leaflet源码解析--TileLayer_Lekia的博客-CSDN博客_leaflet 源码](https://blog.csdn.net/weixin_39279307/article/details/86506557)

---



师姐给的geohash转化代码，用wx4er1.json来测试，可想而知报错了

```js
lineReader.eachLine(map_file, function(line, last, cb) {
	  	read_lonlat(line);
	  	cb();
		//console.log(++counter);
	});
```

报错：

```
SyntaxError: Unexpected token  in JSON at position 0
    at JSON.parse (<anonymous>)
    at read_lonlat (C:\Users\LENOVO\Desktop\geojson_lonlat2geohash\geojson_2_geohashjson-china_border.js:35:21)
    at C:\Users\LENOVO\Desktop\geojson_lonlat2geohash\geojson_2_geohashjson-china_border.js:28:5
    at C:\Users\LENOVO\Desktop\geojson_lonlat2geohash\line-reader\lib\line_reader.js:277:11
```

JSON解析出了问题，好像这个wx4er1.json文件里本身写的就是一个对象，不需要JSON.parse，

首尾加上双引号——尝试失败

首尾加上单引号——尝试失败

line.toString——失败

- 需要考察一下lineReader.eachLine的功能，百度，因为wx4er1.json文件里没有换行，所以整个文件就是一行，一下子就读进来了

去掉geojson_2_geohashjson-china_border.js文件第35行的JSON.parse？

找不到解决办法...累了





重现周畅的leaflet地图展现，写一个分析和部署帮助文档；

github链接（内涵论文地址）：https://github.com/ivyzhou/GeohashTile

geoHashTile项目结构如下：

![image-20210317113709185](C:\Users\LENOVO\Desktop\cscw实验室相关\tile地图学习过程.assets\image-20210317113709185.png)

在浏览器打开index-geohash.html可以直接看到地图



熟悉周畅的工具，把经纬度数据转换成geohash数据；