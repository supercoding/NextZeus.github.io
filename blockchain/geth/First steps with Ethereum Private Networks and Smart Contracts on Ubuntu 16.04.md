# First steps with Ethereum Private Networks and Smart Contracts on Ubuntu 16.04
[原文地址](https://alanbuxton.wordpress.com/2017/07/19/first-steps-with-ethereum-private-networks-and-smart-contracts-on-ubuntu-16-04/)

#### ON JULY 19, 2017 BY ALANBUXTONIN SOFTWARE DEVELOPMENT


Ethereum is still in that “move fast and break things” phase. The docs for contracts[1] are very out of date, even the docs for mining have some out of date content in[2].

I wanted a very simple guide to setting up a small private network for testing smart contracts. I couldn’t find a simple one that worked. After much trial and error and digging around on Stackexchange, see below the steps I eventually settled on to get things working with a minimum of copy/paste. Hope it will prove useful for other noobs out there and that more experienced people might help clear things up that I have misunderstood.

I’ll do 3 things:

1. Set up my first node and do some mining on it
2. Add a very simple contract
3. Add a second node to the network
First make sure you have installed ethereum (geth) and solc, for example with:

```
sudo apt-get install software-properties-common
sudo add-apt-repository -y ppa:ethereum/ethereum
sudo apt-get update
sudo apt-get install ethereum solc

```
Set up first node and do some mining on it
Create a genesis file – the below is about as simple as I could find. Save it as genesis.json in your working directory.

```

{
  "config": {
    "chainId": 1907,
    "homesteadBlock": 0,
    "eip155Block": 0,
    "eip158Block": 0
  },
  "difficulty": "40",
  "gasLimit": "2100000",
  "alloc": {}
}

```

Make a new data directory for the first node and set up two accounts to be used by that node. (Obviously your addresses will differ to the examples you see below).

```
ethuser@host01:~$ mkdir node1
ethuser@host01:~$ geth --datadir node1 account new
WARN [07-19|14:16:22] No etherbase set and no accounts found as default 
Your new account is locked with a password. Please give a password. Do not forget this password.
Passphrase: 
Repeat passphrase: 
Address: {f74afb1facd5eb2dd69feb589213c12be9b38177}
ethuser@host01:~$ geth --datadir node1 account new
Your new account is locked with a password. Please give a password. Do not forget this password.
Passphrase: 
Repeat passphrase: 
Address: {f0a3cf66cc2806a1e9626e11e5324360ee97f968}
Choose a networkid for your private network and initiate the first node:

ethuser@host01:~$ geth --datadir node1 init genesis.json
INFO [07-19|14:21:44] Allocated cache and file handles         database=/home/ethuser/node1/geth/chaindata cache=16 handles=16
....
INFO [07-19|14:21:44] Successfully wrote genesis state         database=lightchaindata                          hash=dd3f8d…707d0d
Now launch a geth console

ethuser@host01:~$ geth --datadir node1 --networkid 98765 console
INFO [07-19|14:22:42] Starting peer-to-peer node               instance=Geth/v1.6.7-stable-ab5646c5/linux-amd64/go1.8.1
...
 datadir: /home/ethuser/node1
 modules: admin:1.0 debug:1.0 eth:1.0 miner:1.0 net:1.0 personal:1.0 rpc:1.0 txpool:1.0 web3:1.0

> 
The first account you created is set as eth.coinbase. This will earn ether through mining. It does not have any ether yet[3], so we need to mine some blocks:

> eth.coinbase
"0xf74afb1facd5eb2dd69feb589213c12be9b38177"
> eth.getBalance(eth.coinbase)
0
> miner.start(1)
First time you run this it will create the DAG. This will take some time. Once the DAG is completed, leave the miner running for a while until it mines a few blocks. When you are ready to stop it, stop it with miner.stop().

.....
INFO [07-19|14:40:03] 🔨 mined potential block                  number=13 hash=188f37…47ef07
INFO [07-19|14:40:03] Commit new mining work                   number=14 txs=0 uncles=0 elapsed=196.079µs
> miner.stop()
> eth.getBalance(eth.coinbase)
65000000000000000000
> eth.getBalance(eth.accounts[0])
65000000000000000000
The first account in the account list is the one that has been earning the ether for its mining, so all we prove above is that eth.coinbase == eth.accounts[0]. Now we’ve got some ether in the first account, let’s send it to the 2nd account we created. The source account has to be unlocked before it can send a transaction.

> eth.getBalance(eth.accounts[1])
0
> personal.unlockAccount(eth.accounts[0])
Unlock account 0xf74afb1facd5eb2dd69feb589213c12be9b38177
Passphrase: 
true
> eth.sendTransaction({from: eth.accounts[0], to: eth.accounts[1], value: web3.toWei(3,"ether")})
INFO [07-19|14:49:12] Submitted transaction                    fullhash=0xa69d3fdf5672d2a33b18af0a16e0b56da3cbff5197898ad8c37ced9d5506d8a8 recipient=0xf0a3cf66cc2806a1e9626e11e5324360ee97f968
"0xa69d3fdf5672d2a33b18af0a16e0b56da3cbff5197898ad8c37ced9d5506d8a8"
For this transaction to register it has to be mined into a block, so let’s mine one more block:

> miner.start(1)
> 
INFO [07-19|14:50:14] Updated mining threads                   threads=1
INFO [07-19|14:50:14] Transaction pool price threshold updated price=18000000000
null
> INFO [07-19|14:50:14] Starting mining operation 
> 
INFO [07-19|14:50:14] Commit new mining work                   number=14 txs=1 uncles=0 elapsed=507.975µs
INFO [07-19|14:51:39] Successfully sealed new block            number=14 hash=f77345…f484c9
INFO [07-19|14:51:39] 🔗 block reached canonical chain          number=9  hash=2e7186…5fbd96
INFO [07-19|14:51:39] 🔨 mined potential block                  number=14 hash=f77345…f484c9

> miner.stop()
true
> eth.getBalance(eth.accounts[1])
3000000000000000000

```
One small point: the docs talk about miner.hashrate. This no longer exists, you have to use eth.hashrate if you want to see mining speed.

Add a very simple contract
The example contract is based on an example in the Solidity docs. There is no straightforward way to compile a contract into geth. Browser-solidity is a good online resource but I want to stick to the local server as much as possible for this posting. Save the following contract into a text file called simple.sol

```

pragma solidity ^0.4.13;

contract Simple {
  function arithmetics(uint _a, uint _b) returns (uint o_sum, uint o_product) {
    o_sum = _a + _b;
    o_product = _a * _b;
  }

  function multiply(uint _a, uint _b) returns (uint) {
    return _a * _b;
  }
}

```

And compile it as below:

```

ethuser@host01:~/contract$ solc -o . --bin --abi simple.sol
ethuser@host01:~/contract$ ls
Simple.abi  Simple.bin  simple.sol
The .abi file holds the contract interface and the .bin file holds the compiled code. There is apparently no neat way to load these files into geth so we will need to edit those files into scripts that can be loaded. Edit the files so they look like the below:

ethuser@host01:~/contract$ cat Simple.abi
var simpleContract = eth.contract([{"constant":false,"inputs":[{"name":"_a","type":"uint256"},{"name":"_b","type":"uint256"}],"name":"multiply","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_a","type":"uint256"},{"name":"_b","type":"uint256"}],"name":"arithmetics","outputs":[{"name":"o_sum","type":"uint256"},{"name":"o_product","type":"uint256"}],"payable":false,"type":"function"}])
and

ethuser@host01:~/contract$ cat Simple.bin
personal.unlockAccount(eth.accounts[0])

var simple = simpleContract.new(
{ from: eth.accounts[0],
data: "0x6060604052341561000f57600080fd5b5b6101178061001f6000396000f30060606040526000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063165c4a161460475780638c12d8f0146084575b600080fd5b3415605157600080fd5b606e600480803590602001909190803590602001909190505060c8565b6040518082815260200191505060405180910390f35b3415608e57600080fd5b60ab600480803590602001909190803590602001909190505060d6565b604051808381526020018281526020019250505060405180910390f35b600081830290505b92915050565b600080828401915082840290505b92509290505600a165627a7a72305820389009d0e8aec0e9007e8551ca12061194d624aaaf623e9e7e981da7e69b2e090029",
gas: 500000
}
)

```

Two things in particular to notice:

In the .bin file you need to ensure that the from account is unlocked
The code needs to be enclosed in quotes and begin with 0x
Launch geth as before, load the contract scripts, mine them into a block and then interact with the contract. We won’t be able to do anything useful with the contract until it’s mined, as you can see below.

```

ethuser@host01:~$ geth --datadir node1 --networkid 98765 console
INFO [07-19|16:33:02] Starting peer-to-peer node instance=Geth/v1.6.7-stable-ab5646c5/linux-amd64/go1.8.1
....
> loadScript("contract/Simple.abi")
true
> loadScript("contract/Simple.bin")
Unlock account 0xf74afb1facd5eb2dd69feb589213c12be9b38177
Passphrase: 
INFO [07-19|16:34:16] Submitted contract creation              fullhash=0x318caec477b1b5af4e36b277fe9a9b054d86744f2ee12e22c12a7d5e16f9a022 contract=0x2994da3a52a6744aafb5be2adb4ab3246a0517b2
true
> simple
{
....
  }],
  address: undefined,
  transactionHash: "0x318caec477b1b5af4e36b277fe9a9b054d86744f2ee12e22c12a7d5e16f9a022"
}
> simple.multiply
undefined
> miner.start(1)
INFO [07-19|16:36:07] Updated mining threads                   threads=1
...
INFO [07-19|16:36:21] 🔨 mined potential block                  number=15 hash=ac3991…83b9ac
...
> miner.stop()
true
> simple.multiply
function()
> simple.multiply.call(5,6)
30
> simple.arithmetics.call(8,9)
[17, 72]

```

Set up a second node in the network
I’ll run the second node on the same virtual machine to keep things simple. The steps to take are:

Make sure the existing geth node is running
Create an empty data directory for the second node
Add accounts for the second geth node as before
Initialise the second geth node using the same genesis block as before
Launch the second geth node setting bootnodes to point to the existing node
The second geth node will need to run on a non-default port.

Find the enode details from the existing geth node:

```

> admin.nodeInfo
{  enode: "enode://08993401988acce4cd85ef46a8af10d1cacad39652c98a9df4d5785248d1910e51d7f3d330f0a96053001264700c7e94c4ac39d30ed5a5f79758774208adaa1f@[::]:30303", 
...

```

We will need to substitute [::] with the IP address of the host, in this case 127.0.0.1

To set up the second node:

```

ethuser@host01:~$ mkdir node2
ethuser@host01:~$ geth --datadir node2 account new
WARN [07-19|16:55:52] No etherbase set and no accounts found as default 
Your new account is locked with a password. Please give a password. Do not forget this password.
Passphrase: 
Repeat passphrase: 
Address: {00163ea9bd7c371f92ecc3020cfdc69a32f70250}
ethuser@host01:~$ geth --datadir node2 init genesis.json
INFO [07-19|16:56:14] Allocated cache and file handles         database=/home/ethuser/node2/geth/chaindata cache=16 handles=16
...
INFO [07-19|16:56:14] Writing custom genesis block 
INFO [07-19|16:56:14] Successfully wrote genesis state         database=lightchaindata                          hash=dd3f8d…707d0d
ethuser@host01:~$ geth --datadir node2 --networkid 98765 --port 30304 --bootnodes "enode://08993401988acce4cd85ef46a8af10d1cacad39652c98a9df4d5785248d1910e51d7f3d330f0a96053001264700c7e94c4ac39d30ed5a5f79758774208adaa1f@127.0.0.1:30303" console

```

Wait a little and you will see block synchronisation taking place

```

> INFO [07-19|16:59:36] Block synchronisation started 
INFO [07-19|16:59:36] Imported new state entries               count=1 flushed=0 elapsed=118.503µs processed=1 pending=4 retry=0 duplicate=0 unexpected=0
INFO [07-19|16:59:36] Imported new state entries               count=3 flushed=2 elapsed=339.353µs processed=4 pending=3 retry=0 duplicate=0 unexpected=0
To check that things have fully synced, run eth.getBlock('latest') on each of the nodes. If things aren’t looking right then use admin.peers on each node to make sure that each node has peered with the other node.

```

Now you can run the miner on one node and run transactions on the other node.

Notes
[1]  [https://github.com/ethereum/go-ethereum/issues/3793](https://github.com/ethereum/go-ethereum/issues/3793):

Compiling via RPC has been removed in #3740 (see ethereum/EIPs#209 for why). We will bring it back under a different method name if there is sufficient user demand. You’re the second person to complain about it within 2 days, so it looks like there is demand.

[2] The official guide to Contracts is out of date. I spotted some out of date material on Mining and submitted an issue but updating the official docs doesn’t seem much of a priority so I figured I would collect my learnings here for now.
[3] You can pre-allocate ether in the genesis.json if you prefer, but that would mean a little more cut and paste which I am doing my best to minimise here.