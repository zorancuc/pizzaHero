import React from 'react';
import TronLinkGuide from 'components/TronLinkGuide';
import TronWeb from 'tronweb';
import Utils from 'utils';
import Swal from 'sweetalert2';

import './App.scss';

const FOUNDATION_ADDRESS = 'TXWSjLQoCMB6CkEQf2y1wyeiUSBU7U5ekg';

const PZ_ITEM_GEAR = 0;
const PZ_ITEM_EMOTE = 1;

const PZ_ITEM_COMMON = 0;
const PZ_ITEM_UNCOMMON = 1;
const PZ_ITEM_RARE = 2;
const PZ_ITEM_EPIC = 3;
const PZ_ITEM_LEGENDARY = 4;

const PZ_TOKEN_ID = "1000027";

const ITEM_TYPE = ['Gear', 'Emote'];
const ITEM_RARITY = ['COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY'];

const TRAIT_COUNT = 14;
const HERO_CHARACTER = [
    'Gender',
    'Body',
    'Eye',
    'Mouth',
    'Ear',
    'Tail',
    'Pattern',
    'Wild1',
    'Wild2',
    'Primary Color',
    'Accent Color',
    'Pattern Color',
    'HairColor',
    'Eye Color'
];

const HERO_TRAITS_CODE = [
    ['M', 'F'],
    ['G', 'H', 'Z', 'X', '2', '4'],
    ['A', 'B', 'D', 'F', 'H', 'K', '2', '4', '6'],
    ['I', 'P', 'E', 'W', 'D', 'S', '5', '7', '9'],
    ['Y', 'K', 'L', 'R', '9', '4'],
    ['J', 'V', 'X', 'O', '2', '5'],
    ['Q', 'R', 'W', 'E', '4', '2'],
    ['X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'],
    ['X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'],
    ['Y', 'O', 'G', 'B', 'W', 'L', 'H', 'J', 'r', 'p', 'b', 'm'],
    ['Y', 'O', 'G', 'B', 'W', 'L', 'r', 'p', 'b'],
    ['Y', 'O', 'G', 'B', 'T', 'L', 'H', 'M', 'r', 'p', 'b', 'j'],
    ['Y', 'O', 'G', 'B', 'W', 'L', 'r', 'p', 'b'],
    ['Y', 'O', 'G', 'B', 'T', 'L', 'H', 'M', 'r', 'p', 'b', 'j']
];

const HERO_TRAITS_NAME = [
    [ 
        'Male', 
        'Femal'
    ],
    [
        'Calzone',
        'Hot Wing',
        'Mama Mia',
        'Breadstick',
        'Dough Boy',
        'Bagel Bite'
    ],
    [
        'Margarita',
        'Meatballs',
        'Cutie Pie',
        'Crusty',
        'Salty',
        'Olives',
        'Icey',
        'Soggy',
        'Undercooked'
    ],
    [
        'Sweet Tea',
        'Chompy',
        'Stale',
        'Saucy',
        'Cheeser',
        'Cutie Pie',
        'Garlic',
        'Stalemate',
        'Rustic'
    ],
    [   'Soggy', 
        'Fluffy', 
        'Deep Dish', 
        'Nibble', 
        'Shroomie', 
        'Mystic'
    ],
    [
        'Thin Crust',
        'Deep Dish',
        'Stinky Cheese',
        'Readymade',
        'Porkypie',
        'Mushroom'
    ],
    [   'Gumdrop', 
        'Moomoo', 
        'Boxer', 
        'Splatter', 
        'Time Traveler', 
        'Rawwr'
    ],
    [],
    [],
    [
        'Lemonade',
        'Orange Soda',
        'Cloudy',
        'Midnight',
        'Milk Shake',
        'Blue Rasberry',
        'Rocket',
        'Seahorse',
        'Grape Soda',
        'Rosie',
        'Stone Oven',
        'Leafy',
    ],
    [
        'Moonchild',
        'Strawberry Milk',
        'Macaron',
        'Vanilla',
        'Slime',
        'Earl Grey',
        'Sky',
        'Gummy',
        'Lemon Head',
    ],
    [
        'Sour Apple',
        'Cherry Tart',
        'Banana Pudding',
        'Blue Hawaiian',
        'Bubble Gum',
        'Jelly Bean',
        'Orange Cream',
        'Chocolate Brownie',
        'Rock Candy',
        'Blueberry Pie',
        'Cotton Candy',
        'Black Licorice'
    ],
    [
        'Jet',
        'Firebird',
        'Brown Sugar',
        'Cinnamon Spice',
        'Horchata',
        'Peanut Butter',
        'Pony',
        'Boquest',
        'Rasberry Jelly',
    ],
    [
        'Sour Apple',
        'Cherry Tart',
        'Banana Pudding',
        'Blue Hawaiian',
        'Bubble Gum',
        'Jelly Bean',
        'Orange Cream',
        'Chocolate Brownie',
        'Rock Candy',
        'Blueberry Pie',
        'Cotton Candy',
        'Black Licorice'
    ]
];

class App extends React.Component {
    state = {
        tronWeb: {
            installed: false,
            loggedIn: false
        },
        itemAmount: 0,
        itemGroupId: 0,
        chestAmount: 0,
        address: 0x0,
        balance: 0,
        tokenBalance : 0,
        tokenString: '',
        availableChests: [],
        chests: [],
        itemGroupString: '',
        chestGroupString: '',
        chestString: '',
        itemString: '',
        eggString: '',
        heroString: '',
        itemRarity: 0,
        itemName: '',
        itemQuantity: 0,
        chestName: '',
        chestQuantity: 0,
        chestPrice: 0,
        itemTRXPrice: 0,
        itemTokenPrice: 0,
        chestSlot: [],
        chestSlots: [],
        chestSlotString: '',
        itemTokenId: '',
        tokenId: '',
        tokenPrice: 0,
        chestId: 0,
        eggId: 0,
        heroId: 0,
        sireId: 0,
        itemId: 0,
        chestGroupId: 0,
        payment: 'TRX',
        chestToAddress: "TWrY88cShKxsn5j2bK4xrYQanGsN2VNcLi",
        eggToAddress: "TWrY88cShKxsn5j2bK4xrYQanGsN2VNcLi",
        heroToAddress: "TWrY88cShKxsn5j2bK4xrYQanGsN2VNcLi",
        itemToAddress: "TWrY88cShKxsn5j2bK4xrYQanGsN2VNcLi",
        itemSellPrice: 0,
        eggSellPrice: 0,
        heroSellPrice: 0,
        itemMarketplaceString: '',
        eggMarketplaceString: '',
        heroMarketplaceString: ''
    };

