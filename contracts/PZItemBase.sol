pragma solidity ^0.5.0;

contract PZItemBase
{
    uint private constant       PZ_ITEM_GEAR = 0;
    uint private constant       PZ_ITEM_EMOTE = 1;

    uint private constant       PZ_ITEM_COMMON = 0;
    uint private constant       PZ_ITEM_UNCOMMON = 1;
    uint private constant       PZ_ITEM_RARE = 2;
    uint private constant       PZ_ITEM_EPIC = 3;
    uint private constant       PZ_ITEM_LEGENDARY = 4;

    // uint private constant       PZ_ITEM_RARE = 0;
    // uint private constant       PZ_ITEM_EPIC = 1;
    // uint private constant       PZ_ITEM_LEGENDARY = 2;

    // uint private constant       PZ_ITEM_GEAR = 0;
    // uint private constant       PZ_ITEM_EMOTE = 1;

    uint private constant       PZ_ITEM_LIMIT_RARE = 10000;
    uint private constant       PZ_ITEM_LIMIT_EPIC = 10000;
    uint private constant       PZ_ITEM_LIMIT_LEGENDARY = 10000;

    struct Item {
        uint        date;
        uint        price;
        uint        tokenId;
        uint        tokenPrice;
        uint        itemType;           //gear, emote
        uint        itemRarity;         //rare, ep ic, legendary
        uint        itemGroupID;
        string      itemName;
    }

    struct ItemGroup {
        uint        price;
        uint        tokenId;
        uint        tokenPrice;
        string      itemName;
        uint        itemQuantity;
        uint        itemTotalAmount;
        uint        itemRarity;
        uint        itemType;
    }

    address payable public                          addrAdmin;

    uint[] public                           itemQuantityLimit;
    // uint[][3] public                        itemIDs;

    // uint[][3] public                        availableItemIDs;

    // uint[][3] public                        itemIDsInChest;

    Item[]  public                          items;
    ItemGroup[] public                      itemGroups;

    address public                          addrChest;
    address public                          addrHero;

    mapping (uint256 => address) public     itemIndexToOwner;
    mapping (address => uint256) public     ownershipItemCount;
    mapping (uint256 => address) public     itemIndexToApproved;

    event Transfer(address from, address to, uint256 itemId);
    event ItemsCreated(uint itmeType, uint quantity);
    event ItemGroupCreated(string itemName, uint itemQuantity, uint itemRarity, uint itemType);

    /**
    * Constructor
    *
     */
    constructor() public
    {
        addrAdmin = msg.sender;

        itemQuantityLimit.push(PZ_ITEM_LIMIT_RARE);
        itemQuantityLimit.push(PZ_ITEM_LIMIT_EPIC);
        itemQuantityLimit.push(PZ_ITEM_LIMIT_LEGENDARY);
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
    }

    /**
    * Create ItemGroup as the Meta Information of Item NFT
    * @param _itemName                              Item Name
    * @param _itemQuantity                          Item Quantity
    * @param _itemRarity                            Item Rarity
    * @param _itemType                              Item Type
    *
     */
    function _createItemGroup(uint _price, uint _tokenId, uint _tokenPrice, string memory _itemName, uint _itemQuantity, uint _itemRarity, uint _itemType) internal {
        require((_itemType >= 0) && (_itemType <= 2));
        require(_itemQuantity > 0);

        itemGroups.push(ItemGroup(_price, _tokenId, _tokenPrice, _itemName, _itemQuantity, _itemQuantity, _itemRarity, _itemType));
        emit ItemGroupCreated(_itemName, _itemQuantity, _itemRarity, _itemType);
    }

    /**
    * Create Item NFT
    * @param _buyer                                 Buyer's address of Item
    * @param _itemType                              Item type
    * @param _itemRarity                            Item Rarity
    * @param _itemGroupID                           Item Group ID
    * @param _itemName                              Item Name
    *
     */
    function _createItem(address _buyer, uint _date, uint _price, uint _tokenId, uint _tokenPrice, uint _itemType, uint _itemRarity, uint _itemGroupID, string memory _itemName) internal{
        require((_itemType >= 0) && (_itemType <= 2));
        require(_buyer != address(0x0));

        Item memory _item = Item(_date, _price, _tokenId, _tokenPrice, _itemType, _itemRarity, _itemGroupID, _itemName);
        uint256 newItemId = items.push(_item) - 1;
        _transfer(address(0), _buyer, newItemId);
    }

    /**
    * Decrease the available quantity of Item group
    * @param _itemGroupId                            ItemGroup Id
    *
     */
    function _decreaseQuantityOfItemGroup(uint _itemGroupId) internal {
        ItemGroup memory _itemGroup = itemGroups[_itemGroupId];
        require(_itemGroup.itemQuantity > 0);
        itemGroups[_itemGroupId].itemQuantity = itemGroups[_itemGroupId].itemQuantity - 1;
    }

    /**
    * Transfer Item NFT
    * @param _from                          Address of transfer
    * @param _to                            Address of receiver
    * @param _itemId                        Item Id to be transferred
    *
     */
    function _transfer(address _from, address _to, uint256 _itemId) internal {
        ownershipItemCount[_to]++;
        itemIndexToOwner[_itemId] = _to;
        if (_from != address(0)) {
            ownershipItemCount[_from]--;
            delete itemIndexToApproved[_itemId];
        }

        emit Transfer(_from, _to, _itemId);
    }
}
