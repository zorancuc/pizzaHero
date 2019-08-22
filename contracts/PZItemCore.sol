pragma solidity ^0.4.25;

import "./PZItemFactory.sol";

contract PZItemCore is PZItemFactory
{
    /**
    * Constructor
    *
     */
    constructor() public
    {

    }

    // function getItems(uint _quantityToCreate) external pure returns(uint[] _items, uint _quantity)
    // {
    //     uint[] memory items = new uint[](_quantityToCreate);

    //     return (items, _quantityToCreate);
    // }

    // function transferItemsToChest(uint _quantityRare, uint _quantityEpic, uint _quantityLegendary) external
    // {
    //     require(msg.sender == addrChest);

    //     uint index = 0;
    //     uint availableQuantity = balanceOf(addrAdmin);
    //     uint256[] memory itemsAvailable = new uint256[](availableQuantity);
    //     itemsAvailable = itemsOfOwner(addrAdmin);
    //     uint[] memory neededQuantity = new uint[](3);
    //     neededQuantity[0] = _quantityRare;
    //     neededQuantity[1] = _quantityEpic;
    //     neededQuantity[2] = _quantityLegendary;

    //     for (index = 0; index < availableQuantity; index ++) {
    //         Item memory _item = items[itemsAvailable[index]];
    //         if(neededQuantity[_item.itemRarity] > 0) {
    //             neededQuantity[_item.itemRarity]--;
    //         }

    //         _transfer(addrAdmin, addrChest, itemsAvailable[index]);
    //         if(neededQuantity[0] + neededQuantity[1] + neededQuantity[2] == 0)
    //             break;

    //     }
    // }

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

        _createItem(_buyer, _itemGroup.itemType, _itemGroup.itemRarity, _itemGroupId, _itemGroup.itemName);
        _decreaseQuantityOfItemGroup(_itemGroupId);

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

    // function returnItemToAdmin(uint _itemId) external
    // {
    //     require(msg.sender == addrChest);

    //     _transfer(addrChest, addrAdmin, _itemId);
    // }

    /**
    * Get Information of Item
    * @param _id                            Item Id
    *
    * @return itemType                      Item Type
    * @return itemRarity                    Item Rarity
    * @return itemName                      Item Name
    *
     */
    function getItem(uint _id) external view returns(uint itemType, uint itemRarity, string itemName)
    {
        Item memory item = items[_id];
        return (item.itemType, item.itemRarity, item.itemName);
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
    function getItemGroup(uint _itemGroupId) external view returns(string itemName, uint itemQuantity, uint itemRairty, uint itemType) {
        ItemGroup memory _itemGroup = itemGroups[_itemGroupId];
        return (_itemGroup.itemName, _itemGroup.itemQuantity, _itemGroup.itemRarity, _itemGroup.itemType);
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