    constructor(props) {
        super(props);

        // this.onMessage = this.onMessageEdit.bind(this); this.onMessageSend =
        // this.onMessageSend.bind(this); this.onMessageTip =
        // this.onMessageTip.bind(this);

        this.onBuyItems = this.onBuyItems.bind(this);
        this.onItemGroupIDEdit = this.onItemGroupIDEdit.bind(this);
        this.onItemAmountEdit = this.onItemAmountEdit.bind(this);
        this.onChestAmountEdit = this.onChestAmountEdit.bind(this);
        this.onGetInfo = this.onGetInfo.bind(this);
        this.onGiftChest = this.onGiftChest.bind(this);
        this.onGiftEgg = this.onGiftEgg.bind(this);
        this.onGiftHero = this.onGiftHero.bind(this);
        this.onGiftItem = this.onGiftItem.bind(this);

        this.onSellItem = this.onSellItem.bind(this);
        this.onBuyItem = this.onBuyItem.bind(this);

        this.onSellEgg = this.onSellEgg.bind(this);
        this.onBuyEgg = this.onBuyEgg.bind(this);

        this.onSellHero = this.onSellHero.bind(this);
        this.onBuyHero = this.onBuyHero.bind(this);

        this.onSireHero = this.onSireHero.bind(this);
        this.onMatchHero = this.onMatchHero.bind(this);

        this.onItemSellPriceEdit = this.onItemSellPriceEdit.bind(this);
        this.onEggSellPriceEdit = this.onEggSellPriceEdit.bind(this);
        this.onHeroSellPriceEdit = this.onHeroSellPriceEdit.bind(this);

        this.onHeroIDEdit = this.onHeroIDEdit.bind(this);
        this.onSireIDEdit = this.onSireIDEdit.bind(this);
        this.onChestIDEdit = this.onChestIDEdit.bind(this);
        this.onTokenIDEdit = this.onTokenIDEdit.bind(this);
        this.onTokenPriceEdit = this.onTokenPriceEdit.bind(this);
        this.onEggIDEdit = this.onEggIDEdit.bind(this);
        this.onItemIDEdit = this.onItemIDEdit.bind(this);
        this.onHeroToAddressEdit = this.onHeroToAddressEdit.bind(this);
        this.onChestToAddressEdit = this.onChestToAddressEdit.bind(this);
        this.onEggToAddressEdit = this.onEggToAddressEdit.bind(this);
        this.onItemToAddressEdit = this.onItemToAddressEdit.bind(this);

        this.onAddSlot = this.onAddSlot.bind(this);
        this.onCreateItems = this.onCreateItems.bind(this);
        this.onRarityEdit = this.onRarityEdit.bind(this);
        this.onNameEdit = this.onNameEdit.bind(this);
        this.onQuantityEdit = this.onQuantityEdit.bind(this);

        this.onItemTRXPriceEdit = this.onItemTRXPriceEdit.bind(this);
        this.onItemTokenIDEdit = this.onItemTokenIDEdit.bind(this);
        this.onItemTokenPriceEdit = this.onItemTokenPriceEdit.bind(this);

        this.onChestPriceEdit = this.onChestPriceEdit.bind(this);
        this.onChestNameEdit = this.onChestNameEdit.bind(this);
        this.onChestQuantityEdit = this.onChestQuantityEdit.bind(this);
        this.onChestSlotEdit = this.onChestSlotEdit.bind(this);
        this.onChestGroupIDEdit = this.onChestGroupIDEdit.bind(this);
        this.onPaymentChange = this.onPaymentChange.bind(this);

        this.onBuyChest1 = this.onBuyChest1.bind(this);
        this.onCreateChest = this.onCreateChest.bind(this);
        this.onOpenChest = this.onOpenChest.bind(this);
        this.onOpenEgg = this.onOpenEgg.bind(this);
        // this.onTokenTest = this.onTokenTest.bind(this);
        this.onBreedHero = this.onBreedHero.bind(this);
    }

    async componentDidMount() {
        await new Promise((resolve) => {
            const tronWebState = {
                installed: !!window.tronWeb,
                loggedIn: window.tronWeb && window.tronWeb.ready
            };

            if (tronWebState.installed) {
                this.setState({ tronWeb: tronWebState });

                return resolve();
            }

            let tries = 0;

            const timer = setInterval(() => {
                if (tries >= 10) {
                    const TRONGRID_API = 'https://api.trongrid.io';

                    window.tronWeb = new TronWeb(
                        TRONGRID_API,
                        TRONGRID_API,
                        TRONGRID_API
                    );

                    this.setState({
                        tronWeb: {
                            installed: false,
                            loggedIn: false
                        }
                    });

                    clearInterval(timer);
                    return resolve();
                }

                tronWebState.installed = !!window.tronWeb;
                tronWebState.loggedIn = window.tronWeb && window.tronWeb.ready;

                if (!tronWebState.installed) return tries++;

                this.setState({ tronWeb: tronWebState });

                resolve();
            }, 100);
        });

        if (!this.state.tronWeb.loggedIn) {
            // Set default address (foundation address) used for contract calls Directly
            // overwrites the address object as TronLink disabled the function call
            window.tronWeb.defaultAddress = {
                hex: window.tronWeb.address.toHex(FOUNDATION_ADDRESS),
                base58: FOUNDATION_ADDRESS
            };

            window.tronWeb.on('addressChanged', (result) => {
                // console.log(result.base58);
                this.getAccountInfo(result.base58);
                // console.log("OKOKOK");
                if (this.state.tronWeb.loggedIn) return;

                this.setState({
                    tronWeb: {
                        installed: true,
                        loggedIn: true
                    }
                });
            });
        }

        await Utils.setTronWeb(window.tronWeb);

        this.startEventListener();
        await Utils.chestTest();
        await Utils.checkTotalSupply();
        await Utils.checkChestBalance('TXWSjLQoCMB6CkEQf2y1wyeiUSBU7U5ekg');
        await Utils.checkChestBalance('TWrY88cShKxsn5j2bK4xrYQanGsN2VNcLi');
        await Utils.checkChestBalance('TKfB91Xodm5rijBqUsXND5fz5M1Cu8tt9V');
        await Utils.checkChestBalance('TY8zdoWeJp7iZrybhM5brhzVSUAkZYC1Mj');
        await Utils.getAvailableItems();
        await Utils.chestsOfOwner('TKfB91Xodm5rijBqUsXND5fz5M1Cu8tt9V');
        await Utils.getChestInfoById(0);
        await this.getBoughtChests();
        await this.getBoughtItems();
        await this.getEggs();
        await this.getBoughtHeroes();
        await this.getInfo();
        await this.getMarketplaceItems();
        await this.getMarketplaceHeroes();
        await this.getMarketplaceEggs();
        // this.fetchMessages();
    }

