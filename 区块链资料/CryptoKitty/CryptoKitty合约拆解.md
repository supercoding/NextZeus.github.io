# CryptoKitty合约拆解

## KittyAccessControl

管理多个地址和约束条件，只限CEO,CFO,COO


## KittyBase

定义了共享的基础方法， 主要数据存储，常量，数据类型，内部函数

```

event Birth(address owner, uint256 kittyId, uint256 matronId, uint256 sireId, uint256 genes);
event Transfer(address from, address to, uint256 tokenId);

struct Kitty {
    uint256 genes;
    uint64 birthTime;
    uint64 cooldownEndBlock;
    uint32 matronId;
    uint32 sireId;
    uint32 siringWithId;
    uint16 cooldownIndex;
    uint16 generation;
}

uint32[14] public cooldowns = []; //冷却时间数组

uint256 public secondsPerBlock = 15;//每个区块之间的时间

Kitty[] kitties;

mapping (uint256 => address) public kittyIndexToOwner;
mapping (address => uint256) ownershipTokenCount;
mapping (uint256 => address) public kittyIndexToApproved;
mapping (uint256 => address) public sireAllowedToAddress;

SaleClockAuction public saleAuction;
SiringClockAuction public siringAuction;

function _transfer(address _from, address _to, uint256 _tokenId) internal 

//创建一只猫
function _createKitty(uint256 _matronId,uint256 _sireId,uint256 _generation,uint256 _genes,address _owner) internal

function setSecondsPerBlock(uint256 secs) external onlyCLevel 

```


## KittyOwnership is KittyBase, ERC721 

```

function setMetadataAddress(address _contractAddress) public onlyCEO

//检查一个地址是否是这只猫的owner
function _owns(address _claimant, uint256 _tokenId) internal

//检查一个地址是否拥有这只猫的转移批准
function _approvedFor(address _claimant, uint256 _tokenId) internal

//这只猫被用户标记为可拍卖的状态 ？？？
function _approve(uint256 _tokenId, address _approved) internal

//获取一个用户的所有猫的个数
function balanceOf(address _owner) public

//交易一只猫
function transfer(address _to,uint256 _tokenId) external 

//授权一个地址可以通过transferFrom转移一只特殊的猫
function approve(address _to,uint256 _tokenId) external

//转移一个其他address拥有的猫 市场中的猫？？？把所有权先授权给系统address, 然后系统可以再转交给买家？？？
function transferFrom(address _from,address _to,uint256 _tokenId) external

//当前世界总共的猫数量
function totalSupply() public 

//获取一只猫的owner
function ownerOf(uint256 _tokenId) external

//获取一个用户的所有猫的IDs
function tokensOfOwner(address _owner) external 



```

## KittyBreeding is KittyOwnership

为繁衍猫提供了一些方法，包括追踪孕育订单，依赖于外部的基因组合合约

```
event Pregnant(address owner, uint256 matronId, uint256 sireId, uint256 cooldownEndBlock);
uint256 public autoBirthFee = 2 finney; //自己的两只猫配对手续费
uint256 public pregnantKitties; //孕育中的猫的总数
GeneScienceInterface public geneScience; //基因接口

//设置基因合约地址
function setGeneScienceAddress(address _address) external onlyCEO
	- GeneScienceInterface candidateContract = GeneScienceInterface(_address);
	- geneScience = candidateContract; //Set the new contract address

//是否可以繁殖
function _isReadyToBreed(Kitty _kit) internal
	- return (_kit.siringWithId == 0) && (_kit.cooldownEndBlock <= uint64(block.number)); //block ???

//是否允许孕育： 两只猫的主人是同一个owner | sire授权给matron的owner[租过来了]
function _isSiringPermitted(uint256 _sireId, uint256 _matronId) internal
	- return (matronOwner == sireOwner || sireAllowedToAddress[_sireId] == matronOwner);

//触发冷却
function _triggerCooldown(Kitty storage _kitten) internal 
	- _kitten.cooldownEndBlock = uint64((cooldowns[_kitten.cooldownIndex]/secondsPerBlock) + block.number);
	- cooldownIndex <= 13

//把你的猫授权给别的用户孕育
function approveSiring(address _addr, uint256 _sireId) external

//设置自繁衍手续费
function setAutoBirthFee(uint256 val) external onlyCOO 

//检查一只猫是否准备生产了
function _isReadyToGiveBirth(Kitty _matron) private 

//检查猫是否可以繁衍
function isReadyToBreed(uint256 _kittyId) public

//检查猫是否在孕育中
function isPregnant(uint256 _kittyId) public

//检查两只猫是否可配对
function _isValidMatingPair(Kitty storage _matron,uint256 _matronId,Kitty storage _sire,uint256 _sireId) private

//检查两只猫是否可以租借繁衍
function _canBreedWithViaAuction(uint256 _matronId, uint256 _sireId) internal

//检查条件是否能繁衍
function canBreedWith(uint256 _matronId, uint256 _sireId) external


function _breedWith(uint256 _matronId, uint256 _sireId) internal

//自己的猫繁衍 需要付手续费
function breedWithAuto(uint256 _matronId, uint256 _sireId) external payable

//生产
function giveBirth(uint256 _matronId) external

```

