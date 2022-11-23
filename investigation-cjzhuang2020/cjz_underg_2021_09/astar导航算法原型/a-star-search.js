//曼哈顿距离的参数待定，目前只是测试功能正确性

//计算曼哈顿距离的参数（可调）
const P = 10;
//数该长度下的geohash对应的格子数（可调）
const PRECISTON = 10;

let queuePush = 0;
let queuePop = 0;
let queueTop = 0;

let mhCount = 0;

//astar算法主流程逻辑
function astar(start, end,startGeohash,endGeohash){
    // const graph = this.state.graph;
    const timer = Date.now();
    const frontier = new FlatQueue();
    frontier.push(start, 0);
    queuePush++;
    //记录每个节点的父节点
    let path = new Map();
    //记录起点到当前节点的实际费用
    let costSofar = new Map();
    costSofar.set(start, 0);

    let current, adjNodes, priority;
    let nodes = [];
    let pathCounter = 0;
    while (frontier.length > 0) {
        current = frontier.pop(); //remove smallest item
        queuePop++;
        queueTop++;
        adjNodes = adjacencyList[current] || [];
        console.log("current", current)
        console.log("adjNodes", adjNodes)
        nodes.push(current);

        if (current === end) {
            let runTime = Date.now() - timer;

            let costAll = Array.from(costSofar)[costSofar.size - 1][1];
            // this.setState({ costAll, nodesVisited: nodes.length, runTime });
            console.log(
            `%分析了 ${pathCounter} 条路，最短的路径花费为： ${costAll}.`,
            "color: #fff; background-color:#b32400; border-radius: 5px; padding: 2px"
            );
            console.log("runTime", runTime)
            console.log("path", path)
            //处理path获得最短路径
            animatePath(path, startGeohash, endGeohash)
            break;
        }

        let i = 0;
        for (let next of adjNodes) {
            let newCost = costSofar.get(current) + adjacencyList[current][i].cost;

            if (!costSofar.has(next.target) || newCost < costSofar.get(next.target)) {
                if (newCost < costSofar.get(next.target)) pathCounter++; //How many different paths analysed

                costSofar.set(next.target, newCost);
                priority = newCost + manhattan(next.targetGeohash, endGeohash) * P;
                mhCount++;
                frontier.push(next.target, priority);
                queuePush++;
                path.set(next.targetGeohash, next.sourceGeohash);
            }
            i++;
        }
    }
    if (!frontier.length) {
        console.log(`${nodes.length} nodes visted in ${Date.now() - timer} ms`);
        console.log(
            `没找到路径，${current} 这个点可能是死胡同`
        );
    }
    console.log("queuePush:",queuePush)
    console.log("queuePop:",queuePop)
    console.log("queueTop:",queueTop)
    console.log("mhCount:",mhCount)
};

function animatePath(path, startGeohash, endGeohash){
    let currentGeohash = endGeohash
    let backwards = []
    while (currentGeohash !== startGeohash) {
        backwards.push(currentGeohash);
        currentGeohash = path.get(currentGeohash);
    }
    backwards.push(startGeohash);
    backwards.reverse();
    console.log(`Path length ${backwards.length}`)
    console.log("Path traveled: ", backwards)


    function draw2(p, q){
		if(q == backwards.length){
			return 1
		}

		function doit2(geohash1, geohash2){
            console.log("geohash1, geohash2: ", geohash1, geohash2)
            let route = L.polyline([geohash1,geohash2],{color:"#00CCFF",fillColor:"#00CCFF",fillOpacity:1, weight:10});
            map.addLayer(route)
            sleep(100)
        }

		setTimeout(doit2(backwards[p], backwards[q]), 0)
		draw2(p+1, q+1)
	}
    draw2(0, 1)
    return backwards
}

function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}

function manhattan(nextGeohash, endGeohash){
    //数该长度下的geohash对应的格子数
    nextGeohash = nextGeohash.slice(0, PRECISTON)
    endGeohash = endGeohash.slice(0, PRECISTON)

    //前缀匹配优化速度
    for(let i = 0; i < nextGeohash.length; i++){
        if(nextGeohash[i] != endGeohash[i]){
            nextGeohash = nextGeohash.slice(i)
            endGeohash = endGeohash.slice(i)
        }
    }
    
    let dislat1 = getLatBlock(nextGeohash);
	let dislon1 = getLonBlock(nextGeohash);
	let dislat2 = getLatBlock(endGeohash);
	let dislon2 = getLonBlock(endGeohash);

    let dislat = Math.abs(dislat2 - dislat1)
	let dislon = Math.abs(dislon2 - dislon1)
    return dislat + dislon
}


var Bits = [16, 8, 4, 2, 1];
var Base32 = "0123456789bcdefghjkmnpqrstuvwxyz".split("");
// console.log(manhattan("wx4epmm18xv", "wx4epbymzvv"))

function getLatBlock(geohash) {//geohashγ��
	var even = true;
	var lat = 0;

	for(var i = 0; i < geohash.length; i++)
	{
		var c = geohash[i];
		var cd = Base32.indexOf(c);
		for (var j = 0; j < 5; j++)
		{
			var mask = Bits[j];
			if (!even){
				lat = lat * 2;
				if ((cd & mask) != 0) {
					lat = lat + 1;
				}
			}
			even = !even;
		}
	}
	return lat;
}

function getLonBlock(geohash) { //geohash����
	var even = true;
	var lon = 0;

	for(var i = 0; i < geohash.length; i++)
	{
		var c = geohash[i];
		var cd = Base32.indexOf(c);
		for (var j = 0; j < 5; j++)
		{
			var mask = Bits[j];
			if (even){
				lon = lon * 2;
				if ((cd & mask) != 0) {
					lon = lon + 1;
				}				
			}
			even = !even;
		}
	}
	return lon;
}
// console.log("getLatBlock(mm18x)", getLatBlock("mm18x"))
// console.log("getLonBlock(mm18x)", getLonBlock("mm18x"))
// console.log("getLatBlock(bymzv)", getLatBlock("bymzv"))
// console.log("getLonBlock(bymzv)", getLonBlock("bymzv"))
// console.log("manhattan", manhattan("wx4epmm18xv", "wx4epbymzvv"))