    async getInfo() {
        console.log('Item Group Supply');
        let length = await Utils.pzItemContract.getItemGroupSupply().call();
        length = parseInt(length._hex, 16);
        console.log(length);
        let str = '';
        for (let i = 0; i < length; i++) {
            let itemGroupInfo = await Utils.pzItemContract.getItemGroup(i).call();
            str += "ItemGroupID: " + i + " " + JSON.stringify(itemGroupInfo) + '\n';
            console.log(itemGroupInfo);
        }
        console.log(str);
        this.setState({itemGroupString: str});

        console.log('Chest Group Supply');
        str = '';
        length = await Utils.pzChestContract.getChestGroupSupply().call();
        length = parseInt(length._hex, 16);
        console.log(length);
        for (let i = 0; i < length; i++) {
            let chestGroupInfo = await Utils.pzChestContract.getChestGroupById(i).call();
            str += "  ChestGroupID: " + i + " " + JSON.stringify(chestGroupInfo) + '\n';
            console.log(chestGroupInfo);
        }
        console.log(str);
        this.setState({chestGroupString: str});
    }

    // Polls blockchain for smart contract events
    startEventListener() {
        // Utils.pzChestContract.CreateChest().watch((err, { result }) => {
        //     if (err) return console.error('Failed to bind event listener:', err);

        //     console.log('Chest Created');
        //     console.log(result);
        // });
    }

    async getAccountInfo(address) {
        console.log(address);

        let accountInfo = await window.tronWeb.trx.getAccount(address);
        console.log(accountInfo);
        

        console.log(await window.tronWeb.trx.getAccount("TFf335okZGX1bkSiWZHLhdDDHaVNhrsFsh"));
        let balance = await window.tronWeb.trx.getBalance(address);

        balance = window.tronWeb.fromSun(balance);
        let tokenBalance = 0;
        let str = '';
        if (accountInfo.hasOwnProperty('assetV2')) {
            for (let i = 0; i < accountInfo.assetV2.length; i ++) {
                str += JSON.stringify(accountInfo.assetV2[i]) + '\n';
                console.log(accountInfo.assetV2[i]);
                // str += 
                if(accountInfo.assetV2[i].key === PZ_TOKEN_ID) {
                    tokenBalance = window.tronWeb.fromSun(accountInfo.assetV2[0].value);
                    break;
                }
            }
        }
        
        
        console.log(balance);
        console.log(tokenBalance);
        this.setState({ address: address, balance: balance, tokenBalance: tokenBalance, tokenString: str});
        return balance;
    }

    // async fetchMessages() {     this.setState({         messages: await
    // Utils.fetchMessages()     }); } async fetchMessage(messageID) {     const {
    // recent,         featured,         message     } = await
    // Utils.fetchMessage(messageID, this.state.messages);     this.setState({
    // messages: {             recent,             featured         }     }); return
    // message; }

    

    onPaymentChange({target: {
        value
    }}) {
        this.setState({payment: value});
    }

    onItemSellPriceEdit({target: {
            value
        }}) {
        this.setState({itemSellPrice: value});
    }

    onEggSellPriceEdit({target: {
            value
        }}) {
        this.setState({eggSellPrice: value});
    }

    onHeroSellPriceEdit({target: {
            value
        }}) {
        this.setState({heroSellPrice: value});
    }

    onChestNameEdit({target: {
            value
        }}) {
        this.setState({chestName: value});
    }

    onEggIDEdit({target: {
            value
        }}) {
        this.setState({eggId: value});
    }

    onChestIDEdit({target: {
            value
        }}) {
        this.setState({chestId: value});
    }

    onTokenIDEdit({target: {
        value
    }}) {
        this.setState({tokenId: value});
    }

    onTokenPriceEdit({target: {
        value
    }}) {
        this.setState({tokenPrice: value});
    }
    
    onItemIDEdit({target: {
            value
        }}) {
        this.setState({itemId: value});
    }

    onHeroIDEdit({target: {
            value
        }}) {
        this.setState({heroId: value});
    }

    onChestGroupIDEdit({target: {
            value
        }}) {
        this.setState({chestGroupId: value});
    }

    onItemAmountEdit({target: {
            value
        }}) {
        this.setState({itemAmount: value});
    }

    onItemGroupIDEdit({target: {
            value
        }}) {
        this.setState({itemGroupId: value});
    }

    onChestAmountEdit({target: {
            value
        }}) {
        this.setState({chestAmount: value});
    }
    
    onItemTRXPriceEdit({target: {
            value
        }}) {
        this.setState({itemTRXPrice: value});
    }

    onItemTokenIDEdit({target: {
            value
        }}) {
        this.setState({itemTokenId: value});
    }
    
    onItemTokenPriceEdit({target: {
            value
        }}) {
        this.setState({itemTokenPrice: value});
    }
    
    onSireIDEdit({target: {
            value
        }}) {
        this.setState({sireId: value});
    }

    onChestQuantityEdit({target: {
            value
        }}) {
        this.setState({chestQuantity: value});
    }

    onChestToAddressEdit({target: {
            value
        }}) {
        this.setState({chestToAddress: value});
    }

    onItemToAddressEdit({target: {
            value
        }}) {
        this.setState({itemToAddress: value});
    }

    onEggToAddressEdit({target: {
            value
        }}) {
        this.setState({eggToAddress: value});
    }

    onHeroToAddressEdit({target: {
        value
    }}) {
    this.setState({heroToAddress: value});
}

    onChestPriceEdit({target: {
            value
        }}) {
        this.setState({chestPrice: value});
    }

    onChestSlotEdit({target: {
            value
        }}) {
        this.setState({chestSlot: value});
    }

    onRarityEdit({target: {
            value
        }}) {
        this.setState({itemRarity: value});
    }

    onNameEdit({target: {
            value
        }}) {
        this.setState({itemName: value});
    }

    onQuantityEdit({target: {
            value
        }}) {
        this.setState({itemQuantity: value});
    }

    onCreateItems() {
        let name = this.state.itemName;
        let rarity = this.state.itemRarity;
        let quantity = this.state.itemQuantity;
        let trxPrice = this.state.itemTRXPrice;
        let itemTokenId = this.state.itemTokenId;
        let itemTokenPrice = this.state.itemTokenPrice;

        console.log(name);
        console.log(rarity);
        console.log(quantity);
        console.log(trxPrice);
        console.log(itemTokenId);
        console.log(itemTokenPrice);

        Utils.pzItemContract
            .createItemGroup(trxPrice * 1000000, itemTokenId, itemTokenPrice * 1000000, name, quantity, rarity, PZ_ITEM_GEAR)
            .send({ shouldPollResponse: true, callValue: 0 })
            .then((res) => Swal({ title: 'Create Items Succeed', type: 'success' }))
            .catch((err) => Swal({ title: 'Create Items Failed', type: 'error' }))
            .then(() => {
                console.log('OKOK');

                this.getInfo();
            });
    }

