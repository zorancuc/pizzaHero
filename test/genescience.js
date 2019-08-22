var PZHeroCore = artifacts.require("./PZHeroCore.sol");
var PZChest = artifacts.require("./PZChest.sol");
var PZGeneScience = artifacts.require("./PZGeneScience.sol");

var TronWeb = require('tronweb');
var pzHero;

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

tronWeb = new TronWeb({
    fullNode: 'https://api.trongrid.io',
    solidityNode: 'https://api.trongrid.io',
    eventServer: 'https://api.trongrid.io',
});

tronWeb.setDefaultBlock('latest');

contract('GeneScience Test', function(accounts) {
  console.log(accounts);

  describe('GeneScience Contract Test', () => {
    it('Deployed OK', async () => {
        pzHero = await PZHeroCore.deployed();
        pzChest = await PZChest.deployed();
        pzGeneScience = await PZGeneScience.deployed();
        // console.log(pzHero.address);
        // await pzHero.setChestAddress(pzChest.address);
        // console.log(pzChest.address);
    });

    var testStr;
    it('TEST OK', async () => {
        testStr = await pzGeneScience.geneTest();
        console.log(testStr);
    });

    it('Generate Gene 0 OK', async () => {

        testStr = await pzGeneScience.generateGene0();
        console.log(testStr);

        let gene = parseInt(testStr, 10);
        console.log(gene); 
        let traits = await pzGeneScience.generateTraits();
        console.log(traits);

        let appearance = [];

        for(let i = 0; i < 14; i++) {
            appearance[i] = traits[i*4];
            console.log(heroCharacter[i] + ': ' + heroTraitsName[i][appearance[i]]);
        }

        console.log(appearance);
        // console.log(tronWeb.toBigNumber(gene));
        // testStr = await pzGeneScience.expressingTraits(tronWeb.toBigNumber(gene));
        // console.log(testStr);
    });

    // it('Mix Gene OK', async () => {
    //     var mixedGene = await pzGeneScience.mixGenes(100000, 500000, 0);
    //     console.log(mixedGene);
    // });
  });
});