## ClockAuctionBase

```

struct Auction {
    // Current owner of NFT
    address seller;
    // Price (in wei) at beginning of auction
    uint128 startingPrice;
    // Price (in wei) at end of auction
    uint128 endingPrice;
    // Duration (in seconds) of auction
    uint64 duration;
    // Time when auction started
    // NOTE: 0 if this auction has been concluded
    uint64 startedAt;
}

ERC721 public nonFungibleContract;
uint256 public ownerCut;//抽成

// Map from token ID to their corresponding auction.
mapping (uint256 => Auction) tokenIdToAuction;

event AuctionCreated(uint256 tokenId, uint256 startingPrice, uint256 endingPrice, uint256 duration);
event AuctionSuccessful(uint256 tokenId, uint256 totalPrice, address winner);
event AuctionCancelled(uint256 tokenId);

//是否拥有这只猫
function _owns(address _claimant, uint256 _tokenId) internal 

//系统抽成 内部调用
function _escrow(address _owner, uint256 _tokenId) internal
	- nonFungibleContract.transferFrom(_owner, this, _tokenId);

//猫的所有权转移 从合约地址转移给某个用户
function _transfer(address _receiver, uint256 _tokenId) internal
	- nonFungibleContract.transfer(_receiver, _tokenId);

//添加交易信息
function _addAuction(uint256 _tokenId, Auction _auction) internal 
	- tokenIdToAuction[_tokenId] = _auction;
	- AuctionCreated(_tokenId, startingPrice, endingPrice, duration) //触发事件

//取消交易
function _cancelAuction(uint256 _tokenId, address _seller) internal 
	- _removeAuction(_tokenId); //删除内存信息
	- _transfer(_seller, _tokenId);//所有权转移
	- AuctionCancelled(_tokenId);//触发事件

//竞拍 判断交易是否进行中 获取当前价格 判断买家资金是否足够 删除交易信息 
function _bid(uint256 _tokenId, uint256 _bidAmount) internal
	- _isOnAuction(auction)
	- require(_bidAmount >= price)
	- _removeAuction(_tokenId); // The bid is good! Remove the auction before sending the fees to the sender so we can't have a reentrancy attack.
	- price > 0 ? seller.transfer(price - _computeCut(price)); : nothing;
	- msg.sender.transfer(bidExcess);
	- AuctionSuccessful(_tokenId, price, msg.sender);

function _removeAuction(uint256 _tokenId) internal
	- delete tokenIdToAuction[_tokenId];

function _isOnAuction(Auction storage _auction) internal
	- return (_auction.startedAt > 0);

//获取当前交易价格
function _currentPrice(Auction storage _auction) internal
	- _computeCurrentPrice

//根据时间段 计算出当前价格
function _computeCurrentPrice(uint256 _startingPrice,uint256 _endingPrice,uint256 _duration,uint256 _secondsPassed) internal pure

//计算出用户的手续费【系统抽成】
function _computeCut(uint256 _price) internal

```

