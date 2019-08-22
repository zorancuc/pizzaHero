var PZItemCore = artifacts.require("./PZItemCore.sol");
var pzItem;

contract('Item Test', function(accounts) {
  console.log(accounts);

  describe('PZItem Contract Test', () => {
    it('Deployed OK', async () => {
      pzItem = await PZItemCore.deployed();
      console.log(pzItem.address);
    });

    it('TEST OK', async () => {
      var testStr = await pzItem.itemTest();
      console.log(testStr);
    });

    it('Create Items OK', async () => {
      var newItemsQuantity = await pzItem.createItems(0, 0, 10);
      console.log(newItemsQuantity);

      var newItemsQuantity = await pzItem.createItems(0, 1, 20);
      console.log(newItemsQuantity);

      var newItemsQuantity = await pzItem.createItems(0, 2, 30);
      console.log(newItemsQuantity);

      var quantity = await pzItem.getItemQuantity();
      console.log(quantity);

      var balanceOfAdmin = await pzItem.balanceOf(accounts[0]);
      console.log("Balance of Admin: " + balanceOfAdmin.count + "\n");
    });

    it('Get Items Against Type', async () => {
      var itemIDsOfRare = await pzItem.getItemIDsByType(0);
      // console.log(itemIDsOfRare);

      var itemIDsOfEpic = await pzItem.getItemIDsByType(1);
      // console.log(itemIDsOfEpic);

      var itemIDsOfLegendary = await pzItem.getItemIDsByType(2);
      // console.log(itemIDsOfLegendary);
    });

    it('Test Lock Item', async () => {
      var itemIDsOfRare = await pzItem.getAvailableItemIDsByType(0);
      console.log(itemIDsOfRare);

      var availbaleItemQuantity = await pzItem.getAvailableItemQuantityByType(0);
      console.log(availbaleItemQuantity);

      // var itemIdsInChest = await pzItem.putItemsIntoChest(0, 5);
      // await pzItem.putItemsIntoChest(0, 5);
      var itemIdInChest = await pzItem.getItemsInChestByType(0);
      console.log("Items in Chest: " + itemIdInChest + "\n");
      itemIDsOfRare = await pzItem.getAvailableItemIDsByType(0);
      console.log(itemIDsOfRare);

      availbaleItemQuantity = await pzItem.getAvailableItemQuantityByType(0);
      console.log(availbaleItemQuantity);
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