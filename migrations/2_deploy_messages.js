var PZItemCore = artifacts.require("./PZItemCore.sol");
var PZHeroCore = artifacts.require("./PZHeroCore.sol");
var PZChest = artifacts.require("./PZChest.sol");
var PZGeneScience = artifacts.require("./PZGeneScience.sol");
var PZEggCore = artifacts.require("./PZEggCore.sol");
module.exports = function(deployer) {

  var poolAddr = "TGVSUv74MSrrhaKwFYf5dcNu2ESxLVgzn9";

  deployer.deploy(PZGeneScience).then(() => {
    return deployer.deploy(PZItemCore).then(() => {
      return deployer.deploy(PZEggCore, PZGeneScience.address).then(() => {      
        return deployer.deploy(PZHeroCore, PZItemCore.address, PZEggCore.address, PZGeneScience.address).then(() => {
          return deployer.deploy(PZChest, PZHeroCore.address, PZItemCore.address, PZEggCore.address, poolAddr).then((instance)=>{
            return PZHeroCore.deployed().then((heroInstance) => {
              heroInstance.setChestAddress(PZChest.address);
              return PZItemCore.deployed().then(itemInstance => {
                itemInstance.setChestAddr(PZChest.address);
                itemInstance.setHeroAddr(PZHeroCore.address);
                return PZEggCore.deployed().then(eggInstance => {
                  eggInstance.setChestAddr(PZChest.address);
                  eggInstance.setHeroAddr(PZHeroCore.address);
                  console.log("GeneScience Address: " + PZGeneScience.address);
                  console.log("Item Address: " + PZItemCore.address);
                  console.log("Egg Address: " + PZEggCore.address);
                  console.log("Hero Address: " + PZHeroCore.address);
                  console.log("Chest Address: " + PZChest.address);
                  console.log("\n" + "Migration OK" + "\n");
                });
              });
            });
          })
        });
      });
    })
  });
};
