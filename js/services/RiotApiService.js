export default class RiotApiService {
  constructor() {
    this.patchActuel = null;
    this.items = null;
    this.champions = null;
    this.spells = null;
    this.runes = null;
  }

  async initialiser() {
    try {
      const reponseVersions = await fetch(
        "https://ddragon.leagueoflegends.com/api/versions.json",
      );
      const versions = await reponseVersions.json();
      const patchActuel = versions[0];

      const [reponseItems, reponseChamps, reponseSpells, reponseRunes] =
        await Promise.all([
          fetch(
            `https://ddragon.leagueoflegends.com/cdn/${patchActuel}/data/fr_FR/item.json`,
          ),
          fetch(
            `https://ddragon.leagueoflegends.com/cdn/${patchActuel}/data/fr_FR/champion.json`,
          ),
          fetch(
            `https://ddragon.leagueoflegends.com/cdn/${patchActuel}/data/fr_FR/summoner.json`,
          ),
          fetch(
            `https://ddragon.leagueoflegends.com/cdn/${patchActuel}/data/fr_FR/runesReforged.json`,
          ),
        ]);

      this.patchActuel = patchActuel;
      this.items = (await reponseItems.json()).data;
      this.champions = (await reponseChamps.json()).data;
      this.spells = (await reponseSpells.json()).data;
      this.runes = await reponseRunes.json();
    } catch (erreur) {
      console.error(erreur);
    }
  }

  getPatchActuel() {
    return this.patchActuel;
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