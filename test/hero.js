var PZHeroCore = artifacts.require("./PZHeroCore.sol");
var PZChest = artifacts.require("./PZChest.sol");
var pzHero;

var TronWeb = require('tronweb');

var tronWeb;

var heroCharacter = [
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
var heroTraitsCode = [
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

var heroTraitsName = [
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
contract('Hero Test', function(accounts) {
  console.log(accounts);

  describe('PZHero Contract Test', () => {
    it('Deployed OK', async () => {
        pzHero = await PZHeroCore.deployed();
        pzChest = await PZChest.deployed();
        // console.log(pzHero.address);
        // await pzHero.setChestAddress(pzChest.address);
        // console.log(pzChest.address);
    });

    it('TEST OK', async () => {
      var testStr = await pzHero.heroTest();
      console.log(testStr);
    });

    it('Create Heroes OK', async () => {
        console.log(await pzHero.createGen0Hero(accounts[0]));
        console.log(await pzHero.createGen0Hero(accounts[0]));
        console.log(await pzHero.createGen0Hero(accounts[0]));
        console.log(await pzHero.createGen0Hero(accounts[0]));

        let balance = await pzHero.balanceOf(accounts[0]);
        console.log("Total Supply: " + balance.count + "\n");

        var hero = await pzHero.getHero(balance.count - 1);
        console.log("Your hero: \n");
        console.log(hero);
        console.log("\n");
        
        var traits = await pzHero.getHeroTraits(balance.count - 1);
        console.log("length: " + traits.length + "\n");
        console.log("Trait is: \n");
        console.log(traits);
        console.log("\n");
    });

    it('Breeding OK', async () => {
        await pzHero.breedWithAuto(0, 1);
        // await pzHero.breedWithAuto(2, 3);

        let balance = await pzHero.balanceOf(accounts[0]);
        console.log("Total Supply: " + balance.count + "\n");

        console.log("Pregnant Heroes Count:" + await pzHero.getPregnantHeroesCount() + "\n");
    });

    it('Birth OK', async () => {
        console.log(await pzHero.giveBirth(0));
        // console.log(await pzHero.giveBirth(2));

        let balance = await pzHero.balanceOf(accounts[0]);
        console.log("Total Supply: " + balance.count + "\n");

        console.log("Pregnant Heroes Count:" + await pzHero.getPregnantHeroesCount() + "\n");

        var hero = await pzHero.getHero(balance.count - 1);
        console.log("Your hero: \n");
        console.log(hero);
        console.log("\n");


        var traits = await pzHero.getHeroTraits(balance.count - 1);
        console.log("length: " + traits.length + "\n");
        console.log("Trait is: \n");
        console.log(traits);
        console.log("\n");

        let appearance = [];

        for(let i = 0; i < 12; i++) {
            appearance[i] = traits[i*4];
            console.log(heroCharacter[i] + ': ' + heroTraitsName[i][appearance[i]]);
        }

        console.log(appearance);
        // hero = await pzHero.getHero(balance.count - 2);
        // console.log("Your hero: \n");
        // console.log(hero);
        // console.log("\n");
    });
//     it('Get Items Against Type', async () => {
//       var itemIDsOfRare = await pzItem.getItemIDsByType(0);
//       // console.log(itemIDsOfRare);

//       var itemIDsOfEpic = await pzItem.getItemIDsByType(1);
//       // console.log(itemIDsOfEpic);

//       var itemIDsOfLegendary = await pzItem.getItemIDsByType(2);
//       // console.log(itemIDsOfLegendary);
//     });

//     it('Test Lock Item', async () => {
//       var itemIDsOfRare = await pzItem.getAvailableItemIDsByType(0);
//       console.log(itemIDsOfRare);

//       var availbaleItemQuantity = await pzItem.getAvailableItemQuantityByType(0);
//       console.log(availbaleItemQuantity);

//       // var itemIdsInChest = await pzItem.putItemsIntoChest(0, 5);
//       // await pzItem.putItemsIntoChest(0, 5);
//       var itemIdInChest = await pzItem.getItemsInChestByType(0);
//       console.log("Items in Chest: " + itemIdInChest + "\n");
//       itemIDsOfRare = await pzItem.getAvailableItemIDsByType(0);
//       console.log(itemIDsOfRare);

//       availbaleItemQuantity = await pzItem.getAvailableItemQuantityByType(0);
//       console.log(availbaleItemQuantity);
//     });
  });
});