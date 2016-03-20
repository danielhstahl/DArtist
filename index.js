const crypto = require('crypto');
var Web3=require('web3');
var ursa=require('ursa');
var keys=ursa.generatePrivateKey();

var privPem=keys.toPrivatePem('base64');
//console.log(privPem);

var priv = ursa.createPrivateKey(privPem, '', 'base64');
//console.log(priv);

var pubPem = keys.toPublicPem('base64');
//console.log('pubPem:', pubPem);

var pub = ursa.createPublicKey(pubPem, 'base64');

var data = new Buffer('hello world');
//console.log('data:', data);

var enc = pub.encrypt(data);
//console.log('enc:', enc);

var unenc = priv.decrypt(enc);
//console.log('unenc:', unenc);

/*var sha256 = crypto.createHash('sha256');
sha256.update("hello world");
var d = sha256.digest('hex');
console.log(d);*/


if(typeof web3 !== 'undefined'){
  web3 = new Web3(web3.currentProvider);
}
else{
  // set the provider you want from Web3.providers
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

var ABI =[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"availableFiles","outputs":[{"name":"owner","type":"address"},{"name":"author","type":"address"},{"name":"price","type":"uint256"},{"name":"exists","type":"bool"}],"type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"buyFile","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"owners","outputs":[{"name":"","type":"bytes32"}],"type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"},{"name":"price","type":"uint256"}],"name":"addFile","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"maxOwnership","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"inputs":[{"name":"tokenName","type":"string"}],"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"bytes32"}],"name":"FileBought","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"price","type":"uint256"},{"indexed":false,"name":"value","type":"bytes32"}],"name":"FileAdded","type":"event"}]
;

//var contractAddress = "0xb1f1e62116fc99e0773aB46826D5977251CF0BBC";
//var contractAddress = "0x39a617fA0150324815150D2ebf5F45e9fec1198D";
var contractAddress = "0xe05846BC159889501735258A2E4fbE5a745d8D35";
//0x0353923bBA81475321a1394b9332Ef3d5F73a6A6
var contract = web3.eth.contract(ABI).at(contractAddress);
var event = contract.FileAdded();
// watch for changes
event.watch(function(error, result){
  if(error){
    console.log(error);
    return;
  }
  console.log(result);
});
//console.log(web3.eth.accounts);
web3.eth.defaultAccount=web3.eth.accounts[1];

var supersecretfile="mypainting3";
var hash = web3.sha3(supersecretfile);
console.log(hash);

function checkAuthenticity(hash){//ensures authenticity of the file
  return contract.availableFiles(hash)[3];//this is the index of the "exists" variable in the "file" struct (see SendFile.sol)
}
function getAllFiles(owner){
  var maxIndex=contract.maxOwnership(owner).c[0];
  //console.log(maxIndex);
  var ownedFiles=[];
  for(var i=1; i<=maxIndex; i++){ //the way I created it in the contract its "1" based
    var myFile=contract.owners(owner, i);
    console.log(myFile);
    if(myFile!='0x0000000000000000000000000000000000000000000000000000000000000000'){ //blank is 0?
      ownedFiles.push(myFile);
    }
  }
}
function addFile(hash, price){
  contract.addFile.sendTransaction(hash, price, {gas: 300000});
}
function buyFile(hash){
  contract.buyFile.sendTransaction(hash, {gas: 300000});
}
//addFile(hash);
//buyFile(hash);
getAllFiles(web3.eth.accounts[0]);
//console.log(checkAuthenticity(hash));
