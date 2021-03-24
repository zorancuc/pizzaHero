pragma solidity ^0.5.0;

import "./PZEggMarketplace.sol";
import "./PZHeroCore.sol";
import "./PZGeneScienceInterface.sol";

contract PZEggCore is PZEggMarketplace
{

    PZGeneScienceInterface public           contractGeneScience;
    PZHeroCore public                       contractHeroCore;

    /**
    * Constructor
    * @param _addrGeneScience               Address of GeneScience contract
    *
     */
    constructor(address _addrGeneScience) public
    {
        // require(_addrItemCore != address(0x0));
        // addrItemCore = _addrItemCore;

        // addrGeneScience = _addrGeneScience;
        PZGeneScienceInterface candidateContract = PZGeneScienceInterface(_addrGeneScience);

        require(candidateContract.isGeneScience());

        // Set the new contract address
        contractGeneScience = candidateContract;
    }

    /**
    * Set Chest Address
    * @param _addrChest                      Address of Chest contract
    *
     */
    function setChestAddr(address _addrChest) public onlyAdmin
    {
        require(_addrChest != address(0x0));
        addrChest = _addrChest; 

    }

    /**
    * Set Hero Address
    * @param _addrHero                      Address of Hero contract
    *
     */
    function setHeroAddr(address _addrHero) public onlyAdmin
    {
        require(_addrHero != address(0x0));
        addrHero = _addrHero;
        contractHeroCore = PZHeroCore(addrHero);
    }

    /**
    * Test function
    *
     */
    function eggTest() external view returns (address){
        return addrChest;
    }

    /**
    * Check function as if this is the Egg contract
    *
     */
    function isEggContract() public pure returns (bool) {
        return true;
    }

    /**
    * Create Egg and transfer to Owner
    * @param _eggOwner                      Address of Egg Owner
    * @param _matronId                      Matron ID of new Egg
    * @param _sireId                        Sire ID of new Egg
    *
     */
    function createEggToOwner(address _eggOwner, uint _date, uint _price, uint _tokenId, uint _tokenPrice, uint256 _matronId, uint256 _sireId) public {
        require((msg.sender == addrChest) || (msg.sender == addrHero));

        require(_matronId == uint256(uint32(_matronId)));
        require(_sireId == uint256(uint32(_sireId)));

        _createEgg(_eggOwner, _date, _price, _tokenId, _tokenPrice, _matronId, _sireId);
    }

    /**
    * Get Information of an Egg
    * @param _eggId                      Egg Id
    *
    * @return matronId                   Matron ID
    * @return sireId                     Sire ID
    *
     */
    function getEgg(uint _eggId) public view returns(uint date, uint price, uint tokenId, uint tokenPrice, uint256 matronId, uint256 sireId)
    {
        Egg memory _egg = eggs[_eggId];
        return(_egg.date, _egg.price, _egg.tokenId, _egg.tokenPrice, _egg.matronId, _egg.sireId);
    }

    /**
    * Gift Egg to other users
    *
    * @param _to                            address of receiver
    * @param _eggId                         Egg Id to gift
    *
    */
    function giftEgg(address _to, uint256 _eggId) public
    {
        require(_owns(msg.sender, _eggId));
        require(_to != address(0x0));
        _transfer(msg.sender, _to, _eggId);
    }

    /**
    * Birth the Egg to create new Hero
    *
    * @param _eggId                         Egg Id to gift
    *
    */
    function giveBirth(uint256 _eggId) public
    {
        require(_owns(msg.sender, _eggId));
        Egg memory _egg = eggs[_eggId];

        uint256 matronGene = 0;
        uint16  matronGeneration = 0;
        uint64 cooldownEndBlock = 0;

        uint256 sireGene = 0;
        uint16  sireGeneration = 0;

        uint16 childGeneration = 0;
        uint256 childGenes = 0;

        if ((_egg.matronId == 0) && (_egg.sireId == 0)) {
            childGeneration = 0;
            childGenes = contractGeneScience.generateGene0();
        } else {
            (,,,,matronGene,,cooldownEndBlock,,,,matronGeneration,,) = contractHeroCore.getHero(_egg.matronId);
            (,,,,sireGene,,,,,,sireGeneration,,) = contractHeroCore.getHero(_egg.sireId);

            childGeneration = matronGeneration;
            if (sireGeneration > matronGeneration) {
                childGeneration = sireGeneration;
            }
            childGeneration = childGeneration + 1;
            childGenes = contractGeneScience.mixGenes(matronGene, sireGene, cooldownEndBlock);
        }

        _transfer(msg.sender, address(0), _eggId);
        delete eggs[_eggId];
        contractHeroCore.createHero(now, _egg.price, _egg.tokenId, _egg.tokenPrice, _egg.matronId, _egg.sireId, childGeneration, childGenes, 0, msg.sender);
    }
}
