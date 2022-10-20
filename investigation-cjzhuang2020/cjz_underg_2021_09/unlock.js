var Web3 = require('web3');
// var json = require("./build/StoreMap.json");
// var contract = require("truffle-contract");
// var MyContract = contract(json);
var fs = require('fs');
var callfile = require('child_process');


var web3_1
// var web3_2


web3_1 = new Web3(new Web3.providers.WebsocketProvider("ws://127.0.0.1:8546"));
// web3_2 = new Web3(new Web3.providers.WebsocketProvider("ws://127.0.0.1:8548"));
sleep(1000);
let accounts = [];
let counter = 0;

let unlockedCounter = 0;

web3_1.eth.getAccounts().then(function(result){
    accounts = result;
    unlockAccount();
})

async function unlockAccount(){
    let partTask = [];
	let loopNum = 5;

	for (let i = 0; i < loopNum; i++) {
		partTask.push(unlockUnit(accounts[counter]));
		counter++;
		if((accounts.length - counter) == 0 ){
			Promise.all(partTask).then((resolve) => {
				console.log("账户解锁完成");
			},(reject) => {})
			break;
		}
	}
	if(partTask.length == loopNum){
		Promise.all(partTask).then((resolve) => {
			unlockAccount();
		},(reject) => {})
	}
}

async function unlockUnit(account){
    await web3_1.eth.personal.unlockAccount(account,"123456",0).then(function(result){
        unlockedCounter++;
        console.log(`解锁第${unlockedCounter}个账户`);
    })
}

    // web3_2.eth.getAccounts().then(function(result){
    //     let task2 = [];
    //     for(let i = 0; i < num; i++){
    //         task2.push(unlock2(result[i]))
    //     }

    //     Promise.all(task2).then(function(result){
    //         console.log("节点2账户解锁完毕",result)
    //     })

    // })

async function unlock1(account){
    return await web3_1.eth.personal.unlockAccount(account,"123456",0)
}

async function unlock2(account){
    return await web3_2.eth.personal.unlockAccount(account,"123456",0)
}
//三个参数，第一个是一共生成多少新账户，第二个是分配给passenger的账户数量，第三个参数是分配给vehicle的账户数量



function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}