pragma solidity ^0.4.25;

import "./PZItemMarketplace.sol";

contract PZItemFactory is PZItemMarketplace
{
    function createItemGroup(string _itemName, uint _itemQuantity, uint _itemRarity, uint _itemType) public onlyAdmin {
        _createItemGroup(_itemName, _itemQuantity, _itemRarity, _itemType);
    }
}
