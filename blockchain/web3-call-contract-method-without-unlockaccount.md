# web3 call contract method without unlock account

- 查看文档搜集资料测试研究出来的结果

```

let myContract = contInstance.getContractInstance('zoo');
    
// suppose you want to call a function named myFunction of myContract

let functionParams = {};

<!--external contract method-->
let getData = myContract.contractMethod.request(functionParams).params[0].data
/* getData
{ method: 'eth_sendTransaction',
  callback: undefined,
  params:
   [ { to: '0xd84b922494c3a39113052eb6cc4453b968ee69f7',
       data: '0xfbede92000000000000000000000000000000000000000000000000000000000000003ea' } ],
  format: [Function: bound ] }
*/  

let from = '0xFrom'; //from地址
let gas = 400000;
web3.eth.sendTransaction({from:from, data: getData,gasPrice:web3.eth.gasPrice,gas:gas});

```
