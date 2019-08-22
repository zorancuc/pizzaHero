pragma solidity ^0.4.25;

import "./PZGeneScience.sol";

contract PZGeneScienceInterface {

    function isGeneScience() public pure returns (bool);

    function mixGenes(uint256 genes1, uint256 genes2, uint256 targetBlock) public returns (uint256);

    function generateGene0() public returns(uint256);
    function decode(uint256 _genes) public pure returns(uint8[]);
    function expressingTraits(uint256 _genes) public pure returns(uint8[14]);
}