
 let fs=require('fs');
 for( let i=0;i<=850;i++){
    fs.writeFileSync("./unlock.js"," personal.unlockAccount(eth.accounts["+i+"],\"123456\",0);\n",{flag:'a',encoding:'utf-8',mode:'0666'},function(err){});
 }