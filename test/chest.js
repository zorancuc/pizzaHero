var PZItemCore = artifacts.require("./PZItemCore.sol");
var PZHeroCore = artifacts.require("./PZHeroCore.sol");
var PZChest = artifacts.require("./PZChest.sol");
var pzItem;
var pzHero;
var pzChest;

var PZ_CHEST_NORMAL = 0;
var PZ_CHEST_RARE = 1;
var PZ_CHEST_EPIC = 2;
var PZ_CHEST_LEGENDARY = 3;

var PZ_ITEM_GEAR = 0;
var PZ_ITEM_EMOTE = 1;

var PZ_ITEM_RARE = 0;
var PZ_ITEM_EPIC = 1;
var PZ_ITEM_LEGENDARY = 2;

contract('Chest Test', function(accounts) {
  console.log(accounts);

  describe('PZChest Contract Test', () => {
    it('Deployed OK', async () => {
      pzItem = await PZItemCore.deployed();
      pzHero = await PZHeroCore.deployed();
      pzChest = await PZChest.deployed();
      
      console.log(pzItem.address);
      console.log(pzHero.address);
      console.log(pzChest.address);
    });

    it('TEST OK', async () => {
      var testStr = await pzChest.chestTest();
      console.log(testStr);
    });

    it('Create Items OK', async () => {
      // var watcher = pzItem.ItemsCreated();
      await pzItem.createItems(PZ_ITEM_GEAR, PZ_ITEM_RARE, 10);
      // var events = watcher.get();
      // console.log(events);
      // assert.equal(events.length, 1);

      await pzItem.createItems(PZ_ITEM_GEAR, PZ_ITEM_EPIC, 10);
      await pzItem.createItems(PZ_ITEM_GEAR, PZ_ITEM_LEGENDARY, 10);
      
      console.log("Create Items");
      var quantity = await pzItem.getItemQuantity();
      console.log("Created Item Quantity: " + quantity.quantity + "\n");

      quantity = await pzItem.balanceOf(accounts[0]);
      console.log("Created Item Create Quantity By Balance: " + quantity.count + "\n");

      var itemsOfAdmin = await pzItem.itemsOfOwner(accounts[0]);
      console.log("Items of Admin: " + itemsOfAdmin.ownerItems + "\n");
    });

    it('Create Chests OK', async () => {
      await pzChest.createChests("", 10, 100, 0, 100, PZ_CHEST_NORMAL, 100, 10);

      console.log("Chest created");

      var quantity = await pzItem.balanceOf(accounts[0]);
      console.log("Quantity Of Admin : " + quantity.count + "\n");

      quantity = await pzItem.balanceOf(PZChest.address);
      console.log("Quantity Of Chest: " + quantity.count + "\n");

      var itemsOfAdmin = await pzItem.itemsOfOwner(accounts[0]);
      console.log("Items of Admin: " + itemsOfAdmin.ownerItems + "\n");

      var itemsOfChest = await pzItem.itemsOfOwner(PZChest.address);
      console.log("Items of Chest: " + itemsOfChest.ownerItems + "\n");

      var chestQuantity = await pzChest.getChestsQuantity();
      console.log("Created Chest Count: " + chestQuantity + "\n");
    });

    it('Buy Chest OK', async () => {
      var buyer = 'TXWSjLQoCMB6CkEQf2y1wyeiUSBU7U5ekg';
      // var watcher = pzChest.BuyChest();
      await pzChest.buyChest(0, buyer, {from: buyer});
      await pzChest.buyChest(3, buyer, {from: buyer});
      await pzChest.buyChest(8, buyer, {from: buyer});
      
      // var events = watcher.get();
      // console.log(events);

      var balanceOfAdmin = await pzChest.balanceOf(accounts[0]);
      console.log("Balance of Admin after buy chest: " + balanceOfAdmin.count + "\n");

      var balanceOfBuyer = await pzChest.balanceOf(buyer);
      console.log("Balance of buyer after buy chest: " + balanceOfBuyer.count + "\n");

      var balanceOfChest = await pzChest.balanceOf(PZChest.address);
      console.log("Balance of Chest after buy chest: " + balanceOfChest.count + "\n");
    });

    it('Open Chest OK', async () => {
      var buyer = 'TXWSjLQoCMB6CkEQf2y1wyeiUSBU7U5ekg';
      // var watcher = pzChest.BuyChest();
      var chestId = 16;
      await pzChest.openChest(chestId);
     
      // var events = watcher.get();
      // console.log(events);

      var balanceOfAdmin = await pzChest.balanceOf(accounts[0]);
      console.log("Balance of Admin after Open chest: " + balanceOfAdmin.count + "\n");

      var balanceOfBuyer = await pzChest.balanceOf(buyer);
      console.log("Balance of buyer after Open chest: " + balanceOfBuyer.count + "\n");

      var balanceOfChest = await pzChest.balanceOf(PZChest.address);
      console.log("Balance of Chest after Open chest: " + balanceOfChest.count + "\n");

      var chest = await pzChest.getChestById(chestId);
      console.log("You opened chest: \n");
      console.log(chest);
      console.log("\n");

      var item = await pzItem.getItem(chest.itemId.toNumber());
      console.log("You got Item: \n");
      console.log(item);
      console.log("\n");

      var eggCount = await pzChest.getEggCount(accounts[0]);
      console.log("You got Egg: " + eggCount + "\n");

      await pzChest.openEgg();
      console.log("You Open Egg. \n")
      var heroCount = await pzHero.balanceOf(accounts[0]);
      console.log("Your hero count: " + heroCount.count + "\n");
      heroCount = await pzHero.totalSupply() + 1;
      console.log("Your hero count: " + heroCount + "\n");

      var hero = await pzHero.getHero(0);
      console.log("Your hero: \n");
      console.log(hero);
      console.log("\n");
      
    });

    it('Burn Chests OK', async () => {
      await pzChest.burnChests();

      console.log("Chest Burned");

      var quantity = await pzItem.balanceOf(accounts[0]);
      console.log("Quantity Of Admin : " + quantity.count + "\n");

      quantity = await pzItem.balanceOf(PZChest.address);
      console.log("Quantity Of Chest: " + quantity.count + "\n");

      var itemsOfAdmin = await pzItem.itemsOfOwner(accounts[0]);
      console.log("Items of Admin: " + itemsOfAdmin.ownerItems + "\n");

      var itemsOfChest = await pzItem.itemsOfOwner(PZChest.address);
      console.log("Items of Chest: " + itemsOfChest.ownerItems + "\n");

      var balanceOfAdmin = await pzChest.balanceOf(accounts[0]);
      console.log("Balance of Admin after buy chest: " + balanceOfAdmin.count + "\n");

    });
    
    // it('Create Chests OK', async () => {
    //   await pzChest.createChests("", 100, 100, 0, 100, PZ_CHEST_NORMAL, 100, 10);

    //   console.log("Chest created");

    //   var itemIdInChest = await pzItem.getItemsInChestByType(PZ_ITEM_RARE);
    //   console.log("Rare Items in Chest: " + itemIdInChest + "\n");
      
    //   itemIdInChest = await pzItem.getItemsInChestByType(PZ_ITEM_EPIC);
    //   console.log("Epic Items in Chest: " + itemIdInChest + "\n");

    //   itemIdInChest = await pzItem.getItemsInChestByType(PZ_ITEM_LEGENDARY);
    //   console.log("Legendary Items in Chest: " + itemIdInChest + "\n");

    //   var availableQuantity = await pzItem.getAvailableItemIDsByType(PZ_ITEM_RARE);
    //   console.log("Available Items of Rare: " + availableQuantity + "\n");

    //   availableQuantity = await pzItem.getAvailableItemIDsByType(PZ_ITEM_EPIC);
    //   console.log("Available Items of Epic: " + availableQuantity + "\n");

    //   availableQuantity = await pzItem.getAvailableItemIDsByType(PZ_ITEM_LEGENDARY);
    //   console.log("Available Items of Legendary: " + availableQuantity + "\n");

    //   var chestQuantity = await pzChest.getChestsQuantity();
    //   console.log(chestQuantity);

    //   var balanceOfAdmin = await pzChest.balanceOf(accounts[0]);
    //   console.log("Balance of Admin: " + balanceOfAdmin.count + "\n");

    // });

    // it('Buy Chest OK', async () => {
    //   var buyer = 'TKfB91Xodm5rijBqUsXND5fz5M1Cu8tt9V';
    //   // var watcher = pzChest.BuyChest();
    //   await pzChest.buyChest(0, buyer, {from: buyer});
    //   // var events = watcher.get();
    //   // console.log(events);

    //   var balanceOfAdmin = await pzChest.balanceOf(accounts[0]);
    //   console.log("Balance of Admin after buy chest: " + balanceOfAdmin.count + "\n");

    //   var balanceOfBuyer = await pzChest.balanceOf(buyer);
    //   console.log("Balance of buyer after buy chest: " + balanceOfBuyer.count + "\n");
    // });

    // it('Burn Chests OK', async () => {
    //   await pzChest.burnChests(60);

    //   console.log("Chest Burned");

    //   var itemIdInChest = await pzItem.getItemsInChestByType(PZ_ITEM_RARE);
    //   console.log("Rare Items in Chest: " + itemIdInChest + "\n");
      
    //   itemIdInChest = await pzItem.getItemsInChestByType(PZ_ITEM_EPIC);
    //   console.log("Epic Items in Chest: " + itemIdInChest + "\n");

    //   itemIdInChest = await pzItem.getItemsInChestByType(PZ_ITEM_LEGENDARY);
    //   console.log("Legendary Items in Chest: " + itemIdInChest + "\n");

    //   var availableQuantity = await pzItem.getAvailableItemIDsByType(PZ_ITEM_RARE);
    //   console.log("Available Items of Rare: " + availableQuantity + "\n");

    //   availableQuantity = await pzItem.getAvailableItemIDsByType(PZ_ITEM_EPIC);
    //   console.log("Available Items of Epic: " + availableQuantity + "\n");

    //   availableQuantity = await pzItem.getAvailableItemIDsByType(PZ_ITEM_LEGENDARY);
    //   console.log("Available Items of Legendary: " + availableQuantity + "\n");

    //   var chestQuantity = await pzChest.getChestsQuantity();
    //   console.log(chestQuantity);

    //   var balanceOfAdmin = await pzChest.balanceOf(accounts[0]);
    //   console.log("Balance of Admin: " + balanceOfAdmin.count + "\n");

    // });

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