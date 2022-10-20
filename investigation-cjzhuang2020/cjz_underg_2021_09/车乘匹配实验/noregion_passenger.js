let fs=require('fs');
let Web3 = require('web3');
let web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

//generate accounts 90* 9,分布在9个六位GeoHash区域内
//Traffic contract
var trafficContractAddress = '0x0311d0c7f879fb34fe0a10233f4e7241ff5b7382';

let passengerIdList =["0xBA4Ab957ea99491395c06e4EdCD2FFD91bbc2258","0x73D43d7371464fe84FA417E045b3c047468c2364","0x46be3b3805242b7E83B4BE3f47D9ee81c4D21510","0xB67Cf478385C3eC2D47B7621fDA9688aEdf0A349","0xD286EF2EEB95a66d1093D107DC287E540dD91C05","0xE8FEAB74e2108e489718C6bA7f320faf78D93Bc9","0x015b06e821DEE820eE166200974991EfC0Fc750f","0xA88d297b6A2F58c488C350B6e7449EEef63Cc5AF","0x141ceeBfD3eE951C259BFAa55F7A20656f70Cd7A","0xC1A17Dd8D511Db76c823Bcb7783Ad54Db498d807","0xF06b5FebFf2b44E6fED4C7e5c9C80363Cee39A21","0xf4209DD6f19F885a4F2593DF090231F58Ae0B297","0x0668Fc1223732E66Cd77799c0C93177449E19C28","0x8cB53cf16b8749D1dD1b7723c2373Dd98A4C1177","0x55698ac6ADE7fd8Da239495f87e8251462F45fC5","0x018BA4Cc4764278d2BcF59Ed64EfF6d0a1a4f5C0","0x06611Dd5948282a4eA05CF4FCeAa2Fa17d1cC511","0x00CA718364546D35665733b05aca54A9747A9670","0xf098A95d504e5DAC7c83c0A78C8DAf7008487Ec8","0x9e8ab6E879D7015A545aDCB168f6D9219B5378d6","0xFEDa5B904AD5ce1DbB09E340EBDc25E6344deAca","0xD37D67bd3d25Eea7FBd2c63c1072B3b5EC629169","0xfbc04e5c0eB8D25C8C58D034d153fBF28989402A","0x058D815f7DdF78f66E3109C4f23a051dCfd0D5fc","0xfa5947f9c732EA02b3E8731e7F1683cA9d9bA700","0xC6AAA26f50032547762C6c6Cb1765f7625582A57","0x0143B7efFE8202df09Cafe50f1EbFD41858835D8","0x8fc59c65Fc4F3932523dCbD9Bb782F80eedE04D5","0x0A4E2caa43f726327F89a39eE94133EA036662b9","0xC02c737DaBEc9917BaC6Aa23Cb461082cA0aBa07","0x9A7e4D8ae43453faA36E30FFc9d9a4e08C230b48","0xa6957ad9B3Fc20d4339082a73f3b025dEDC5dFDa","0x48B4Dfb06644bA811f09d249fDAEF83e4AeCF523","0xD395C546f65A8Bf12E0F1DC17c77b51A722f0b1b","0x7fa7AaD5391de31Ad0050cE373159CA372B6aA1B","0xEB688F146A8533af757CD67C7E709Cc24178FC32","0x9c25BDd4C099A5C01d98A03a53695D34DAb3E92A","0x1069CDf20D53e94b272ECd4018BB69C0a89007A8","0xc3742587a4113f7F27abC698C2b76F3496776138","0x7Fd13Dbed271eD799E954ADcC8Fcf06c34d4F533","0x8196BF44F1784f435125121596cC8792BfCe27fB","0xa4C6C014aEef2a136e9480a8127C36B0d32AC482","0x810B97B3D6bFA9d72Da1383F92B448181B2aC9B2","0x911E2E64d0A2cF7f221C5B9c4C1380123160C37E","0xd9E9f283b3422a9355F0AE18029f1122BB180E5b","0x7e1A9886D2E52587A2F682327EF81a49B06D434F","0xCfF7756392e4A2177701fC915940a76464c17d6E","0xb1B2a2e7EaE289077a45244c31D11dccd6BdE1aB","0x14E146a1961E045735350b5289C12ABdEB93Ef67","0x220fA14Db734D87aC8D741811a1311144cAedf2a","0xF986FF7029a086cf78558f856c7e5a73DADb3408","0xf8aD37c37075b29978ba23d07AD97B2c90883527","0x4a1E890600176554295164096c238422b139C845","0x15F8Fb3f2a5b8d0037884CD4b09e018bBb554B9C","0xf883a8b61F112ae2209fF72c642Bb38D709c268C","0x243711F944Cb2D875b69E773Ac4046704E1a1789","0x612Ecd0e9Cc0fA411609de15E460301a343F0f3A","0x64BeD5041e2112c68722952d6C765caf2BCb6013","0xe4CF4bb5049dc3DCc2b182Ed0E7ad0Af3B077A03","0xc6C84D9af59eB462f752b5fAF20ecD3392dbdC77","0xDf5A2Ec5d4306E5eD5115aa32549f7F686254872","0x8d286dCcF62a2b6843573D149d63D638c709f531","0xEB1bd2Ae7015b0668bd2c35391228485eA6f317a","0x5102222c5FAbd6CaaC8757c524977fb06268fA68","0x21b136f0DFbD145Ba7C1114d54654821196AeA18","0xFBeCD545ba67A627CF090CEFb233966020352b72","0x5a426f77188FCB83dFef692992ec7247d4c64954","0x611d80d81cD710B2B7524e58F6CccE945da4D695","0x1F8a3AF871a0628e89D176E8Ed1DFCB51CEdf845","0x6490e79b9436aC55B5469C4e7aa858435eC90D40","0x82c153560E69a44d4b6d1730F49584fd8D9bD1a4","0xCBcD8A77bb2DA46d96f1e9C832265c745F5202cf","0x0f00c8523d0B610A78b102451Ee2a96bf07376c9","0x7Eb053fDE76Fec5C3e51Ca07f32FAE1F9cA2ca9B","0xb81B2f59d44e65ff205a574CE8bBd6E0Cc5fAe4B","0xc099091cb62F6eB7A41d03d0D602244C0bF38C1E","0x54927C6bbd9EFdDF14Ff635c32331f7b46a9b353","0xaD53B9f658a536B7fc1046898c34323B0E203685","0xd97e9aa71610856F74C658F53aF1074D8ac923C0","0x1ec0F8431E9869ee6B7676AA9E172dfE737C9bdC","0x3cCC9c6aB891897Ff0D36313Ad1B04f424fcc7E4","0x99fbD1f2CF5fD44609a0450d50159d5Cb73223CE","0x9a320d17236b17543FD098351Ab1974def418fcC","0xCB667827Bbc7638b74dc0D084ae7635ffD2f0cED","0x8278AabA0531776D2C7bc0b430A3Ce5588d7Ac02","0x53D30a806A7d7955947EbC6DF1fF23b5D0105e68","0x48a232D65e8DF44EaEAA122e7e9899e88089d0d1","0x0BA5594218F91524181846D36D6ac91FaC8F8f50","0x3d7b8521AE64158747CF9555d50B4F7343ecB0dc","0x1e526a8D438A4239eC2cd59d01f232223115Dd85","0x54AB8194944c023cf84583cDe7bdA6b1a052E46a","0x250b73a6b0aC65c86C1767171B34b49cf41d8e22","0x5e7B3F715BFFB5532d96fbeE3370DBa3f5743840","0xD1c6945ebeb2cC51F1575767542cd6EEB0Cb4DA7","0x82AA12D1c00AcA4cd6EF21053D693109439618E5","0x5689dE29BaF46D00a32A163b62b5339B063FDb40","0x61674B4Dd0CC1BA834fd24B0eF1383a5F51d7F44","0xE299077c244ED7c77c18a494B2613cbd85D6E6ce","0x66CC36Dfdd9BA6B6fbd9aa8F3Cd21154646Ca778"]

