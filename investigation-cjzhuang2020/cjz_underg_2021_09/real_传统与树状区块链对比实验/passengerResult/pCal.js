let fs=require('fs');
let pnoregionFile = "./pnoregion.json";

let pnoregion = JSON.parse(fs.readFileSync(pnoregionFile, 'utf-8'));

console.log(pnoregion.length);





