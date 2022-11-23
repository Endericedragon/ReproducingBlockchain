var Web3 = require('web3');
// var json = require("./build/StoreMap.json");
// var contract = require("truffle-contract");
// var MyContract = contract(json);
var fs = require('fs');
var callfile = require('child_process');


var web3
var node1

var genesisFile = './genesis.json';
var passengerFile = './树状区块链性能实验/allPassengerAccounts.json';
var vehicleFile = './树状区块链性能实验/allVehicleAccounts.json';
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
var genesis = {
    config: {
      "chainId": 91036,
      "homesteadBlock": 0,
      "eip150Block": 0,
      "eip155Block": 0,
      "eip158Block": 0,
      "byzantiumBlock": 0,
      "constantinopleBlock": 0,
      "petersburgBlock": 0
    },
    alloc: {
    },
    coinbase: "0x0000000000000000000000000000000000000000",
    difficulty: "0x1",
    extraData: "",
    gasLimit: "0xffffffff",
    nonce: "0x0000000000000042",
    mixhash: "0x0000000000000000000000000000000000000000000000000000000000000000",
    parentHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
    timestamp: "0x00"
  }
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));




let counter = 0;
let createdCounter = 0;

// creatAccount(12000,7000,5000);
getAccount();
function getAccount(){
    web3.eth.getAccounts().then(function(result2){
        
        let passengerAccounts = [];
        let vehicleAccounts = [];
        //随机生成车辆的初始位置
        let vehicles = [];

        for(let i = 0; i < 1200; i++){
            passengerAccounts.push(result2.splice(0,1)[0])
        }
        for(let i = 0; i < 800; i++){
            let vehicleAccount = result2.splice(0,1)[0]
            vehicleAccounts.push(vehicleAccount)
        }
        fs.writeFileSync(passengerFile, JSON.stringify(passengerAccounts),{flag:'w',encoding:'utf-8',mode:'0666'},function(err){});
        fs.writeFileSync(vehicleFile, JSON.stringify(vehicleAccounts),{flag:'w',encoding:'utf-8',mode:'0666'},function(err){});
        console.log("done")
        // fs.writeFile(vehiclePositionFile,"let vehicles = "+JSON.stringify(vehicles),{flag:'w',encoding:'utf-8',mode:'0666'},function(err){});
    })
}

function creatAccount(accountNumber,passengerNumber,vehicleNumber){
    let partTask = [];
	let loopNum = 5;

	for (let i = 0; i < loopNum; i++) {
		partTask.push(createOneAccount());
		accountNumber--;
		if(0 == accountNumber){
			Promise.all(partTask).then((resolve) => {
				console.log("账户创建完成");
                web3.eth.getAccounts().then(function(result2){
                    console.log("result2: ",result2);
                    for(let i = 0; i < result2.length; i++){
                        genesis.alloc[result2[i]] = {"balance":"50000000000000000000000000000000000000000","position":"test0123456789","txtime":1}
                    }
                    fs.writeFileSync(genesisFile,JSON.stringify(genesis),{flag:'w',encoding:'utf-8',mode:'0666'},function(err){});

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
                    fs.writeFileSync(passengerFile, JSON.stringify(passengerAccounts),{flag:'w',encoding:'utf-8',mode:'0666'},function(err){});
                    fs.writeFileSync(vehicleFile, JSON.stringify(vehicleAccounts),{flag:'w',encoding:'utf-8',mode:'0666'},function(err){});
    
                    // fs.writeFile(vehiclePositionFile,"let vehicles = "+JSON.stringify(vehicles),{flag:'w',encoding:'utf-8',mode:'0666'},function(err){});
                })
			},(reject) => {});
			break;
		}
	}
	if(partTask.length == loopNum && accountNumber > 0){
		Promise.all(partTask).then((resolve) => {
			creatAccount(accountNumber, passengerNumber, vehicleNumber);
		},(reject) => {})
	}
}

async function createOneAccount(){
    await web3.eth.personal.newAccount('123456').then(()=>{
        createdCounter++;
        console.log(`创建第${createdCounter}个账户`);
    })
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