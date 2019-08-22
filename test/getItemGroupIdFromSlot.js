var PZItemCore = artifacts.require("./PZItemCore.sol");
var PZHeroCore = artifacts.require("./PZHeroCore.sol");
var PZChest = artifacts.require("./PZChest.sol");
var pzItem;
var pzHero;
var pzChest;


var PZ_ITEM_GEAR = 0;
var PZ_ITEM_EMOTE = 1;

var PZ_ITEM_COMMON = 0;
var PZ_ITEM_UNCOMMON = 1;
var PZ_ITEM_RARE = 2;
var PZ_ITEM_EPIC = 3;
var PZ_ITEM_LEGENDARY = 4;

var rarityString = ["COMMON", "UNCOMMON", "RARE", "EPIC", "LEGENDARY"];
contract('Chest Test', function(accounts) {
    console.log(accounts);

    describe('PZChest Contract Test', () => {
        it('Deployed OK', async() => {
            pzItem = await PZItemCore.deployed();
            pzHero = await PZHeroCore.deployed();
            pzChest = await PZChest.deployed();

            console.log(pzItem.address);
            console.log(pzHero.address);
            console.log(pzChest.address);
        });

        it('TEST OK', async() => {
            var testStr = await pzChest.chestTest();
            console.log(testStr);
        });

        it('Create Items OK', async() => {
            // var watcher = pzItem.ItemsCreated();
            await pzItem.createItemGroup('TEST1', 10, PZ_ITEM_RARE, PZ_ITEM_GEAR);
            await pzItem.createItemGroup('TEST2', 10, PZ_ITEM_UNCOMMON, PZ_ITEM_GEAR);
            await pzItem.createItemGroup('TEST3', 10, PZ_ITEM_COMMON, PZ_ITEM_GEAR);
            await pzItem.createItemGroup('TEST4', 10, PZ_ITEM_LEGENDARY, PZ_ITEM_GEAR);
            await pzItem.createItemGroup('TEST5', 10, PZ_ITEM_EPIC, PZ_ITEM_GEAR);
            // await pzItem.createItemGroup('TEST6', 10, PZ_ITEM_LEGENDARY, PZ_ITEM_GEAR);
            // await pzItem.createItemGroup('TEST7', 10, PZ_ITEM_COMMON, PZ_ITEM_GEAR);
            // await pzItem.createItemGroup('TEST8', 10, PZ_ITEM_LEGENDARY, PZ_ITEM_GEAR);
            // await pzItem.createItemGroup('TEST9', 10, PZ_ITEM_EPIC, PZ_ITEM_GEAR);
            // await pzItem.createItemGroup('TEST9', 10, PZ_ITEM_UNCOMMON, PZ_ITEM_GEAR);

            console.log('Item Group Supply');
            let length = await pzItem.getItemGroupSupply();
            // length = parseInt(length._hex, 16);
            // console.log(length);
            // for (let i = 0; i < length; i++) {
            //     console.log(await pzItem.getItemGroup(i));
            // }

        });

        it('Open Item Slot By Ranomly generated number', async() => {

            console.log("\n------- Open Item Slot Test with Randomly Generated Number -------");
            let result = await pzChest._getItemGroupIdFromSlot(0, [0, 2, 4]);
            // console.log(result);
            console.log(result);

            result = await pzChest._getItemGroupIdFromSlot(1, [0, 1, 2]);
            // console.log(result);
            console.log(result);

            result = await pzChest._getItemGroupIdFromSlot(2, [0, 3]);
            // console.log(result);
            console.log(result);

            console.log("\n------- Open Item Slot Test with Randomly Generated Number -------");
        });

        it('Open Item Slot By Ranomly generated number', async() => {

            console.log("\n------- Open Item Slot Test with Randomly Generated Number -------");
            let result = await pzChest.getItemGroupIdFromSlotToTest([0, 1, 2, 3, 4]);
            // console.log(result);
            console.log("Items in Slot: RARE, UNCOMMON, COMMON, LEGENDARY, EPIC\n");
            console.log("ItemGroup is Found?: " + result._bFind);
            console.log("Random Number generated for chance of item rarity:" + result._rand);
            console.log("Item To Be Created:" + rarityString[getRarityByChance(result._rand)]);
            console.log("Item Created:" + rarityString[result._itemRarity]);
            console.log("Item Group Number:" + result._itemGroupId);
            console.log("\n");

            result = await pzChest.getItemGroupIdFromSlotToTest([0, 1, 4]);
            // console.log(result);
            console.log("Items in Slot: RARE, UNCOMMON, EPIC\n");
            console.log("ItemGroup is Found?: " + result._bFind);
            console.log("Random Number generated for chance of item rarity:" + result._rand);
            console.log("Item To Be Created:" + rarityString[getRarityByChance(result._rand)]);
            console.log("Item Created:" + rarityString[result._itemRarity]);
            console.log("Item Group Number:" + result._itemGroupId);
            console.log("\n");

            result = await pzChest.getItemGroupIdFromSlotToTest([2, 4]);
            // console.log(result);
            console.log("Items in Slot: COMMON, EPIC\n");
            console.log("ItemGroup is Found?: " + result._bFind);
            console.log("Random Number generated for chance of item rarity:" + result._rand);
            console.log("Item To Be Created:" + rarityString[getRarityByChance(result._rand)]);
            console.log("Item Created:" + rarityString[result._itemRarity]);
            console.log("Item Group Number:" + result._itemGroupId);
            console.log("\n");
            console.log("------- Open Item Slot Test with Randomly Generated Number -------");
            console.log("\n\n");
        });



        it('Open Item Slot By Given Number', async() => {
            console.log("\n------- Open Item Slot Test with Given Number -------");
            let result = await pzChest.getItemGroupIdFromSlotToTestByRand(300, [0, 1, 2, 3, 4]);
            // console.log(result);
            console.log("Items in Slot: RARE, UNCOMMON, COMMON, LEGENDARY, EPIC\n");
            console.log("ItemGroup is Found?: " + result._bFind);
            console.log("Given Number for item rarity:" + result._rand);
            console.log("Item To Be Created:" + rarityString[getRarityByChance(result._rand)]);
            console.log("Item Created:" + rarityString[result._itemRarity]);
            console.log("Item Group Number:" + result._itemGroupId);
            console.log("\n");

            result = await pzChest.getItemGroupIdFromSlotToTestByRand(234, [0, 1, 3, 4]);
            // console.log(result);
            console.log("Items in Slot: RARE, UNCOMMON, EPIC, LEGENDARY\n");
            console.log("ItemGroup is Found?: " + result._bFind);
            console.log("Given Number for item rarity:" + result._rand);
            console.log("Item To Be Created:" + rarityString[getRarityByChance(result._rand)]);
            console.log("Item Created:" + rarityString[result._itemRarity]);
            console.log("Item Group Number:" + result._itemGroupId);
            console.log("\n");

            result = await pzChest.getItemGroupIdFromSlotToTestByRand(600, [0, 3, 4]);
            // console.log(result);
            console.log("Items in Slot: RARE, EPIC, LEGENDARY\n");
            console.log("ItemGroup is Found?: " + result._bFind);
            console.log("Given Number for item rarity:" + result._rand);
            console.log("Item To Be Created:" + rarityString[getRarityByChance(result._rand)]);
            console.log("Item Created:" + rarityString[result._itemRarity]);
            console.log("Item Group Number:" + result._itemGroupId);
            console.log("\n");

            result = await pzChest.getItemGroupIdFromSlotToTestByRand(850, [3, 4]);
            // console.log(result);
            console.log("Items in Slot: EPIC, LEGENDARY\n");
            console.log("ItemGroup is Found?: " + result._bFind);
            console.log("Given Number for item rarity:" + result._rand);
            console.log("Item To Be Created:" + rarityString[getRarityByChance(result._rand)]);
            console.log("Item Created:" + rarityString[result._itemRarity]);
            console.log("Item Group Number:" + result._itemGroupId);
            console.log("\n");

            result = await pzChest.getItemGroupIdFromSlotToTestByRand(923, [1, 3, 4]);
            // console.log(result);
            console.log("Items in Slot: UNCOMMON, EPIC, LEGENDARY\n");
            console.log("ItemGroup is Found?: " + result._bFind);
            console.log("Given Number for item rarity:" + result._rand);
            console.log("Item To Be Created:" + rarityString[getRarityByChance(result._rand)]);
            console.log("Item Created:" + rarityString[result._itemRarity]);
            console.log("Item Group Number:" + result._itemGroupId);
            console.log("\n");

            console.log("------- Open Item Slot Test with Given Number -------");
            console.log("\n\n");
        });

    });

    // it("call Test", function() {
    //     PZItemCore.deployed().then(function(instance) {
    //           return instance.call('itemTest');
    //         }).then(function(result) {
    //           console.log("Result");
    //           console.log(result);
    //           assert.equal("TESTTEST", result[0], "is not call method g");
    //     });
    // });
});

function getRarityByChance(rand) {
    let itemRarity = 0;
    if (rand < 440) {
        itemRarity = PZ_ITEM_COMMON;
    } else if (rand < 740) {
        itemRarity = PZ_ITEM_UNCOMMON;
    } else if (rand < 955) {
        itemRarity = PZ_ITEM_RARE;
    } else if (rand < 995) {
        itemRarity = PZ_ITEM_EPIC;
    } else if (rand < 1000) {
        itemRarity = PZ_ITEM_LEGENDARY;
    }
    return itemRarity;
}