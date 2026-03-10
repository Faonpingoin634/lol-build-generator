export default class BuildGenerator {
  constructor(riotApiService) {
    this.riotApiService = riotApiService;
    this.idsBottes = [
      "3006",
      "3009",
      "3020",
      "3047",
      "3111",
      "3158",
      "3200",
      "3202",
    ];
    this.itemsBannis = [
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

  genererChampionEtSorts(role) {
    const tousLesChamps = this.riotApiService.getChampions();
    const tousLesSpells = this.riotApiService.getSpells();

    const idsChamps = Object.keys(tousLesChamps);
    const idChampionChoisi = this._getRandomElement(idsChamps);
    const championData = tousLesChamps[idChampionChoisi];

    let idsSpellsValides = Object.keys(tousLesSpells).filter((id) =>
      tousLesSpells[id].modes?.includes("CLASSIC"),
    );

    let idSpell1, idSpell2;

    if (role === "jungle") {
      idSpell1 = "SummonerSmite";
      idsSpellsValides = idsSpellsValides.filter(
        (id) => id !== "SummonerSmite",
      );
      idSpell2 = this._getRandomElement(idsSpellsValides);
    } else {
      idsSpellsValides = idsSpellsValides.filter(
        (id) => id !== "SummonerSmite",
      );
      idSpell1 = this._getRandomElement(idsSpellsValides);
      idSpell2 = this._getRandomElement(idsSpellsValides);

      while (idSpell1 === idSpell2) {
        idSpell2 = this._getRandomElement(idsSpellsValides);
      }
    }

    return {
      champion: championData,
      sorts: [tousLesSpells[idSpell1], tousLesSpells[idSpell2]],
    };
  }

  genererRunes() {
    const tousLesArbres = this.riotApiService.getRunes();
    const arbrePrincipal = this._getRandomElement(tousLesArbres);

    let arbreSecondaire = this._getRandomElement(tousLesArbres);
    while (arbreSecondaire.id === arbrePrincipal.id) {
      arbreSecondaire = this._getRandomElement(tousLesArbres);
    }

    const runesPrincipales = arbrePrincipal.slots.map((slot) => {
      return this._getRandomElement(slot.runes);
    });

    const lignesDisponibles = [1, 2, 3];
    const indexLigne1 = this._getRandomElement(lignesDisponibles);

    let indexLigne2 = this._getRandomElement(lignesDisponibles);
    while (indexLigne2 === indexLigne1) {
      indexLigne2 = this._getRandomElement(lignesDisponibles);
    }

    const runesSecondaires = [
      this._getRandomElement(arbreSecondaire.slots[indexLigne1].runes),
      this._getRandomElement(arbreSecondaire.slots[indexLigne2].runes),
    ];

    return {
      arbrePrincipal: { donnees: arbrePrincipal, runes: runesPrincipales },
      arbreSecondaire: { donnees: arbreSecondaire, runes: runesSecondaires },
    };
  }

  genererInventaire(role) {
    const tousLesItems = this.riotApiService.getItems();
    let bottesDisponibles = [];
    let itemsValides = [];

    Object.keys(tousLesItems).forEach((id) => {
      const item = tousLesItems[id];
      const tags = item.tags || [];

      if (this.itemsBannis.includes(String(id))) return;

      if (this.idsBottes.includes(String(id))) {
        bottesDisponibles.push(item);
        return;
      }

      const pasUnComposant =
        item.into === undefined ||
        item.into.every((upgradeId) => Number(upgradeId) >= 7000);

      const estValide =
        item.maps?.["11"] === true &&
        item.gold?.purchasable === true &&
        pasUnComposant &&
        item.gold?.total >= 1500 &&
        !tags.includes("Consumable") &&
        !tags.includes("Jungle") &&
        !tags.includes("Trinket") &&
        !tags.includes("Boots");

      if (estValide) itemsValides.push(item);
    });

    let botteChoisie = tousLesItems["3006"];
    if (bottesDisponibles.length > 0) {
      botteChoisie = this._getRandomElement(bottesDisponibles);
    }

    let objetsChoisis = [];
    let nomsDejaPris = [];
    let tentatives = 0;

    let nbItems = 5;
    if (role === "adc") {
      nbItems = 6;
    } else if (role === "support") {
      nbItems = 4;
    }

    while (objetsChoisis.length < nbItems && tentatives < 1000) {
      const itemCandidat = this._getRandomElement(itemsValides);

      if (!nomsDejaPris.includes(itemCandidat.name)) {
        objetsChoisis.push(itemCandidat);
        nomsDejaPris.push(itemCandidat.name);
      }
      tentatives++;
    }

    let inventaireFinal = [botteChoisie, ...objetsChoisis];

    for (let i = inventaireFinal.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [inventaireFinal[i], inventaireFinal[j]] = [
        inventaireFinal[j],
        inventaireFinal[i],
      ];
    }

    return inventaireFinal;
  }

  genererBuildComplet(role) {
    return {
      championEtSorts: this.genererChampionEtSorts(role),
      runes: this.genererRunes(),
      inventaire: this.genererInventaire(role),
    };
  }
}