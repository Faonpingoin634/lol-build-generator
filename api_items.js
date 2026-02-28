class RiotApiService {
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

class BuildGenerator {
  constructor(riotApiService) {
    this.riotApiService = riotApiService;
    this.idsBottes = [
      "3006",
      "3009",
      "3020",
      "3047",
      "3111",
      "3117",
      "3158",
      "3200",
      "3202",
    ];
    this.itemsBannis = [
      // --- ARMES TROLLS / ÉVÉNEMENTS SPÉCIAUX (ARENA, PVE, ETC.) ---
      "3005",
      "663039", // Jugement d'Atma
      "3131",
      "663060", // Épée du divin
      "3133",
      "3400",
      "667101", // Lame du parieur (dont mode PvE Veigar)
      "3420",
      "447112",
      "667112", // Nécrophage
      "124011",
      "664011", // Épée de l'aube
      "663056", // Couronne du Roi-démon (Arena / Faker)
      "663059", // Manteau de nuit étoilée (Arena / PvE)
      "6697",
      "126697",
      "667109", // Cruauté (Toutes versions : Hubris & Météore)
      "663193", // Lithoplastron de gargouille (Ancien item / Arena)

      // --- AMÉLIORATIONS D'ORNN BUGGÉES & VARIANTES ---
      "7004",
      "3373",
      "223204",
      "663058", // Bouclier de roche en fusion (Toutes versions)
      "3068", // Cape solaire (doublon)

      // --- FAMILLE DU GARDIEN (ARAM & ARENA) ---
      "3184",
      "3177", // Lame du gardien
      "3111",
      "3112", // Orbe du gardien
      "3181", // Marteau du gardien
      "2051", // Corne du gardien
      "2049", // Amulette du gardien
      "2050", // Suaire du gardien
      "223185", // Dague du gardien
    ];
  }

  _getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  genererChampionEtSorts() {
    const tousLesChamps = this.riotApiService.getChampions();
    const tousLesSpells = this.riotApiService.getSpells();

    const idsChamps = Object.keys(tousLesChamps);
    const idChampionChoisi = this._getRandomElement(idsChamps);
    const championData = tousLesChamps[idChampionChoisi];

    const idsSpellsValides = Object.keys(tousLesSpells).filter((id) =>
      tousLesSpells[id].modes?.includes("CLASSIC"),
    );

    const idSpell1 = this._getRandomElement(idsSpellsValides);
    let idSpell2 = this._getRandomElement(idsSpellsValides);

    while (idSpell1 === idSpell2) {
      idSpell2 = this._getRandomElement(idsSpellsValides);
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

  genererInventaire() {
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

    while (objetsChoisis.length < 5 && tentatives < 1000) {
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

  genererBuildComplet() {
    return {
      championEtSorts: this.genererChampionEtSorts(),
      runes: this.genererRunes(),
      inventaire: this.genererInventaire(),
    };
  }
}

class BuildView {
  constructor() {
    this.zoneChampion = document.getElementById("champion-zone");
    this.zoneRunes = document.getElementById("runes-zone");
    this.conteneurInventaire = document.getElementById("inventaire");
    this.tooltip = document.getElementById("tooltip");
    this.boutonRelancer = document.getElementById("btn-relancer");

    this._initTooltips();
  }

  afficherChargement() {
    this.zoneChampion.innerHTML = "Chargement...";
    this.zoneRunes.innerHTML = "";
    this.conteneurInventaire.innerHTML = "Chargement des objets...";
  }

  afficherBuild(buildComplet, patchActuel) {
    this._afficherChampion(buildComplet.championEtSorts, patchActuel);
    this._afficherRunes(buildComplet.runes);
    this._afficherInventaire(buildComplet.inventaire, patchActuel);
  }

  _afficherChampion({ champion, sorts }, patchActuel) {
    this.zoneChampion.innerHTML = `
      <img src="https://ddragon.leagueoflegends.com/cdn/${patchActuel}/img/champion/${champion.id}.png" class="champion-sprite sprite-tooltip" alt="Portrait de ${champion.name}" data-title="${champion.name}" data-desc="${champion.blurb.replace(/"/g, "&quot;")}">
      <div class="spells-container">
          <img src="https://ddragon.leagueoflegends.com/cdn/${patchActuel}/img/spell/${sorts[0].id}.png" class="spell-sprite sprite-tooltip" alt="Sort d'invocateur ${sorts[0].name}" data-title="${sorts[0].name}" data-desc="${sorts[0].description}">
          <img src="https://ddragon.leagueoflegends.com/cdn/${patchActuel}/img/spell/${sorts[1].id}.png" class="spell-sprite sprite-tooltip" alt="Sort d'invocateur ${sorts[1].name}" data-title="${sorts[1].name}" data-desc="${sorts[1].description}">
      </div>
      <h2 style="margin-left: 10px;">${champion.name}</h2>
    `;
  }

  _afficherRunes(runes) {
    const bU = "https://ddragon.leagueoflegends.com/cdn/img/";
    const cR = (r, c) =>
      `<img src="${bU}${r.icon}" class="${c} sprite-tooltip" alt="Rune ${r.name}" data-title="${r.name}" data-desc="${r.longDesc.replace(/"/g, "&quot;")}">`;

    const aP = runes.arbrePrincipal;
    const aS = runes.arbreSecondaire;

    this.zoneRunes.innerHTML = `
      <div class="rune-colonne">
        <img src="${bU}${aP.donnees.icon}" class="arbre-icon" alt="Arbre principal ${aP.donnees.name}">
        ${cR(aP.runes[0], "rune-fondamentale")}
        ${cR(aP.runes[1], "rune-mineure")}
        ${cR(aP.runes[2], "rune-mineure")}
        ${cR(aP.runes[3], "rune-mineure")}
      </div>
      <div class="rune-colonne" style="margin-top:30px;">
        <img src="${bU}${aS.donnees.icon}" class="arbre-icon" alt="Arbre secondaire ${aS.donnees.name}">
        ${cR(aS.runes[0], "rune-mineure")}
        ${cR(aS.runes[1], "rune-mineure")}
      </div>
    `;
  }

  _afficherInventaire(inventaire, patchActuel) {
    this.conteneurInventaire.innerHTML = "";
    inventaire.forEach((item) => {
      let img = document.createElement("img");
      img.src = `https://ddragon.leagueoflegends.com/cdn/${patchActuel}/img/item/${item.image.full}`;
      img.className = "item-sprite sprite-tooltip";
      img.alt = `Objet : ${item.name}`;
      img.dataset.title = item.name;
      img.dataset.prix = `Prix : ${item.gold.total} PO`;
      img.dataset.desc = item.description;
      this.conteneurInventaire.appendChild(img);
    });
  }

  _initTooltips() {
    document.addEventListener("mouseover", (e) => {
      if (e.target.classList.contains("sprite-tooltip")) {
        this.tooltip.style.display = "block";
        this.tooltip.innerHTML = `<h4>${e.target.dataset.title}</h4>${e.target.dataset.prix ? `<div class="prix">${e.target.dataset.prix}</div>` : ""}<div>${e.target.dataset.desc}</div>`;
      }
    });
    document.addEventListener("mousemove", (e) => {
      if (this.tooltip.style.display === "block") {
        this.tooltip.style.left = e.pageX + 15 + "px";
        this.tooltip.style.top = e.pageY + 15 + "px";
      }
    });
    document.addEventListener("mouseout", (e) => {
      if (e.target.classList.contains("sprite-tooltip")) {
        this.tooltip.style.display = "none";
      }
    });
  }
}

class BuildController {
  constructor(apiService, buildGenerator, view) {
    this.apiService = apiService;
    this.buildGenerator = buildGenerator;
    this.view = view;

    this.view.boutonRelancer.addEventListener("click", () =>
      this.relancerLeBuild(),
    );
  }

  async demarrer() {
    this.view.afficherChargement();
    await this.apiService.initialiser();
    this.relancerLeBuild();
  }

  relancerLeBuild() {
    const nouveauBuild = this.buildGenerator.genererBuildComplet();
    this.view.afficherBuild(nouveauBuild, this.apiService.getPatchActuel());
  }
}

const apiService = new RiotApiService();
const buildGenerator = new BuildGenerator(apiService);
const view = new BuildView();
const controller = new BuildController(apiService, buildGenerator, view);

controller.demarrer();
