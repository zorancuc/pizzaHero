pragma solidity ^0.4.25;

import "./PZHeroBase.sol";
import "./TRC721.sol";
import "./TRC721Metadata.sol";

contract PZHeroOwnership is PZHeroBase, TRC721
{
    string public constant name = "PZHeroes";
    string public constant symbol = "PH";

    // The contract that will return kitty metadata
    TRC721Metadata public trc721Metadata;

    bytes4 constant InterfaceSignature_TRC165 =
        bytes4(keccak256('supportsInterface(bytes4)'));

    bytes4 constant InterfaceSignature_TRC721 =
        bytes4(keccak256('name()')) ^
        bytes4(keccak256('symbol()')) ^
        bytes4(keccak256('totalSupply()')) ^
        bytes4(keccak256('balanceOf(address)')) ^
        bytes4(keccak256('ownerOf(uint256)')) ^
        bytes4(keccak256('approve(address,uint256)')) ^
        bytes4(keccak256('transfer(address,uint256)')) ^
        bytes4(keccak256('transferFrom(address,address,uint256)')) ^
        bytes4(keccak256('heroesOfOwner(address)')) ^
        bytes4(keccak256('tokenMetadata(uint256,string)'));

    function supportsInterface(bytes4 _interfaceID) external view returns (bool)
    {
        return ((_interfaceID == InterfaceSignature_TRC165) || (_interfaceID == InterfaceSignature_TRC721));
    }

    /**
    * Set Meta Data Address of TRC721
    * @param _contractAddress                      Address of TRC721
    *
     */
    function setMetadataAddress(address _contractAddress) external onlyAdmin {
        trc721Metadata = TRC721Metadata(_contractAddress);
    }

    /**
    * Check if the claimant owns Hero
    * @param _claimant                  Address of Claimer
    * @param _heroId                    Hero Id
    *
    * @return result                    The boolean result if claimant owns given Hero
    *
     */
    function _owns(address _claimant, uint256 _heroId) internal view returns (bool) {
        return heroIndexToOwner[_heroId] == _claimant;
    }

    /**
    * Check if Hero is approved for Claimant
    * @param _claimant                  Address of Claimer
    * @param _heroId                    Hero Id
    *
    * @return result                    The boolean result if claimant is approved for given Hero
    *
     */
    function _approvedFor(address _claimant, uint256 _heroId) internal view returns (bool) {
        return heroIndexToApproved[_heroId] == _claimant;
    }

    /**
    * Approve Hero for for Claimant
    * @param _approved                  Address of approved
    * @param _heroId                     Hero Id
    *
     */
    function _approve(uint256 _heroId, address _approved) internal {
        heroIndexToApproved[_heroId] = _approved;
    }

    /**
    * Get Balance of Owner
    * @return count                     Count of Heroes owned by Owner
    *
     */
    function balanceOf(address _owner) public view returns (uint256 count) {
        return ownershipHeroCount[_owner];
    }

    /**
    * Transfer Hero
    * @param _to                            Address of receiver
    * @param _heroId                        Hero Id to be transferred
    *
     */
    function transfer(
        address _to,
        uint256 _heroId
    )
        external
    {
        // Safety check to prevent against an unexpected 0x0 default.
        require(_to != address(0));
        require(_to != address(this));

        require(_owns(msg.sender, _heroId));

        _transfer(msg.sender, _to, _heroId);
    }

    /**
    * Approve Hero for for Claimant
    * @param _to                            Address to be approved by Hero
    * @param _heroId                        Hero Id
    *
     */
    function approve(
        address _to,
        uint256 _heroId
    )
        external
    {
        // Only an owner can grant transfer approval.
        require(_owns(msg.sender, _heroId));

        // Register the approval (replacing any previous approval).
        _approve(_heroId, _to);

        // Emit approval event.
        emit Approval(msg.sender, _to, _heroId);
    }

    /**
    * Transfer Hero
    * @param _from                          Address of transfer
    * @param _to                            Address of receiver
    * @param _heroId                        Hero Id to be transferred
    *
     */
    function transferFrom(
        address _from,
        address _to,
        uint256 _heroId
    )
        external
    {
        require(_to != address(0));

        require(_to != address(this));

        require(_approvedFor(msg.sender, _heroId));
        require(_owns(_from, _heroId));

        _transfer(_from, _to, _heroId);
    }

    /**
    * Get Total Supply
    * @return count                     Total Supply of Heroes
    *
     */
    function totalSupply() public view returns (uint) {
        return heroes.length - 1;
    }

    /**
    * Get Owner of Given Hero
    * @param _heroId                        Hero Id
    * @return owner                         Owner's address of Hero id
    *
     */
    function ownerOf(uint256 _heroId)
        public
        view
        returns (address owner)
    {
        owner = heroIndexToOwner[_heroId];

        require(owner != address(0));
    }

    /**
    * Get Heroes of Owner
    * @param _owner                         Owner's address
    *
    * @return ownerHeroes                   Owner's Heroes
    *
     */
    function heroesOfOwner(address _owner) public view returns(uint256[] ownerHeroes) {
        uint256 heroCount = balanceOf(_owner);

        if (heroCount == 0) {
            // Return an empty array
            return new uint256[](0);
        } else {
            uint256[] memory result = new uint256[](heroCount);
            uint256 totalHeroes = totalSupply();
            uint256 resultIndex = 0;

            uint256 heroId;

            for (heroId = 1; heroId <= totalHeroes; heroId++) {
                if (heroIndexToOwner[heroId] == _owner) {
                    result[resultIndex] = heroId;
                    resultIndex++;
                }
            }

            return result;
        }
    }

    function _memcpy(uint _dest, uint _src, uint _len) private pure {
        // Copy word-length chunks while possible
        for(; _len >= 32; _len -= 32) {
            assembly {
                mstore(_dest, mload(_src))
            }
            _dest += 32;
            _src += 32;
        }

        // Copy remaining bytes
        uint256 mask = 256 ** (32 - _len) - 1;
        assembly {
            let srcpart := and(mload(_src), not(mask))
            let destpart := and(mload(_dest), mask)
            mstore(_dest, or(destpart, srcpart))
        }
    }

    function _toString(bytes32[4] _rawBytes, uint256 _stringLength) private pure returns (string) {
        string memory outputString = new string(_stringLength);
        uint256 outputPtr;
        uint256 bytesPtr;

        assembly {
            outputPtr := add(outputString, 32)
            bytesPtr := _rawBytes
        }

        _memcpy(outputPtr, bytesPtr, _stringLength);

        return outputString;
    }
}
