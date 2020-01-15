pragma solidity ^0.4.25;
pragma experimental ABIEncoderV2;

import "./PZHeroCore.sol";
import "./PZItemCore.sol";
import "./PZEggCore.sol";

contract PZChest
{
    uint private constant       PZ_ITEM_GEAR = 0;
    uint private constant       PZ_ITEM_EMOTE = 1;

    uint private constant       PZ_ITEM_COMMON = 0;
    uint private constant       PZ_ITEM_UNCOMMON = 1;
    uint private constant       PZ_ITEM_RARE = 2;
    uint private constant       PZ_ITEM_EPIC = 3;
    uint private constant       PZ_ITEM_LEGENDARY = 4;

    uint private constant       PZ_ITEM_CHANCE_COMMON = 440;
    uint private constant       PZ_ITEM_CHANCE_UNCOMMON = 740;
    uint private constant       PZ_ITEM_CHANCE_RARE = 955;
    uint private constant       PZ_ITEM_CHANCE_EPIC = 995;
    uint private constant       PZ_ITEM_CHANCE_LEGENDARY = 1000;

    uint private constant       PZ_ZA_NORMAL_DOWN_LIMIT = 10000;
    uint private constant       PZ_ZA_NORMAL_UP_LIMIT = 25000;
    uint private constant       PZ_ZA_RARE_DOWN_LIMIT = 5000;
    uint private constant       PZ_ZA_RARE_UP_LIMIT = 10000;
    uint private constant       PZ_ZA_EPIC_DOWN_LIMIT = 5000;
    uint private constant       PZ_ZA_EPIC_UP_LIMIT = 10000;
    uint private constant       PZ_ZA_LEGENDARY_DOWN_LIMIT = 7000;
    uint private constant       PZ_ZA_LEGENDARY_UP_LIMIT = 20000;
    uint private constant       PZ_TOKEN_TRX_PROPOTION = 1;
    uint private constant       PZ_TOKEN_ID = 1000382;

    struct Chest {
        uint        date;
        string      name;
        uint        price;
        uint        tokenId;
        uint        tokenPrice;
        uint        zaCoin;
        uint        chance;
        uint[][]    slot;
        bool        eggFlag;
    }

    struct ChestGroup {
        string      name;
        uint        quantity;
        uint        totalAmount;
        uint        price;
        uint        tokenId;
        uint        tokenPrice;
        uint        startDate;
        uint        endDate;
        uint        zaCoin;
        uint        chance;
        uint[][]    slot;
        bool        eggFlag;
    }

    event CreateChestGroup(
            address indexed _admin,
            string _name,
            uint _quantity,
            uint _totalAmount,
            uint _price,
            uint _tokenId,
            uint _tokenPrice,
            uint _startDate,
            uint _endDate,
            uint _zaCoin,
            uint _chance,
            uint[][] _slot,
            bool _eggFlag);

    event SetHeroCoreAddress(address indexed _admin, address indexed _newHeroCore);
    event SetItemCoreAddress(address indexed _admin, address indexed _newItemCore);
    event SetPoolAddress(address indexed _admin, address indexed _newPool);
    event ChangeAdmin(address indexed _admin, address indexed _newAdmin);
    event OpenChest(address indexed _buyer, uint _chestId);
    event BuyChest(address indexed _buyer, uint _chestGroupId, address _referrer, bool bTrxPurchase);
    event BurnChest(uint burnQuantity, uint id);
    event CreateChest(uint quantity, uint supply);
    event GiftChest(address indexed sender, address indexed _to, uint _chestId);

    uint[4] public                          pzZAUpperLimit;
    uint[4] public                          pzZADownLimit;

    uint[5] private                         itemChance;
    Chest[] public                          chests;
    ChestGroup[] public                     chestGroups;
    mapping(uint => address) public         chestIndexToOwner;
    mapping(address => uint) public         ownershipChestCount;

    address private                         addrHeroCore;
    address private                         addrItemCore;
    address private                         addrEggCore;
    address private                         addrPool;
    address private                         addrEVO;
    address private                         addrAdmin;
    // address private                         addrToken;

    PZItemCore public                       contractItemCore;
    PZEggCore public                        contractEggCore;
    PZHeroCore public                       contractHeroCore;
    // PZToken public                          contractToken;
//    PZPool public                           contractPool;

    event ChestTransfer(address from, address to, uint256 chestId);
    event ChestCreated(uint itmeType, uint quantity);

    /**
    * Constructor
    *
    * @param _heroCore                      address of hero contract
    * @param _itemCore                      address of item contract
    * @param _eggCore                       address of egg contract
    * @param _pool                          address of pool contract
    *
    */

    constructor(address _heroCore, address _itemCore, address _eggCore, address _pool) public
    {
        require(_heroCore != address(0));
        require(_itemCore != address(0));
        require(_eggCore != address(0));
        require(_pool != address(0));

        addrAdmin = msg.sender;
        addrHeroCore = _heroCore;
        addrItemCore = _itemCore;
        addrEggCore = _eggCore;
        addrPool = _pool;

        contractItemCore = PZItemCore(addrItemCore);
        contractHeroCore = PZHeroCore(addrHeroCore);
        contractEggCore = PZEggCore(addrEggCore);
        // contractToken = PZToken(addrToken);

        // contractItemCore.setAddrPool(addrPool);
        itemChance[PZ_ITEM_COMMON] = PZ_ITEM_CHANCE_COMMON;
        itemChance[PZ_ITEM_UNCOMMON] = PZ_ITEM_CHANCE_UNCOMMON;
        itemChance[PZ_ITEM_RARE] = PZ_ITEM_CHANCE_RARE;
        itemChance[PZ_ITEM_EPIC] = PZ_ITEM_CHANCE_EPIC;
        itemChance[PZ_ITEM_LEGENDARY] = PZ_ITEM_CHANCE_LEGENDARY;

        pzZAUpperLimit[PZ_ITEM_COMMON] = PZ_ZA_NORMAL_UP_LIMIT;
        pzZAUpperLimit[PZ_ITEM_UNCOMMON] = PZ_ZA_RARE_UP_LIMIT;
        pzZAUpperLimit[PZ_ITEM_RARE] = PZ_ZA_EPIC_UP_LIMIT;
        pzZAUpperLimit[PZ_ITEM_EPIC] = PZ_ZA_LEGENDARY_UP_LIMIT;

        pzZADownLimit[PZ_ITEM_COMMON] = PZ_ZA_NORMAL_DOWN_LIMIT;
        pzZADownLimit[PZ_ITEM_UNCOMMON] = PZ_ZA_RARE_DOWN_LIMIT;
        pzZADownLimit[PZ_ITEM_RARE] = PZ_ZA_EPIC_DOWN_LIMIT;
        pzZADownLimit[PZ_ITEM_EPIC] = PZ_ZA_LEGENDARY_DOWN_LIMIT;
//        contractPool = PZPool(addrPool);
    }

    modifier onlyAdmin()
    {
        require(msg.sender == addrAdmin);
        _;
    }

    /**
    * Set the Address of Hero contract
    *
    * @param _heroCore                   new address of hero contract
    *
    */
    function setHeroCoreAddress(address _heroCore) public onlyAdmin
    {
        require(_heroCore != address(0x0));

        addrHeroCore = _heroCore;
        PZHeroCore candidateContract = PZHeroCore(addrHeroCore);

        require(candidateContract.isHeroContract());
        contractHeroCore = candidateContract;
        emit SetHeroCoreAddress(addrAdmin, _heroCore);
    }

    /**
    * Set the Address of Item contract
    *
    * @param _itemCore                   new address of item contract
    *
    */
    function setItemCoreAddress(address _itemCore) public onlyAdmin
    {
        require(_itemCore != address(0x0));

        addrItemCore = _itemCore;

        PZItemCore candidateContract = PZItemCore(addrItemCore);
        require(candidateContract.isItemContract());

        contractItemCore = candidateContract;
        // contractItemCore.setAddrPool(addrPool);
        emit SetItemCoreAddress(addrAdmin, _itemCore);
    }

    /**
    * Set the Address of Pool
    *
    * @param _pool                   new address of pool
    *
    */
    function setPoolAddress(address _pool) public onlyAdmin
    {
        require(_pool != address(0x0));

        addrPool = _pool;
        emit SetPoolAddress(addrAdmin, _pool);
    }

    /**
    * Set the Address of Admin
    *
    * @param _addrAdmin                   new address of Admin
    *
    */
    function changeAdmin(address _addrAdmin) public onlyAdmin
    {
        addrAdmin = _addrAdmin;
        emit ChangeAdmin(addrAdmin, _addrAdmin);
    }

    /**
    * Create Chest Group that is the Meta Information for creating Chest NFT
    *
    * @param _name                          name of the chest
    * @param _quantity                      quantity of the chest
    * @param _price                         price of the chest
    * @param _startDate                     start Date of Sale for the chest
    * @param _endDate                       end Date of Sale for the chest
    * @param _zaCoin                        zaCoin amount //not sure
    * @param _chance                        chance  //not sure
    * @param _slot                          item slots of the chest
    *
    */
    function createChestGroup(
            string _name,
            uint _quantity,
            uint _price,
            uint _tokenId,
            uint _tokenPrice,
            uint _startDate,
            uint _endDate,
            uint _zaCoin,
            uint _chance,
            uint[][] _slot,
            bool _eggFlag)
        public
        onlyAdmin
    {
        require(_quantity > 0);
        require(_price > 0);
        require(_startDate < _endDate);

        chestGroups.push(ChestGroup(_name, _quantity, _quantity, _price, _tokenId, _tokenPrice, _startDate, _endDate, _zaCoin, _chance, _slot, _eggFlag));
        emit CreateChestGroup(msg.sender, _name, _quantity, _quantity, _price, _tokenId, _tokenPrice, _startDate, _endDate, _zaCoin, _chance, _slot, _eggFlag);
    }

    function _generateRandomZA(uint _rarity) private view returns (uint)
    {
        uint rand = uint(keccak256(abi.encodePacked(block.timestamp)));
        uint diff = pzZAUpperLimit[_rarity] - pzZADownLimit[_rarity];
        uint result = rand % diff + pzZADownLimit[_rarity];
        return result;
    }

    /**
    * Get ID of item group for the item slot of the chest to open
    *
    * @param num                                num for random generation
    * @param itemSlot                           items arry for the slot
    *
    * @return bFindItem                         flag if the available item is found
    * @return itemGroupId                       Id of Itemgroup
    *
    */
    function _getItemGroupIdFromSlot(uint num, uint[] itemSlot)
        private
        view
        returns(bool, uint256)
    {
        uint rand = uint(keccak256(abi.encodePacked(block.timestamp, block.difficulty, num)));
        rand = rand % 1000;
        bool[5] memory rarityFlag = [false, false, false, false, false];
        uint[5] memory rarityItemGroupId;

        uint index = 0;

        uint itemRarity = 0;
        uint itemGroupId = 0;

        uint _slotQuantity = 0;
        uint _slotRarity = 0;
        bool bFindItem = false;
        // uint

        if (rand < itemChance[PZ_ITEM_COMMON]) {
            itemRarity = PZ_ITEM_COMMON;
        } else if (rand < itemChance[PZ_ITEM_UNCOMMON]) {
            itemRarity = PZ_ITEM_UNCOMMON;
        } else if (rand < itemChance[PZ_ITEM_RARE]) {
            itemRarity = PZ_ITEM_RARE;
        } else if (rand < itemChance[PZ_ITEM_EPIC]) {
            itemRarity = PZ_ITEM_EPIC;
        } else if (rand < itemChance[PZ_ITEM_LEGENDARY]) {
            itemRarity = PZ_ITEM_LEGENDARY;
        }

        for(index = 0; index < itemSlot.length; index ++) {
            (,,,,_slotQuantity,, _slotRarity,) = contractItemCore.getItemGroup(itemSlot[index]);
            if (_slotQuantity > 0) {
                if (_slotRarity == itemRarity) {
                    itemGroupId = itemSlot[index];
                    bFindItem = true;
                    break;
                } else {
                    if (rarityFlag[_slotRarity] == false) {
                        rarityFlag[_slotRarity] = true;
                        rarityItemGroupId[_slotRarity] = itemSlot[index];
                    }
                }
            }
        }

        if( !bFindItem ) {
            for (index = 0; index < 5; index ++) {
                if (rarityFlag[index] == true) {
                    itemRarity = index;
                    itemGroupId = rarityItemGroupId[index];
                    bFindItem = true;
                    break;
                }
            }
        }

        return (bFindItem, itemGroupId);
    }

    /**
    * Open item Slots to create Item NFT for buy chest
    *
    * @param buyer                          address of Buyer
    * @param _chestId                       chest Id to buy
    *
    */
    function _openItemSlots(address buyer, uint _chestId) internal
    {
        Chest memory chest = chests[_chestId];

        bool bFindItemGroupId = false;
        uint itemGroupId = 0;
        uint index = 0;
        // uint[] memory itemSlot = chest.slot;
        for (index = 0; index < chest.slot.length; index ++) {
            (bFindItemGroupId, itemGroupId) = _getItemGroupIdFromSlot(index, chest.slot[index]);
            if (bFindItemGroupId) {
                contractItemCore.createItemToBuyer(buyer, itemGroupId);
                bFindItemGroupId = false;
            }
        }
    }

    /**
    * Gift Chest to other users
    *
    * @param _to                            address of receiver
    * @param _chestId                       chest Id to gift
    *
    */
    function giftChest(address _to, uint _chestId) public
    {
        require(_owns(msg.sender, _chestId));
        require(_to != address(0x0));
        _transfer(msg.sender, _to, _chestId);
        emit GiftChest(msg.sender, _to, _chestId);
    }
    
    /**
    * Open Chest
    *
    * @param _chestId                       chest Id to Open
    *
    */
    function openChest(uint _chestId) public
    {
        require(_owns(msg.sender, _chestId));

        Chest memory chest = chests[_chestId];

        //Open Item Slot to create Item and send to Buyer
        _openItemSlots(msg.sender, _chestId);

        // chests[_chestId].zaCoin = _generateRandomZA();

        //Breed Egg
        if (chest.eggFlag)
            contractEggCore.createEggToOwner(msg.sender, now, chest.price, chest.tokenId, chest.tokenPrice, 0, 0);

        //Implementation
        _transfer(msg.sender, address(0x0), _chestId);
        delete chests[_chestId];

        emit OpenChest(msg.sender, _chestId);
    }

    /**
    * Burn chests
    *
    *
    */
    function burnChests() public onlyAdmin
    {
        uint supply = chestGroups.length;

        for (uint index = 0; index < supply; index ++) {
            delete chestGroups[index];
            chestGroups.length--;
        }
        // emit BurnChest();
    }

    /**
    * Buy Chest
    *
    * @param _chestGroupId                          chest Group Id to buy
    * @param _referrer                              address of referrer
    * @param bTrxPurchase                           flag whether the purchase is by TRX or TRC10 token
    *
    */
    function buyChest(uint _chestGroupId, address _referrer, uint chestAmount, bool bTrxPurchase) public payable
    {
        // require((block.number >= chests[_chestId].startDate) && (block.number <= chests[_chestId].endDate));

        //Implementation
        ChestGroup memory _chestGroup = chestGroups[_chestGroupId];
        require(_chestGroup.quantity > chestAmount);
        uint256 newChestId = 0;
        uint i = 0;

        if (bTrxPurchase) {
            require (msg.value == _chestGroup.price * chestAmount);
            if (_referrer != address(0x0)) {
                _referrer.transfer(msg.value / 10);
                addrPool.transfer(msg.value / 10);
                addrAdmin.transfer(msg.value - msg.value / 10 * 2);
                // addrAdmin.transfer(msg.value);
            }
            for (i = 0; i < chestAmount; i ++) {
                newChestId = chests.push(Chest(now, _chestGroup.name, _chestGroup.price, _chestGroup.tokenId, 0, _chestGroup.zaCoin, _chestGroup.chance, _chestGroup.slot, _chestGroup.eggFlag)) - 1;
                chestGroups[_chestGroupId].quantity = chestGroups[_chestGroupId].quantity - 1;
                _transfer(0, msg.sender, newChestId);
                emit BuyChest(msg.sender, _chestGroupId, _referrer, bTrxPurchase);
            }
        } else {
            // uint256 _tokenBalance = contractToken.getTokenBalance(msg.sender, PZ_TOKEN_ID);
            // uint256 _valueInToken = _chestGroup.price * PZ_TOKEN_TRX_PROPOTION;
            require (msg.tokenid == _chestGroup.tokenId);
            require (msg.tokenvalue == _chestGroup.tokenPrice * chestAmount);
        
            if (_referrer != address(0x0)) {
                _referrer.transferToken(msg.tokenvalue / 10, msg.tokenid);
                addrPool.transferToken(msg.tokenvalue / 10, msg.tokenid);
                addrAdmin.transferToken(msg.tokenvalue - msg.tokenvalue / 10 * 2, msg.tokenid);

                // addrAdmin.transferToken(msg.tokenvalue, msg.tokenid);
                // contractToken.transferToken(_referrer, _valueInToken / 10, PZ_TOKEN_ID);
                // contractToken.transferToken(addrPool, _valueInToken / 10, PZ_TOKEN_ID);
                // contractToken.transferToken(addrAdmin, _valueInToken - _valueInToken / 10 * 2, PZ_TOKEN_ID);
            }
            for (i = 0; i < chestAmount; i ++) {
                newChestId = chests.push(Chest(now, _chestGroup.name, 0, _chestGroup.tokenId, _chestGroup.tokenPrice, _chestGroup.zaCoin, _chestGroup.chance, _chestGroup.slot, _chestGroup.eggFlag)) - 1;
                chestGroups[_chestGroupId].quantity = chestGroups[_chestGroupId].quantity - 1;
                _transfer(0, msg.sender, newChestId);
            }
            emit BuyChest(msg.sender, _chestGroupId, _referrer, bTrxPurchase);
        }
    }

    /**
    * Get quantity of Chest NFT
    *
    *
    */
    function getChestsQuantity() external view returns(uint)
    {
        return chests.length;
    }

    /**
    * Get Chest NFT
    *
    * @return name                      chest name
    * @return price                     chest price
    * @return zaCoin                    chest zaCoin
    * @return chance                    chest chance
    * @return slot                      chest slot
    *
    */
    function getChestById(uint _id) external view returns(
        uint date, string name, uint price, uint tokenId, uint tokenPrice, uint zaCoin, uint chance, uint[][] slot, bool eggFlag
        )
    {
        Chest memory chest = chests[_id];
        return (chest.date, chest.name, chest.price, chest.tokenId, chest.tokenPrice, chest.zaCoin, chest.chance, chest.slot, chest.eggFlag);
    }

    /**
    * Get quantity of chest group
    *
    *
    */
    function getChestGroupSupply() external view returns(uint256)
    {
        return chestGroups.length;
    }

    /**
    * Get Chest Group Info
    *
    * @return name                      chest name
    * @return quantity                  chest quantity
    * @return startDate                 start Date of chest sale
    * @return endDate                   end Date of chest sale
    * @return price                     chest price
    * @return zaCoin                    chest zaCoin
    * @return chance                    chest chance
    * @return slot                      chest slot
    *
    */
    function getChestGroupById(uint _chestGroupId)
        external
        view
        returns(string name, uint quantity, uint totalAmount, uint price, uint tokenId, uint tokenPrice, uint startDate, uint endDate, uint zaCoin, uint chance, uint[][] slot, bool eggFlag)
    {
        ChestGroup memory _chestGroup = chestGroups[_chestGroupId];
        return(_chestGroup.name,
                _chestGroup.quantity, _chestGroup.totalAmount,
                _chestGroup.price, _chestGroup.tokenId, _chestGroup.tokenPrice, _chestGroup.startDate,
                _chestGroup.endDate, _chestGroup.zaCoin, _chestGroup.chance, _chestGroup.slot, _chestGroup.eggFlag);
    }

    /**
    * Transfer Chest NFT
    *
    * @param _from                              address of sender
    * @param _to                                address of receiver
    * @param _chestId                           chest Id to transfer
    *
    */
    function _transfer(address _from, address _to, uint256 _chestId) internal
    {
        ownershipChestCount[_to]++;
        chestIndexToOwner[_chestId] = _to;
        if (_from != address(0)) {
            ownershipChestCount[_from]--;
            // delete itemIndexToApproved[_chestId];
        }

        emit ChestTransfer(_from, _to, _chestId);
    }

    /**
    * Check if the claimer owns item
    *
    * @param _claimant                  address of claimer
    * @param _itemId                    item id to claim
    *
    */
    function _owns(address _claimant, uint256 _itemId) internal view returns (bool) {
        return chestIndexToOwner[_itemId] == _claimant;
    }

    /**
    * Get Owner address of Chest Id
    *
    * @param _chestId                   Chest Id to Check
    *
    * @return owner                     address of owner
    *
    */
    function ownerOf(uint256 _chestId)
        external
        view
        returns (address owner)
    {
        owner = chestIndexToOwner[_chestId];

        require(owner != address(0));
    }

    /**
    * Get count of chest NFT belongs to owner
    *
    * @param _owner                     address of owner
    *
    * @return count                     count of chest NFT
    *
    */
    function balanceOf(address _owner) public view returns (uint256 count) {
        return ownershipChestCount[_owner];
    }

    /**
    * Total count of chest NFT
    *
    */
    function totalSupply() public view returns (uint) {
        return chests.length - 1;
    }

    /**
    * Get chest array of given address
    *
    * @return ownerChests                   chests array
    *
    */
    function chestsOfOwner(address _owner) external view returns(uint256[] ownerChests) {
        uint256 chestCount = balanceOf(_owner);

        if (chestCount == 0) {
            // Return an empty array
            return new uint256[](0);
        } else {
            uint256[] memory result = new uint256[](chestCount);
            uint256 totalChests = totalSupply();
            uint256 resultIndex = 0;

            uint256 chestId;

            for (chestId = 1; chestId <= totalChests; chestId++) {
                if (chestIndexToOwner[chestId] == _owner) {
                    result[resultIndex] = chestId;
                    resultIndex++;
                }
            }

            return result;
        }
    }

    /**
    * Check function of Chest contract
    *
    */
    function chestTest() external view returns (address){
        return contractHeroCore.heroTest();
    }

    /**
    * Check function as if this is the Chest contract
    *
    */
    function isChestContract() external pure returns (bool) {
        return true;
    }
}
