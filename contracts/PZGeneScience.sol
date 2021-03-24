pragma solidity ^0.5.0;

contract PZGeneScience {
    bool public isGeneScience = true;

    uint256 internal constant maskLast8Bits = uint256(0xff);
    uint256 internal constant maskFirst248Bits = uint256(~0xff);

    uint8 internal constant TRAIT_COUNT = 14;

    uint8 internal constant BASETRAIT_GENDER_COUNT = 2;
    uint8 internal constant BASETRAIT_BODY_COUNT = 4;
    uint8 internal constant BASETRAIT_EYE_COUNT = 6;
    uint8 internal constant BASETRAIT_MOUTH_COUNT = 6;
    uint8 internal constant BASETRAIT_EAR_COUNT = 4;
    uint8 internal constant BASETRAIT_TAIL_COUNT = 4;
    uint8 internal constant BASETRAIT_PATTERN_COUNT = 4;  
    uint8 internal constant BASETRAIT_UNUSED1_COUNT = 1;
    uint8 internal constant BASETRAIT_UNUSED2_COUNT = 1;
    uint8 internal constant BASETRAIT_PRIMARYCOLOR_COUNT = 8;
    uint8 internal constant BASETRAIT_ACCENTCOLOR_COUNT = 6;
    uint8 internal constant BASETRAIT_PATTERNCOLOR_COUNT = 8;
    uint8 internal constant BASETRAIT_HAIRCOLOR_COUNT = 6;
    uint8 internal constant BASETRAIT_EYECOLOR_COUNT = 8;
    
    
    uint8 internal constant RAIT_GENDER_COUNT = 2;
    uint8 internal constant TRAIT_BODY_COUNT = 6;
    uint8 internal constant TRAIT_EYE_COUNT = 9;
    uint8 internal constant TRAIT_MOUTH_COUNT = 9;
    uint8 internal constant TRAIT_EAR_COUNT = 6;
    uint8 internal constant TRAIT_TAIL_COUNT = 6;
    uint8 internal constant TRAIT_PATTERN_COUNT = 6;
    uint8 internal constant TRAIT_UNUSED1_COUNT = 1;
    uint8 internal constant TRAIT_UNUSED2_COUNT = 1;
    uint8 internal constant TRAIT_PRIMARYCOLOR_COUNT = 12;
    uint8 internal constant TRAIT_ACCENTCOLOR_COUNT = 9;
    uint8 internal constant TRAIT_PATTERNCOLOR_COUNT = 12;
    uint8 internal constant TRAIT_HAIRCOLOR_COUNT = 9;
    uint8 internal constant TRAIT_EYECOLOR_COUNT = 12;

    uint8[] internal baseTraitCount;
    uint8[] internal traitCount;

    constructor() public {
        baseTraitCount.push(BASETRAIT_GENDER_COUNT);
        baseTraitCount.push(BASETRAIT_BODY_COUNT);
        baseTraitCount.push(BASETRAIT_EYE_COUNT);
        baseTraitCount.push(BASETRAIT_MOUTH_COUNT);
        baseTraitCount.push(BASETRAIT_EAR_COUNT);
        baseTraitCount.push(BASETRAIT_TAIL_COUNT);
        baseTraitCount.push(BASETRAIT_PATTERN_COUNT);
        baseTraitCount.push(BASETRAIT_UNUSED1_COUNT);
        baseTraitCount.push(BASETRAIT_UNUSED2_COUNT);
        baseTraitCount.push(BASETRAIT_PRIMARYCOLOR_COUNT);
        baseTraitCount.push(BASETRAIT_ACCENTCOLOR_COUNT);
        baseTraitCount.push(BASETRAIT_PATTERNCOLOR_COUNT);
        baseTraitCount.push(BASETRAIT_HAIRCOLOR_COUNT);
        baseTraitCount.push(BASETRAIT_EYECOLOR_COUNT);

        traitCount.push(RAIT_GENDER_COUNT);
        traitCount.push(TRAIT_BODY_COUNT);
        traitCount.push(TRAIT_EYE_COUNT);
        traitCount.push(TRAIT_MOUTH_COUNT);
        traitCount.push(TRAIT_EAR_COUNT);
        traitCount.push(TRAIT_TAIL_COUNT);
        traitCount.push(TRAIT_PATTERN_COUNT);
        traitCount.push(TRAIT_UNUSED1_COUNT);
        traitCount.push(TRAIT_UNUSED2_COUNT);
        traitCount.push(TRAIT_PRIMARYCOLOR_COUNT);
        traitCount.push(TRAIT_ACCENTCOLOR_COUNT);
        traitCount.push(TRAIT_PATTERNCOLOR_COUNT);
        traitCount.push(TRAIT_HAIRCOLOR_COUNT);
        traitCount.push(TRAIT_EYECOLOR_COUNT);
    }

    /**
    * Generate Traits for Mutation of Gene
    * @param traitPos                   Position of Trait
    * @param trait1                     First trait to be mixed
    * @param trait2                     Second trait to be Mixed
    * @param rand                       Rand number for mixing
    *
    * @return ascension                 Mixed Trait for mutation
    *
     */
    function _ascend(uint256 traitPos, uint8 trait1, uint8 trait2, uint256 rand) internal view returns(uint8 ascension) {
        ascension = 0;

        uint8 smallT = trait1;
        uint8 bigT = trait2;
        uint256 traitIndex = traitPos / 4;

        if (smallT > bigT) {
            bigT = trait1;
            smallT = trait2;
        }

        if ((bigT - smallT == 1) && smallT % 2 == 0) {
            uint256 maxRand;
            if (smallT < traitCount[traitIndex]) maxRand = 1;
            else maxRand = 0;

            if (rand <= maxRand ) {
                ascension = (smallT / 2) + baseTraitCount[traitIndex];
            }
        }
        return ascension;
    }

    /**
    * Slice the Number
    * @param _n                         number to be Sliced
    * @param _nbits                     count of bits to be Sliced
    * @param _offset                    offset
    *
    * @return result                    sliced number
    *
     */
    function _sliceNumber(uint256 _n, uint256 _nbits, uint256 _offset) private pure returns (uint256) {
        uint256 mask = uint256((2**_nbits) - 1) << _offset;
        return uint256((_n & mask) >> _offset);
    }

    /**
    * Get 5 Bits of number
    * @param _input                    input number
    * @param _slot                     slot
    *
    * @return result                   5 bits of number
    *
     */
    function _get5Bits(uint256 _input, uint256 _slot) internal pure returns(uint8) {
        return uint8(_sliceNumber(_input, uint256(5), _slot * 5));
    }

    /**
    * Decode Traits from Gene
    * @param _genes                    Gene
    *
    * @return traits                   Traits array from Gene
    *
     */
    function decode(uint256 _genes) public pure returns(uint8[] memory) {
        uint8[] memory traits = new uint8[](TRAIT_COUNT * 4);
        uint256 i;
        for(i = 0; i < TRAIT_COUNT * 4; i++) {
            traits[i] = _get5Bits(_genes, i);
        }
        return traits;
    }

    /**
    * Encode Gene from Traits array
    * @param _traits                   Traits array
    *
    * @return _genes                   Gene from Traits array
    *
     */
    function encode(uint8[] memory _traits) public pure returns (uint256 _genes) {
        _genes = 0;
        for(uint256 i = 0; i < TRAIT_COUNT * 4; i++) {
            _genes = _genes << 5;
            _genes = _genes | _traits[TRAIT_COUNT * 4 - 1 - i];
        }
        return _genes;
    }

    /**
    * Get expressing Traits from Gene
    * @param _genes                     Gene
    *
    * @return express                   Expressing Traits array from Gene
    *
     */
    function expressingTraits(uint256 _genes) public pure returns(uint8[TRAIT_COUNT] memory) {
        uint8[TRAIT_COUNT] memory express;
        for(uint256 i = 0; i < TRAIT_COUNT; i++) {
            express[i] = _get5Bits(_genes, i * 4);
        }
        return express;
    }

    /**
    * Generate 0 Generation Gene
    *
    * @return gene                   Gene
    *
     */
    function generateGene0() public view returns(uint256)
    {   
        uint8[] memory traits = new uint8[](TRAIT_COUNT * 4);
        traits = generateTraits();
        return encode(traits);

        // rand = uint256(keccak256(block.timestamp, block.difficulty));
        // return rand;
    }

    /**
    * Generates Random Traits
    *
    * @return traits                   Random Traits array
    *
     */
    function generateTraits() public view returns(uint8[] memory)
    {   
        uint8[] memory traits = new uint8[](TRAIT_COUNT * 4);
        uint256 rand = 0;
        rand = uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty)));
        traits = decode(rand);
        for(uint8 i = 0; i < TRAIT_COUNT * 4; i++) {
            traits[i] = traits[i] % baseTraitCount[i/4];
            // traits[i] = uint8(rand);
        }

        return traits;
    }

    /**
    * Mix Gene from two Genes
    * @param _genes1                     Gene 1
    * @param _genes2                     Gene 2
    * @param _targetBlock                Target Block for random generation
    *
    * @return gene                       Mixed Gene
    *
     */
    function mixGenes(uint256 _genes1, uint256 _genes2, uint256 _targetBlock) public view returns (uint256) {

        //For test
        // require(block.number > _targetBlock);

        uint256 randomN = uint256(blockhash(_targetBlock));

        if (randomN == 0) {
            _targetBlock = (block.number & maskFirst248Bits) + (_targetBlock & maskLast8Bits);

            if (_targetBlock >= block.number) _targetBlock -= 256;

            randomN = uint256(blockhash(_targetBlock));
        }

        randomN = uint256(keccak256(abi.encodePacked(randomN, _genes1, _genes2, _targetBlock)));
        uint256 randomIndex = 0;

        uint8[] memory genes1Array = decode(_genes1);
        uint8[] memory genes2Array = decode(_genes2);
        uint8[] memory babyArray = new uint8[](TRAIT_COUNT * 4);
        uint256 traitPos;
        uint8 swap;
        for(uint256 i = 0; i < TRAIT_COUNT; i++) {
            uint256 j;
            uint256 rand;
            for(j = 3; j >= 1; j--) {
                traitPos = (i * 4) + j;

                rand = _sliceNumber(randomN, 2, randomIndex);
                randomIndex += 2;

                if (rand == 0) {
                    swap = genes1Array[traitPos];
                    genes1Array[traitPos] = genes1Array[traitPos - 1];
                    genes1Array[traitPos - 1] = swap;

                }

                rand = _sliceNumber(randomN, 2, randomIndex); 
                randomIndex += 2;

                if (rand == 0) {
                    swap = genes2Array[traitPos];
                    genes2Array[traitPos] = genes2Array[traitPos - 1];
                    genes2Array[traitPos - 1] = swap;
                }
            }

        }
        for(traitPos = 0; traitPos < TRAIT_COUNT * 4; traitPos++) {

            uint8 ascendedTrait = 0;
            uint256 rand;
            if ((traitPos % 4 == 0) && (genes1Array[traitPos] & 1) != (genes2Array[traitPos] & 1)) {
                rand = _sliceNumber(randomN, 3, randomIndex);
                randomIndex += 3;

                ascendedTrait = _ascend(traitPos, genes1Array[traitPos], genes2Array[traitPos], rand);
            }

            if (ascendedTrait > 0) {
                babyArray[traitPos] = uint8(ascendedTrait);
            } else {
                rand = _sliceNumber(randomN, 1, randomIndex);
                randomIndex += 1;

                if (rand == 0) {
                    babyArray[traitPos] = uint8(genes1Array[traitPos]);
                } else {
                    babyArray[traitPos] = uint8(genes2Array[traitPos]);
                }
            }
        }

        return encode(babyArray);
    }

    /**
    * Check function of GeneScience contract
    *
    */
    function geneTest() public pure returns(string memory) {
        return "Gene Test";
    }
}