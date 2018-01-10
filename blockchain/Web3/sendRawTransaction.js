var Web3 = require("web3");
var web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/"));
var privateKey = new Buffer('私钥','hex');
var from = 'from';

var Tx = require('ethereumjs-tx');
var value = web3.toWei(0.25,'ether');
var valueHex = web3.toHex( value ) ;
var nonce = web3.eth.getTransactionCount(from);
var nonceHex = web3.toHex( nonce ) ;
var gasPrice = web3.eth.gasPrice;
var gasPriceHex = web3.toHex( gasPrice );
var gasLimitHex =  web3.toHex( 300000 );

console.log('value: ',value);
console.log('valueHex: ',valueHex);
console.log('nonce: ',nonce);
console.log('nonceHex: ',nonceHex);
console.log('gasPrice: ',gasPrice);
console.log('gasPriceHex: ',gasPriceHex);
console.log('gasLimitHex: ',gasLimitHex);

var rawTx = {
    nonce: nonceHex,
    gasPrice: gasPriceHex, 
    gasLimit: gasLimitHex,
    to: 'to', 
    value: valueHex, 
    data: '0x1234567890'
};

var tx = new Tx(rawTx);
tx.sign(privateKey);

var serializedTx = tx.serialize();
var serializedHex = '0x' + serializedTx.toString('hex');
console.log('serializedTx: ',serializedTx);
console.log('serializedHex: ',serializedHex);

web3.eth.sendRawTransaction(serializedHex, function(err, hash) {
    if (!err){
        console.log('交易订单请查看 \nhttps://ropsten.etherscan.io/tx/' + hash);
    } else {
        console.error(err);
    }
});