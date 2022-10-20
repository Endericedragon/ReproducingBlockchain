let fs=require('fs');
let region6AveFile = "./region6_aveCenterCouple.json";
let region7AveFile = "./region7_aveCenterCouple.json";
let region75AveFile = "./region75_aveCenterCouple.json";

let region6_ave = JSON.parse(fs.readFileSync(region6AveFile, 'utf-8'));
let region7_ave = JSON.parse(fs.readFileSync(region7AveFile, 'utf-8'));
let region75_ave = JSON.parse(fs.readFileSync(region75AveFile, 'utf-8'));

let region6Result = [];
let region7Result = [];
let region75Result = [];

let region6ResultFile = "./filterResult/region6_aveFilter.json";
let region7ResultFile = "./filterResult/region7_aveFilter.json";
let region75ResultFile = "./filterResult/region75_aveFilter.json";

for(let i = 0; i < region6_ave.length; i++){
    let position6 = region6_ave[i].passengerGeoHash;
    let distance6 = region6_ave[i].theirDistance;
    if(distance6 != 0){
        for(let j = 0; j < region7_ave.length; j++){
            let position7 = region7_ave[j].passengerGeoHash;
            let distance7 = region7_ave[j].theirDistance;
            if(position7 == position6 && distance7 != 0){
                
                for(let k = 0; k < region75_ave.length; k++){
                    let position75 = region75_ave[k].passengerGeoHash;
                    let distance75 = region75_ave[k].theirDistance;
                    if(position75 == position7 && distance75 != 0){
                        console.log("position75: ", position75);
                        region6Result.push(region6_ave[i]);
                        region7Result.push(region7_ave[j]);
                        region75Result.push(region75_ave[k]);
                    }
                }
            }
        }
    }
}

let region6ResultJson = JSON.stringify(region6Result);
let region7ResultJson = JSON.stringify(region7Result);
let region75ResultJson = JSON.stringify(region75Result);

fs.writeFileSync(region6ResultFile,region6ResultJson,{flag:'w',encoding:'utf-8',mode:'0666'},function(err){});
fs.writeFileSync(region7ResultFile,region7ResultJson,{flag:'w',encoding:'utf-8',mode:'0666'},function(err){});
fs.writeFileSync(region75ResultFile,region75ResultJson,{flag:'w',encoding:'utf-8',mode:'0666'},function(err){});


