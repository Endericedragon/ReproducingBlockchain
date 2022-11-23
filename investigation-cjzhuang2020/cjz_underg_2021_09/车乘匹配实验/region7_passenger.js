let fs=require('fs');
let Web3 = require('web3');
let web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
var deltaLat = 0.596496069;
var deltaLon = [1.191555127,1.1800798,1.157239659,1.123254668,1.07845212,1.023263489,0.958220271,0.883948868,0.801164554,0.710664587,0.613320532,0.510069865,0.401906947,0.289873444,0.175048303,0.05853735];
var Base32 = "0123456789bcdefghjkmnpqrstuvwxyz".split("");
var Neighbors = [[ "p0r21436x8zb9dcf5h7kjnmqesgutwvy", // Top
	"bc01fg45238967deuvhjyznpkmstqrwx", // Right
	"14365h7k9dcfesgujnmqp0r2twvyx8zb", // Bottom
	"238967debc01fg45kmstqrwxuvhjyznp", // Left
	], ["bc01fg45238967deuvhjyznpkmstqrwx", // Top
	"p0r21436x8zb9dcf5h7kjnmqesgutwvy", // Right
	"238967debc01fg45kmstqrwxuvhjyznp", // Bottom
	"14365h7k9dcfesgujnmqp0r2twvyx8zb", // Left
	]];
var Borders = [["prxz", "bcfguvyz", "028b", "0145hjnp"],["bcfguvyz", "prxz", "0145hjnp", "028b"]];
var Bits = [16, 8, 4, 2, 1];
var precision = 10;
var divnum = 4;

//generate accounts 90* 9,分布在9个六位GeoHash区域内
//Traffic contract
var trafficContractAddress = '0x0311d0c7f879fb34fe0a10233f4e7241ff5b7382';