let passengerPositionList =["wx4eqfdpjek","wx4eqf3fpek","wx4eqfudqek","wx4eqfyyvek","wx4eqfr7fek","wx4eqfwypek","wx4eqf4t4ek","wx4eqf7zbek","wx4eqfn9bek","wx4eqfhgkek","wx4eqfwsbek","wx4eqgeqkek","wx4eqgjpfek","wx4eqgf6tek","wx4eqgeb9ek","wx4eqgsm0ek","wx4eqg4qnek","wx4eqgf8jek","wx4eqgjfyek","wx4eqgvnsek","wx4eqg04dek","wx4eqghujek","wx4er4pnjek","wx4er4p4jek","wx4er4hdyek","wx4er4nx8ek","wx4er4squek","wx4er47wnek","wx4er4tmxek","wx4er471sek","wx4er45u1ek","wx4er4d8bek","wx4er4kvyek","wx4eqce0kek","wx4eqcfcdek","wx4eqc4krek","wx4eqczpbek","wx4eqc9shek","wx4eqcvhzek","wx4eqcwqxek","wx4eqck84ek","wx4eqcf7eek","wx4eqccyrek","wx4eqcc6dek","wx4eqdj69ek","wx4eqd753ek","wx4eqd95uek","wx4eqdw2sek","wx4eqdt18ek","wx4eqdm4gek","wx4eqdf6bek","wx4eqdcttek","wx4eqdqv6ek","wx4eqd25wek","wx4eqd1w7ek","wx4eqe1r4ek","wx4eqe2t0ek","wx4eqeffyek","wx4eqepb1ek","wx4eqe5n7ek","wx4eqetkbek","wx4eqeb2mek","wx4eqeu5uek","wx4eqee1eek","wx4eqevgdek","wx4eqemrjek","wx4er5vebek","wx4er59cmek","wx4er59hpek","wx4er5chhek","wx4er5xtwek","wx4er50rxek","wx4er5v8mek","wx4er5k9bek","wx4er5eb6ek","wx4er5rjzek","wx4er5shvek","wx4eq9zu5ek","wx4eq9pdeek","wx4eq9kmeek","wx4eq9xpyek","wx4eq9h43ek","wx4eq902tek","wx4eq9dymek","wx4eq906mek","wx4eq9s5wek","wx4eq9wcbek","wx4eq92d8ek","wx4er1mj4ek","wx4er12epek","wx4er1vweek","wx4er10s8ek","wx4er1hveek","wx4er14wrek","wx4er1gerek","wx4er1c4wek","wx4er11zdek","wx4er1k4zek","wx4er1j8mek"]

