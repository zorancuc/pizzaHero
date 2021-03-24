pragma solidity ^0.5.0;

import "./PZEggBase.sol";
import "./TRC721.sol";
import "./TRC721Metadata.sol";

contract PZEggOwnership is PZEggBase, TRC721
{
    string public constant name = "PZeggs";
    string public constant symbol = "PE";

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
        bytes4(keccak256('eggsOfOwner(address)')) ^
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
    function setMetadataAddress(address _contractAddress) public onlyAdmin {
        trc721Metadata = TRC721Metadata(_contractAddress);
    }

    /**
    * Check if the claimant owns Egg
    * @param _claimant                  Address of Claimer
    * @param _eggId                     Egg Id
    *
    * @return result                    The boolean result if claimant owns given Egg
    *
     */
    function _owns(address _claimant, uint256 _eggId) internal view returns (bool) {
        return eggIndexToOwner[_eggId] == _claimant;
    }

    /**
    * Check if egg is approved for Claimant
    * @param _claimant                  Address of Claimer
    * @param _eggId                     Egg Id
    *
    * @return result                    The boolean result if claimant is approved for given Egg
    *
     */
    function _approvedFor(address _claimant, uint256 _eggId) internal view returns (bool) {
        return eggIndexToApproved[_eggId] == _claimant;
    }

    /**
    * Approve Egg for for Claimant
    * @param _approved                  Address of approved
    * @param _eggId                     Egg Id
    *
     */
    function _approve(uint256 _eggId, address _approved) internal {
        eggIndexToApproved[_eggId] = _approved;
    }

    /**
    * Get Balance of Owner
    * @return count                     Count of Eggs owned by Owner
    *
     */
    function balanceOf(address _owner) public view returns (uint256 count) {
        return ownershipEggCount[_owner];
    }

    /**
    * Transfer Egg
    * @param _to                            Address of receiver
    * @param _eggId                         Egg Id to be transferred
    *
     */
    function transfer(
        address _to,
        uint256 _eggId
    )
        external
    {
        // Safety check to prevent against an unexpected 0x0 default.
        require(_to != address(0x0));
        require(_to != address(this));

        require(_owns(msg.sender, _eggId));

        _transfer(msg.sender, _to, _eggId);
    }

    /**
    * Approve Egg for for Claimant
    * @param _to                        Address to be approved by Egg
    * @param _eggId                     Egg Id
    *
     */
    function approve(
        address _to,
        uint256 _eggId
    )
        external
    {
        // Only an owner can grant transfer approval.
        require(_owns(msg.sender, _eggId));

        // Register the approval (replacing any previous approval).
        _approve(_eggId, _to);

        // Emit approval event.
        emit Approval(msg.sender, _to, _eggId);
    }

    /**
    * Transfer Egg
    * @param _from                          Address of transfer
    * @param _to                            Address of receiver
    * @param _eggId                         Egg Id to be transferred
    *
     */
    function transferFrom(
        address _from,
        address _to,
        uint256 _eggId
    )
        external
    {
        require(_to != address(0));

        require(_to != address(this));

        require(_approvedFor(msg.sender, _eggId));
        require(_owns(_from, _eggId));

        _transfer(_from, _to, _eggId);
    }

    /**
    * Get Total Supply
    * @return count                     Total Supply of Eggs
    *
     */
    function totalSupply() public view returns (uint) {
        return eggs.length - 1;
    }

    /**
    * Get Owner of Given Egg
    * @param _eggId                         Egg Id
    * @return owner                         Owner's address of Egg id
    *
     */
    function ownerOf(uint256 _eggId)
        public
        view
        returns (address owner)
    {
        owner = eggIndexToOwner[_eggId];

        require(owner != address(0x0));
    }

    /**
    * Get Eggs of Owner
    * @param _owner                         Owner's address of Egg id
    *
    * @return ownerEggs                     Owner's Eggs
    *
     */
    function eggsOfOwner(address _owner) public view returns(uint256[] memory ownerEggs) {
        uint256 eggCount = balanceOf(_owner);

        if (eggCount == 0) {
            // Return an empty array
            return new uint256[](0);
        } else {
            uint256[] memory result = new uint256[](eggCount);
            uint256 totaleggs = totalSupply();
            uint256 resultIndex = 0;

            uint256 eggId;

            for (eggId = 1; eggId <= totaleggs; eggId++) {
                if (eggIndexToOwner[eggId] == _owner) {
                    result[resultIndex] = eggId;
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

    function _toString(bytes32[4] memory _rawBytes, uint256 _stringLength) private pure returns (string memory) {
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