let passengerIdList = ["0xBA4Ab957ea99491395c06e4EdCD2FFD91bbc2258","0x73D43d7371464fe84FA417E045b3c047468c2364","0x46be3b3805242b7E83B4BE3f47D9ee81c4D21510","0xB67Cf478385C3eC2D47B7621fDA9688aEdf0A349","0xD286EF2EEB95a66d1093D107DC287E540dD91C05","0xE8FEAB74e2108e489718C6bA7f320faf78D93Bc9","0x015b06e821DEE820eE166200974991EfC0Fc750f","0xA88d297b6A2F58c488C350B6e7449EEef63Cc5AF","0x141ceeBfD3eE951C259BFAa55F7A20656f70Cd7A","0xC1A17Dd8D511Db76c823Bcb7783Ad54Db498d807","0xF06b5FebFf2b44E6fED4C7e5c9C80363Cee39A21","0xf4209DD6f19F885a4F2593DF090231F58Ae0B297","0x0668Fc1223732E66Cd77799c0C93177449E19C28","0x8cB53cf16b8749D1dD1b7723c2373Dd98A4C1177","0x55698ac6ADE7fd8Da239495f87e8251462F45fC5","0x018BA4Cc4764278d2BcF59Ed64EfF6d0a1a4f5C0","0x06611Dd5948282a4eA05CF4FCeAa2Fa17d1cC511","0x00CA718364546D35665733b05aca54A9747A9670","0xf098A95d504e5DAC7c83c0A78C8DAf7008487Ec8","0x9e8ab6E879D7015A545aDCB168f6D9219B5378d6","0xFEDa5B904AD5ce1DbB09E340EBDc25E6344deAca","0xD37D67bd3d25Eea7FBd2c63c1072B3b5EC629169","0xfbc04e5c0eB8D25C8C58D034d153fBF28989402A","0x058D815f7DdF78f66E3109C4f23a051dCfd0D5fc","0xfa5947f9c732EA02b3E8731e7F1683cA9d9bA700","0xC6AAA26f50032547762C6c6Cb1765f7625582A57","0x0143B7efFE8202df09Cafe50f1EbFD41858835D8","0x8fc59c65Fc4F3932523dCbD9Bb782F80eedE04D5","0x0A4E2caa43f726327F89a39eE94133EA036662b9","0xC02c737DaBEc9917BaC6Aa23Cb461082cA0aBa07","0x9A7e4D8ae43453faA36E30FFc9d9a4e08C230b48","0xa6957ad9B3Fc20d4339082a73f3b025dEDC5dFDa","0x48B4Dfb06644bA811f09d249fDAEF83e4AeCF523","0xD395C546f65A8Bf12E0F1DC17c77b51A722f0b1b","0x7fa7AaD5391de31Ad0050cE373159CA372B6aA1B","0xEB688F146A8533af757CD67C7E709Cc24178FC32","0x9c25BDd4C099A5C01d98A03a53695D34DAb3E92A","0x1069CDf20D53e94b272ECd4018BB69C0a89007A8","0xc3742587a4113f7F27abC698C2b76F3496776138","0x7Fd13Dbed271eD799E954ADcC8Fcf06c34d4F533","0x8196BF44F1784f435125121596cC8792BfCe27fB","0xa4C6C014aEef2a136e9480a8127C36B0d32AC482","0x810B97B3D6bFA9d72Da1383F92B448181B2aC9B2","0x911E2E64d0A2cF7f221C5B9c4C1380123160C37E","0xd9E9f283b3422a9355F0AE18029f1122BB180E5b","0x7e1A9886D2E52587A2F682327EF81a49B06D434F","0xCfF7756392e4A2177701fC915940a76464c17d6E","0xb1B2a2e7EaE289077a45244c31D11dccd6BdE1aB","0x14E146a1961E045735350b5289C12ABdEB93Ef67","0x220fA14Db734D87aC8D741811a1311144cAedf2a","0xF986FF7029a086cf78558f856c7e5a73DADb3408","0xf8aD37c37075b29978ba23d07AD97B2c90883527","0x4a1E890600176554295164096c238422b139C845","0x15F8Fb3f2a5b8d0037884CD4b09e018bBb554B9C","0xf883a8b61F112ae2209fF72c642Bb38D709c268C","0x243711F944Cb2D875b69E773Ac4046704E1a1789","0x612Ecd0e9Cc0fA411609de15E460301a343F0f3A","0x64BeD5041e2112c68722952d6C765caf2BCb6013","0xe4CF4bb5049dc3DCc2b182Ed0E7ad0Af3B077A03","0xc6C84D9af59eB462f752b5fAF20ecD3392dbdC77","0xDf5A2Ec5d4306E5eD5115aa32549f7F686254872","0x8d286dCcF62a2b6843573D149d63D638c709f531","0xEB1bd2Ae7015b0668bd2c35391228485eA6f317a","0x5102222c5FAbd6CaaC8757c524977fb06268fA68","0x21b136f0DFbD145Ba7C1114d54654821196AeA18","0xFBeCD545ba67A627CF090CEFb233966020352b72","0x5a426f77188FCB83dFef692992ec7247d4c64954","0x611d80d81cD710B2B7524e58F6CccE945da4D695","0x1F8a3AF871a0628e89D176E8Ed1DFCB51CEdf845","0x6490e79b9436aC55B5469C4e7aa858435eC90D40","0x82c153560E69a44d4b6d1730F49584fd8D9bD1a4","0xCBcD8A77bb2DA46d96f1e9C832265c745F5202cf","0x0f00c8523d0B610A78b102451Ee2a96bf07376c9","0x7Eb053fDE76Fec5C3e51Ca07f32FAE1F9cA2ca9B","0xb81B2f59d44e65ff205a574CE8bBd6E0Cc5fAe4B","0xc099091cb62F6eB7A41d03d0D602244C0bF38C1E","0x54927C6bbd9EFdDF14Ff635c32331f7b46a9b353","0xaD53B9f658a536B7fc1046898c34323B0E203685","0xd97e9aa71610856F74C658F53aF1074D8ac923C0","0x1ec0F8431E9869ee6B7676AA9E172dfE737C9bdC","0x3cCC9c6aB891897Ff0D36313Ad1B04f424fcc7E4","0x99fbD1f2CF5fD44609a0450d50159d5Cb73223CE","0x9a320d17236b17543FD098351Ab1974def418fcC","0xCB667827Bbc7638b74dc0D084ae7635ffD2f0cED","0x8278AabA0531776D2C7bc0b430A3Ce5588d7Ac02","0x53D30a806A7d7955947EbC6DF1fF23b5D0105e68","0x48a232D65e8DF44EaEAA122e7e9899e88089d0d1","0x0BA5594218F91524181846D36D6ac91FaC8F8f50","0x3d7b8521AE64158747CF9555d50B4F7343ecB0dc","0x1e526a8D438A4239eC2cd59d01f232223115Dd85"]

