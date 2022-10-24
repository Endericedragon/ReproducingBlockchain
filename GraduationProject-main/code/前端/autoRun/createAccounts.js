var Web3 = require('web3');
var fs = require('fs');
var callfile = require('child_process');
var web3;
var node1;
var passengerFile = './passengersInfo.json';
var vehicleFile = './vehiclesInfo.json';
var intersections = [
    'wx4enwwfxft',
    'wx4eqcet93y',
    'wx4enyt0kv7',
    'wx4enx3v83j',
    'wx4enym5rjq',
    'wx4enym77dt',
    'wx4enymjys8',
    'wx4enzu3wfr'
]
function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}

//三个参数，第一个是一共生成多少新账户，第二个是分配给passenger的账户数量，第三个参数是分配给vehicle的账户数量
async function accountConfig(accountNumber,passengerNumber,vehicleNumber){
    const task = [];
    for(let i = 0; i < accountNumber; i++){
        task.push(creatAccount())
    }
    Promise.all(task).then(function(result1){
        console.log("result1: ",result1);
        web3.eth.getAccounts().then(function(result2){
            console.log("result2: ",result2);
            //随机生成车辆的初始位置
            let vehicles = [];
            let passengers=[];
            //passenger info
            for(let i = 0; i < passengerNumber; i++){
                let passengerAccount=result2.splice(0,1)[0]
                
                let startPosition= intersections.splice([Math.floor(Math.random()*(intersections.length))],1)[0];
                let endPosition=intersections.splice([Math.floor(Math.random()*(intersections.length))],1)[0];
                passengers.push(
                    {
                        passengerId:passengerAccount,
                        startPosition:"wx4enyt0kv7",
                        endPosition:"wx4enymjys8"
                    }
                )
                web3.eth.personal.unlockAccount(passengerAccount,"123456",(err,res)=>{
                    if(err){
                        console.log("Error: ",err);
                    }
                })
            }
            //vehicle info
            for(let i = 0; i < vehicleNumber; i++){
                let vehicleAccount = result2.splice(0,1)[0]
                //随机生成车辆的初始位置
                let vehiclePosition = intersections.splice([Math.floor(Math.random()*(intersections.length))],1)[0];
                if(!vehiclePosition) vehiclePosition="wx4eqcet93y";
                vehicles.push(
                    {
                    vehicleId: vehicleAccount,
                    vehiclePosition: "wx4eqcet93y"
                }
                )

                web3.eth.personal.unlockAccount(vehicleAccount,"123456",(err,res)=>{
                    if(err){
                        console.log("Error: ",err);
                    }
                })
            }
            fs.writeFile(passengerFile,JSON.stringify(passengers),{flag:'w',encoding:'utf-8',mode:'0666'},function(err){});
            fs.writeFile(vehicleFile,JSON.stringify(vehicles),{flag:'w',encoding:'utf-8',mode:'0666'},function(err){});
        })
    })
}

async function creatAccount(){
    return await web3.eth.personal.newAccount('123456').then(console.log);
}

node1 = callfile.exec("gnome-terminal  -e 'bash -c  \"cd  ~; cd  桌面; cd geth_map; geth --datadir ./gethdata --networkid 91036 --port 30303 --rpc --rpcaddr 127.0.0.1 --rpcport 8545 --rpcapi 'personal,net,eth,web3,admin' --rpccorsdomain='*' --ws --wsaddr='localhost' --wsport 8546 --wsorigins='*' --wsapi 'personal,net,eth,web3,admin' --nodiscover --allow-insecure-unlock --dev.period 1 --syncmode='full' console\"'", async function (error, stdout, stderr) {
    if (stderr) {
        throw stderr;
    }
    console.log("start geth successfully");
    console.log(stdout);
    sleep(1000);
    web3 = new Web3(new Web3.providers.WebsocketProvider("ws://127.0.0.1:8546"));
    var args = process.argv.splice(2);
    console.log("args: "+args);
    accountConfig(args[0], args[1], args[2]);
})
