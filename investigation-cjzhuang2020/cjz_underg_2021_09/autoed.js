var Web3 = require('web3');
// var json = require("./build/StoreMap.json");
// var contract = require("truffle-contract");
// var MyContract = contract(json);
var fs = require('fs');
var callfile = require('child_process');


var web3
var node1

var genesisFile = './genesis.json';
var passengerFile = './passengerAccounts.py';
var vehicleFile = './vehicleAccounts.py';
var vehiclePositionFile = './vehicles.js';

var intersections = [
    'wx4er01st5v',
    'wx4er2juseu',
    'wx4erb4hs5g',
    'wx4epj1dv0j',
    'wx4epmjfu8h',
    'wx4epv44u05',
    'wx4ep418vhm',
    'wx4ep6jbusk',
    'wx4epf40uh7'
]

web3 = new Web3(new Web3.providers.WebsocketProvider("ws://127.0.0.1:8546"));
accountConfig(4,4);

//三个参数，第一个是一共生成多少新账户，第二个是分配给passenger的账户数量，第三个参数是分配给vehicle的账户数量
async function accountConfig(passengerNumber,vehicleNumber){

    web3.eth.getAccounts().then(function(result2){
        let passengerAccounts = [];
        let vehicleAccounts = [];
        //随机生成车辆的初始位置
        let vehicles = [];

        for(let i = 0; i < passengerNumber; i++){
            passengerAccounts.push(result2.splice(0,1)[0])
        }
        for(let i = 0; i < vehicleNumber; i++){
            let vehicleAccount = result2.splice(0,1)[0]
            vehicleAccounts.push(vehicleAccount)

            //随机生成车辆的初始位置
            let vehiclePosition = intersections.splice([Math.floor(Math.random()*(intersections.length))],1)[0];
            vehicles.push({
                vehicleId: vehicleAccount,
                vehiclePosition: vehiclePosition
            })
        }
        fs.writeFile(passengerFile,"passengers = "+JSON.stringify(passengerAccounts),{flag:'a',encoding:'utf-8',mode:'0666'},function(err){});
        fs.writeFile(vehicleFile,"vehicles = "+JSON.stringify(vehicleAccounts),{flag:'a',encoding:'utf-8',mode:'0666'},function(err){});

        fs.writeFile(vehiclePositionFile,"let vehicles = "+JSON.stringify(vehicles),{flag:'a',encoding:'utf-8',mode:'0666'},function(err){});

    })
}

async function creatAccount(){
    return await web3.eth.personal.newAccount('123456').then(console.log);
}
// web3 = new Web3(new Web3.providers.WebsocketProvider("ws://127.0.0.1:8546"));
// web3.eth.personal.newAccount('123456').then(console.log);



// Step 3: Provision the contract with a web3 provider
// MyContract.setProvider(new Web3.providers.HttpProvider("http://localhost:8545"));



// contract address 
// var myContractInstance = MyContract.at("0xf4a754a9e1fc627151e89c0fb10a8c8fc502dcc2");
var account = "0x9297ab0d706d0fc128a79d76cc81f205ac03035e";

function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}