let passengerPositionList = ["wx4eqfwsdek","wx4eqfqtvek","wx4eqf43yek","wx4eqf17gek","wx4eqf5pwek","wx4eqfke3ek","wx4eqfet2ek","wx4eqfbqpek","wx4eqfy02ek","wx4eqfvc1ek","wx4eqff7jek","wx4eqfe12ek","wx4eqf7hmek","wx4eqfpwyek","wx4eqf80qek","wx4eqf7vxek","wx4eqfnbpek","wx4eqfmrhek","wx4eqfy4vek","wx4eqfe9rek","wx4eqfv2hek","wx4eqfcmsek","wx4eqfs0sek","wx4eqfkqsek","wx4eqfg1dek","wx4eqfgfqek","wx4eqf5xwek","wx4eqft9vek","wx4eqfvtyek","wx4eqfjwzek","wx4eqfvdcek","wx4eqfdyuek","wx4eqf529ek","wx4eqf9u1ek","wx4eqf2rxek","wx4eqf92qek","wx4eqf23vek","wx4eqf5jbek","wx4eqfev3ek","wx4eqf1keek","wx4eqfu06ek","wx4eqfvmfek","wx4eqf1nkek","wx4eqf23qek","wx4eqfgmkek","wx4eqfm6wek","wx4eqf373ek","wx4eqfjy7ek","wx4eqf1usek","wx4eqfq0nek","wx4eqfsc8ek","wx4eqf1djek","wx4eqfbj9ek","wx4eqfwu2ek","wx4eqfv01ek","wx4eqf7g1ek","wx4eqfqn3ek","wx4eqfduyek","wx4eqf88vek","wx4eqftzdek","wx4eqfv9wek","wx4eqfdynek","wx4eqfex5ek","wx4eqf262ek","wx4eqf37gek","wx4eqf10fek","wx4eqfmxgek","wx4eqfq46ek","wx4eqfzjrek","wx4eqf0x4ek","wx4eqfsndek","wx4eqf7kxek","wx4eqfdwxek","wx4eqfqvvek","wx4eqf2s5ek","wx4eqffw5ek","wx4eqfqxkek","wx4eqfk51ek","wx4eqfqe0ek","wx4eqfvfgek","wx4eqfmqhek","wx4eqf9c4ek","wx4eqftj8ek","wx4eqfs61ek","wx4eqfsntek","wx4eqfr9hek","wx4eqf3b4ek","wx4eqfjr7ek","wx4eqfn5fek","wx4eqfkrxek"]

let couples = [];
let countNum = 0;


