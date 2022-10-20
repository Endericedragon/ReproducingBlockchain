const { time } = require('console');
let fs=require('fs');
let Web3 = require('web3');
let web3 = new Web3(new Web3.providers.WebsocketProvider("ws://127.0.0.1:8546"));

//Map contract
let mapContractAddress = '0x564f66da247a731629070622e1ca2a7877bedc08';
let mapContractAbi = JSON.parse(fs.readFileSync('./contracts/storeMapAbi_old.json', 'utf-8'));
let mapContract = new web3.eth.Contract(mapContractAbi,mapContractAddress);

//Traffic contract
let trafficContractAddress = '0xa3df5e69ac95624456bba86a40498b951d47b94e';
let trafficContractAbi = JSON.parse(fs.readFileSync('./contracts/trafficAbi_old.json', 'utf-8'));
let trafficContract = new web3.eth.Contract(trafficContractAbi,trafficContractAddress);

// let vehicleIdList = JSON.parse(fs.readFileSync('./accountResult/partVehicle.json', 'utf-8'));
// let vehiclePositionList = JSON.parse(fs.readFileSync('./positionInit/vehiclePosition.json', 'utf-8'));
let vehicleIdList=["0xbc5232516842164aa73e912860a5fcd508c1509e"];
let vehiclePositionList =["wx4er19tt1t"];

let allVehicleMessage = [];

let timeInfo={};
let  time_init_1, time_init_2,time_distribute,time_navigate,time_getOn,time_pay,time_reset;
let allTimeInfo=[];

async function initVehicle(){

    const task = [];
    for(let i = 0; i < vehicleIdList.length; i++){
        task.push(initUnit(vehicleIdList[i], vehiclePositionList[i]));
    }
    Promise.all(task).then((res) => {
        console.log("所有车辆都上传了位置")
    })
}
fs.writeFileSync("./timeInfo/vehicleTimeInfo.json","[",{flag:'w',encoding:'utf-8',mode:'0666'},function(err){});
initVehicle();
// deleteVehicle();
// getVehicleIdList();

let countNum = 0;
let systemNum = 50;//系统要测试多少订单


async function initUnit(vehicleId, vehiclePosition){
    let vehicleMessage = {};

    //event
	trafficContract.events.Myevent(function(error, event){
		if(error != null){
			console.log("Myevent_error: ",error);
		}
		//whether to pick up the passenger
		if(event.returnValues.vehicleId.slice(0,42) == vehicleId.toLowerCase()){
			// console.log(event);
            time_distribute=Date.now();

			let passengerId = event.returnValues.passengerId;
			let passengerGeohash = web3.utils.hexToAscii(event.returnValues.passengerGeohash).slice(0,11);
            console.log(vehicleId,"接到了订单,乘客位置: ", passengerGeohash);
            console.log("乘客id: ", passengerId);
            
            vehicleMessage.passengerId = passengerId;
            vehicleMessage.passengerGeohash = passengerGeohash;
			timeInfo.distribute=time_distribute-time_init_2;

			pickUp(vehicleId, vehiclePosition, passengerId, passengerGeohash, vehicleMessage);
		}
	})
    //监听乘客付款事件
	trafficContract.events.payEvent(function(error, event){
		if(error != null){
			console.log("payEvent_error: ",error);
		}
		if(event.returnValues.vehicleId.slice(0,42) == vehicleId.toLowerCase()){
			// console.log("payEvent: " + vehicleId + "乘客已付款");
			time_pay=Date.now();
			timeInfo.pay=time_pay-time_navigate;

            trafficContract.methods.initVehicle(vehicleId, web3.utils.asciiToHex(vehicleMessage.endGeohash)).send({from: vehicleId, gas: 500000,position: vehicleMessage.endGeohash, txtime:Date.now()}).then(function(result){
                console.log("置状态为空车");
                vehiclePosition = vehicleMessage.endGeohash;
                allVehicleMessage.push(vehicleMessage);

				time_reset=Date.now();
				timeInfo.reset=time_reset-time_pay;
				time_init_2=Date.now();
				allTimeInfo.push(timeInfo);
                countNum++;
				console.log("count: " +countNum)
				console.log(timeInfo);
				fs.writeFileSync("./timeInfo/vehicleTimeInfo.json",JSON.stringify(timeInfo),{flag:'a',encoding:'utf-8',mode:'0666'},function(err){});
		
				
				
                if(countNum == systemNum){
                    // let gname = "./vehicleResult/region7_vehicle.json";
                    // let jsonstr = JSON.stringify(allVehicleMessage);
                    // fs.writeFileSync(gname,jsonstr,{flag:'w',encoding:'utf-8',mode:'0666'},function(err){});
					
					// fs.writeFileSync("./timeInfo/vehicleTimeInfo.json",JSON.stringify(allTimeInfo),{flag:'w',encoding:'utf-8',mode:'0666'},function(err){});
					 console.log("finish");
					 fs.writeFileSync("./timeInfo/vehicleTimeInfo.json","]",{flag:'a',encoding:'utf-8',mode:'0666'},function(err){});
				}else{
					fs.writeFileSync("./timeInfo/vehicleTimeInfo.json",",",{flag:'a',encoding:'utf-8',mode:'0666'},function(err){});
				}
            })
		}
	})

	//监听乘客上车事件
	trafficContract.events.boardEvent(function(error, event){
		if(error != null){
			console.log("boardEvent_error: ",error);
		}
		if(event.returnValues.vehicleId.slice(0,42) == vehicleId.toLowerCase()){
			console.log("boardEvent: " + vehicleId + "乘客已上车");
			console.log("执行了调度算法,车辆到达乘客所在位置");
			time_getOn=Date.now();
			timeInfo.getOn=time_getOn-time_distribute;
			manageToEnd(vehicleId, vehicleMessage.passengerId, vehicleMessage.passengerGeohash, vehicleMessage);
		}
	})

	time_init_1=Date.now();
    return await trafficContract.methods.initVehicle(vehicleId, web3.utils.asciiToHex(vehiclePosition)).send({from: vehicleId, gas: 500000,position: vehiclePosition, txtime:Date.now()}).then(()=>{
		time_init_2=Date.now();
		timeInfo.init=time_init_2-time_init_1;
	});
}

