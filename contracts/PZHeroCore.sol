pragma solidity ^0.4.25;

import "./PZHeroFactory.sol";

contract PZHeroCore is PZHeroFactory
{
    /**
    * Constructor
    * @param _addrItemCore                  Address of Item Contract
    * @param _addrEggCore                   Address of Egg Contract
    * @param _addrGeneScience               Address of GeneScience contract
    *
     */
    constructor(address _addrItemCore, address _addrEggCore, address _addrGeneScience) public
    {
        require(_addrItemCore != address(0x0));
        addrItemCore = _addrItemCore;

        addrGeneScience = _addrGeneScience;
        PZGeneScienceInterface candidateContract = PZGeneScienceInterface(_addrGeneScience);

        require(candidateContract.isGeneScience());

        // Set the new contract address
        contractGeneScience = candidateContract;

        addrEggCore = _addrEggCore;
        PZEggCore candidateEggContract = PZEggCore(_addrEggCore);

        require(candidateEggContract.isEggContract());

        // Set the new contract address
        contractEggCore = candidateEggContract;
    }

    /**
    * Gift Hero to other users
    *
    * @param _to                            address of receiver
    * @param _heroId                        Hero Id to gift
    *
    */    
    function giftHero(address _to, uint256 _heroId) external
    {
        require(_owns(msg.sender, _heroId));
        require(_to != address(0x0));
        _transfer(msg.sender, _to, _heroId);
    }

    /**
    * Get Information of an Hero
    * @param _heroId                        Hero ID
    *
    * @return genes                         Genes
    * @return birthTime                     BirthTime
    * @return cooldownEndBlock              Cooldown Time
    * @return matronId                      MatronID
    * @return sireId                        Sire ID
    * @return siringWithId                  Sire ID breeded with
    * @return cooldownIndex                 Cooldown Index
    * @return generation                    Generation
    * @return level                         Level
    *
     */
    function getHero(uint _heroId)
        public
        view
        returns(
            uint256 genes,
            uint64 birthTime,
            uint64 cooldownEndBlock,
            uint32 matronId,
            uint32 sireId,
            uint32 siringWithId,
            uint16 cooldownIndex,
            uint16 generation,
            uint16 level)
    {
        Hero memory _hero = heroes[_heroId];
        return (_hero.genes,
            _hero.birthTime,
            _hero.cooldownEndBlock,
            _hero.matronId, _hero.sireId,
            _hero.siringWithId, _hero.cooldownIndex, _hero.generation, _hero.level);
    }

    /**
    * Get Traits of Hero
    * @param _heroId                      Hero Id
    *
    * @return traits
    *
     */
    function getHeroTraits(uint _heroId) public view returns(uint8[]) {
        Hero memory _hero = heroes[_heroId];
        return contractGeneScience.decode(_hero.genes);
    }

    /**
    * Get Appearance of Hero
    * @param _heroId                      Hero Id
    *
    *
     */
    function getHeroAppearance(uint _heroId) public view returns(uint8[14]){
        Hero memory _hero = heroes[_heroId];
        return contractGeneScience.expressingTraits(_hero.genes);
    }

    function heroTest() external view returns (address){
        return addrChest;
    }

    function isHeroContract() public pure returns (bool) {
        return true;
    }
}
