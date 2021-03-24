pragma solidity ^0.5.0;

import "./PZHeroMarketplace.sol";

contract PZHeroFactory is PZHeroMarketplace
{
    
    // function createGen0Hero(address _owner) external returns(uint256){
    //     // require(msg.sender == addrChest);

    //     uint256 _genes = 0;
    //     address heroOwner = _owner;
    //     if (heroOwner == address(0)) {
    //          heroOwner = addrAdmin;
    //     }

    //     _genes = contractGeneScience.generateGene0();
    //     uint256 newHeroId = _createHero(0, 0, 0, _genes, 0, heroOwner);

        
    //     // Hero memory _hero = Hero(_genes, uint256(0), 0, uint256(0), uint256(0), 0, 1, uint256(0), uint256(0));
    //     // uint256 newHeroId = heroes.push(_hero) - 1;

    //     // require(newHeroId == uint256(newHeroId));

    //     // _transfer(address(0), _owner, newHeroId);

    //     return newHeroId;
    // }
}