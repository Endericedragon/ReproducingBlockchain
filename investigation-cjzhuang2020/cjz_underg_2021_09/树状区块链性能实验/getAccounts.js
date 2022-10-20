let fs = require('fs');
let passengerAccountFile = "./allPassengerAccounts.json";
let vehicleAccountFile = "./allVehicleAccounts.json";
let getPassengerResult = "./accountResult/partPassenger.json";
let getVehicleResult = "./accountResult/partVehicle.json";

let passengerAccounts = JSON.parse(fs.readFileSync(passengerAccountFile, 'utf-8'));
let vehicleAccounts = JSON.parse(fs.readFileSync(vehicleAccountFile, 'utf-8'));
// console.log(passengerAccounts.slice(0,2))

function getHowMuch(passengerNum, vehicleNum){
    let passengerResult = passengerAccounts.slice(0, passengerNum);
    let vehicleResult = vehicleAccounts.slice(0, vehicleNum);
    fs.writeFile(getPassengerResult, JSON.stringify(passengerResult),{flag:'w',encoding:'utf-8',mode:'0666'},function(err){});
    fs.writeFile(getVehicleResult, JSON.stringify(vehicleResult),{flag:'w',encoding:'utf-8',mode:'0666'},function(err){});
}
getHowMuch(390, 800);
