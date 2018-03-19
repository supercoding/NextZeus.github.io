# stage环境搭建私有链

```

测试环境安装geth 使用stable-1.7.3版本，使用unstable版本，发布合约的时候会出现问题
https://github.com/trufflesuite/truffle/issues/721

1. git clone https://github.com/ethereum/go-ethereum
2. cd go-ethereum & make get

genesis.json

{
  "config": {
    "chainId": 98765,
    "homesteadBlock": 0,
    "eip155Block": 0,
    "eip158Block": 0
  },
  "difficulty": "40",
  "gasLimit": "1000000",
  "alloc": {}
}

账号：
dcfe9cccc0dcf170cff5ee1f758a93543fcfc28a hero1
1b5a02fff927692d60443b2e6fc2463cf865c5af hero2

geth --datadir /data/work/gethnode1 account new

geth --datadir /data/work/gethnode1 account new


geth --datadir /data/work/gethnode1 init go-ethereum/genesis.json

geth --datadir "/data/work/gethnode1" --networkid 98765 --rpc --rpcport "8545" --rpcaddr "0.0.0.0" --rpcapi "db,eth,web3,personal,net" --mine --minerthreads=1 console

miner.stop()
miner.start(1) 开始挖矿

geth attach /data/work/gethnode1/geth.ipc

personal.unlockAccount(eth.coinbase,'hero1',30000)


```

## 搭建本地区块链浏览器

[参考github](https://github.com/carsenk/explorer)

## smart-contract-watch
[smart-contract-watch](https://github.com/Neufund/smart-contract-watch)