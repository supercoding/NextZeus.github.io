# local环境搭建私有链

```

测试环境部署geth 

networks {
	dev:{
		host: "0.0.0.0",
	      	port: 8545,
      		gas: 4641592,
			gasPrice: 65000000000,
      		network_id: "*" 
	}
}

//启动本地私链
geth --dev --rpc --rpcapi “eth,web3,personal,net” --cache=1024 --rpcport 8545 --rpcaddr 0.0.0.0 --rpccorsdomain "*"  --mine --minerthreads=1 console


//精品 first-steps-with-ethereum-private-networks-and-smart-contracts-on-ubuntu-16-04/
https://alanbuxton.wordpress.com/2017/07/19/first-steps-with-ethereum-private-networks-and-smart-contracts-on-ubuntu-16-04/


geth --datadir "/Users/lixiaodong/Documents/node1" --networkid 98765 --rpc --rpcport "8545" --rpcaddr "0.0.0.0" --rpcapi "db,eth,web3,personal,net" console


//部署合约前 需要unlockAccount eth.coinbase
personal.unlockAccount(eth.accounts[0], )


eth.sendTransaction({from: eth.accounts[0], to: eth.accounts[1], value: web3.toWei(3,"ether")})



Error: The method net_version does not exist/is not available
—recapi ‘db,eth,web3,net’ 把net导出

Error: exceeds block gas limit

Thank you! I checked the current gas limit using web3.eth.getBlock("latest") and the gas limit was greater which was in 2_deploy_contracts.js. I reduced the value lesser than the latest gas limit. Then ran truffle migrate which successfully deployed the contract

Error: The contract code couldn't be stored, please check your gas amount

0xb572b08bfa89a90774d4c98a9562f35a37d3478037014d61915803c67885a639



```