    onAddSlot() {
        let chestSlots = this.state.chestSlots;

        let chestSlot = this.state.chestSlot.split(',').map(Number);
        let chestSlotString = this.state.chestSlotString;
        chestSlots.push(chestSlot);
        chestSlotString += '[' + this.state.chestSlot + '] ';
        console.log(chestSlots);
        console.log(chestSlotString);
        console.log(this.state.chestSlots);
        this.setState({
            chestSlots: chestSlots,
            chestSlotString: chestSlotString
        })
    }

    onCreateChest() {
        let name = this.state.chestName;
        let quantity = this.state.chestQuantity;
        let price = this.state.chestPrice;
        let slots = this.state.chestSlots;
        var eggFlag = document.getElementById("eggFlag").checked;
        let tokenId = this.state.tokenId;
        let tokenPrice = this.state.tokenPrice;

        console.log(name);
        console.log(quantity);
        console.log(price);
        console.log(slots);
        console.log(eggFlag);
        console.log(tokenId);

        Utils.pzChestContract
            .createChestGroup(
                name,
                quantity,
                price * 1000000,
                tokenId,
                tokenPrice * 1000000,
                0,
                100,
                100,
                10, slots,
                eggFlag
            )
            .send({ shouldPollResponse: true, callValue: 0 })
            .then((res) => Swal({ title: 'Create Chest Succeed', type: 'success' }))
            .catch((err) => Swal({ title: 'Create Chest Failed', type: 'error' }))
            .then(() => {
                console.log('OKOK');
                this.getInfo();
            });

        this.setState({chestSlots: [], chestSlotString: ''});
    }

    async getAvailableChests() {
        let result = await Utils.chestsOfOwner(
            'TKfB91Xodm5rijBqUsXND5fz5M1Cu8tt9V'
        );
        this.setState({ availableChests: result });
        console.log(this.state.availableChests);
        return result;
    }

    async getBoughtChests() {
        let result = await Utils.chestsOfOwner(this.state.address);
        let str = '';
        result = result.ownerChests;
        console.log(result);
        this.setState({ chests: result.ownerChests });

        for (let i = 0; i < result.length; i++) {
            console.log(result[i]._hex);
            let chestInfo = await Utils.getChestInfoById(result[i]._hex);
            str +=
                chestInfo.name +
                ' #' +
                parseInt(result[i]._hex, 16) +
                ': ' +
                parseInt(chestInfo.price, 10) +
                '\n';
        }

        console.log(str);
        this.setState({ chestString: str });
        return result;
    }

    async getBoughtItems() {
        let result = await Utils.itemsOfOwner(this.state.address);
        let str = '';
        result = result.ownerItems;
        console.log(result);

        str += '';
        for (let i = 0; i < result.length; i++) {
            console.log(result[i]._hex);
            let itemInfo = await Utils.getItem(result[i]._hex);
            str +=
                ' ' + itemInfo.itemName + '#' +
                parseInt(result[i]._hex, 16) +
                ': ' +
                ITEM_TYPE[itemInfo.itemType] +
                ' ' +
                ITEM_RARITY[itemInfo.itemRarity] +
                '\n';
        }

        console.log(str);
        this.setState({ itemString: str });
        return result;
    }

    async getMarketplaceItems() {
        let result = await Utils.pzItemContract.getItemIdsOnSale().call();
        console.log("Items on Sale");
        console.log(result);
        let str = '';
        // result = result.ownerItems;
        // console.log(result);

        // str += 'Items ';
        for (let i = 0; i < result.length; i++) {
            console.log(result[i]._hex);
            let itemInfo = await Utils.pzItemContract.getItemAuctionByItemId(result[i]._hex).call();
            str +=
                ' #' +
                parseInt(result[i]._hex, 16) +
                ': ' +
                itemInfo.price / 1000000 + 
                '\n';
        }

        console.log(str);
        this.setState({ itemMarketplaceString: str });
        // return result;
    }

    async getMarketplaceHeroes() {
        let result = await Utils.pzHeroContract.getHeroIdsOnSale().call();
        console.log("Heroes on Sale");
        console.log(result);
        let str = '';
        // result = result.ownerItems;
        // console.log(result);

        // str += 'Items ';
        for (let i = 0; i < result.length; i++) {
            console.log(result[i]._hex);
            let heroInfo = await Utils.pzHeroContract.getHeroAuctionByheroId(result[i]._hex).call();
            str +=
                ' #' +
                parseInt(result[i]._hex, 16) +
                ': ' +
                heroInfo.price / 1000000 + 
                ' ' +
                heroInfo.auctionType + 
                '\n';
        }

        console.log(str);
        this.setState({ heroMarketplaceString: str });
        // return result;
    }

    async getMarketplaceEggs() {
        let result = await Utils.pzEggContract.getEggIdsOnSale().call();
        console.log("Eggs on Sale");
        console.log(result);
        let str = '';
        // result = result.ownerItems;
        // console.log(result);

        // str += 'Items ';
        for (let i = 0; i < result.length; i++) {
            console.log(result[i]._hex);
            let eggInfo = await Utils.pzEggContract.getEggAuctionByEggId(result[i]._hex).call();
            str +=
                ' #' +
                parseInt(result[i]._hex, 16) +
                ': ' +
                eggInfo.price / 1000000 + 
                '\n';
        }

        console.log(str);
        this.setState({ eggMarketplaceString: str });
        // return result;
    }

    async getBoughtHeroes() {
        let result = await Utils.heroesOfOwner(this.state.address);
        let str = '';
        result = result.ownerHeroes;
        console.log(result);

        str += '';
        for (let i = 0; i < result.length; i++) {
            console.log(result[i]._hex);
            let heroInfo = await Utils.getHero(result[i]._hex);
            console.log(heroInfo);
            str += ' #' + parseInt(result[i]._hex, 16) + ': '; // + heroInfo.genes + '\n';

            var traits = await Utils.pzHeroContract
                .getHeroTraits(result[i]._hex)
                .call();
            console.log('length: ' + traits.length + '\n');
            console.log('Trait is: \n');
            console.log(traits);
            console.log('\n');

            let appearance = [];

            for (let i = 0; i < 14; i++) {
                appearance[i] = traits[i * 4];
                console.log(
                    HERO_CHARACTER[i] + ': ' + HERO_TRAITS_NAME[i][appearance[i]]
                );
                // str += traits[i*4]%6; str += traits[i*4+1]%6; str += traits[i*4+2]%6; str +=
                // traits[i*4+3]%6;

                str += HERO_TRAITS_CODE[i][traits[i * 4] % 6];
                str += HERO_TRAITS_CODE[i][traits[i * 4 + 1] % 6];
                str += HERO_TRAITS_CODE[i][traits[i * 4 + 2] % 6];
                str += HERO_TRAITS_CODE[i][traits[i * 4 + 3] % 6];
            }

            console.log(appearance);
        }

        console.log(str);
        this.setState({ heroString: str });
        return result;
    }

