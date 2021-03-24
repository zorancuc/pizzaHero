pragma solidity ^0.5.0;

import "./PZEggOwnership.sol";

contract PZEggMarketplace is PZEggOwnership
{
    struct EggAuction {
        address payable seller;
        uint256 startingPrice;
        uint256 eggId;
        // uint256 endingPrice;
        // uint64  duration;
        // uint64  startedAt;
    }

    mapping (uint256 => EggAuction) eggIdToAuction;
    EggAuction[] public       eggAuctions;

    /**
    * Constructor
    *
     */
    constructor() public
    {

    }

    /**
    * Get Ids of Eggs on the Marketplace Sale
    *
    * @return eggsOfOwner               Eggs of Owner
    *
     */
    function getEggIdsOnSale() external view returns(uint256[] memory)
    {
        return eggsOfOwner(address(this));
    }

    /**
    * Place an Egg to Aunction on marketplace
    *
    * @param _price                 Price to Sell
    * @param _eggId                 Egg Id
    *
     */
    function addAuction(uint _price, uint _eggId) external
    {
        require(_price > 0);
        require(_owns(msg.sender, _eggId));

        EggAuction memory _auction = EggAuction(msg.sender, _price, _eggId);

        _transfer(msg.sender, address(this), _eggId);
        eggIdToAuction[_eggId] = _auction;
    }

    /**
    * Get Information of Auction By Egg ID
    *
    * @param _eggId                 Egg Id
    *
    * @return seller                Seller's Address
    * @return price                 Price
    * @return eggId                 Egg Id
    *
     */
    function getEggAuctionByEggId(uint256 _eggId) external view returns(address seller, uint256 price, uint256 eggId)
    {
        EggAuction memory _auction = eggIdToAuction[_eggId];
        return(_auction.seller, _auction.startingPrice, _auction.eggId);
    }

    /**
    * Get Count of Auction Sale
    *
    * @return count                Count of Auction Sale
    *
     */
    function getEggAuctionCount() external view returns(uint256)
    {
        return eggAuctions.length;
    }

    /**
    * Get Information of Auction By Auction ID
    *
    * @param _auctionId             Auction Id
    *
    * @return seller                Seller's Address
    * @return price                 Price
    * @return eggId                 Egg Id
    *
     */
    function getEggAuction(uint256 _auctionId) external view returns(address seller, uint256 price, uint256 eggId)
    {
        EggAuction memory _auction = eggAuctions[_auctionId];
        return(_auction.seller, _auction.startingPrice, _auction.eggId);
    }

    /**
    * Remove Auction By Egg ID
    *
    * @param _eggId                 Egg ID
    *
     */
    function _removeAuction(uint256 _eggId) internal {
        delete eggIdToAuction[_eggId];
    }

    /**
    * Bid on Auction Sale
    *
    * @param _eggId                 Egg ID
    *
     */
    function bidAuction(uint256 _eggId) external payable
    {
        require(_owns(address(this), _eggId));
        EggAuction memory _auction = eggIdToAuction[_eggId];
        require(!_owns(msg.sender, _eggId));
        require(_auction.startingPrice == msg.value);

        _removeAuction(_eggId);
        _transfer(address(this), msg.sender, _eggId);
        _auction.seller.transfer(msg.value);
    }

    /**
    * Cancel Auction By Egg ID
    *
    * @param _eggId                 Egg ID
    *
     */
    function cancelAuction(uint256 _eggId) external
    {
        require(_owns(address(this), _eggId));
        EggAuction memory _auction = eggIdToAuction[_eggId];
        require(msg.sender == _auction.seller);

        _removeAuction(_eggId);
        _transfer(address(this), msg.sender, _eggId);
    }
}