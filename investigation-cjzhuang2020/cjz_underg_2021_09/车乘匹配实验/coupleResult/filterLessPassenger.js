let fs=require('fs');
let region6LessFile = "./region6_lessCenterCouple.json";
let region7LessFile = "./region7_lessCenterCouple.json";
let region75LessFile = "./region75_lessCenterCouple.json";

let region6_less = JSON.parse(fs.readFileSync(region6LessFile, 'utf-8'));
let region7_less = JSON.parse(fs.readFileSync(region7LessFile, 'utf-8'));
let region75_less = JSON.parse(fs.readFileSync(region75LessFile, 'utf-8'));

let region6Result = [];
let region7Result = [];
let region75Result = [];

let region6ResultFile = "./filterResult/region6_lessFilter.json";
let region7ResultFile = "./filterResult/region7_lessFilter.json";
let region75ResultFile = "./filterResult/region75_lessFilter.json";

for(let i = 0; i < region6_less.length; i++){
    let position6 = region6_less[i].passengerGeoHash;
    let distance6 = region6_less[i].theirDistance;
    if(distance6 != 0){
        for(let j = 0; j < region7_less.length; j++){
            let position7 = region7_less[j].passengerGeoHash;
            let distance7 = region7_less[j].theirDistance;
            if(position7 == position6 && distance7 != 0){
                
                for(let k = 0; k < region75_less.length; k++){
                    let position75 = region75_less[k].passengerGeoHash;
                    let distance75 = region75_less[k].theirDistance;
                    if(position75 == position7 && distance75 != 0){
                        console.log("position75: ", position75);
                        region6Result.push(region6_less[i]);
                        region7Result.push(region7_less[j]);
                        region75Result.push(region75_less[k]);
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


