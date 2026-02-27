const zoneChampion = document.getElementById("champion-zone");
const zoneRunes = document.getElementById("runes-zone");
const conteneurInventaire = document.getElementById("inventaire");
const boutonRelancer = document.getElementById("btn-relancer");
const tooltip = document.getElementById("tooltip");

// 🛑 LISTE STRICTE DES BOTTES (Blindée à 100%)
const idsBottes = [
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

// 🛑 BLACKLIST PAR ID UNIQUEMENT (Contrôle total)
const itemsBannis = [
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

async function genererBuildComplet() {
  zoneChampion.innerHTML = "Chargement...";
  zoneRunes.innerHTML = "";
  conteneurInventaire.innerHTML = "Chargement des objets...";

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

    const tousLesItems = (await reponseItems.json()).data;
    const tousLesChamps = (await reponseChamps.json()).data;
    const tousLesSpells = (await reponseSpells.json()).data;
    const tousLesArbresRunes = await reponseRunes.json();

    // --- 1. CHAMPION & SORTS ---
    const idsChamps = Object.keys(tousLesChamps);
    const championData =
      tousLesChamps[idsChamps[Math.floor(Math.random() * idsChamps.length)]];

    const idsSpellsValides = Object.keys(tousLesSpells).filter((id) =>
      tousLesSpells[id].modes?.includes("CLASSIC"),
    );
    for (let i = idsSpellsValides.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [idsSpellsValides[i], idsSpellsValides[j]] = [
        idsSpellsValides[j],
        idsSpellsValides[i],
      ];
    }
    const s1 = tousLesSpells[idsSpellsValides[0]];
    const s2 = tousLesSpells[idsSpellsValides[1]];

    zoneChampion.innerHTML = `
            <img src="https://ddragon.leagueoflegends.com/cdn/${patchActuel}/img/champion/${championData.id}.png" class="champion-sprite sprite-tooltip" data-title="${championData.name}" data-desc="${championData.blurb.replace(/"/g, "&quot;")}">
            <div class="spells-container">
                <img src="https://ddragon.leagueoflegends.com/cdn/${patchActuel}/img/spell/${s1.id}.png" class="spell-sprite sprite-tooltip" data-title="${s1.name}" data-desc="${s1.description}">
                <img src="https://ddragon.leagueoflegends.com/cdn/${patchActuel}/img/spell/${s2.id}.png" class="spell-sprite sprite-tooltip" data-title="${s2.name}" data-desc="${s2.description}">
            </div>
            <h2 style="margin-left: 10px;">${championData.name}</h2>
        `;

    // --- 2. RUNES ---
    const arbreP =
      tousLesArbresRunes[Math.floor(Math.random() * tousLesArbresRunes.length)];
    const arbreS = tousLesArbresRunes.filter((a) => a.id !== arbreP.id)[
      Math.floor(Math.random() * (tousLesArbresRunes.length - 1))
    ];
    const pR = arbreP.slots.map(
      (s) => s.runes[Math.floor(Math.random() * s.runes.length)],
    );

    let lS = [1, 2, 3];
    for (let i = lS.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [lS[i], lS[j]] = [lS[j], lS[i]];
    }

    const sR = [
      arbreS.slots[lS[0]].runes[
        Math.floor(Math.random() * arbreS.slots[lS[0]].runes.length)
      ],
      arbreS.slots[lS[1]].runes[
        Math.floor(Math.random() * arbreS.slots[lS[1]].runes.length)
      ],
    ];
    const bU = "https://ddragon.leagueoflegends.com/cdn/img/";
    const cR = (r, c) =>
      `<img src="${bU}${r.icon}" class="${c} sprite-tooltip" data-title="${r.name}" data-desc="${r.longDesc.replace(/"/g, "&quot;")}">`;

    zoneRunes.innerHTML = `<div class="rune-colonne"><img src="${bU}${arbreP.icon}" class="arbre-icon">${cR(pR[0], "rune-fondamentale")}${cR(pR[1], "rune-mineure")}${cR(pR[2], "rune-mineure")}${cR(pR[3], "rune-mineure")}</div><div class="rune-colonne" style="margin-top:30px;"><img src="${bU}${arbreS.icon}" class="arbre-icon">${cR(sR[0], "rune-mineure")}${cR(sR[1], "rune-mineure")}</div>`;

    // --- 3. INVENTAIRE (Le fix ultime d'Ornn) ---
    let bottes = [];
    let items = [];

    Object.keys(tousLesItems).forEach((id) => {
      const item = tousLesItems[id];
      if (itemsBannis.includes(String(id))) return;

      const tags = item.tags || [];

      // Si c'est explicitement une botte, on prend tout de suite !
      if (idsBottes.includes(String(id))) {
        bottes.push(id);
        return;
      }

      // CORRECTION DU BUG ORNN : Un objet final ne se transforme en rien,
      // OU ALORS il se transforme UNIQUEMENT en objet d'Ornn (ID supérieur à 7000)
      const pasUnComposant =
        item.into === undefined ||
        item.into.every((upgradeId) => Number(upgradeId) >= 7000);

      const valide =
        item.maps?.["11"] === true &&
        item.gold?.purchasable === true &&
        pasUnComposant &&
        item.gold?.total >= 1500 && // Sécurité : Seuls les gros objets passent
        !tags.includes("Consumable") &&
        !tags.includes("Jungle") &&
        !tags.includes("Trinket") &&
        !tags.includes("Boots"); // On exclut les fausses bottes

      if (valide) {
        items.push(id);
      }
    });

    // On mélange "items" correctement
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }

    // Le Bouclier Anti-Doublons (par nom)
    let objetsChoisis = [];
    let nomsDejaPris = [];

    for (let i = 0; i < items.length; i++) {
      if (objetsChoisis.length === 5) break;

      const idActuel = items[i];
      const nomActuel = tousLesItems[idActuel].name;

      if (!nomsDejaPris.includes(nomActuel)) {
        objetsChoisis.push(idActuel);
        nomsDejaPris.push(nomActuel);
      }
    }

    // Tirage de la botte (avec une sécurité si Riot casse les IDs un jour)
    const botteTiree =
      bottes.length > 0
        ? bottes[Math.floor(Math.random() * bottes.length)]
        : "3006";

    // 1 botte + 5 objets (Toujours 6)
    let final = [botteTiree, ...objetsChoisis];

    // On mélange le sac final
    for (let i = final.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [final[i], final[j]] = [final[j], final[i]];
    }

    // Affichage
    conteneurInventaire.innerHTML = "";
    final.forEach((id) => {
      const d = tousLesItems[id];
      let img = document.createElement("img");
      img.src = `https://ddragon.leagueoflegends.com/cdn/${patchActuel}/img/item/${id}.png`;
      img.className = "item-sprite sprite-tooltip";
      img.dataset.title = d.name;
      img.dataset.prix = `Prix : ${d.gold.total} PO`;
      img.dataset.desc = d.description;
      conteneurInventaire.appendChild(img);
    });
  } catch (e) {
    console.error(e);
  }
}

// --- TOOLTIP ENGINE ---
document.addEventListener("mouseover", (e) => {
  if (e.target.classList.contains("sprite-tooltip")) {
    tooltip.style.display = "block";
    tooltip.innerHTML = `<h4>${e.target.dataset.title}</h4>${e.target.dataset.prix ? `<div class="prix">${e.target.dataset.prix}</div>` : ""}<div>${e.target.dataset.desc}</div>`;
  }
});
document.addEventListener("mousemove", (e) => {
  if (tooltip.style.display === "block") {
    tooltip.style.left = e.pageX + 15 + "px";
    tooltip.style.top = e.pageY + 15 + "px";
  }
});
document.addEventListener("mouseout", (e) => {
  if (e.target.classList.contains("sprite-tooltip"))
    tooltip.style.display = "none";
});

genererBuildComplet();
boutonRelancer.addEventListener("click", genererBuildComplet);