let couples = [];
let countNum = 0;


var trafficContractAbi = JSON.parse('[{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"bytes32\",\"name\":\"vehicleId\",\"type\":\"bytes32\"},{\"indexed\":false,\"internalType\":\"bytes32\",\"name\":\"passengerId\",\"type\":\"bytes32\"},{\"indexed\":false,\"internalType\":\"bytes32\",\"name\":\"passengerGeohash\",\"type\":\"bytes32\"}],\"name\":\"Myevent\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"bytes32\",\"name\":\"vehicleId\",\"type\":\"bytes32\"}],\"name\":\"boardEvent\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"bytes32\",\"name\":\"vehicleId\",\"type\":\"bytes32\"}],\"name\":\"payEvent\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"bytes32\",\"name\":\"passengerId\",\"type\":\"bytes32\"}],\"name\":\"rejectEvent\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"bytes32\",\"name\":\"passengerId\",\"type\":\"bytes32\"}],\"name\":\"routeEvent\",\"type\":\"event\"},{\"constant\":false,\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"newPrecision\",\"type\":\"uint256\"}],\"name\":\"changePrecision\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"vehicleId\",\"type\":\"bytes32\"}],\"name\":\"confirmBoard\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"vehicleId\",\"type\":\"bytes32\"}],\"name\":\"confirmPay\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"vehicleId\",\"type\":\"bytes32\"}],\"name\":\"deleteVehicle\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"internalType\":\"string\",\"name\":\"geohash\",\"type\":\"string\"}],\"name\":\"getLatBlock\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"getLatDelta\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"internalType\":\"string\",\"name\":\"geohash\",\"type\":\"string\"}],\"name\":\"getLonBlock\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"geohash\",\"type\":\"bytes32\"}],\"name\":\"getLonDelta\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"passengerId\",\"type\":\"bytes32\"}],\"name\":\"getPassengerEnd\",\"outputs\":[{\"internalType\":\"bytes32\",\"name\":\"end\",\"type\":\"bytes32\"}],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"passengerId\",\"type\":\"bytes32\"}],\"name\":\"getPassengerPos\",\"outputs\":[{\"internalType\":\"bytes32\",\"name\":\"position\",\"type\":\"bytes32\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"vehicleId\",\"type\":\"bytes32\"}],\"name\":\"getRoutes\",\"outputs\":[{\"internalType\":\"bytes32[]\",\"name\":\"route\",\"type\":\"bytes32[]\"},{\"internalType\":\"uint256\",\"name\":\"cost\",\"type\":\"uint256\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"passengerGeohash\",\"type\":\"bytes32\"}],\"name\":\"getVehicle\",\"outputs\":[{\"internalType\":\"bytes32\",\"name\":\"\",\"type\":\"bytes32\"},{\"internalType\":\"bytes32\",\"name\":\"\",\"type\":\"bytes32\"},{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"passengerGeohash\",\"type\":\"bytes32\"},{\"internalType\":\"bytes32[]\",\"name\":\"regionVehicles\",\"type\":\"bytes32[]\"}],\"name\":\"getVehicleByRegion\",\"outputs\":[{\"internalType\":\"bytes32\",\"name\":\"\",\"type\":\"bytes32\"},{\"internalType\":\"bytes32\",\"name\":\"\",\"type\":\"bytes32\"},{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"vehicleId\",\"type\":\"bytes32\"}],\"name\":\"getVehicleId\",\"outputs\":[{\"internalType\":\"bytes32\",\"name\":\"\",\"type\":\"bytes32\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"getVehicleIdList\",\"outputs\":[{\"internalType\":\"bytes32[]\",\"name\":\"\",\"type\":\"bytes32[]\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"vehicleId\",\"type\":\"bytes32\"}],\"name\":\"getVehicleStatus\",\"outputs\":[{\"internalType\":\"int32\",\"name\":\"\",\"type\":\"int32\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"passengerId\",\"type\":\"bytes32\"},{\"internalType\":\"bytes32\",\"name\":\"geohash\",\"type\":\"bytes32\"}],\"name\":\"initPassenger\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"vehicleId\",\"type\":\"bytes32\"},{\"internalType\":\"bytes32\",\"name\":\"geohash\",\"type\":\"bytes32\"}],\"name\":\"initVehicle\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"nextGeohash\",\"type\":\"bytes32\"},{\"internalType\":\"bytes32\",\"name\":\"endGeohash\",\"type\":\"bytes32\"}],\"name\":\"manhattan\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"passengerId\",\"type\":\"bytes32\"},{\"internalType\":\"bytes32\",\"name\":\"startGeohash\",\"type\":\"bytes32\"},{\"internalType\":\"bytes32\",\"name\":\"endGeohash\",\"type\":\"bytes32\"}],\"name\":\"setPassengerDemand\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"passengerId\",\"type\":\"bytes32\"},{\"internalType\":\"bytes32\",\"name\":\"passengerGeohash\",\"type\":\"bytes32\"}],\"name\":\"setPassengerPosition\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"vehicleId\",\"type\":\"bytes32\"},{\"internalType\":\"bytes32\",\"name\":\"passengerId\",\"type\":\"bytes32\"}],\"name\":\"setRejectVehicleStatus\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"vehicleId\",\"type\":\"bytes32\"},{\"internalType\":\"bytes32\",\"name\":\"vehicleGeohash\",\"type\":\"bytes32\"}],\"name\":\"setVehicle\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"vehicleId\",\"type\":\"bytes32\"},{\"internalType\":\"bytes32\",\"name\":\"passengerId\",\"type\":\"bytes32\"},{\"internalType\":\"bytes32\",\"name\":\"passengerGeohash\",\"type\":\"bytes32\"}],\"name\":\"setVehicleStatus\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"vehicleId\",\"type\":\"bytes32\"}],\"name\":\"setVehicleStatusEmpty\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"geohash1\",\"type\":\"bytes32\"},{\"internalType\":\"bytes32\",\"name\":\"geohash2\",\"type\":\"bytes32\"}],\"name\":\"sliceGeoHash\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"},{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"cost\",\"type\":\"uint256\"},{\"internalType\":\"bytes32\",\"name\":\"vehicleId\",\"type\":\"bytes32\"},{\"internalType\":\"bytes32\",\"name\":\"passengerId\",\"type\":\"bytes32\"},{\"internalType\":\"bytes32[]\",\"name\":\"route\",\"type\":\"bytes32[]\"}],\"name\":\"storeRoutes\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"}]');