var trafficContractAbi = JSON.parse('[{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"bytes32\",\"name\":\"vehicleId\",\"type\":\"bytes32\"},{\"indexed\":false,\"internalType\":\"bytes32\",\"name\":\"passengerId\",\"type\":\"bytes32\"},{\"indexed\":false,\"internalType\":\"bytes32\",\"name\":\"passengerGeohash\",\"type\":\"bytes32\"}],\"name\":\"Myevent\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"bytes32\",\"name\":\"vehicleId\",\"type\":\"bytes32\"}],\"name\":\"boardEvent\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"bytes32\",\"name\":\"vehicleId\",\"type\":\"bytes32\"}],\"name\":\"payEvent\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"bytes32\",\"name\":\"passengerId\",\"type\":\"bytes32\"}],\"name\":\"rejectEvent\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"bytes32\",\"name\":\"passengerId\",\"type\":\"bytes32\"}],\"name\":\"routeEvent\",\"type\":\"event\"},{\"constant\":false,\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"newPrecision\",\"type\":\"uint256\"}],\"name\":\"changePrecision\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"vehicleId\",\"type\":\"bytes32\"}],\"name\":\"confirmBoard\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"vehicleId\",\"type\":\"bytes32\"}],\"name\":\"confirmPay\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"vehicleId\",\"type\":\"bytes32\"}],\"name\":\"deleteVehicle\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"internalType\":\"string\",\"name\":\"geohash\",\"type\":\"string\"}],\"name\":\"getLatBlock\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"getLatDelta\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"internalType\":\"string\",\"name\":\"geohash\",\"type\":\"string\"}],\"name\":\"getLonBlock\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"geohash\",\"type\":\"bytes32\"}],\"name\":\"getLonDelta\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"passengerId\",\"type\":\"bytes32\"}],\"name\":\"getPassengerEnd\",\"outputs\":[{\"internalType\":\"bytes32\",\"name\":\"end\",\"type\":\"bytes32\"}],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"passengerId\",\"type\":\"bytes32\"}],\"name\":\"getPassengerPos\",\"outputs\":[{\"internalType\":\"bytes32\",\"name\":\"position\",\"type\":\"bytes32\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"vehicleId\",\"type\":\"bytes32\"}],\"name\":\"getRoutes\",\"outputs\":[{\"internalType\":\"bytes32[]\",\"name\":\"route\",\"type\":\"bytes32[]\"},{\"internalType\":\"uint256\",\"name\":\"cost\",\"type\":\"uint256\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"passengerGeohash\",\"type\":\"bytes32\"}],\"name\":\"getVehicle\",\"outputs\":[{\"internalType\":\"bytes32\",\"name\":\"\",\"type\":\"bytes32\"},{\"internalType\":\"bytes32\",\"name\":\"\",\"type\":\"bytes32\"},{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"passengerGeohash\",\"type\":\"bytes32\"},{\"internalType\":\"bytes32[]\",\"name\":\"regionVehicles\",\"type\":\"bytes32[]\"}],\"name\":\"getVehicleByRegion\",\"outputs\":[{\"internalType\":\"bytes32\",\"name\":\"\",\"type\":\"bytes32\"},{\"internalType\":\"bytes32\",\"name\":\"\",\"type\":\"bytes32\"},{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"vehicleId\",\"type\":\"bytes32\"}],\"name\":\"getVehicleId\",\"outputs\":[{\"internalType\":\"bytes32\",\"name\":\"\",\"type\":\"bytes32\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"getVehicleIdList\",\"outputs\":[{\"internalType\":\"bytes32[]\",\"name\":\"\",\"type\":\"bytes32[]\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"vehicleId\",\"type\":\"bytes32\"}],\"name\":\"getVehicleStatus\",\"outputs\":[{\"internalType\":\"int32\",\"name\":\"\",\"type\":\"int32\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"passengerId\",\"type\":\"bytes32\"},{\"internalType\":\"bytes32\",\"name\":\"geohash\",\"type\":\"bytes32\"}],\"name\":\"initPassenger\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"vehicleId\",\"type\":\"bytes32\"},{\"internalType\":\"bytes32\",\"name\":\"geohash\",\"type\":\"bytes32\"}],\"name\":\"initVehicle\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"nextGeohash\",\"type\":\"bytes32\"},{\"internalType\":\"bytes32\",\"name\":\"endGeohash\",\"type\":\"bytes32\"}],\"name\":\"manhattan\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"passengerId\",\"type\":\"bytes32\"},{\"internalType\":\"bytes32\",\"name\":\"startGeohash\",\"type\":\"bytes32\"},{\"internalType\":\"bytes32\",\"name\":\"endGeohash\",\"type\":\"bytes32\"}],\"name\":\"setPassengerDemand\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"passengerId\",\"type\":\"bytes32\"},{\"internalType\":\"bytes32\",\"name\":\"passengerGeohash\",\"type\":\"bytes32\"}],\"name\":\"setPassengerPosition\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"vehicleId\",\"type\":\"bytes32\"},{\"internalType\":\"bytes32\",\"name\":\"passengerId\",\"type\":\"bytes32\"}],\"name\":\"setRejectVehicleStatus\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"vehicleId\",\"type\":\"bytes32\"},{\"internalType\":\"bytes32\",\"name\":\"vehicleGeohash\",\"type\":\"bytes32\"}],\"name\":\"setVehicle\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"vehicleId\",\"type\":\"bytes32\"},{\"internalType\":\"bytes32\",\"name\":\"passengerId\",\"type\":\"bytes32\"},{\"internalType\":\"bytes32\",\"name\":\"passengerGeohash\",\"type\":\"bytes32\"}],\"name\":\"setVehicleStatus\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"vehicleId\",\"type\":\"bytes32\"}],\"name\":\"setVehicleStatusEmpty\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"geohash1\",\"type\":\"bytes32\"},{\"internalType\":\"bytes32\",\"name\":\"geohash2\",\"type\":\"bytes32\"}],\"name\":\"sliceGeoHash\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"},{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"cost\",\"type\":\"uint256\"},{\"internalType\":\"bytes32\",\"name\":\"vehicleId\",\"type\":\"bytes32\"},{\"internalType\":\"bytes32\",\"name\":\"passengerId\",\"type\":\"bytes32\"},{\"internalType\":\"bytes32[]\",\"name\":\"route\",\"type\":\"bytes32[]\"}],\"name\":\"storeRoutes\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"}]');

