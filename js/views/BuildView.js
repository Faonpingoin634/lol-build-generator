export default class BuildView {
  constructor() {
    this.zoneChampion = document.getElementById("champion-zone");
    this.zoneRunes = document.getElementById("runes-zone");
    this.conteneurInventaire = document.getElementById("inventaire");
    this.tooltip = document.getElementById("tooltip");
    this.boutonRelancer = document.getElementById("btn-relancer");
    this.selectRole = document.getElementById("select-role");
    this.boutonPartager = document.getElementById("btn-partager");
    this.captureZone = document.getElementById("capture-zone");
    this.affichageRole = document.getElementById("affichage-role");

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