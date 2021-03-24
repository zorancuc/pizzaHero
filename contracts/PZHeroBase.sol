pragma solidity ^0.5.0;

contract PZHeroBase
{
    struct Hero {
        uint date;
        uint price;
        uint tokenId;
        uint tokenPrice;
        uint256 genes;

        uint64 birthTime;

        uint64 cooldownEndBlock;

        uint32 matronId;
        uint32 sireId;

        uint32 siringWithId;

        uint16 cooldownIndex;
        uint16 generation;
        uint16 level;
    }

    uint32[14] public cooldowns = [
        uint32(1 minutes),
        uint32(2 minutes),
        uint32(5 minutes),
        uint32(10 minutes),
        uint32(30 minutes),
        uint32(1 hours),
        uint32(2 hours),
        uint32(4 hours),
        uint32(8 hours),
        uint32(16 hours),
        uint32(1 days),
        uint32(2 days),
        uint32(4 days),
        uint32(7 days)
    ];

    uint8 internal constant TRAIT_COUNT = 14;

    uint256 public                          secondsPerBlock = 15;
    address payable public                          addrAdmin;

    address public                          addrChest;
    address public                          addrItemCore;

    Hero[]  public                          heroes;
    mapping (uint256 => address) public     heroIndexToOwner;
    mapping (address => uint256) public     ownershipHeroCount;
    mapping (uint256 => address) public     heroIndexToApproved;
    mapping (uint256 => address) public     sireAllowedToAddress;

    event Transfer(address from, address to, uint256 itemId);
    event Birth(address owner, uint256 kittyId, uint256 matronId, uint256 sireId, uint256 genes, uint16 level);

    /**
    * Constructor
    *
     */
    constructor() public
    {
        addrAdmin = msg.sender;
    }

    /**
    * Modifier for Admin Only
    *
     */
    modifier onlyAdmin()
    {
        require(msg.sender == addrAdmin);
        _;
    }

    /**
    * Set Chest Address
    * @param _addrChest                      Address of Chest contract
    *
     */
    function setChestAddress(address _addrChest) external onlyAdmin
    {
        addrChest = _addrChest;
    }

    /**
    * Set Item _addrItem
    * @param _addrItem                      Address of Item contract
    *
     */
    function setItemCoreAddress(address _addrItem) external onlyAdmin
    {
        addrItemCore = _addrItem;
    }

    /**
    * Create Hero NFT
    * @param _matronId                      Matron ID of new Hero
    * @param _sireId                        Sire ID of new Hero
    * @param _generation                    Generation of new Hero
    * @param _genes                         Gene of new Hero
    * @param _level                         Level of new Hero
    * @param _owner                         Owner of new Hero
    *
     */
    function createHero(
        uint _date,
        uint _price,
        uint _tokenId,
        uint _tokenPrice,
        uint256 _matronId,
        uint256 _sireId,
        uint256 _generation,
        uint256 _genes,
        uint16  _level,
        address _owner
    )
        public
        returns (uint)
    {
        require(_matronId == uint256(uint32(_matronId)));
        require(_sireId == uint256(uint32(_sireId)));
        require(_generation == uint256(uint16(_generation)));

        uint16 cooldownIndex = uint16(_generation / 2);
        if (cooldownIndex > 13) {
            cooldownIndex = 13;
        }

        Hero memory _hero = Hero({
            date: _date,
            price: _price,
            tokenId: _tokenId,
            tokenPrice: _tokenPrice,
            genes: _genes,
            birthTime: uint64(now),
            cooldownEndBlock: 0,
            matronId: uint32(_matronId),
            sireId: uint32(_sireId),
            siringWithId: 0,
            cooldownIndex: cooldownIndex,
            generation: uint16(_generation),
            level: uint16(_level)
        });
        uint256 newHeroId = heroes.push(_hero) - 1;

        require(newHeroId == uint256(uint32(newHeroId)));

        // emit the birth event
        emit Birth(
            _owner,
            newHeroId,
            uint256(_hero.matronId),
            uint256(_hero.sireId),
            _hero.genes,
            _hero.level
        );

        _transfer(address(0), _owner, newHeroId);

        return newHeroId;
    }

    /**
    * Transfer Hero NFT
    * @param _from                          Address of transfer
    * @param _to                            Address of receiver
    * @param _heroId                        Hero Id to be transferred
    *
     */
    function _transfer(address _from, address _to, uint256 _heroId) internal {
        ownershipHeroCount[_to]++;
        heroIndexToOwner[_heroId] = _to;
        if (_from != address(0x0)) {
            ownershipHeroCount[_from]--;
            delete sireAllowedToAddress[_heroId];
            delete heroIndexToApproved[_heroId];
        }

        emit Transfer(_from, _to, _heroId);
    }
}