var trafficContract = new web3.eth.Contract(trafficContractAbi,trafficContractAddress);

//乘客发出调度请求
function manageVehicleByRegion7(){

    for(let i = 0; i < passengerIdList.length; i++){
		let regionVehicles = [];
		let neighbourRegion = getNeighbour(passengerPositionList[i].slice(0,7));
		neighbourRegion.unshift(passengerPositionList[i].slice(0,7));
		let regionTasks = [];
		for(let i = 0; i < neighbourRegion.length; i++){
			regionTasks.push(regionTask(neighbourRegion[i], regionVehicles));
		}
		Promise.all(regionTasks).then(function(result){
			//返回距离乘客最近的空车的位置
			getVehicleByRegion(passengerIdList[i], passengerPositionList[i], regionVehicles, 0);
		})
    }
}
manageVehicleByRegion7();

async function getVehicleByRegion(passengerId, positionGeohash, regionVehicles, count){
	let getVehicleTime1 = Date.now()
	// console.log("regionVehicles: ", regionVehicles);
	trafficContract.methods.getVehicleByRegion(web3.utils.asciiToHex(positionGeohash), regionVehicles).call({from: passengerId, gas: 500000000}).then(async function(result1){
		let getVehicleTime2 = Date.now() - getVehicleTime1;
		if(getVehicleTime2 == 0){
			console.log("regionVehicles: ", regionVehicles);
		}
		trafficContract.methods.setVehicleStatus(result1[1], passengerId, web3.utils.asciiToHex(positionGeohash)).send({from: passengerId, gas: 5000000,position:"w3511111111111",txtime:278000}).then(function(result2){

            vehiclePosition = web3.utils.hexToAscii(result1[0]).slice(0, 11);
			vehicleId = result1[1].slice(0,42);
            let couple = {
                passenger: passengerId,
                vehicle: vehicleId,
                passengerGeoHash: positionGeohash,
                vehicleGeoHash: vehiclePosition,
                theirDistance: getDistanceByGeohash(positionGeohash, vehiclePosition),
                gasCost: parseInt(result1[2]),
                getVehicleTime: getVehicleTime2
            }
            couples.push(couple);
            countNum++;
            if(countNum == passengerIdList.length){
                let gname = "./coupleResult/region7_aveCenterCouple.json";
                let jsonstr = JSON.stringify(couples);
                fs.writeFileSync(gname,jsonstr,{flag:'w',encoding:'utf-8',mode:'0666'},function(err){});
            }
			
		},function(error2){
			console.log("error2" );
			count++;
			if(count < 10){
				// $("#vehicleEvent").val("调度车辆中");
				// console.log("调度车辆中");
				getVehicleByRegion(passengerId, positionGeohash, regionVehicles, count);
			}else{
				// $("#vehicleEvent").val("当前没有合适的车辆");
				// console.log("当前没有合适的车辆");
                let couple = {
                    passenger: passengerId,
                    vehicle: "0x0000000000000000000000000000000000000000",
                    passengerGeoHash: positionGeohash,
                    vehicleGeoHash: "wwwwwwwwwww",
                    theirDistance: 0,
                    gasCost: 0,
                    getVehicleTime: 0
                }
                couples.push(couple);
                countNum++;
                if(countNum == passengerIdList.length){
                    let gname = "./coupleResult/region7_aveCenterCouple.json";
                    let jsonstr = JSON.stringify(couples);
                    fs.writeFileSync(gname,jsonstr,{flag:'w',encoding:'utf-8',mode:'0666'},function(err){});
                }
			}
		})
	},function(error1){
		console.log("error1");
		count++;
		if(count < 10){
			// $("#vehicleEvent").val("调度车辆中");
			// console.log("调度车辆中");
			getVehicleByRegion(passengerId, positionGeohash, regionVehicles, count);
		}else{
			// $("#vehicleEvent").val("当前没有合适的车辆");
			// console.log("当前没有合适的车辆");
			let couple = {
                passenger: passengerId,
                vehicle: "0x0000000000000000000000000000000000000000",
                passengerGeoHash: positionGeohash,
                vehicleGeoHash: "wwwwwwwwwww",
                theirDistance: 0,
                gasCost: 0,
                getVehicleTime: 0
            }
            couples.push(couple);
            countNum++;
            if(countNum == passengerIdList.length){
                let gname = "./coupleResult/region7_aveCenterCouple.json";
                let jsonstr = JSON.stringify(couples);
                fs.writeFileSync(gname,jsonstr,{flag:'w',encoding:'utf-8',mode:'0666'},function(err){});
            }
		}
	});
}