## ClockAuction  is Pausable, ClockAuctionBase

```

ownerCut = _cut;
ERC721 candidateContract = ERC721(_nftAddress);
nonFungibleContract = candidateContract;

//remove all ether from the contract
function withdrawBalance() external
 
function createAuction(uint256 _tokenId,uint256 _startingPrice,uint256 _endingPrice,uint256 _duration,address _seller) external

function bid(uint256 _tokenId) external payable

//cancel an auction that has`t been won yet
function cancelAuction(uint256 _tokenId) external

//cancel auction when the contract is paused
function cancelAuctionWhenPaused(uint256 _tokenId) onlyOwner external

//get auction info 
function getAuction(uint256 _tokenId) external

//get current price of an auction
function getCurrentPrice(uint256 _tokenId) external

```


## SiringClockAuction is ClockAuction
## SaleClockAuction is ClockAuction

```

function createAuction(uint256 _tokenId,uint256 _startingPrice,uint256 _endingPrice,uint256 _duration,address _seller) external
	- Auction memory auction = Auction(...) //结构体数据
	- _addAuction(_tokenId, auction); //继承方法

function bid(uint256 _tokenId) external payable
	- _transfer(msg.sender, _tokenId);
	- 如果是gen0猫，lastGen0SalePrices[gen0SaleCount % 5] = price; //比较最近5只gen0的价格

//获取gen0平均价格
function averageGen0SalePrice() external [只有sale有此方法]
	- sum += lastGen0SalePrices[i];
	- return sum / 5
```

## KittyAuction is KittyBreeding

为拍卖，标价，孕育服务提供了公共方法。 依赖于两个合约：出售，孕育两个合约

```

function setSaleAuctionAddress(address _address) external onlyCEO
	- SaleClockAuction candidateContract = SaleClockAuction(_address);
	- saleAuction = candidateContract; // Set the new contract address

function setSiringAuctionAddress(address _address) external onlyCEO
	- SiringClockAuction candidateContract = SiringClockAuction(_address);
	- siringAuction = candidateContract; // Set the new contract address

//挂售
function createSaleAuction(uint256 _kittyId,uint256 _startingPrice,uint256 _endingPrice,uint256 _duration) external
	- saleAuction.createAuction

//挂租繁衍
function createSiringAuction(uint256 _kittyId,uint256 _startingPrice,uint256 _endingPrice,uint256 _duration) external
	- siringAuction.createAuction

//立即开始孕育 如果竞标成功
function bidOnSiringAuction(uint256 _sireId,uint256 _matronId) external payable
	- _breedWith(uint32(_matronId), uint32(_sireId));

//提现
function withdrawAuctionBalances() external onlyCLevel
	- saleAuction.withdrawBalance();
	- siringAuction.withdrawBalance();
	
```


## KittyMinting is KittyAuction

创建gen0猫，创造5000个促销猫，发放给玩家。50k只gen0猫直接出售

```
uint256 public constant PROMO_CREATION_LIMIT = 5000;
uint256 public constant GEN0_CREATION_LIMIT = 45000;

// Constants for gen0 auctions.
uint256 public constant GEN0_STARTING_PRICE = 10 finney;
uint256 public constant GEN0_AUCTION_DURATION = 1 days;

// Counts the number of cats the contract owner has created.
uint256 public promoCreatedCount;
uint256 public gen0CreatedCount;

//促销猫 直接送人
function createPromoKitty(uint256 _genes, address _owner) external onlyCOO
	- _createKitty
//gen0猫 放到市场出售 
function createGen0Auction(uint256 _genes) external onlyCOO
	- saleAuction.createAuction
	- _createKitty

function _computeNextGen0Price() internal view returns (uint256) //依赖于SaleClockAuction Contract

```

## KittyCore is KittyMinting 

```
//获取一只猫的信息
function getKitty(uint256 _id) external

address public newContractAddress;

function unpause() public onlyCEO whenPaused 

function withdrawBalance() external onlyCFO


```