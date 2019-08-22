const pzItemContractAddress = 'TCUuXcCoUtWAVdv4EwxADVbZe3scEo6vbP';
const pzEggContractAddress = 'THzngcVDeggjMjmV81isnZMUK8m8AxiQoN';
const pzHeroContractAddress = 'THvRpURyddQabLtErtfu2xp7hxLWuJutUc';
const pzChestContractAddress = 'TNyjLK7HjUj8N3hDNba3sYSkubRnkUznbp';

const PZ_CHEST_NORMAL = 0;
const PZ_CHEST_RARE = 1;
const PZ_CHEST_EPIC = 2;
const PZ_CHEST_LEGENDARY = 3;

const PZ_ITEM_GEAR = 0;
const PZ_ITEM_EMOTE = 1;

const PZ_ITEM_RARE = 0;
const PZ_ITEM_EPIC = 1;
const PZ_ITEM_LEGENDARY = 2;

const utils = {
    tronWeb: false,
    pzChestContract: false,
    pzItemContract: false,
    pzHeroContract: false,
    pzEggContract: false,

    async setTronWeb(tronWeb) {
        this.tronWeb = tronWeb;
        this.pzChestContract = await tronWeb
            .contract()
            .at(pzChestContractAddress);
        this.pzItemContract = await tronWeb
            .contract()
            .at(pzItemContractAddress);
        this.pzHeroContract = await tronWeb
            .contract()
            .at(pzHeroContractAddress);
        this.pzEggContract = await tronWeb.contract().at(pzEggContractAddress);
    },

    transformMessage(message) {
        return {
            tips: {
                amount: message.tips,
                count: message
                    .tippers
                    .toNumber()
            },
            owner: this
                .tronWeb
                .address
                .fromHex(message.creator),
            timestamp: message
                .time
                .toNumber(),
            message: message.message
        }
    },

    async getChestInfoById(id) {
        return await this
            .pzChestContract
            .getChestById(id)
            .call();
    },

    async itemsOfOwner(address) {
        return await this
            .pzItemContract
            .itemsOfOwner(address)
            .call();
    },

    async eggsOfOwner(address) {
        return await this
            .pzEggContract
            .eggsOfOwner(address)
            .call();
    },

    async heroesOfOwner(address) {
        // return await this.pzHeroContract.heroesOfOwner(address).call();
        return await this
            .pzHeroContract
            .heroesOfOwner(address)
            .call();
    },

    async chestsOfOwner(address) {
        return await this
            .pzChestContract
            .chestsOfOwner(address)
            .call();
    },

    async createTestItems() {
        await this
            .pzItemContract
            .createItems(PZ_ITEM_GEAR, PZ_ITEM_RARE, 10);

        await this
            .pzItemContract
            .createItems(PZ_ITEM_GEAR, PZ_ITEM_EPIC, 10);
        await this
            .pzItemContract
            .createItems(PZ_ITEM_GEAR, PZ_ITEM_LEGENDARY, 10);
    },

    async itemTest() {
        console.log(await this.pzItemContract.itemTest().call());
    },

    async getItem(id) {
        return await this
            .pzItemContract
            .getItem(id)
            .call();
    },

    async getEgg(id) {
        return await this
            .pzEggContract
            .getEgg(id)
            .call();
    },

    async getHero(id) {
        return await this
            .pzHeroContract
            .getHero(id)
            .call();
    },

    async getAvailableItems() {
        console.log(await this.pzItemContract.totalSupply().call());
    },

    async chestTest() {
        console.log(await this.pzChestContract.chestTest().call());
    },

    async checkChestBalance(address) {
        console.log(await this.pzChestContract.balanceOf(address).call());
    },

    async checkTotalSupply() {
        console.log(await this.pzChestContract.totalSupply().call());
    }

    // async fetchMessages(recent = {}, featured = []) {     // Try to fetch
    // messageID's of top 20 tipped messages (or until there are no more) for(let i
    // = 0; i < 20; i++) {         const message = await
    // this.contract.topPosts(i).call();         if(message.toNumber() === 0) break;
    // // End of tips array         featured.push( message.toNumber() );     } //
    // Fetch Max(30) most recent messages     const totalMessages = (await
    // this.contract.current().call()).toNumber();    const min = Math.max(1,
    // totalMessages - 30);     const messageIDs = [ ...new Set([         ...new
    // Array(totalMessages - min).fill().map((_, index) => min + index), ...featured
    //     ])];     await Promise.all(messageIDs.map(messageID => (
    // this.contract.messages(messageID).call()     ))).then(messages =>
    // messages.forEach((message, index) => {         const messageID =
    // +messageIDs[index];         recent[messageID] =
    // this.transformMessage(message);     }));     return {         featured,
    // recent     }; },
};

export default utils;