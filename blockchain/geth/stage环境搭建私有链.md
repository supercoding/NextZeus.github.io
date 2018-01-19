# stage环境搭建私有链

```

测试环境安装geth

1. git clone https://github.com/ethereum/go-ethereum
2. cd go-ethereum & make get

genesis.json

{
  "config": {
    "chainId": 1907,
    "homesteadBlock": 0,
    "eip155Block": 0,
    "eip158Block": 0
  },
  "difficulty": "40",
  "gasLimit": "4700000",
  "alloc": {}
}

账号：
dcfe9cccc0dcf170cff5ee1f758a93543fcfc28a hero1
1b5a02fff927692d60443b2e6fc2463cf865c5af hero2

go-ethereum/build/bin/geth --datadir /data/work/gethnode1 account new

go-ethereum/build/bin/geth --datadir /data/work/gethnode1 account new

go-ethereum/build/bin/geth --datadir /data/work/gethnode1 init go-ethereum/genesis.json

go-ethereum/build/bin/geth --datadir "/data/work/gethnode1" --networkid 98765 --rpc --rpcport "8545" --rpcaddr "0.0.0.0" --rpcapi "db,eth,web3,personal,net" --mine --minerthreads=1 console


miner.stop()
miner.start(1) 开始挖矿

personal.unlockAccount(eth.coinbase,'hero1',30000)



```