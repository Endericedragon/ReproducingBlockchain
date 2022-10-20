var fs = require('fs');

let gene = fs.readFileSync('./genesis.json');

gene = JSON.parse(gene);
let gene2 = gene.alloc

console.log(Object.keys(gene.alloc).length);