    async getEggs() {
        let result = await Utils.eggsOfOwner(this.state.address);
        let str = '';
        result = result.ownerEggs;
        console.log(result);

        str += '';
        for (let i = 0; i < result.length; i++) {
            console.log(result[i]._hex);
            let eggInfo = await Utils.getEgg(result[i]._hex);
            str +=
                ' #' +
                parseInt(result[i]._hex, 16) +
                ': MatronId ' +
                eggInfo.matronId +
                ' SireId ' +
                eggInfo.sireId +
                '\n';
        }

        console.log(str);
        this.setState({ eggString: str });
        return result;
    }

    async onGetInfo() {
        await this.getInfo();
    }
    async onOpenEgg() {
        // let result = await Utils.eggsOfOwner(this.state.address);
        // result = result.ownerEggs;
        // console.log("EggID:" + result[0]._hex);

        // let eggInfo = await Utils.getEgg(result[0]._hex);
        // console.log(eggInfo);
        let eggId = this.state.eggId;
        await Utils.pzEggContract
            .giveBirth(eggId)
            .send({ shouldPollResponse: true, callValue: 0 });
        
        console.log(await this.getEggs());
        console.log(await this.getBoughtHeroes());
    }

    async onGiftEgg() {
        // let result = await Utils.eggsOfOwner(this.state.address);
        // result = result.ownerEggs;
        // console.log("EggID:" + result[0]._hex);

        // let eggInfo = await Utils.getEgg(result[0]._hex);
        // console.log(eggInfo);
        let eggId = this.state.eggId;
        let addressTo = this.state.eggToAddress;
        await Utils.pzEggContract
            .giftEgg(addressTo, eggId)
            .send({ shouldPollResponse: true, callValue: 0 });
        
        console.log(await this.getEggs());
        console.log(await this.getBoughtHeroes());
    }
    
    async onBreedHero() {
        let heroId = this.state.heroId;
        let sireId = this.state.sireId;
        let price = this.state.heroSellPrice;
        await Utils.pzHeroContract
            .breedWithOwned( heroId, sireId)
            .send({ shouldPollResponse: true, callValue: price * 1000000 });
        
            console.log(await this.getBoughtHeroes());
        await this.getMarketplaceHeroes();
    }

    // async onTokenTest() {
    //     console.log("OKOK");
    //     await Utils.pzTokenContract.msgTokenValueAndTokenId().send({shouldPollResponse: true, tokenValue: 100000000, tokenId:"1000024"});
    //     // await window.tronWeb.trx.sendAsset("TWZM2fmu8fGZjhK1TRjHmDUMjdiS6RLj5J", 100000000, "1000024");
    // }

    async onGiftHero() {
        // let result = await Utils.eggsOfOwner(this.state.address);
        // result = result.ownerEggs;
        // console.log("EggID:" + result[0]._hex);

        // let eggInfo = await Utils.getEgg(result[0]._hex);
        // console.log(eggInfo);
        let heroId = this.state.heroId;
        let addressTo = this.state.heroToAddress;
        await Utils.pzHeroContract
            .giftHero(addressTo, heroId)
            .send({ shouldPollResponse: true, callValue: 0 });
        
        console.log(await this.getBoughtHeroes());
    }

    async onGiftItem() {
        // let result = await Utils.eggsOfOwner(this.state.address);
        // result = result.ownerEggs;
        // console.log("EggID:" + result[0]._hex);

        // let eggInfo = await Utils.getEgg(result[0]._hex);
        // console.log(eggInfo);
        let itemId = this.state.itemId;
        let addressTo = this.state.itemToAddress;
        await Utils.pzItemContract.giftItem(addressTo, itemId)
            .send({ shouldPollResponse: true, callValue: 0 });
        
        console.log(await this.getBoughtItems());
    }

    
    async onSireHero() {
        // let result = await Utils.eggsOfOwner(this.state.address);
        // result = result.ownerEggs;
        // console.log("EggID:" + result[0]._hex);

        // let eggInfo = await Utils.getEgg(result[0]._hex);
        // console.log(eggInfo);
        let heroId = this.state.heroId;
        let price = this.state.heroSellPrice;
        await Utils.pzHeroContract
            .addAuction(price * 1000000, heroId, 1)
            .send({ shouldPollResponse: true, callValue: 0 });
        
        console.log(await this.getBoughtHeroes());
        await this.getMarketplaceHeroes();
    }

    async onMatchHero() {
        // let result = await Utils.eggsOfOwner(this.state.address);
        // result = result.ownerEggs;
        // console.log("EggID:" + result[0]._hex);

        // let eggInfo = await Utils.getEgg(result[0]._hex);
        // console.log(eggInfo);
        let heroId = this.state.heroId;
        let sireId = this.state.sireId;
        let price = this.state.heroSellPrice;
        await Utils.pzHeroContract
            .bidSire( heroId, sireId)
            .send({ shouldPollResponse: true, callValue: price * 1000000 });
        
            console.log(await this.getBoughtHeroes());
        await this.getMarketplaceHeroes();
    }

    async onSellHero() {
        // let result = await Utils.eggsOfOwner(this.state.address);
        // result = result.ownerEggs;
        // console.log("EggID:" + result[0]._hex);

        // let eggInfo = await Utils.getEgg(result[0]._hex);
        // console.log(eggInfo);
        let heroId = this.state.heroId;
        let price = this.state.heroSellPrice;
        await Utils.pzHeroContract
            .addAuction(price * 1000000, heroId, 0)
            .send({ shouldPollResponse: true, callValue: 0 });
        
        console.log(await this.getBoughtHeroes());
        await this.getMarketplaceHeroes();
    }

    async onBuyHero() {
        // let result = await Utils.eggsOfOwner(this.state.address);
        // result = result.ownerEggs;
        // console.log("EggID:" + result[0]._hex);

        // let eggInfo = await Utils.getEgg(result[0]._hex);
        // console.log(eggInfo);
        let heroId = this.state.heroId;
        let price = this.state.heroSellPrice;
        await Utils.pzHeroContract
            .bidAuction( heroId)
            .send({ shouldPollResponse: true, callValue: price * 1000000 });
        
            console.log(await this.getBoughtHeroes());
        await this.getMarketplaceHeroes();
    }

    async onSellEgg() {
        // let result = await Utils.eggsOfOwner(this.state.address);
        // result = result.ownerEggs;
        // console.log("EggID:" + result[0]._hex);

        // let eggInfo = await Utils.getEgg(result[0]._hex);
        // console.log(eggInfo);
        let eggId = this.state.eggId;
        let price = this.state.eggSellPrice;
        await Utils.pzEggContract
            .addAuction(price * 1000000, eggId)
            .send({ shouldPollResponse: true, callValue: 0 });
        
        console.log(await this.getEggs());
        await this.getMarketplaceEggs();
    }

