export default class BuildGenerator {
  constructor(apiService) {
    this.apiService = apiService;
    this.bootIds = [
      "3006",
      "3009",
      "3020",
      "3047",
      "3111",
      "3158",
      "3200",
      "3202",
    ];
    this.bannedItems = [
      "663039",
      "663060",
      "667101",
      "667112",
      "664011",
      "663056",
      "663059",
      "667109",
      "663193",
      "664644",
      "663058",
      "3068",
      "3177",
      "3112",
      "3181",
      "2051",
      "2049",
      "2050",
      "223185",
    ];
  }

  _getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  generateChampionAndSpells(role, championTypeFilter = null) {
    const allChampions = this.apiService.getChampions();
    const allSpells = this.apiService.getSpells();

    let champIds = Object.keys(allChampions);
    if (championTypeFilter && championTypeFilter !== "all") {
      const filtered = champIds.filter((id) =>
        allChampions[id].tags?.includes(championTypeFilter),
      );
      if (filtered.length > 0) champIds = filtered;
    }

    const chosenChampionId = this._getRandomElement(champIds);
    const championData = allChampions[chosenChampionId];

    const isAram = role === "aram";
    const gameMode = isAram ? "ARAM" : "CLASSIC";

    let validSpellIds = Object.keys(allSpells).filter((id) =>
      allSpells[id].modes?.includes(gameMode),
    );

    let spellId1, spellId2;

    if (isAram) {
      spellId1 = this._getRandomElement(validSpellIds);
      spellId2 = this._getRandomElement(validSpellIds);
      while (spellId1 === spellId2) {
        spellId2 = this._getRandomElement(validSpellIds);
      }
    } else if (role === "jungle") {
      spellId1 = "SummonerSmite";
      validSpellIds = validSpellIds.filter((id) => id !== "SummonerSmite");
      spellId2 = this._getRandomElement(validSpellIds);
    } else {
      validSpellIds = validSpellIds.filter((id) => id !== "SummonerSmite");
      spellId1 = this._getRandomElement(validSpellIds);
      spellId2 = this._getRandomElement(validSpellIds);
      while (spellId1 === spellId2) {
        spellId2 = this._getRandomElement(validSpellIds);
      }
    }

    return {
      champion: championData,
      spells: [allSpells[spellId1], allSpells[spellId2]],
    };
  }

  generateRunes() {
    const allTrees = this.apiService.getRunes();
    const primaryTree = this._getRandomElement(allTrees);

    let secondaryTree = this._getRandomElement(allTrees);
    while (secondaryTree.id === primaryTree.id) {
      secondaryTree = this._getRandomElement(allTrees);
    }

    const primaryRunes = primaryTree.slots.map((slot) => {
      return this._getRandomElement(slot.runes);
    });

    const availableRows = [1, 2, 3];
    const rowIndex1 = this._getRandomElement(availableRows);

    let rowIndex2 = this._getRandomElement(availableRows);
    while (rowIndex2 === rowIndex1) {
      rowIndex2 = this._getRandomElement(availableRows);
    }

    const secondaryRunes = [
      this._getRandomElement(secondaryTree.slots[rowIndex1].runes),
      this._getRandomElement(secondaryTree.slots[rowIndex2].runes),
    ];

    return {
      primaryTree: { data: primaryTree, runes: primaryRunes },
      secondaryTree: { data: secondaryTree, runes: secondaryRunes },
    };
  }

  generateInventory(role) {
    const allItems = this.apiService.getItems();
    const isAram = role === "aram";
    const mapId = isAram ? "12" : "11";

    let availableBoots = [];
    let validItems = [];

    Object.keys(allItems).forEach((id) => {
      const item = allItems[id];
      const tags = item.tags || [];

      if (this.bannedItems.includes(String(id))) return;

      if (!isAram && this.bootIds.includes(String(id))) {
        availableBoots.push(item);
        return;
      }

      const isNotComponent =
        item.into === undefined ||
        item.into.every((upgradeId) => Number(upgradeId) >= 7000);

      const isValid =
        item.maps?.[mapId] === true &&
        item.gold?.purchasable === true &&
        isNotComponent &&
        item.gold?.total >= 1500 &&
        !tags.includes("Consumable") &&
        !tags.includes("Jungle") &&
        !tags.includes("Trinket") &&
        !tags.includes("Boots");

      if (isValid) validItems.push(item);
    });

    let itemCount = 6;
    if (!isAram) {
      if (role === "adc") {
        itemCount = 6;
      } else if (role === "support") {
        itemCount = 4;
      } else {
        itemCount = 5;
      }
    }

    let chosenItems = [];
    let takenNames = [];
    let attempts = 0;

    while (chosenItems.length < itemCount && attempts < 1000) {
      const candidateItem = this._getRandomElement(validItems);
      if (!takenNames.includes(candidateItem.name)) {
        chosenItems.push(candidateItem);
        takenNames.push(candidateItem.name);
      }
      attempts++;
    }

    if (isAram) {
      return chosenItems;
    }

    let chosenBoots = allItems["3006"];
    if (availableBoots.length > 0) {
      chosenBoots = this._getRandomElement(availableBoots);
    }

    let finalInventory = [chosenBoots, ...chosenItems];
    for (let i = finalInventory.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [finalInventory[i], finalInventory[j]] = [finalInventory[j], finalInventory[i]];
    }

    return finalInventory;
  }

  generateFullBuild(role, championTypeFilter = null) {
    return {
      championAndSpells: this.generateChampionAndSpells(role, championTypeFilter),
      runes: this.generateRunes(),
      inventory: this.generateInventory(role),
    };
  }
}