async function deleteVehicle(){
    const task = [];
    for(let i = 0; i < vehicleIdList.length; i++){
        task.push(deleteUnit(vehicleIdList[i]));
    }
    Promise.all(task).then((res) => {
        console.log("所有车辆都注销了")
    })
}
async function deleteUnit(vehicleId){
    return await trafficContract.methods.deleteVehicle(vehicleId).send({from: vehicleId, gas: 50000000,position: "w3511111111111", txtime:Date.now()});
}
// deleteVehicle();
// deleteUnit("0x4c454053ce95853afc4591c3a3ad20852428c619");

function getVehicleStatus(vehicleId){
	trafficContract.methods.getVehicleStatus(vehicleId).call({ from: vehicleId, gas: 50000000}).then(function(result){
		console.log("getVehicleStatus: ",result)
	})
}
// getVehicleStatus("0x04264684c97eeaaec075051ae660557db07e826c");
// "0x4c454053ce95853afc4591c3a3ad20852428c619", "0x344d60bccf77f085d3a3419d53f5fae1ec660c59", "0x6eda21bfaba44045e80235eec31b9f2ee673808a"

function getVehicleId(vehicleId){
	trafficContract.methods.getVehicleId(vehicleId).call({ from: vehicleId, gas: 50000000}).then(function(result){
		console.log("getVehicleId: ",result)
	})
}
// getVehicleId("0xff0c4b9260bc5a2137aaa30f78457e8f7da64b80");

function getVehicleIdList(){
	trafficContract.methods.getVehicleIdList().call().then(function(result){
		console.log("getVehicleIdList: ",result)
	})
}
// getVehicleIdList();




