pragma solidity ^0.4.25;

import "./PZItemMarketplace.sol";

contract PZItemFactory is PZItemMarketplace
{
    function createItemGroup(uint _price, uint _tokenId, uint _tokenPrice, string _itemName, uint _itemQuantity, uint _itemRarity, uint _itemType) public onlyAdmin {
        _createItemGroup(_price, _tokenId, _tokenPrice, _itemName, _itemQuantity, _itemRarity, _itemType);
    }
}
