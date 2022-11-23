let fs=require('fs');
let Web3 = require('web3');
let web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

//Traffic contract
let trafficContractAddress = '0x0311d0c7f879fb34fe0a10233f4e7241ff5b7382';

let vehicleIdList = JSON.parse(fs.readFileSync('./accountResult/partVehicle.json', 'utf-8'));
let vehiclePositionList = JSON.parse(fs.readFileSync('./pointsResult/vehicle100.json', 'utf-8'));

let trafficContractAbi = JSON.parse(fs.readFileSync('./trafficContractAbi.json', 'utf-8'));
let trafficContract = new web3.eth.Contract(trafficContractAbi,trafficContractAddress);

async function initVehicle(){
    const task = [];
    for(let i = 0; i < vehicleIdList.length; i++){
        task.push(initUnit(vehicleIdList[i], vehiclePositionList[i]));
    }
    Promise.all(task).then((res) => {
        console.log("所有车辆都上传了位置")
    })
}
initVehicle();
// deleteVehicle();
// getVehicleIdList();

async function initUnit(vehicleId, vehiclePosition){
    return await trafficContract.methods.initVehicle(vehicleId, web3.utils.asciiToHex(vehiclePosition)).send({from: vehicleId, gas: 50000000,position: vehiclePosition, txtime:Date.now()});
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