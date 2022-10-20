var Web3 = require('web3');
// Step 3: Provision the contract with a web3 provider
let web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

let res = web3.eth.getAccountByRegion("w")
console.log(res)

// eth.sendTransaction({from:eth.accounts[0],to:eth.accounts[2],value:web3.toWei(1,"ether"),position:"wx4erg11111111",txtime:6})