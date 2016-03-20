var Web3=require('web3');
if(typeof web3 !== 'undefined'){
  web3 = new Web3(web3.currentProvider);
}
else{
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}
var ABI =[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"bytes32"}],"name":"owners","outputs":[{"name":"","type":"bool"}],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"availableFiles","outputs":[{"name":"owner","type":"address"},{"name":"author","type":"address"},{"name":"price","type":"uint256"},{"name":"exists","type":"bool"}],"type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"buyFile","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"},{"name":"price","type":"uint256"}],"name":"addFile","outputs":[],"type":"function"},{"inputs":[{"name":"tokenName","type":"string"}],"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"bytes32"}],"name":"FileBought","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"price","type":"uint256"},{"indexed":false,"name":"value","type":"bytes32"}],"name":"FileAdded","type":"event"}];

//var contractAddress = "0xb1f1e62116fc99e0773aB46826D5977251CF0BBC";
var contractAddress = "0x39a617fA0150324815150D2ebf5F45e9fec1198D";
//0x0353923bBA81475321a1394b9332Ef3d5F73a6A6
var contract = web3.eth.contract(ABI).at(contractAddress);
web3.eth.defaultAccount=web3.eth.accounts[0];
console.log(contract.availableFiles());
console.log(contract.owners());
console.log(contract.name());
