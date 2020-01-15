pragma solidity ^0.4.25;

import "./PZHeroOwnership.sol";
import "./PZGeneScienceInterface.sol";
import "./PZEggCore.sol";

contract PZHeroBreeding is PZHeroOwnership
{
    event Pregnant(address owner, uint256 matronId, uint256 sireId, uint256 cooldownEndBlock);

    uint256 public autoBirthFee = 10 trx ;

    // uint256 public pregnantHeroes;

    PZGeneScienceInterface public           contractGeneScience;
    address public                          addrGeneScience;

    PZEggCore public                        contractEggCore;
    address public                          addrEggCore;

    /**
    * Set Address of GeneScience Contract
    * @param _addrGeneScience                      Address of Gene Science Contract
    *
     */
    function setGeneScienceAddr(address _addrGeneScience) public onlyAdmin
    {
        addrGeneScience = _addrGeneScience;
        PZGeneScienceInterface candidateContract = PZGeneScienceInterface(_addrGeneScience);

        require(candidateContract.isGeneScience());

        // Set the new contract address
        contractGeneScience = candidateContract;
    }

    /**
    * Check if the Hero is Ready to Breed
    * @param _hero                              Hero NFT
    *
    * @return result                            Return bool typed result
    *
     */
    function _isReadyToBreed(Hero _hero) internal view returns (bool) {
        // return (_hero.siringWithId == 0) && (_hero.cooldownEndBlock <= uint64(block.number));

        return (_hero.cooldownEndBlock <= uint64(block.number));
    }

    /**
    * Check if sire and matron are permitted to breed
    * @param _sireId                              Id of Sire Hero
    * @param _matronId                            Id of Matron Hero
    *
    * @return result                            Return bool typed result
    *
     */
    function _isSiringPermitted(uint256 _sireId, uint256 _matronId) internal view returns (bool) {
        address matronOwner = heroIndexToOwner[_matronId];
        address sireOwner = heroIndexToOwner[_sireId];

        return (matronOwner == sireOwner || sireAllowedToAddress[_sireId] == matronOwner);
    }

    /**
    * Trigger the cooldown of Hero
    * @param _hero                                   Hero NFT
    *
     */
    function _triggerCooldown(Hero storage _hero) internal {
        _hero.cooldownEndBlock = uint64((cooldowns[_hero.cooldownIndex]/secondsPerBlock) + block.number);

        if (_hero.cooldownIndex < 13) {
            _hero.cooldownIndex += 1;
        }
    }

    function approveSiring(address _addr, uint256 _sireId)
        external
    {
        require(_owns(msg.sender, _sireId));
        sireAllowedToAddress[_sireId] = _addr;
    }

    /**
    * Check if the Hero is Ready to Breed
    * @param _heroId                                   HeroId
    *
    * @return result                                    Return Result
    *
     */
    function isReadyToBreed(uint256 _heroId)
        public
        view
        returns (bool)
    {
        require(_heroId > 0);
        Hero storage hero = heroes[_heroId];
        return _isReadyToBreed(hero);
    }

    function _isValidMatingPair(
        Hero storage _matron,
        uint256 _matronId,
        Hero storage _sire,
        uint256 _sireId
    )
        private
        view
        returns(bool)
    {
        if (_matronId == _sireId) {
            return false;
        }

        if (_matron.matronId == _sireId || _matron.sireId == _sireId) {
            return false;
        }
        if (_sire.matronId == _matronId || _sire.sireId == _matronId) {
            return false;
        }

        if (_sire.matronId == 0 || _matron.matronId == 0) {
            return true;
        }

        if (_sire.matronId == _matron.matronId || _sire.matronId == _matron.sireId) {
            return false;
        }
        if (_sire.sireId == _matron.matronId || _sire.sireId == _matron.sireId) {
            return false;
        }

        return true;
    }

    function _canBreedWithViaAuction(uint256 _matronId, uint256 _sireId)
        internal
        view
        returns (bool)
    {
        Hero storage matron = heroes[_matronId];
        Hero storage sire = heroes[_sireId];
        return _isValidMatingPair(matron, _matronId, sire, _sireId);
    }

    function canBreedWith(uint256 _matronId, uint256 _sireId)
        external
        view
        returns(bool)
    {
        require(_matronId > 0);
        require(_sireId > 0);
        Hero storage matron = heroes[_matronId];
        Hero storage sire = heroes[_sireId];
        return _isValidMatingPair(matron, _matronId, sire, _sireId) &&
            _isSiringPermitted(_sireId, _matronId);
    }

    /**
    * Breed Matron and Sire
    * @param _matronId                                   ID of Matron Hero
    * @param _sireId                                     ID of Sire Hero
    *
     */
    function _breedWith(uint256 _matronId, uint256 _sireId) internal {
        Hero storage sire = heroes[_sireId];
        Hero storage matron = heroes[_matronId];

        matron.siringWithId = uint32(_sireId);

        _triggerCooldown(sire);
        _triggerCooldown(matron);

        delete sireAllowedToAddress[_matronId];
        delete sireAllowedToAddress[_sireId];

        // pregnantHeroes++;

        contractEggCore.createEggToOwner(heroIndexToOwner[_matronId], now, sire.price, sire.tokenId, sire.tokenPrice, _matronId, _sireId);

        emit Pregnant(heroIndexToOwner[_matronId], _matronId, _sireId, matron.cooldownEndBlock);
    }

    /**
    * Breed Matron and Sire owend by One User
    * @param _matronId                                   ID of Matron Hero
    * @param _sireId                                     ID of Sire Hero
    *
     */
    
    function breedWithOwns(uint256 _matronId, uint256 _sireId)
        external
        payable
    {
        require(_owns(msg.sender, _matronId));
        require(_owns(msg.sender, _sireId));
        _breedWith(_matronId, _sireId);
    }

    /**
    * Breed Matron and Sire Owned By One User
    * @param _matronId                                   ID of Matron Hero
    * @param _sireId                                     ID of Sire Hero
    *
     */
    function breedWithOwned(uint256 _matronId, uint256 _sireId)
        external
        payable
        // whenNotPaused
    {
        require(msg.value >= autoBirthFee);

        require(_owns(msg.sender, _matronId));
        require(_owns(msg.sender, _sireId));

        // require(_isSiringPermitted(_sireId, _matronId));
        // Hero storage matron = heroes[_matronId];

        // require(_isReadyToBreed(matron));

        // Hero storage sire = heroes[_sireId];

        // require(_isReadyToBreed(sire));

        // require(_isValidMatingPair(
        //     matron,
        //     _matronId,
        //     sire,
        //     _sireId
        // ));

        _breedWith(_matronId, _sireId);
    }

    function breedTest() public pure returns(string)
    {
        return "Breed Test";
    }
}