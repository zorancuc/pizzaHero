var PZToken = artifacts.require("./PZToken.sol");
var pzToken;

contract('PZToken Test', function(accounts) {
  console.log(accounts);

  describe('PZToken Contract Test', () => {
    it('Deployed OK', async () => {
      pzToken = await PZToken.deployed();
      console.log(pzToken.address);
    });

    it('TEST OK', async () => {
      var testStr = await pzToken.tokenTest();
      console.log(testStr);
    });

    it('Transfer Token OK', async () => {
      await pzToken.transferToken("TWrY88cShKxsn5j2bK4xrYQanGsN2VNcLi", 50, 1000382);
    });
  });
});