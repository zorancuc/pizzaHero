pragma solidity ^0.5.0;

import "./PZItemFactory.sol";

contract PZItemCore is PZItemFactory
{
    address payable private                         addrPool;
    /**
    * Constructor
    *
     */
    constructor(address payable _pool) public
    {
        require(_pool != address(0x0));
        addrPool = _pool;
    }

    /**
    * Create Item  NFT to buyer
    *
    * @param _buyer                         Egg Id to gift
    * @param _itemGroupId                   Item Group Id to create
    *
    */
    function createItemToBuyer(address _buyer, uint _itemGroupId) public
    {
        require(msg.sender == addrChest);

        ItemGroup memory _itemGroup = itemGroups[_itemGroupId];

        _createItem(_buyer, now, _itemGroup.price, _itemGroup.tokenId, _itemGroup.tokenPrice, _itemGroup.itemType, _itemGroup.itemRarity, _itemGroupId, _itemGroup.itemName);
        _decreaseQuantityOfItemGroup(_itemGroupId);

    }

    function setAddrPool(address payable _pool) public onlyAdmin
    {
        require(_pool != address(0x0));

        addrPool = _pool;
    }

    function buyItems(uint _itemGroupId, address payable _referrer, uint itemAmount, bool bTrxPurchase) public payable
    {
        // require((block.number >= chests[_chestId].startDate) && (block.number <= chests[_chestId].endDate));

        //Implementation
        ItemGroup memory _itemGroup = itemGroups[_itemGroupId];
        require(itemAmount > 0);
        require(_itemGroup.itemQuantity >= itemAmount);

        uint i = 0;

        if (bTrxPurchase) {
            require (msg.value == _itemGroup.price * itemAmount);
            if (_referrer != address(0x0)) {
                address(_referrer).transfer(msg.value / 10);
                address(addrPool).transfer(msg.value / 10);
                address(addrAdmin).transfer(msg.value - msg.value / 10 * 2);
                // addrAdmin.transfer(msg.value);
            }
            for (i = 0; i < itemAmount; i ++) {
                _createItem(msg.sender, now, _itemGroup.price, _itemGroup.tokenId, 0, _itemGroup.itemType, _itemGroup.itemRarity, _itemGroupId, _itemGroup.itemName);
                _decreaseQuantityOfItemGroup(_itemGroupId);
            }
        } else {
            require (msg.tokenid == _itemGroup.tokenId);
            require (msg.tokenvalue == _itemGroup.tokenPrice * itemAmount);
        
            if (_referrer != address(0x0)) {
                _referrer.transferToken(msg.tokenvalue / 10, msg.tokenid);
                address(addrPool).transferToken(msg.tokenvalue / 10, msg.tokenid);
                address(addrAdmin).transferToken(msg.tokenvalue - msg.tokenvalue / 10 * 2, msg.tokenid);
            }
            for (i = 0; i < itemAmount; i ++) {
                _createItem(msg.sender, now, 0, _itemGroup.tokenId, _itemGroup.tokenPrice, _itemGroup.itemType, _itemGroup.itemRarity, _itemGroupId, _itemGroup.itemName);
                _decreaseQuantityOfItemGroup(_itemGroupId);
            }
        }
    }
    /**
    * Gift Item to other users
    *
    * @param _to                            address of receiver
    * @param _itemId                        Item Id to gift
    *
    */
    function giftItem(address _to, uint256 _itemId) external
    {
        require(_owns(msg.sender, _itemId));
        require(_to != address(0x0));
        _transfer(msg.sender, _to, _itemId);
    }

    /**
    * Get Information of Item
    * @param _id                            Item Id
    *
    * @return itemType                      Item Type
    * @return itemRarity                    Item Rarity
    * @return itemName                      Item Name
    *
     */
    function getItem(uint _id) external view returns(uint date, uint price, uint tokenId, uint tokenPrice, uint itemType, uint itemRarity, uint itemGroupId, string memory itemName)
    {
        Item memory item = items[_id];
        return (item.date, item.price, item.tokenId, item.tokenPrice, item.itemType, item.itemRarity, item.itemGroupID, item.itemName);
    }

    /**
    * Get Count of ItemGroup
    * @return length                      Count of Item Group
    *
     */
    function getItemGroupSupply() external view returns(uint256) {
        return itemGroups.length;
    }

    /**
    * Get Information of Item Group
    *
    * @param _itemGroupId                           ItemGroup Id
    *
    * @return itemType                      Item Type
    * @return itemRarity                    Item Rarity
    * @return itemName                      Item Name
    * @return itemQuantity                  Item Quantity
    *
     */
    function getItemGroup(uint _itemGroupId) external view returns(uint price, uint tokenId, uint tokenPrice, string memory itemName, uint itemQuantity, uint itemTotalAmount, uint itemRairty, uint itemType) {
        ItemGroup memory _itemGroup = itemGroups[_itemGroupId];
        return (_itemGroup.price, _itemGroup.tokenId, _itemGroup.tokenPrice, _itemGroup.itemName, _itemGroup.itemQuantity, _itemGroup.itemTotalAmount, _itemGroup.itemRarity, _itemGroup.itemType);
    }

    /**
    * Get Item Quantity
    *
    * @return itemQuantity                  Item Quantity
    *
     */
    function getItemQuantity() external view returns(uint quantity)
    {
        return items.length;
    }

    function itemTest() external view returns (address) {
        return addrChest;
    }

    function isItemContract() public pure returns (bool) {
        return true;
    }
}