var trafficContract = new web3.eth.Contract(trafficContractAbi,trafficContractAddress);

//乘客发出调度请求
function manageVehicle(){
    for(let i = 0; i < passengerIdList.length; i++){
        getVehicle(passengerIdList[i], passengerPositionList[i], 0);
    }
}
manageVehicle();

async function getVehicle(passengerId,positionGeohash, count){
	let getVehicleTime1 = Date.now()
	trafficContract.methods.getVehicle(web3.utils.asciiToHex(positionGeohash)).call({from: passengerId, gas: 500000000}).then(async function(result1){
		let getVehicleTime2 = Date.now() - getVehicleTime1;
		trafficContract.methods.setVehicleStatus(result1[1], passengerId, web3.utils.asciiToHex(positionGeohash)).send({from: passengerId, gas: 5000000,position:"w3511111111111",txtime:278000}).then(function(result2){
			// console.log("getVehicleTime2: ", getVehicleTime2);
			// $("#vehicleEvent").val("车辆选择成功");
			// console.log("车辆选择成功");
			// console.log("getVehicle:",result1);
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
                let gname = "./coupleResult/averageCouple.json";
                let jsonstr = JSON.stringify(couples);
                fs.writeFileSync(gname,jsonstr,{flag:'w',encoding:'utf-8',mode:'0666'},function(err){});
            }
			
		},function(error2){
			// console.log("error2: ", error2);
			count++;
			if(count < 10){
				// $("#vehicleEvent").val("调度车辆中");
				// console.log("调度车辆中");
				getVehicle(passengerId, positionGeohash, count);
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
                    let gname = "./coupleResult/averageCouple.json";
                    let jsonstr = JSON.stringify(couples);
                    fs.writeFileSync(gname,jsonstr,{flag:'w',encoding:'utf-8',mode:'0666'},function(err){});
                }
			}
		})
	},function(error1){
		// console.log("error1: ", error1);
		count++;
		if(count < 10){
			// $("#vehicleEvent").val("调度车辆中");
			// console.log("调度车辆中");
			getVehicle(passengerId, positionGeohash, count);
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
                let gname = "./coupleResult/averageCouple.json";
                let jsonstr = JSON.stringify(couples);
                fs.writeFileSync(gname,jsonstr,{flag:'w',encoding:'utf-8',mode:'0666'},function(err){});
            }
		}
	});
}


// eth.sendTransaction({from:eth.accounts[0],to:eth.accounts[2],value:web3.toWei(1,"ether"),position:"wx4erg11111111",txtime:6})
var deltaLat = 0.596496069;
var deltaLon = [1.191555127,1.1800798,1.157239659,1.123254668,1.07845212,1.023263489,0.958220271,0.883948868,0.801164554,0.710664587,0.613320532,0.510069865,0.401906947,0.289873444,0.175048303,0.05853735];
var Base32 = "0123456789bcdefghjkmnpqrstuvwxyz".split("");
var Bits = [16, 8, 4, 2, 1];
var precision = 10;
var divnum = 4;

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