    async onBuyEgg() {
        // let result = await Utils.eggsOfOwner(this.state.address);
        // result = result.ownerEggs;
        // console.log("EggID:" + result[0]._hex);

        // let eggInfo = await Utils.getEgg(result[0]._hex);
        // console.log(eggInfo);
        let eggId = this.state.eggId;
        let price = this.state.eggSellPrice;
        await Utils.pzEggContract
            .bidAuction( eggId)
            .send({ shouldPollResponse: true, callValue: price * 1000000 });
        
        console.log(await this.getEggs());
        await this.getMarketplaceEggs();
    }

    async onSellItem() {
        // let result = await Utils.eggsOfOwner(this.state.address);
        // result = result.ownerEggs;
        // console.log("EggID:" + result[0]._hex);

        // let eggInfo = await Utils.getEgg(result[0]._hex);
        // console.log(eggInfo);
        let itemId = this.state.itemId;
        let price = this.state.itemSellPrice;
        await Utils.pzItemContract
            .addAuction(price * 1000000, itemId)
            .send({ shouldPollResponse: true, callValue: 0 });
        
        console.log(await this.getBoughtItems());
        await this.getMarketplaceItems();
    }

    async onBuyItem() {
        // let result = await Utils.eggsOfOwner(this.state.address);
        // result = result.ownerEggs;
        // console.log("EggID:" + result[0]._hex);

        // let eggInfo = await Utils.getEgg(result[0]._hex);
        // console.log(eggInfo);
        let itemId = this.state.itemId;
        let price = this.state.itemSellPrice;
        await Utils.pzItemContract
            .bidAuction(itemId)
            .send({ shouldPollResponse: true, callValue: price * 1000000 });
        
        console.log(await this.getBoughtItems());
        await this.getMarketplaceItems();
    }
    
    async onOpenChest() {
        // let result = await Utils.chestsOfOwner(this.state.address);
        // let str = '';
        // result = result.ownerChests;
        // console.log(result);
        // console.log(result[0]._hex);
        // let chestInfo = await Utils.getChestInfoById(result[0]._hex);
        let chestId = this.state.chestId;
        await Utils.pzChestContract
            .openChest(chestId).send({ shouldPollResponse: true, callValue: 0 });

        // let itemId = chestInfo.itemId;
        // let item = await Utils.pzItemContract.getItem(itemId);
        // console.log(item);

        console.log(await this.getBoughtChests());
        console.log(await this.getBoughtItems());
        console.log(await this.getEggs());
    }

    async onGiftChest() {
        let chestId = this.state.chestId;
        let addressTo = this.state.chestToAddress;
        await Utils.pzChestContract
            .giftChest(addressTo, chestId).send({ shouldPollResponse: true, callValue: 0 });

        // let itemId = chestInfo.itemId;
        // let item = await Utils.pzItemContract.getItem(itemId);
        // console.log(item);

        console.log(await this.getBoughtChests());
        console.log(await this.getBoughtItems());
        console.log(await this.getEggs());
    }

    
    async onBuyItems() {
        // await this.getAvailableChests();
        // console.log(this.state.availableChests);
        // let chests = [];
        // chests = this.state.availableChests.ownerChests;
        // console.log(chests);

        let i;
        let itemGroupId = this.state.itemGroupId;
        
        // console.log('Chest Group Supply');
        // let length = await Utils.pzChestContract.getChestGroupSupply().call();
        // length = parseInt(length._hex, 16);
        // console.log(length);
        // for (i = 0; i < length; i++) {
        //     let chestGroupInfo = await Utils.pzChestContract.getChestGroupById(i).call();
        //     console.log(parseInt(chestGroupInfo.price, 10));
        //     if (parseInt(chestGroupInfo.price, 10) == 50 * 1000000) {
        //         console.log(parseInt(chestGroupInfo.price, 10));
        //         console.log(i);
        //         break;
        //     }
        // }
        let itemGroupInfo = await Utils.pzItemContract.getItemGroup(itemGroupId).call();
        let price = parseInt(itemGroupInfo.price, 10);
        let tokenPrice = parseInt(itemGroupInfo.tokenPrice, 10);
        let tokenId = itemGroupInfo.tokenId;
        let itemAmount = this.state.itemAmount;
        console.log("ID: " + itemGroupId);
        console.log(this.state.payment);
        console.log(price);
        console.log(itemAmount);
        
        if (this.state.payment === 'TRX') {
            await Utils.pzItemContract
                .buyItems(itemGroupId, FOUNDATION_ADDRESS, itemAmount, true)
                .send({ shouldPollResponse: true, callValue: price * itemAmount });
        } else if (this.state.payment === 'EVO') {
            await Utils.pzItemContract
                .buyItems(itemGroupId, FOUNDATION_ADDRESS, itemAmount, false)
                .send({ shouldPollResponse: true, tokenValue: tokenPrice * itemAmount, tokenId: tokenId});
        }
    
        // console.log(await this.getBoughtChests());
    }

    async onBuyChest1() {
        // await this.getAvailableChests();
        // console.log(this.state.availableChests);
        // let chests = [];
        // chests = this.state.availableChests.ownerChests;
        // console.log(chests);

        let i;
        let chestGroupId = this.state.chestGroupId;
        
        // console.log('Chest Group Supply');
        // let length = await Utils.pzChestContract.getChestGroupSupply().call();
        // length = parseInt(length._hex, 16);
        // console.log(length);
        // for (i = 0; i < length; i++) {
        //     let chestGroupInfo = await Utils.pzChestContract.getChestGroupById(i).call();
        //     console.log(parseInt(chestGroupInfo.price, 10));
        //     if (parseInt(chestGroupInfo.price, 10) == 50 * 1000000) {
        //         console.log(parseInt(chestGroupInfo.price, 10));
        //         console.log(i);
        //         break;
        //     }
        // }
        let chestGroupInfo = await Utils.pzChestContract.getChestGroupById(chestGroupId).call();
        let price = parseInt(chestGroupInfo.price, 10);
        let tokenPrice = parseInt(chestGroupInfo.tokenPrice, 10);
        let tokenId = chestGroupInfo.tokenId;
        let chestAmount = this.state.chestAmount;
        console.log("ID: " + chestGroupId);
        console.log(this.state.payment);
        console.log(price);
        
        if (this.state.payment === 'TRX') {
            await Utils.pzChestContract
                .buyChest(chestGroupId, FOUNDATION_ADDRESS, chestAmount, true)
                .send({ shouldPollResponse: true, callValue: price * chestAmount });
        } else if (this.state.payment === 'EVO') {
            await Utils.pzChestContract
                .buyChest(chestGroupId, FOUNDATION_ADDRESS, chestAmount, false)
                .send({ shouldPollResponse: true, tokenValue: tokenPrice * chestAmount, tokenId: tokenId});
        }
    
        console.log(await this.getBoughtChests());
    }