async function regionTask(region, regionVehicles){
	await web3.eth.getAccountByRegion(region).then(function(result){
		if(result != null){
			// console.log("regionTask: ", result)
			let regionVehiclesAll = Object.entries(result);
			// console.log("regionVehiclesAll: ",regionVehiclesAll);
			resultVehicles = Object.keys(result);
			for(let j = 0 ; j < resultVehicles.length; j++){
				regionVehicles.push(resultVehicles[j]);
			}
			// console.log("getAccountByRegion: ",result);
		}
	})
}


// eth.sendTransaction({from:eth.accounts[0],to:eth.accounts[2],value:web3.toWei(1,"ether"),position:"wx4erg11111111",txtime:6})


function getDistanceByGeohash(geohash1, geohash2) {//geohash�����
	var vector = getVector(geohash1.slice(0,10), geohash2.slice(0,10));
	var ans = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);
	return ans;
}

function getVector(geohash1, geohash2) { 
	var ans = new Array();

	var londelta = getLonDelta(geohash1);
	var latdelta = getLatDelta(geohash1);
	var dislat1 = getLatBase32(geohash1);
	var dislon1 = getLonBase32(geohash1);
	var dislat2 = getLatBase32(geohash2);
	var dislon2 = getLonBase32(geohash2);

	var dislat = (dislat2 - dislat1) * latdelta;
	var dislon = (dislon2 - dislon1) * londelta;
	ans.push(dislon);
	ans.push(dislat);
	return ans;
}


