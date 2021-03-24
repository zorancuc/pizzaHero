pragma solidity ^0.5.0;

import "./PZHeroBreeding.sol";

contract PZHeroMarketplace is PZHeroBreeding
{
    uint8 private constant       PZ_HERO_AUCTION_SALE = 0;
    uint8 private constant       PZ_HERO_AUCTION_SIRE = 1;

    struct HeroAuction {
        address payable seller;
        uint256 startingPrice;
        uint256 heroId;
        uint8   auctionType;
        // uint256 endingPrice;
        // uint64  duration;
        // uint64  startedAt;
    }

    mapping (uint256 => HeroAuction) heroIdToAuction;
    HeroAuction[] public       heroAuctions;

    /**
    * Constructor
    *
     */
    constructor() public
    {
 
    }

    /**
    * Get Ids of Heroes on the Marketplace Sale
    *
    * @return heroesOfOwner               Heroes of Owner
    *
     */
    function getHeroIdsOnSale() public view returns(uint256[] memory)
    {
        return heroesOfOwner(address(this));
    }

    /**
    * Place an Hero to Aunction on marketplace
    *
    * @param _price                 Price to Sell
    * @param _heroId                Hero Id
    * @param _auctionType           Auction type; sale or sire
    *
     */
    function addAuction(uint _price, uint _heroId, uint8 _auctionType) public
    {
        require(_owns(msg.sender, _heroId));
        require(_price > 0);

        HeroAuction memory _auction = HeroAuction(msg.sender, _price, _heroId, _auctionType);

        // uint256 newAuctionId = HeroAuctions.push(_auction) - 1;
        _transfer(msg.sender, address(this), _heroId);
        heroIdToAuction[_heroId] = _auction;
    }

    /**
    * Get Information of Auction By Hero ID
    *
    * @param _heroId                 Hero Id
    *
    * @return seller                Seller's Address
    * @return price                 Price
    * @return heroId                Hero Id
    * @return auctionType           Auction Type
    *
     */
    function getHeroAuctionByheroId(uint256 _heroId)
        public
        view
        returns(address seller, uint256 price, uint256 heroId, uint8 auctionType)
    {
        HeroAuction memory _auction = heroIdToAuction[_heroId];
        return(_auction.seller, _auction.startingPrice, _auction.heroId, _auction.auctionType);
    }

    /**
    * Get Count of Auction Sale
    *
    * @return count                Count of Auction Sale
    *
     */
    function getHeroAuctionCount() external view returns(uint256)
    {
        return heroAuctions.length;
    }

    /**
    * Remove Auction By Hero ID
    *
    * @param _heroId                 Hero ID
    *
     */
    function _removeAuction(uint256 _heroId) internal {
        delete heroIdToAuction[_heroId];
    }

    /**
    * Bid on Auction Sale
    *
    * @param _heroId                 Hero ID
    *
     */
    function bidAuction(uint256 _heroId) external payable
    {
        require(_owns(address(this), _heroId));
        HeroAuction memory _auction = heroIdToAuction[_heroId];
        require(!_owns(msg.sender, _heroId));
        require(_auction.startingPrice == msg.value);
        require(_auction.auctionType == PZ_HERO_AUCTION_SALE);

        _removeAuction(_heroId);
        _transfer(address(this), msg.sender, _heroId);
        address(_auction.seller).transfer(msg.value);
    }

    /**
    * Bid on Auction Sire
    *
    * @param _heroId                 Hero ID
    * @param _sireId                 Sire ID
    *
     */
    function bidSire(uint256 _heroId, uint256 _sireId) external payable
    {
        require(_owns(address(this), _heroId));
        HeroAuction memory _auction = heroIdToAuction[_heroId];
        require(!_owns(msg.sender, _heroId));
        require(_auction.startingPrice == msg.value);
        require(_auction.auctionType == PZ_HERO_AUCTION_SIRE);

        _removeAuction(_heroId);
        _transfer(address(this), _auction.seller, _heroId);
        _breedWith(_heroId, _sireId);
        address(_auction.seller).transfer(msg.value);
    }

    /**
    * Cancel Auction By Hero ID
    *
    * @param _heroId                 Hero ID
    *
     */
    function cancelAuction(uint256 _heroId) external
    {
        require(_owns(address(this), _heroId));
        HeroAuction memory _auction = heroIdToAuction[_heroId];
        require(msg.sender == _auction.seller);

        _removeAuction(_heroId);
        _transfer(address(this), msg.sender, _heroId);
    }
}