    renderMessageInput() {
        if (!this.state.tronWeb.installed) return <TronLinkGuide / > ;

        if (!this.state.tronWeb.loggedIn) return <TronLinkGuide installed / > ;

        return ( 
            <div>
                <div> { this.state.address } </div> 
                <div > { this.state.balance } TRX </div>
                <div > { this.state.tokenBalance } PZTT </div>
                {/* <div > { this.state.tokenString } </div> */}
                {/* <br/> */}

                <div className = "footer" >
                    <input readOnly value="Rarity:" style={{width: "80px"}}></input>
                    <input
                        type='number'
                        value={this.state.itemRarity}
                        onChange={this.onRarityEdit}></input>

                    {/* <br/> */}

                    <input readOnly value="Name:" style={{width: "80px"}}></input>
                    <input
                        value={this.state.itemName}
                        onChange={this.onNameEdit}></input>

                    {/* <br/> */}

                    <input readOnly value="Quantity:" style={{width: "80px"}}></input>
                    <input
                        type='number'
                        value={this.state.itemQuantity}
                        style={{marginRight:"15px"}}
                        onChange={this.onQuantityEdit}></input>
                    <br/>


                    <input readOnly value="ItemPrice:" style={{width: "80px"}}></input>
                    <input
                        type='number'
                        value={this.state.itemTRXPrice}
                        onChange={this.onItemTRXPriceEdit}></input>
                    {/* <br/> */}

                    <input readOnly value="Token Id:" style={{width: "100px"}}></input>
                    <input
                        value={this.state.itemTokenId}
                        onChange={this.onItemTokenIDEdit}
                        style={{marginRight: "20px"}}
                    >
                    </input>

                    <input readOnly value="Token Price:" style={{width: "150px"}}></input>
                    <input
                        value={this.state.itemTokenPrice}
                        onChange={this.onItemTokenPriceEdit}
                        style={{marginRight: "20px"}}
                    >
                    </input>

                    <div className = { 'createTestItems4' }
                        onClick = { this.onCreateItems } >
                        Create Items
                    </div>

                    <div className = { 'itemGroupString' } >
                        {this.state.itemGroupString } 
                    </div>
                </div>

                <div className = "footer"> 

                    <input readOnly value="ItemGroupID:" style={{width: "130px"}}></input>
                    <input
                        value={this.state.itemGroupId}
                        onChange={this.onItemGroupIDEdit}
                        style={{marginRight: "20px"}}
                    >
                    </input>

                    <select onChange={this.onPaymentChange} value={this.state.payment} style={{marginRight: "20px"}}>
                        <option value="TRX">TRX</option>
                        <option value="EVO">EVO</option>
                        {this.state.payment}
                    </select>

                    <input readOnly value="Item Amount:" style={{width: "150px"}}></input>
                    <input
                        value={this.state.itemAmount}
                        onChange={this.onItemAmountEdit}
                        style={{marginRight: "20px"}}
                    >
                    </input>

                    <div className = { 'buyItem' }
                        onClick = { this.onBuyItems } >
                        BUY ITEM
                    </div>

                </div>

                <br/>
                <div className = "footer"> 
                    <input readOnly value="Name:" style={{width: "80px"}}></input>
                    <input
                        value={this.state.chestName}
                        onChange={this.onChestNameEdit}></input>
                    {/* <br/> */}

                    <input readOnly value="Quantity:" style={{width: "80px"}}></input>
                    <input
                        type='number'
                        value={this.state.chestQuantity}
                        onChange={this.onChestQuantityEdit}></input>
                    <br/>

                    <input readOnly value="Price:" style={{width: "80px"}}></input>
                    <input
                        type='number'
                        value={this.state.chestPrice}
                        onChange={this.onChestPriceEdit}></input>
                    {/* <br/> */}

                    <label>Egg:</label><input type="checkbox" id="eggFlag"></input>

                    <input readOnly value="Slot:" style={{width: "80px"}}></input>
                    <input
                        value={this.state.chestSlot}
                        style={{marginRight:"15px"}}
                        onChange={this.onChestSlotEdit}></input>

                    
                    <div className = { 'addSlot' }
                        onClick = { this.onAddSlot } >
                        +
                    </div>
                    <div className = { 'chestSlotString' } > 
                        { this.state.chestSlotString } 
                    </div>

                    <input readOnly value="Token Id:" style={{width: "100px"}}></input>
                    <input
                        value={this.state.tokenId}
                        onChange={this.onTokenIDEdit}
                        style={{marginRight: "20px"}}
                    >
                    </input>

                    <input readOnly value="Token Price:" style={{width: "150px"}}></input>
                    <input
                        value={this.state.tokenPrice}
                        onChange={this.onTokenPriceEdit}
                        style={{marginRight: "20px"}}
                    >
                    </input>

                    <div className = { 'createChestButton1' }
                        onClick = { this.onCreateChest } >
                        Create Chests
                    </div>

                    <div className = { 'chestGroupString' } >
                        {this.state.chestGroupString } 
                    </div>
                    
                </div>
            

                <div className = "footer"> 

                    <input readOnly value="ChestGroupID:" style={{width: "130px"}}></input>
                    <input
                        value={this.state.chestGroupId}
                        onChange={this.onChestGroupIDEdit}
                        style={{marginRight: "20px"}}
                    >
                    </input>

                    <select onChange={this.onPaymentChange} value={this.state.payment} style={{marginRight: "20px"}}>
                        <option value="TRX">TRX</option>
                        <option value="EVO">EVO</option>
                        {this.state.payment}
                    </select>

                    <input readOnly value="Chest Amount:" style={{width: "150px"}}></input>
                    <input
                        value={this.state.chestAmount}
                        onChange={this.onChestAmountEdit}
                        style={{marginRight: "20px"}}
                    >
                    </input>

                    <div className = { 'buyChest1' }
                        onClick = { this.onBuyChest1 } >
                        BUY CHEST
                    </div>

                </div>
                
                <div className = { 'chestString' } > 
                    { this.state.chestString } 
                </div>
                
                <div className = "footer">

                    <input readOnly value="Chest ID:" style={{width: "80px"}}></input>
                    <input
                        type='number'
                        value={this.state.chestId}
                        style={{marginRight:"15px"}}
                        onChange={this.onChestIDEdit}></input>
                    
                    <input readOnly value=" To:" style={{width: "80px"}}></input>
                    <input
                        // type='number'
                        value={this.state.chestToAddress}
                        style={{marginRight:"15px"}}
                        onChange={this.onChestToAddressEdit}></input>
                        
                    <div className = { 'openChest' }
                        onClick = { this.onOpenChest } >
                        Open Chest
                    </div>

                    <div className = { 'giftChest' }
                        onClick = { this.onGiftChest } >
                        Gift Chest
                    </div>
                </div>
                
                <div className = { 'itemString' }> 
                    { this.state.itemString }
                </div> 
                
                <div className = "footer">
                    <input readOnly value="Item ID:" style={{width: "80px"}}></input>
                    <input
                        type='number'
                        value={this.state.itemId}
                        style={{marginRight:"15px"}}
                        onChange={this.onItemIDEdit}></input>
                        
                    <input readOnly value=" To:" style={{width: "80px"}}></input>
                    <input
                        // type='number'
                        value={this.state.itemToAddress}
                        style={{marginRight:"15px"}}
                        onChange={this.onItemToAddressEdit}></input>

                    <div className = { 'giftItem'}
                        onClick = { this.onGiftItem } style={{marginRight:"15px"}}>
                        Gift Item 
                    </div>

                    <input readOnly value="Price:" style={{width: "80px"}}></input>
                    <input
                        // type='number'
                        value={this.state.itemSellPrice}
                        style={{marginRight:"15px"}}
                        onChange={this.onItemSellPriceEdit}></input>

                    <div className = { 'sellItem'}
                        onClick = { this.onSellItem }
                        style={{marginRight:"15px"}}>
                        Sell Item 
                    </div>

                    <div className = { 'sellItem'}
                        onClick = { this.onBuyItem }>
                        Buy Item 
                    </div>
                </div>
                
                <div className = { 'eggString' }>
                    { this.state.eggString } 
                </div>
                
                <br/>
                
                <div className = "footer">
                    <input readOnly value="Egg ID:" style={{width: "80px"}}></input>
                    <input
                        type='number'
                        value={this.state.eggId}
                        style={{marginRight:"15px"}}
                        onChange={this.onEggIDEdit}></input>
                        
                    <input readOnly value=" To:" style={{width: "80px"}}></input>
                    <input
                        // type='number'
                        value={this.state.eggToAddress}
                        style={{marginRight:"15px"}}
                        onChange={this.onEggToAddressEdit}></input>

                    <div className = { 'openEgg'}
                        onClick = { this.onOpenEgg }>
                        Open Egg 
                    </div>

                    <div className = { 'giftEgg'}
                        onClick = { this.onGiftEgg }
                        style={{marginRight:"15px"}}>
                        Gift Egg 
                    </div>

                    <input readOnly value="Price:" style={{width: "80px"}}></input>
                    <input
                        // type='number'
                        value={this.state.eggSellPrice}
                        style={{marginRight:"15px"}}
                        onChange={this.onEggSellPriceEdit}></input>

                    <div className = { 'sellItem'}
                        onClick = { this.onSellEgg }
                        style={{marginRight:"15px"}}>
                        Sell Egg
                    </div>

                    <div className = { 'sellItem'}
                        onClick = { this.onBuyEgg }>
                        Buy Egg 
                    </div>
                </div>

                <br/>
                
                <div className = { 'heroString' } >
                    {this.state.heroString } 
                </div>
                
                <div className = "footer">

                    <input readOnly value="Hero ID:" style={{width: "80px"}}></input>
                    <input
                        type='number'
                        value={this.state.heroId}
                        style={{marginRight:"15px"}}
                        onChange={this.onHeroIDEdit}></input>
                    
                    <input readOnly value=" To:" style={{width: "80px"}}></input>
                    <input
                        // type='number'
                        value={this.state.heroToAddress}
                        style={{marginRight:"15px"}}
                        onChange={this.onHeroToAddressEdit}></input>
                        
                    {/* <div className = { 'openChest' }
                        onClick = { this.onOpenChest } >
                        Open Chest
                    </div> */}

                    <div className = { 'giftHero' }
                        onClick = { this.onGiftHero } 
                        style={{marginRight:"15px"}}>
                        Gift Hero
                    </div>

                    <input readOnly value="Price:" style={{width: "80px"}}></input>
                    <input
                        // type='number'
                        value={this.state.heroSellPrice}
                        style={{marginRight:"15px"}}
                        onChange={this.onHeroSellPriceEdit}></input>

                    <div className = { 'sellItem'}
                        onClick = { this.onSellHero }
                        style={{marginRight:"15px"}}>
                        Sell Hero
                    </div>

                    <div className = { 'sellItem'}
                        onClick = { this.onBuyHero }
                        style={{marginRight:"15px"}}>
                        Buy Hero 
                    </div>
                    
                    <input readOnly value="Sire ID:" style={{width: "80px"}}></input>
                    <input
                        type='number'
                        value={this.state.sireId}
                        style={{marginRight:"15px"}}
                        onChange={this.onSireIDEdit}></input>

                    <div className = { 'sellItem'}
                        onClick = { this.onSireHero }
                        style={{marginRight:"15px"}}>
                        Sire Hero
                    </div>

                    <div className = { 'sellItem'}
                        onClick = { this.onMatchHero }>
                        Match Hero 
                    </div>

                    <div className = { 'sellItem'}
                        onClick = { this.onBreedHero }>
                        Breed Hero 
                    </div>

                    {/* <div className = { 'sellItem'}
                        onClick = { this.onTokenTest }>
                        Token Test
                    </div> */}

                </div>

                <br/>
                
                {/* <div className = "footer">
                    <div className = { 'getInfo' }
                        onClick = { this.onGetInfo } >
                        Get Info
                    </div> 
                </div> */}

                <div>
                    Item Marketplace:
                </div>

                <div className = { 'itemMarketplaceString' } >
                    {this.state.itemMarketplaceString } 
                </div>
                <br/>

                <div>
                    Egg Marketplace:
                </div>
                <div className = { 'eggMarketplaceString' } >
                    {this.state.eggMarketplaceString } 
                </div>
                <br/>

                <div>
                    Hero Marketplace:
                </div>
                <div className = { 'heroMarketplaceString' } >
                    {this.state.heroMarketplaceString } 
                </div>
                <br/>

            </div>
        );
    }

    render() {
        // const {     recent,     featured } = this.state.messages; const messages =
        // Object.entries(recent).sort((a, b) => b[1].timestamp - a[1].timestamp).map(([
        // messageID, message ]) => (     <Message         message={ message }
        // featured={ featured.includes(+messageID) }         key={ messageID }
        // messageID={ messageID }         tippable={ message.owner !==
        // Utils.tronWeb.defaultAddress.base58 }         requiresTronLink={
        // !this.state.tronWeb.installed }         onTip={ this.onMessageTip } /> ));

        return <div className = "kontainer" > { this.renderMessageInput() } </div>;
    }
}

export default App;