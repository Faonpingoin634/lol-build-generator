export default class RiotApiService {
  constructor() {
    this.currentPatch = null;
    this.items = null;
    this.champions = null;
    this.spells = null;
    this.runes = null;
  }

  async initialize() {
    const versionsResponse = await fetch(
      "https://ddragon.leagueoflegends.com/api/versions.json",
    );
    if (!versionsResponse.ok) throw new Error(`HTTP ${versionsResponse.status}`);
    const versions = await versionsResponse.json();
    const currentPatch = versions[0];

    const [itemsResponse, champsResponse, spellsResponse, runesResponse] =
      await Promise.all([
        fetch(
          `https://ddragon.leagueoflegends.com/cdn/${currentPatch}/data/fr_FR/item.json`,
        ),
        fetch(
          `https://ddragon.leagueoflegends.com/cdn/${currentPatch}/data/fr_FR/champion.json`,
        ),
        fetch(
          `https://ddragon.leagueoflegends.com/cdn/${currentPatch}/data/fr_FR/summoner.json`,
        ),
        fetch(
          `https://ddragon.leagueoflegends.com/cdn/${currentPatch}/data/fr_FR/runesReforged.json`,
        ),
      ]);

    for (const response of [itemsResponse, champsResponse, spellsResponse, runesResponse]) {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
    }

    const [itemsData, champsData, spellsData, runesData] = await Promise.all([
      itemsResponse.json(),
      champsResponse.json(),
      spellsResponse.json(),
      runesResponse.json(),
    ]);

    this.items = itemsData.data;
    this.champions = champsData.data;
    this.spells = spellsData.data;
    this.runes = runesData;
    this.currentPatch = currentPatch;
  }

  isReady() {
    return this.currentPatch !== null;
  }

  getCurrentPatch() {
    return this.currentPatch;
  }
  getItems() {
    return this.items;
  }
  getChampions() {
    return this.champions;
  }
  getSpells() {
    return this.spells;
  }
  getRunes() {
    return this.runes;
  }
}
