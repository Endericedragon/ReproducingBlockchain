const web3Lib = require('web3')
const fs = require('fs')
const childProcess = require('child_process')

const DATA_DIRECTORY = 'gethdata';
const GENESIS_JSON_PATH = 'genesis.json'
const PASSENGERS_ACCOUNTS_JSON_PATH = 'passengers.json'
const VEHICLE_ACCOUNTS_JSON_PATH = 'vehicles.json';

const INTERSECTIONS = [
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

let genesisTemplate = {
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
    alloc: {},
    coinbase: "0x0000000000000000000000000000000000000000",
    difficulty: "0x1",
    extraData: "",
    gasLimit: "0xffffffff",
    nonce: "0x0000000000000042",
    mixhash: "0x0000000000000000000000000000000000000000000000000000000000000000",
    parentHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
    timestamp: "0x00"
}

/** 
 * @param {object} genesisObj 
 * */
function writeToGenesisFile(genesisObj) {
    fs.open(GENESIS_JSON_PATH, 'w', (openErr, fd) => {
        if (openErr) {
            console.error(`Failed to open ${GENESIS_JSON_PATH}:`, openErr)
            return
        }
        fs.writeFile(fd, JSON.stringify(genesisObj), (writeErr) => {
            if (writeErr) {
                console.error(`Failed to write to ${GENESIS_JSON_PATH}:`, writeErr)
                return
            }
        })
    })
}

writeToGenesisFile(genesisTemplate)

childProcess.execSync(
    'gnome-terminal -- bash -c "' +
    `geth1 --identity "MyEth" --rpc --rpcaddr 127.0.0.1  --rpcport "8545" --rpccorsdomain "*" --datadir ${DATA_DIRECTORY} --port "30303" --nodiscover --rpcapi "eth,net,personal,web3" --networkid 91036 init ${GENESIS_JSON_PATH}"`
)

childProcess.exec(
    'gnome-terminal -- bash -c "' +
    `geth1 --datadir ${DATA_DIRECTORY} --networkid 91036 --port 30303 --rpc --rpcaddr 127.0.0.1 --rpcport 8545 --rpcapi 'personal,net,eth,web3,admin' --rpccorsdomain='*' --ws --wsaddr='localhost' --wsport 8546 --wsorigins='*' --wsapi 'personal,net,eth,web3,admin' --nodiscover --allow-insecure-unlock --dev.period 1 --syncmode='full' console; ` +
    'exec bash"',
    async (err, stdoutInfo, stderrInfo) => {
        console.log('err =', err)
        console.log('stdoutInfo =', stdoutInfo)
        console.log('stderrInfo =', stderrInfo)
        accountConfig(8, 4, 4)
    }
)

//三个参数，第一个是一共生成多少新账户，第二个是分配给passenger的账户数量，第三个参数是分配给vehicle的账户数量
async function accountConfig(accountNumber, passengerNumber, vehicleNumber) {
    const task = [];
    for (let i = 0; i < accountNumber; i++) {
        task.push(creatAccount())
    }
    Promise.all(task).then((accountCreateResult) => {
        console.log("accountCreateResult =", accountCreateResult)
        web3.eth.getAccounts().then((existingAccounts) => {
            console.log("existingAccounts =", existingAccounts);
            // for (let i = 0; i < existingAccounts.length; i++) {
            //     genesis.alloc[existingAccounts[i]] = { "balance": "50000000000000000000000000000000000000000", "position": "test0123456789", "txtime": 1 }
            // }
            for (let each of existingAccounts) {
                genesis.alloc[each] = {
                    balance: "50000000000000000000000000000000000000000", 
                    position: "test0123456789", 
                    txtime: 1 
                }
            }
            fs.writeFile(
                genesisFile, JSON.stringify(genesis), { flag: 'w', encoding: 'utf-8', mode: '0666' }, (_) => { }
            );

            let passengerAccounts = [];
            let vehicleAccounts = [];
            //随机生成车辆的初始位置
            let vehicles = [];

            for (let i = 0; i < passengerNumber; i++) {
                passengerAccounts.push(existingAccounts.splice(0, 1)[0])
            }
            for (let i = 0; i < vehicleNumber; i++) {
                let vehicleAccount = existingAccounts.splice(0, 1)[0]
                vehicleAccounts.push(vehicleAccount)

                //随机生成车辆的初始位置
                let vehiclePosition = intersections.splice([Math.floor(Math.random() * (intersections.length))], 1)[0];
                vehicles.push({
                    vehicleId: vehicleAccount,
                    vehiclePosition: vehiclePosition
                })
            }
            fs.writeFile(PASSENGERS_ACCOUNTS_JSON_PATH, JSON.stringify(passengerAccounts), { flag: 'w', encoding: 'utf-8', mode: '0666' }, (_) => { });
            fs.writeFile(VEHICLE_ACCOUNTS_JSON_PATH, JSON.stringify(vehicleAccounts), { flag: 'w', encoding: 'utf-8', mode: '0666' }, (_) => { });

            // fs.writeFile(vehiclePositionFile,"let vehicles = "+JSON.stringify(vehicles),{flag:'a',encoding:'utf-8',mode:'0666'},function(err){});
        })
    }).catch((err) => { console.log(err); })
}

async function creatAccount() {
    return await web3.eth.personal.newAccount('123456').then((res) => {
        return res;
    }).catch((err) => { console.error(err); });
}