function getLonDelta(geohash) {
	//console.log("getLonDelta");
	lat = getLatBase32(geohash);
	lat = lat >> (precision * 5 / 2 - (divnum + 1));
	if ((lat & (1 << divnum)) != (1 << divnum)) {
		lat = (1 << (divnum + 1) - 1) - lat;
	}
	lat = lat - (1 << divnum);
	return deltaLon[lat];
}

function getLatDelta(geohash) {
	lon = getLonBase32(geohash);
	return deltaLat;
}

function getLatBase32(geohash) {//geohashγ��
	var even = true;
	var latNow = [-90, 90];
	var lonNow = [-180, 180];

	lat = 0;

	for(var i = 0; i < geohash.length; i++)
	{
		var c = geohash[i];
		var cd = Base32.indexOf(c);
		for (var j = 0; j < 5; j++)
		{
			var mask = Bits[j];
			if (even)
			{
				RefineInterval(lonNow, cd, mask);
			}
			else
			{
				RefineInterval(latNow, cd, mask);
				lat = lat * 2;
				if ((cd & mask) != 0) {
					lat = lat + 1;
				}
			}
			even = !even;
		}
	}

	return lat;
}

function getLonBase32(geohash) { //geohash����
	var even = true;
	var latNow = [-90, 90];
	var lonNow = [-180, 180];

	lon = 0;

	for(var i = 0; i < geohash.length; i++)
	{
		var c = geohash[i];
		var cd = Base32.indexOf(c);
		for (var j = 0; j < 5; j++)
		{
			var mask = Bits[j];
			if (even)
			{
				RefineInterval(lonNow, cd, mask);
				lon = lon * 2;
				if ((cd & mask) != 0) {
					lon = lon + 1;
				}				
			}
			else
			{
				RefineInterval(latNow, cd, mask);
			}
			even = !even;
		}
	}

	return lon;
}

function RefineInterval(interval, cd, mask)
{
	if ((cd & mask) != 0)
	{
		interval[0] = (interval[0] + interval[1])/2;
	}
	else
	{
		interval[1] = (interval[0] + interval[1])/2;
	}
}


function getNeighbour(hash)
{
	var hash_neighbour = new Array();
	var hash_top = CalculateAdjacent(hash,0);
	hash_neighbour.push(hash_top);
	var hash_right = CalculateAdjacent(hash,1);
	hash_neighbour.push(hash_right);
	var hash_bottom = CalculateAdjacent(hash,2);
	hash_neighbour.push(hash_bottom);
	var hash_left = CalculateAdjacent(hash,3);
	hash_neighbour.push(hash_left);

	var hash_top_left = CalculateAdjacent(hash_top, 3);
	hash_neighbour.push(hash_top_left);
	var hash_top_right = CalculateAdjacent(hash_top, 1);
	hash_neighbour.push(hash_top_right);
	var hash_bottom_left = CalculateAdjacent(hash_bottom, 3);
	hash_neighbour.push(hash_bottom_left);
	var hash_bottom_right = CalculateAdjacent(hash_bottom, 1);
	hash_neighbour.push(hash_bottom_right);

	return hash_neighbour;
}


function CalculateAdjacent(hash, dir)
{
	var lastChr = hash[hash.length - 1];
	var type = hash.length % 2;
	var nHash = hash.substring(0, hash.length - 1);
	if (Borders[type][dir].indexOf(lastChr) != -1)
	{
		nHash = CalculateAdjacent(nHash, dir);
	}
	
	if((Base32[Neighbors[type][dir].indexOf(lastChr)])){
		return nHash + Base32[Neighbors[type][dir].indexOf(lastChr)];
	}
	else{
		return nHash;
	}
}