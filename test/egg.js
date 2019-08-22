var PZEggCore = artifacts.require("./PZEggCore.sol");
var pzEgg;

contract('Egg Test', function(accounts) {
  console.log(accounts);

  describe('PZEgg Contract Test', () => {
    it('Deployed OK', async () => {
      pzEgg = await PZEggCore.deployed();
      console.log(pzEgg.address);
    });

    it('TEST OK', async () => {
      var testStr = await pzEgg.eggTest();
      console.log(testStr);
    });

    it('Create Eggs OK', async () => {
      await pzEgg.createEggToOwnerForTest("TXWSjLQoCMB6CkEQf2y1wyeiUSBU7U5ekg", 0, 0);

      await pzEgg.createEggToOwnerForTest("TXWSjLQoCMB6CkEQf2y1wyeiUSBU7U5ekg", 0, 0);
    
      await pzEgg.createEggToOwnerForTest("TKfB91Xodm5rijBqUsXND5fz5M1Cu8tt9V", 0, 0);

      await pzEgg.createEggToOwnerForTest("TKfB91Xodm5rijBqUsXND5fz5M1Cu8tt9V", 0, 0);

      var balanceOfAcc1 = await pzEgg.balanceOf("TKfB91Xodm5rijBqUsXND5fz5M1Cu8tt9V");
      console.log("Balance of Account1: " + balanceOfAcc1.count + "\n");

      var balanceOfAcc2 = await pzEgg.balanceOf("TKfB91Xodm5rijBqUsXND5fz5M1Cu8tt9V");
      console.log("Balance of Account2: " + balanceOfAcc2.count + "\n");
    });

    it('GiveBirth OK', async () => {
      await pzEgg.giveBirth(0);
    });

    it('Create Auctions OK', async () => {
        await pzEgg.addAuction(100, 2);
        await pzEgg.addAuction(100, 3);
        console.log("Create 2 Auction\n");
        var balanceOfAcc2 = await pzEgg.balanceOf("TKfB91Xodm5rijBqUsXND5fz5M1Cu8tt9V");
        console.log("Balance of Account2: " + balanceOfAcc2.count + "\n");

        console.log("\nEggIds On Sale\n");
        var eggIdsOnSale = await pzEgg.getEggIdsOnSale();
        console.log(eggIdsOnSale);
        console.log("\nAuction 1 Information\n");
        console.log(await pzEgg.getEggAuctionByEggId(2));
        await pzEgg.cancelAuction(3);
        console.log("\nCancel one Auction\n");
        eggIdsOnSale = await pzEgg.getEggIdsOnSale();
        console.log("\nEggIds On Sale\n");
        console.log(eggIdsOnSale);
        var balanceOfAcc2 = await pzEgg.balanceOf("TKfB91Xodm5rijBqUsXND5fz5M1Cu8tt9V");
        console.log("\nBalance of Account2: " + balanceOfAcc2.count + "\n");
      });
  });
});