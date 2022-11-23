let fs=require('fs');
let region6HighFile = "./region6_highCenterCouple.json";
let region7HighFile = "./region7_highCenterCouple.json";
let region75HighFile = "./region75_highCenterCouple.json";

let region6_high = JSON.parse(fs.readFileSync(region6HighFile, 'utf-8'));
let region7_high = JSON.parse(fs.readFileSync(region7HighFile, 'utf-8'));
let region75_high = JSON.parse(fs.readFileSync(region75HighFile, 'utf-8'));

let region6Result = [];
let region7Result = [];
let region75Result = [];

let region6ResultFile = "./filterResult/region6_highFilter.json";
let region7ResultFile = "./filterResult/region7_highFilter.json";
let region75ResultFile = "./filterResult/region75_highFilter.json";

for(let i = 0; i < region6_high.length; i++){
    let position6 = region6_high[i].passengerGeoHash;
    let distance6 = region6_high[i].theirDistance;
    if(distance6 != 0){
        for(let j = 0; j < region7_high.length; j++){
            let position7 = region7_high[j].passengerGeoHash;
            let distance7 = region7_high[j].theirDistance;
            if(position7 == position6 && distance7 != 0){
                
                for(let k = 0; k < region75_high.length; k++){
                    let position75 = region75_high[k].passengerGeoHash;
                    let distance75 = region75_high[k].theirDistance;
                    if(position75 == position7 && distance75 != 0){
                        console.log("position75: ", position75);
                        region6Result.push(region6_high[i]);
                        region7Result.push(region7_high[j]);
                        region75Result.push(region75_high[k]);
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


