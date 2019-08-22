pragma solidity ^0.4.25;

import "./PZItemBase.sol";
import "./TRC721.sol";
import "./TRC721Metadata.sol";

contract PZItemOwnership is PZItemBase, TRC721
{
    string public constant name = "PZItems";
    string public constant symbol = "PI";

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
        bytes4(keccak256('itemsOfOwner(address)')) ^
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
    * Check if the claimant owns Item
    * @param _claimant                  Address of Claimer
    * @param _itemId                    Item Id
    *
    * @return result                    The boolean result if claimant owns given Item
    *
     */
    function _owns(address _claimant, uint256 _itemId) internal view returns (bool) {
        return itemIndexToOwner[_itemId] == _claimant;
    }

    /**
    * Check if Item is approved for Claimant
    * @param _claimant                  Address of Claimer
    * @param _itemId                    Item Id
    *
    * @return result                    The boolean result if claimant is approved for given Item
    *
     */
    function _approvedFor(address _claimant, uint256 _itemId) internal view returns (bool) {
        return itemIndexToApproved[_itemId] == _claimant;
    }

    /**
    * Approve Item for for Claimant
    * @param _approved                  Address of approved
    * @param _itemId                    Item Id
    *
     */
    function _approve(uint256 _itemId, address _approved) internal {
        itemIndexToApproved[_itemId] = _approved;
    }

    /**
    * Get Balance of Owner
    * @return count                     Count of Items owned by Owner
    *
     */
    function balanceOf(address _owner) public view returns (uint256 count) {
        return ownershipItemCount[_owner];
    }

    /**
    * Transfer Item
    * @param _to                            Address of receiver
    * @param _itemId                        Hero Id to be transferred
    *
     */
    function transfer(
        address _to,
        uint256 _itemId
    )
        external
    {
        // Safety check to prevent against an unexpected 0x0 default.
        require(_to != address(0x0));
        require(_to != address(this));

        require(_owns(msg.sender, _itemId));

        _transfer(msg.sender, _to, _itemId);
    }

    /**
    * Approve Item for for Claimant
    * @param _to                        Address to be approved by item
    * @param _itemId                    Item Id
    *
     */
    function approve(
        address _to,
        uint256 _itemId
    )
        external
    {
        // Only an owner can grant transfer approval.
        require(_owns(msg.sender, _itemId));

        // Register the approval (replacing any previous approval).
        _approve(_itemId, _to);

        // Emit approval event.
        emit Approval(msg.sender, _to, _itemId);
    }

    /**
    * Transfer Item
    * @param _from                          Address of transfer
    * @param _to                            Address of receiver
    * @param _itemId                        Item Id to be transferred
    *
     */
    function transferFrom(
        address _from,
        address _to,
        uint256 _itemId
    )
        external
    {
        require(_to != address(0x0));

        require(_to != address(this));

        require(_approvedFor(msg.sender, _itemId));
        require(_owns(_from, _itemId));

        _transfer(_from, _to, _itemId);
    }

    /**
    * Get Total Supply
    * @return count                     Total Supply of Items
    *
     */
    function totalSupply() public view returns (uint) {
        return items.length - 1;
    }

    /**
    * Get Owner of Given Item
    * @param _itemId                        Item Id
    * @return owner                         Owner's address of Item id
    *
     */
    function ownerOf(uint256 _itemId)
        public
        view
        returns (address owner)
    {
        owner = itemIndexToOwner[_itemId];

        require(owner != address(0x0));
    }

    /**
    * Get Items of Owner
    * @param _owner                         Owner's address
    *
    * @return ownerItems                    Owner's Items
    *
     */
    function itemsOfOwner(address _owner) public view returns(uint256[] ownerItems) {
        uint256 itemCount = balanceOf(_owner);

        if (itemCount == 0) {
            // Return an empty array
            return new uint256[](0);
        } else {
            uint256[] memory result = new uint256[](itemCount);
            uint256 totalItems = totalSupply();
            uint256 resultIndex = 0;

            uint256 itemId;

            for (itemId = 1; itemId <= totalItems; itemId++) {
                if (itemIndexToOwner[itemId] == _owner) {
                    result[resultIndex] = itemId;
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
