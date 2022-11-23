var Web3 = require('web3');
// var json = require("./build/StoreMap.json");
// var contract = require("truffle-contract");
// var MyContract = contract(json);
var fs = require('fs');
var childProcess = require('child_process');


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
        "0x9297ab0d706d0fc128a79d76cc81f205ac03035e": { "balance": "50000000000000000000000000000000000000000", "position": "test0123456789", "txtime": 1 },
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

node1 = childProcess.exec(
    "gnome-terminal -e 'bash -c \"cd ~; cd 文档; cd ReproducingBlockchain; cd DispatchSystem; cd Node1; geth1 --datadir ./gethdata --networkid 91036 --port 30303 --rpc --rpcaddr 127.0.0.1 --rpcport 8545 --rpcapi 'personal,net,eth,web3,admin' --rpccorsdomain='*' --ws --wsaddr='localhost' --wsport 8546 --wsorigins='*' --wsapi 'personal,net,eth,web3,admin' --nodiscover --allow-insecure-unlock --dev.period 1 --syncmode='full' console; exec bash\"'",
    async function (error, stdout, stderr) {
        if (stderr) {
            console.log(stderr);
            // throw stderr;
        }
        console.log("ok");
        console.log(stdout);
        sleep(1000);

        web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
        accountConfig(30, 15, 15);
    }
)
//三个参数，第一个是一共生成多少新账户，第二个是分配给passenger的账户数量，第三个参数是分配给vehicle的账户数量
async function accountConfig(accountNumber, passengerNumber, vehicleNumber) {
    const task = [];
    for (let i = 0; i < accountNumber; i++) {
        task.push(creatAccount())
    }
    Promise.all(task).then(function (result1) {
        console.log("result1: ", result1);
        web3.eth.getAccounts().then(function (result2) {
            console.log("result2: ", result2);
            for (let i = 0; i < result2.length; i++) {
                genesis.alloc[result2[i]] = { "balance": "50000000000000000000000000000000000000000", "position": "test0123456789", "txtime": 1 }
            }
            fs.writeFile(genesisFile, JSON.stringify(genesis), { flag: 'a', encoding: 'utf-8', mode: '0666' }, function (err) { });

            let passengerAccounts = [];
            let vehicleAccounts = [];
            //随机生成车辆的初始位置
            let vehicles = [];

            for (let i = 0; i < passengerNumber; i++) {
                passengerAccounts.push(result2.splice(0, 1)[0])
            }
            for (let i = 0; i < vehicleNumber; i++) {
                let vehicleAccount = result2.splice(0, 1)[0]
                vehicleAccounts.push(vehicleAccount)

                //随机生成车辆的初始位置
                let vehiclePosition = intersections.splice([Math.floor(Math.random() * (intersections.length))], 1)[0];
                vehicles.push({
                    vehicleId: vehicleAccount,
                    vehiclePosition: vehiclePosition
                })
            }
            fs.writeFile(passengerFile, "passengers = " + JSON.stringify(passengerAccounts), { flag: 'a', encoding: 'utf-8', mode: '0666' }, function (err) { });
            fs.writeFile(vehicleFile, "vehicles = " + JSON.stringify(vehicleAccounts), { flag: 'a', encoding: 'utf-8', mode: '0666' }, function (err) { });

            // fs.writeFile(vehiclePositionFile,"let vehicles = "+JSON.stringify(vehicles),{flag:'a',encoding:'utf-8',mode:'0666'},function(err){});

        })
    })
}

async function creatAccount() {
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