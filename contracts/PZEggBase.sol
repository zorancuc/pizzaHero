pragma solidity ^0.4.25;

contract PZEggBase
{
    struct Egg {
        uint256 matronId;
        uint256 sireId;
    }

    address public                          addrAdmin;

    Egg[]   public                          eggs;

    address public                          addrChest;
    address public                          addrHero;

    mapping (uint256 => address) public     eggIndexToOwner;
    mapping (address => uint256) public     ownershipEggCount;
    mapping (uint256 => address) public     eggIndexToApproved;

    event Transfer(address from, address to, uint256 eggId);
    event EggsCreated(uint itmeType, uint quantity);

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
    * Create Egg NFT
    * @param _eggOwner                      Address of new Egg's Owner
    * @param _matronId                      Matron ID of new Egg
    * @param _sireId                        Sire ID of new Egg
    *
     */
    function _createEgg(address _eggOwner, uint256 _matronId, uint256 _sireId) internal
    {
        require(_matronId == uint256(uint32(_matronId)));
        require(_sireId == uint256(uint32(_sireId)));

        Egg memory _egg = Egg(_matronId, _sireId);

        uint256 newEggId = eggs.push(_egg) - 1;
        _transfer(0, _eggOwner, newEggId);
    }

    /**
    * Transfer Egg
    * @param _from                          Address of transfer
    * @param _to                            Address of receiver
    * @param _eggId                         Egg Id to be transferred
    *
     */
    function _transfer(address _from, address _to, uint256 _eggId) internal
    {
        ownershipEggCount[_to]++;
        eggIndexToOwner[_eggId] = _to;
        if (_from != address(0)) {
            ownershipEggCount[_from]--;
            delete eggIndexToApproved[_eggId];
        }
        
        emit Transfer(_from, _to, _eggId);
    }
}