//确认接乘客
async function pickUp(vehicleId, vehiclePosition, passengerId, passengerGeohash, vehicleMessage){
	
	if(vehiclePosition == passengerGeohash){
		// store route
		trafficContract.methods.storeRoutes(0,vehicleId, passengerId, []).send({ from: vehicleId, gas: 8000000,position: vehiclePosition, txtime:Date.now()}).then(function(result){
			vehicleGroup = L.layerGroup(vehicleLayers);
			map.addLayer(vehicleGroup);
			console.log("存储路径成功");
		},function(error){
			console.log("存储路径失败:",error);
		});
		time_navigate=Date.now();
		timeInfo.navigateToStart=time_navigate-time_distribute;

        vehicleMessage.emptyAstarTime = 0;
        vehicleMessage.emptyRoute = [];
        vehicleMessage.emptyRouteTime = 0;
        vehicleMessage.countFrag = 0;//经过的路口数量
	}else{
		let astarTime1 = Date.now();
		mapContract.methods.astar(web3.utils.asciiToHex(vehiclePosition), web3.utils.asciiToHex(passengerGeohash)).call({ from: vehicleId, gas: 50000000000}).then(function(result){
			let astarTime2 = Date.now() - astarTime1;
			let countFrag = 0;
			for(let i = 0; i < result[0].length; i++){
				if(result[0][i].toString() != "0x0000000000000000000000000000000000000000000000000000000000000000"){
					countFrag++;
				}
			}
            let astarOriginRoute = result[0];
			let routeLength = Number(result[1]);

            trafficContract.methods.storeRoutes(routeLength,vehicleId, passengerId, astarOriginRoute).send({ from: vehicleId, gas: 5000000, position: vehiclePosition, txtime:Date.now()}).then(function(result){
	
				console.log("存储路径成功");
			});

			let astarRoute = [];
			for(let i = 0; i < result[0].length; i++){
				if(result[0][i].toString() != "0x0000000000000000000000000000000000000000000000000000000000000000"){
					let temp = web3.utils.hexToAscii(result[0][i]).slice(0, 11)
					astarRoute.push(temp)
				}
			}
			astarRoute.reverse();

			time_navigate=Date.now();
			timeInfo.navigateToStart=time_navigate-time_distribute;

            vehicleMessage.emptyAstarTime = astarTime2;//获取导航结果的时间
            vehicleMessage.emptyRoute = astarRoute;//导航结果
            vehicleMessage.emptyRouteTime = Math.floor(routeLength / 6000000);//按此导航结果开车的行驶时间,emptyRouteTime单位：毫秒
            vehicleMessage.countFrag = countFrag;//经过的路口数量
			
		}, function(err){
			console.error("astarErr: ", err)
		})
	}
}

async function manageToEnd(vehicleId, passengerId, passengerGeohash, vehicleMessage){
	
	//车辆接到乘客后通过合约获得其目的地
	trafficContract.methods.getPassengerEnd(passengerId).call({ from: vehicleId, gas: 50000000}).then(function(result){
		let endGeohash = web3.utils.hexToAscii(result).slice(0, 11);
		// console.log("目的地坐标:", endGeohash);

        let astarTime1 = Date.now()
		mapContract.methods.astar(web3.utils.asciiToHex(passengerGeohash), web3.utils.asciiToHex(endGeohash)).call({ from: vehicleId, gas: 50000000000}).then(function(result){
			let astarTime2 = Date.now() - astarTime1;
			let countFrag = 0;
			for(let i = 0; i < result[0].length; i++){
				if(result[0][i].toString() != "0x0000000000000000000000000000000000000000000000000000000000000000"){
					countFrag++;
				}
			}
			let astarOriginRoute = result[0];
			let routeLength = Number(result[1]);
			trafficContract.methods.storeRoutes(routeLength,vehicleId, passengerId, astarOriginRoute).send({ from: vehicleId, gas: 5000000,position: "wx111111111",txtime:Date.now()}).then(function(result){
				console.log("存储路径成功");
				time_navigate=Date.now();
				timeInfo.navigateToEnd=time_navigate-time_getOn;
	
			});
			let astarRoute = []
			for(let i = 0; i < result[0].length; i++){
				if(result[0][i].toString() != "0x0000000000000000000000000000000000000000000000000000000000000000"){
					let temp = web3.utils.hexToAscii(result[0][i]).slice(0, 11)
					astarRoute.push(temp)
				}
			}
			astarRoute.reverse();

	
            vehicleMessage.endGeohash = endGeohash;
            vehicleMessage.loadAstarTime = astarTime2;//获取导航结果的时间
            vehicleMessage.loadRoute = astarRoute;//导航结果
            vehicleMessage.loadRouteTime = Math.floor(routeLength / 6000000);//按此导航结果开车的行驶时间,emptyRouteTime单位：毫秒
            vehicleMessage.countFrag = countFrag;//经过的路口数量

			// console.log("执行了调度算法,车辆将乘客送到了终点");
		}, function(err){
			console.error("astarErr: ", err);
		})
	})   
}