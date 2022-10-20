const { time } = require('console');
const { SSL_OP_EPHEMERAL_RSA } = require('constants');
const { randomBytes } = require('crypto');
let fs = require('fs');
const { config, title } = require('process');
let Web3 = require('web3');
let web3 = new Web3(new Web3.providers.WebsocketProvider("ws://127.0.0.1:8546"));

//Credit contract
let creditContractAddress = '0xed3a2d461908e71180790c3dd450991aba836c5a';
let creditContractAbi = JSON.parse(fs.readFileSync('./contracts/creditContractAbi.json', 'utf-8'));
let creditContract = new web3.eth.Contract(creditContractAbi, creditContractAddress);

//Map contract
let mapContractAddress = '0xea9a43ab9d6496d61fd42730758cac7b43ac010e';
let mapContractAbi = JSON.parse(fs.readFileSync('./contracts/storeMapAbi_old.json', 'utf-8'));
let mapContract = new web3.eth.Contract(mapContractAbi, mapContractAddress);

//user info
let userAccount = "0x6e6d3b51F338C41aF7994BDe5Ce44565b356aEA1"
userAccount = userAccount.toLowerCase()

//locaiton verifed data
let buffer = JSON.parse(fs.readFileSync('./VerificationResult_7.json', 'utf-8'));
var Count = 1;
var ExpTimes = 2

async function effect() {
    var time=0;
  var all_t=  setInterval(()=>{
        console.log("times: "+time);
            var startGeo, endGeo;
            //distance 10Km
            //navigate route length:12 Km
            // BIT => RDF :53  sections of road
            //RDF=> BIT :51 sections of road
            //crowed:50 times/min
            //free: 10 times/min
            if (time % 2 == 0) {
                startGeo = "wx4eqcexckm";//BIT li gong da sha:BIT
                endGeo = "wx4fbnyr58d";// ren min da xue fu shu zhong xue :RDF
            } else {
                startGeo = "wx4fbnyr58d";// ren min da xue fu shu zhong xue :RDF
                endGeo = "wx4eqcexckm";//BIT li gong da sha:BIT
            }
            mapContract.methods
                .astar(
                    web3.utils.asciiToHex(startGeo),
                    web3.utils.asciiToHex(endGeo)
    
                )
                .call({ from: "0xcF94eDc6506E6225D8a1961be2000385C1F7a3F6", gas: 50000000000 })
                .then((result) => {
                    var astarRoute = [];
    
                    for (let i = 0; i < result[0].length; i++) {
                        if (
                            result[0][i].toString() !=
                            "0x0000000000000000000000000000000000000000000000000000000000000000"
                        ) {
    
                            let temp = web3.utils
                                .hexToAscii(result[0][i])
                                .slice(0, 11);
                            astarRoute.push(temp);
                        }
                    }
                    astarRoute.reverse();
                    console.log("routes length: " + astarRoute.length);
                    console.log(astarRoute);
                    var verifed_t,evaluate_t;
                   var verifed_count=0,evaluate_count=0;
                        verifed_t = setInterval(() => {
                            console.log("route: "+verifed_count);
                            var initTimeList = [];
                            for (let x = 0; x <30+Math.random()*20; x++) {
                                initTimeList.push(Date.now());
                                var value = true;
                                if (buffer[Count % 2000] == '0') value = false;
                                creditContract.methods
                                    .revalueByValidation(userAccount, Count++, value, true)
                                    .send({
                                        from: "0xcF94eDc6506E6225D8a1961be2000385C1F7a3F6",
                                        gas: 500000,
                                        position: "w3511111111111",
                                        txtime: Date.now(),
                                    }).then(() => {
                                     
                                    })
                            }
                         
                            verifed_count++;
                            if(verifed_count==astarRoute.length) clearInterval(verifed_t);
                        },5000)
                        evaluate_t=setTimeout(()=>{
                          
                                    console.log("begin  evaluate....")
                                creditContract.methods
                                    .revalueByOrder(userAccount, true)
                                    .send({
                                        from: "0xcF94eDc6506E6225D8a1961be2000385C1F7a3F6",
                                        gas: 500000,
                                        position: "w3511111111111",
                                        txtime: Date.now(),
                                    }).then(() => {
                                        var list_8 = [0, 2, 2, -2, 4, 2, 2, 2, -2, 2, 4, 2, 2, 2, 2, 2, -2, -2, 2, 2, 2];
                                        var res = 2;
                                        creditContract.methods
                                            .revalueByEvaluate(userAccount, res)
                                            .send({
                                                from: "0xcF94eDc6506E6225D8a1961be2000385C1F7a3F6",
                                                gas: 500000,
                                                position: "w3511111111111",
                                                txtime: Date.now(),
                                            }).then(() => {
                                            
                                                if (time == ExpTimes - 1) {
                                                    fs.writeFile("CreditRes.json", CreditRes.toString(), (err) => {
                                                        if (!err) console.log("ok");
                                                        else console.log(err)
                                                        clearInterval(interval);
                                                 
                                                    })
                                                }
                                            })
                                    })
                        
                            
                        },astarRoute.length*5000)
                    
                })
        time++;
        if(time==ExpTimes) clearInterval(all_t);
    },5000*40)


}


function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}
var interval;
var CreditRes = []
creditContract.methods
    .initUser(userAccount, -1)
    .send({
        from: "0xcF94eDc6506E6225D8a1961be2000385C1F7a3F6",
        gas: 500000,
        position: "w3511111111111",
        txtime: Date.now(),
    }).then(() => {
        var printcount = 0;
        interval = setInterval(() => {
            creditContract.methods
                .getCredit(userAccount)
                .call({ from: "0xcF94eDc6506E6225D8a1961be2000385C1F7a3F6", gas: 50000000000 })
                .then((res) => {
                    printcount++;
                    var credit=res;
                    CreditRes.push(credit);
                    if (printcount % 10 == 0) console.log(res);
                })
        }, 500)
        effect();
    })

