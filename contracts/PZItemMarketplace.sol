pragma solidity ^0.4.25;

import "./PZItemOwnership.sol";

contract PZItemMarketplace is PZItemOwnership
{
    struct ItemAuction {
        address seller;
        uint256 startingPrice;
        uint256 itemId;
        // uint256 endingPrice;
        // uint64  duration;
        // uint64  startedAt;
    }

    mapping (uint256 => ItemAuction) itemIdToAuction;
    ItemAuction[] public       itemAuctions;

    /**
    * Constructor
    *
     */
    constructor() public
    {

    }

    /**
    * Get Ids of Iems on the Marketplace Sale
    *
    * @return itemsOfOwner               Items of Owner
    *
     */
    function getItemIdsOnSale() public view returns(uint256[])
    {
        return itemsOfOwner(this);
    }

    /**
    * Place an Item to Aunction on marketplace
    *
    * @param _price                 Price to Sell
    * @param _itemId                Item Id
    *
     */
    function addAuction(uint _price, uint _itemId) public {
        require(_price > 0);
        require(_owns(msg.sender, _itemId));

        ItemAuction memory _auction = ItemAuction(msg.sender, _price, _itemId);

        // uint256 newAuctionId = ItemAuctions.push(_auction) - 1;
        _transfer(msg.sender, this, _itemId);
        itemIdToAuction[_itemId] = _auction;
    }

    /**
    * Get Information of Auction By Item ID
    *
    * @param _itemId                 Item Id
    *
    * @return seller                Seller's Address
    * @return price                 Price
    * @return itemId                 Item Id
    *
     */
    function getItemAuctionByItemId(uint256 _itemId) external view returns(address seller, uint256 price, uint256 itemId)
    {
        ItemAuction memory _auction = itemIdToAuction[_itemId];
        return(_auction.seller, _auction.startingPrice, _auction.itemId);
    }

    /**
    * Get Count of Auction Sale
    *
    * @return count                Count of Auction Sale
    *
     */
    function getItemAuctionCount() external view returns(uint256)
    {
        return itemAuctions.length;
    }

    /**
    * Get Information of Auction By Auction ID
    *
    * @param _auctionId             Auction Id
    *
    * @return seller                Seller's Address
    * @return price                 Price
    * @return itemId                 Item Id
    *
     */
    function getItemAuction(uint256 _auctionId) external view returns(address seller, uint256 price, uint256 itemId)
    {
        ItemAuction memory _auction = itemAuctions[_auctionId];
        return(_auction.seller, _auction.startingPrice, _auction.itemId);
    }

    /**
    * Remove Auction By Item ID
    *
    * @param _itemId                 Item ID
    *
     */
    function _removeAuction(uint256 _itemId) internal {
        delete itemIdToAuction[_itemId];
    }

    /**
    * Bid on Auction Sale
    *
    * @param _itemId                 Item ID
    *
     */
    function bidAuction(uint256 _itemId) public payable
    {
        require(_owns(address(this), _itemId));
        ItemAuction memory _auction = itemIdToAuction[_itemId];
        require(!_owns(msg.sender, _itemId));
        require(_auction.startingPrice == msg.value);

        _removeAuction(_itemId);
        _transfer(this, msg.sender, _itemId);
        _auction.seller.transfer(msg.value);
    }

    /**
    * Cancel Auction By Item ID
    *
    * @param _itemId                 Item ID
    *
     */
    function cancelAuction(uint256 _itemId) public
    {
        require(_owns(address(this), _itemId));
        ItemAuction memory _auction = itemIdToAuction[_itemId];
        require(msg.sender == _auction.seller);

        _removeAuction(_itemId);
        _transfer(this, msg.sender, _itemId);
    }
}