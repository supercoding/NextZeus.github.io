var Web3 = require("web3");
var contract = require("truffle-contract");
var contract_abi = [];
// 通过ABI初始化合约对象
var MetaCoin = contract({
    abi: contract_abi
});

var provider = new Web3.providers.HttpProvider("https://ropsten.infura.io/");

MetaCoin.setProvider(provider);

var account_one = "";
// 合约地址
var contract_address = "";

var instance = null;

MetaCoin.at(contract_address).then(function(data){
    instance = data;
    //调用合约的方法
    return instance.getOwner.call();
})
.then(function(userId){
    console.log('userId: ',userId);
})
.catch(function(err){
    console.log('hahs',err);
});