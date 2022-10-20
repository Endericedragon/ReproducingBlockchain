import { mapContractAddress, mapContractAbi } from "./mapContract.js"
import { trafficContractAddress, trafficContractAbi } from "./trafficContract.js"

//Map contract
var mapContract;
var web3Map;
//Traffic contract
var trafficContract;
var web3Traffic;
//Contract Init
function initContract() {
    if (typeof web3 !== 'undefined') {
        web3Map = new Web3(web3.currentProvider);
        web3Traffic = new Web3(web3.currentProvider);
    } else {
        web3Map = new Web3(new Web3.providers.WebsocketProvider("ws://127.0.0.1:8546"));
        web3Traffic = new Web3(new Web3.providers.WebsocketProvider("ws://127.0.0.1:8546"));
    }
    mapContract = new web3Map.eth.Contract(mapContractAbi, mapContractAddress);
    trafficContract = new web3Traffic.eth.Contract(trafficContractAbi, trafficContractAddress);
    //passengerEvent
    trafficContract.events.routeEvent(function (error, event) {
        if (error) {
            console.log("error: ", error);
        }
        if (event.returnValues.passengerId.slice(0, 42) == passengerId.toLowerCase()) {
            console.log(event);
            let color = (isboard == false) ? "#FFFF00" : "#00FF00";
            trafficContract.methods.getRoutes(vehicleId).call({ from: passengerId, gas: 500000 }).then(function (result) {
                console.log("getRoutes: ", result);
                let astarRoute = [];
                costAll = Number(result[1]);
                console.log("车辆行驶时间：", costAll);
                for (let i = 0; i < result[0].length; i++) {
                    if (result[0][i].toString() != "0x0000000000000000000000000000000000000000000000000000000000000000") {
                        let temp = web3Map.utils.hexToAscii(result[0][i]).slice(0, 11)
                        astarRoute.push(temp)
                    }
                }
                astarRoute.reverse()
                console.log("astar: ", astarRoute)
                //add route point to map
                function draw2(p, q) {
                    if (q == astarRoute.length) {
                        return 1
                    }
                    function doit2(geohash1, geohash2) {
                        console.log("geohash1, geohash2: ", geohash1, geohash2)
                        let route = L.polyline([geohash1, geohash2], { color: color, fillColor: color, fillOpacity: 1, weight: 7 });
                        if (isboard == false) {
                            vehicleLayers.push(route);
                        } else {
                            togetherLayers.push(route);
                        }
                        // map.addLayer(route)
                        // sleep(100)
                    }
                    setTimeout(doit2(astarRoute[p], astarRoute[q]), 0)
                    draw2(p + 1, q + 1)
                }
                draw2(0, 1)
                if (isboard == false) {
                    vehicleGroup = L.layerGroup(vehicleLayers);
                    map.addLayer(vehicleGroup);
                } else {
                    togetherGroup = L.layerGroup(togetherLayers);
                    map.addLayer(togetherGroup);
                }
            })
            if (isboard == false) {
                isboard = true
                trafficContract.methods.confirmBoard(vehicleId).send({ from: passengerId, gas: 5000000, position: "w3511111111111", txtime: 278000 }).then(function (result) {
                    $("#vehicleEvent").val("乘客确认上车");
                    console.log("乘客确认上车");
                })
            } else {
                $("#vehicleEvent").val("乘客到达目的地");
                isboard = false;
            }
        }
    })

    //rejectEvent
    trafficContract.events.rejectEvent(function (error, event) {
        if (error) {
            console.log("error: ", error);
        }
        if (event.returnValues.passengerId.slice(0, 42) == passengerId.toLowerCase()) {
            console.log(event);
            $("#vehicleEvent").val("车辆取消了交易");
            console.log("车辆取消了交易");

        }
    })
    console.log("mapContract", mapContract);
    console.log("trafficContract", trafficContract);
    console.log("OK!");
}